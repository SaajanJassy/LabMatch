import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeFloorPlan: Renders a 3D architectural model of the LabMatch floor plan.
 * The model rotates slowly, and cleanly explodes (exploded CAD view) as the user scrolls.
 */
export default function ThreeFloorPlan() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const width = containerRef.current.clientWidth || window.innerWidth || 800;
    const height = containerRef.current.clientHeight || window.innerHeight || 600;
    
    console.log("ThreeJS Canvas size initialized to:", width, height);

    const scene = new THREE.Scene();
    
    // Perspective camera for premium architectural depth
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 16, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = 'block';

    // Clear container to prevent duplicate canvas elements in React Strict Mode
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // --- Materials ---
    const wallMaterial = new THREE.MeshBasicMaterial({
      color: 0xf2ece2, // var(--linen)
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2d5a3d, // var(--forest)
      linewidth: 1.5,
    });

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

    // Helper: Add wall segment as a subgroup
    function addWall(x, z, w, d, h = 1.2, type = 'inner_wall') {
      const wallGroup = new THREE.Group();
      
      const geometry = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geometry, wallMaterial);
      mesh.position.set(0, h / 2, 0); // local offset
      wallGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, lineMaterial);
      line.position.copy(mesh.position);
      wallGroup.add(line);

      wallGroup.position.set(x, 0, z);
      wallGroup.userData = {
        baseX: x,
        baseY: 0,
        baseZ: z,
        type: type,
      };
      
      floorPlanGroup.add(wallGroup);
    }

    // Helper: Add lab bench as a subgroup
    function addBench(x, z, w, d, h = 0.5) {
      const benchGroup = new THREE.Group();
      
      const geometry = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geometry, benchMaterial);
      mesh.position.set(0, h / 2, 0);
      benchGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, benchLineMaterial);
      line.position.copy(mesh.position);
      benchGroup.add(line);

      benchGroup.position.set(x, 0, z);
      benchGroup.userData = {
        baseX: x,
        baseY: 0,
        baseZ: z,
        type: 'bench',
      };
      
      floorPlanGroup.add(benchGroup);
    }

    // --- Build Structure ---
    const outerW = 22;
    const outerH = 9.5;
    const thickness = 0.2;

    // 1. Outer boundaries (categorised for directional explosion)
    addWall(0, -outerH/2, outerW, thickness, 1.2, 'outer_back');
    addWall(0, outerH/2, outerW, thickness, 1.2, 'outer_front');
    addWall(-outerW/2, 0, thickness, outerH, 1.2, 'outer_left');
    addWall(outerW/2, 0, thickness, outerH, 1.2, 'outer_right');

    // 2. Square Atrium
    const atW = 3.5;
    const atH = 3.5;
    addWall(-0.5, -atH/2, atW, thickness, 1.2, 'atrium_wall');
    addWall(-0.5, atH/2, atW, thickness, 1.2, 'atrium_wall');
    addWall(-0.5 - atW/2, 0, thickness, atH, 1.2, 'atrium_wall');
    addWall(-0.5 + atW/2, 0, thickness, atH, 1.2, 'atrium_wall');

    const diagGeom1 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.5 - atW/2, 0.02, -atH/2),
      new THREE.Vector3(-0.5 + atW/2, 0.02, atH/2)
    ]);
    const diagGeom2 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.5 - atW/2, 0.02, atH/2),
      new THREE.Vector3(-0.5 + atW/2, 0.02, -atH/2)
    ]);
    
    const atriumLines = new THREE.Group();
    atriumLines.add(new THREE.Line(diagGeom1, lineMaterial));
    atriumLines.add(new THREE.Line(diagGeom2, lineMaterial));
    atriumLines.userData = { baseX: 0, baseY: 0, baseZ: 0, type: 'atrium_line' };
    floorPlanGroup.add(atriumLines);

    // 3. Oval Courtyard
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
    
    const ovalGroup = new THREE.Group();
    ovalGroup.add(ovalLine);
    ovalGroup.userData = { baseX: 0, baseY: 0, baseZ: 0, type: 'atrium_line' };
    floorPlanGroup.add(ovalGroup);

    // 4. Room dividers (Inner walls)
    addWall(-7.5, 0, thickness, 5.5, 1.2, 'inner_wall');
    addWall(-10.5, -0.5, 3.8, thickness, 1.2, 'inner_wall');
    addWall(-4.5, -0.5, 5.8, thickness, 1.2, 'inner_wall');
    addWall(-7.5, -3.2, 5.8, thickness, 1.2, 'inner_wall');
    addWall(-7.5, 2.8, 5.8, thickness, 1.2, 'inner_wall');
    
    addWall(7.5, 0, thickness, 5.5, 1.2, 'inner_wall');
    addWall(10.5, -0.5, 3.8, thickness, 1.2, 'inner_wall');
    addWall(7.5, -3.2, 5.8, thickness, 1.2, 'inner_wall');
    addWall(7.5, 2.8, 5.8, thickness, 1.2, 'inner_wall');
    
    addWall(-2.8, 1.8, 1.2, thickness, 1.2, 'inner_wall');
    addWall(-2.8, -1.8, 1.2, thickness, 1.2, 'inner_wall');
    addWall(2.2, 1.8, 1.2, thickness, 1.2, 'inner_wall');
    addWall(2.2, -1.8, 1.2, thickness, 1.2, 'inner_wall');

    // 5. Furniture (Benches)
    for (let z = -2.2; z <= 2.2; z += 1.1) {
      addBench(-9.2, z, 1.4, 0.4);
      addBench(-5.8, z, 1.4, 0.4);
    }
    for (let z = -2.2; z <= 2.2; z += 1.1) {
      addBench(9.2, z, 1.4, 0.4);
    }

    // Offset parent group slightly
    floorPlanGroup.position.set(0, -0.5, 0);

    // --- Animation Loop ---
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      try {
        // 1. Slow, continuous Y-axis rotation
        floorPlanGroup.rotation.y += 0.002;

        // 2. Clean scroll-driven explosion animation with an idle threshold
        const rawScroll = window.scrollY / window.innerHeight;
        const startThreshold = 0.15; // 15% threshold before starting explosion
        
        let scrollFraction = 0;
        if (rawScroll > startThreshold) {
          // Map scroll from 15% to 80% viewport height for a clean transition
          scrollFraction = Math.min(1, (rawScroll - startThreshold) / (0.8 - startThreshold));
        }

        floorPlanGroup.children.forEach((child) => {
          if (!child.userData || !child.userData.type) return;

          const { baseX, baseY, baseZ, type } = child.userData;

          if (type === 'outer_back') {
            child.position.z = baseZ - 4.5 * scrollFraction;
            child.position.y = baseY + 1.2 * scrollFraction;
          } else if (type === 'outer_front') {
            child.position.z = baseZ + 4.5 * scrollFraction;
            child.position.y = baseY + 1.2 * scrollFraction;
          } else if (type === 'outer_left') {
            child.position.x = baseX - 5.5 * scrollFraction;
            child.position.y = baseY + 1.2 * scrollFraction;
          } else if (type === 'outer_right') {
            child.position.x = baseX + 5.5 * scrollFraction;
            child.position.y = baseY + 1.2 * scrollFraction;
          } else if (type === 'inner_wall') {
            child.position.y = baseY + 5.5 * scrollFraction;
          } else if (type === 'atrium_wall') {
            child.position.y = baseY + 4.0 * scrollFraction;
          } else if (type === 'atrium_line') {
            child.position.y = baseY - 2.5 * scrollFraction;
          } else if (type === 'bench') {
            const driftDirX = baseX > 0 ? 1 : -1;
            child.position.x = baseX + 2.0 * driftDirX * scrollFraction;
            child.position.y = baseY + 0.3 * scrollFraction;
          }
        });
      } catch (err) {
        console.error("ThreeJS animate error:", err);
      }

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
