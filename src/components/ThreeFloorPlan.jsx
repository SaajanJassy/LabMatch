import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeFloorPlan: Renders a 3D architectural model of the LabMatch floor plan
 * with a clean, hand-drawn wireframe/pencil style. Rotates slowly on the Y axis.
 */
export default function ThreeFloorPlan() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const scene = new THREE.Scene();
    
    // Orthographic or Perspective camera for architectural look
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 16, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // --- Materials ---
    // Solid fill for walls (matches beige background)
    const wallMaterial = new THREE.MeshBasicMaterial({
      color: 0xf2ece2, // var(--linen)
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    // Dark slate pencil-like material for edges
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2d5a3d, // var(--forest)
      linewidth: 1.5,
    });

    // Lab bench material
    const benchMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    
    const benchLineMaterial = new THREE.LineBasicMaterial({
      color: 0xa89f91, // var(--stone)
    });

    // --- Parent Group ---
    const floorPlanGroup = new THREE.Group();
    scene.add(floorPlanGroup);

    // Helper: Add wall segment (box + outlines)
    function addWall(x, z, w, d, h = 1.2) {
      const geometry = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geometry, wallMaterial);
      mesh.position.set(x, h / 2, z);
      floorPlanGroup.add(mesh);

      // Add wireframe outlines
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, lineMaterial);
      line.position.copy(mesh.position);
      floorPlanGroup.add(line);
    }

    // Helper: Add lab bench
    function addBench(x, z, w, d, h = 0.5) {
      const geometry = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geometry, benchMaterial);
      mesh.position.set(x, h / 2, z);
      floorPlanGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, benchLineMaterial);
      line.position.copy(mesh.position);
      floorPlanGroup.add(line);
    }

    // --- Build Floor Plan Structure ---
    // Outer dimensions: approx 22m x 10m
    const outerW = 22;
    const outerH = 9.5;
    const thickness = 0.2;

    // 1. Outer Boundaries
    addWall(0, -outerH/2, outerW, thickness); // Back
    addWall(0, outerH/2, outerW, thickness);  // Front
    addWall(-outerW/2, 0, thickness, outerH); // Left
    addWall(outerW/2, 0, thickness, outerH);  // Right

    // 2. Central Square Atrium (x = -0.5, size = 3 x 3)
    const atW = 3.5;
    const atH = 3.5;
    addWall(-0.5, -atH/2, atW, thickness);
    addWall(-0.5, atH/2, atW, thickness);
    addWall(-0.5 - atW/2, 0, thickness, atH);
    addWall(-0.5 + atW/2, 0, thickness, atH);

    // Diagonal lines in Square Atrium
    const diagGeom1 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.5 - atW/2, 0.02, -atH/2),
      new THREE.Vector3(-0.5 + atW/2, 0.02, atH/2)
    ]);
    const diagGeom2 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.5 - atW/2, 0.02, atH/2),
      new THREE.Vector3(-0.5 + atW/2, 0.02, -atH/2)
    ]);
    floorPlanGroup.add(new THREE.Line(diagGeom1, lineMaterial));
    floorPlanGroup.add(new THREE.Line(diagGeom2, lineMaterial));

    // 3. Right Courtyard (Oval structure centered at x = 5)
    // We approximate the oval using wall segments
    const ovalX = 5;
    const segments = 16;
    const rx = 1.6;
    const rz = 1.1;
    const ovalPoints = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const px = ovalX + rx * Math.cos(theta);
      const pz = rz * Math.sin(theta);
      ovalPoints.push(new THREE.Vector3(px, 0.02, pz));
    }
    const ovalGeom = new THREE.BufferGeometry().setFromPoints(ovalPoints);
    const ovalLine = new THREE.Line(ovalGeom, lineMaterial);
    floorPlanGroup.add(ovalLine);

    // 4. Vertical & Horizontal Room Dividers (Corridors)
    // Left side lab dividers
    addWall(-7.5, 0, thickness, 5.5);
    addWall(-10.5, -0.5, 3.8, thickness);
    addWall(-4.5, -0.5, 5.8, thickness);
    addWall(-7.5, -3.2, 5.8, thickness);
    addWall(-7.5, 2.8, 5.8, thickness);
    
    // Right side lab dividers
    addWall(7.5, 0, thickness, 5.5);
    addWall(10.5, -0.5, 3.8, thickness);
    addWall(7.5, -3.2, 5.8, thickness);
    addWall(7.5, 2.8, 5.8, thickness);
    
    // Lift shafts & utility cores (center areas)
    addWall(-2.8, 1.8, 1.2, thickness);
    addWall(-2.8, -1.8, 1.2, thickness);
    addWall(2.2, 1.8, 1.2, thickness);
    addWall(2.2, -1.8, 1.2, thickness);

    // 5. Lab Benches & Furniture
    // Left Labs Benches
    for (let z = -2.2; z <= 2.2; z += 1.1) {
      addBench(-9.2, z, 1.4, 0.4);
      addBench(-5.8, z, 1.4, 0.4);
    }
    // Right Labs Benches
    for (let z = -2.2; z <= 2.2; z += 1.1) {
      addBench(9.2, z, 1.4, 0.4);
    }

    // Centring offsets
    floorPlanGroup.position.set(0, -0.5, 0);

    // --- Animation Loop ---
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow, smooth rotation along central Y axis
      floorPlanGroup.rotation.y += 0.002;

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
