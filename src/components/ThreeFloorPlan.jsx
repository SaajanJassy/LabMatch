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

    // Helper: Add lab bench as a subgroup, now complete with detailed overhead reagent shelves
    function addBench(x, z, w, d, h = 0.5) {
      const benchGroup = new THREE.Group();
      
      // Base table
      const geometry = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geometry, benchMaterial);
      mesh.position.set(0, h / 2, 0);
      benchGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, benchLineMaterial);
      line.position.copy(mesh.position);
      benchGroup.add(line);

      // --- Overhead Reagent Shelving Units ---
      const postW = 0.03;
      const postH = 0.8;
      const postGeom = new THREE.BoxGeometry(postW, postH, d - 0.05);
      
      // Left vertical post
      const postLeft = new THREE.Mesh(postGeom, benchMaterial);
      postLeft.position.set(-w/2 + 0.05, h + postH/2, 0);
      benchGroup.add(postLeft);
      const postLeftLine = new THREE.LineSegments(new THREE.EdgesGeometry(postGeom), benchLineMaterial);
      postLeftLine.position.copy(postLeft.position);
      benchGroup.add(postLeftLine);

      // Right vertical post
      const postRight = new THREE.Mesh(postGeom, benchMaterial);
      postRight.position.set(w/2 - 0.05, h + postH/2, 0);
      benchGroup.add(postRight);
      const postRightLine = new THREE.LineSegments(new THREE.EdgesGeometry(postGeom), benchLineMaterial);
      postRightLine.position.copy(postRight.position);
      benchGroup.add(postRightLine);

      // Horizontal Shelf 1
      const shelfGeom = new THREE.BoxGeometry(w - 0.1, 0.03, 0.25);
      const shelf1 = new THREE.Mesh(shelfGeom, benchMaterial);
      shelf1.position.set(0, h + 0.35, 0);
      benchGroup.add(shelf1);
      const shelf1Line = new THREE.LineSegments(new THREE.EdgesGeometry(shelfGeom), benchLineMaterial);
      shelf1Line.position.copy(shelf1.position);
      benchGroup.add(shelf1Line);

      // Horizontal Shelf 2
      const shelf2 = new THREE.Mesh(shelfGeom, benchMaterial);
      shelf2.position.set(0, h + 0.7, 0);
      benchGroup.add(shelf2);
      const shelf2Line = new THREE.LineSegments(new THREE.EdgesGeometry(shelfGeom), benchLineMaterial);
      shelf2Line.position.copy(shelf2.position);
      benchGroup.add(shelf2Line);

      benchGroup.position.set(x, 0, z);
      benchGroup.userData = {
        baseX: x,
        baseY: 0,
        baseZ: z,
        type: 'bench',
      };
      
      floorPlanGroup.add(benchGroup);
    }

    // Helper: Add sink and faucet tap
    function addSink(x, z, w = 0.5, d = 0.5) {
      const sinkGroup = new THREE.Group();
      const h = 0.5;

      const geometry = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geometry, benchMaterial);
      mesh.position.set(0, h / 2, 0);
      sinkGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, lineMaterial);
      line.position.copy(mesh.position);
      sinkGroup.add(line);

      // Faucet tap (L-shaped tube)
      const faucetGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, h, 0),
        new THREE.Vector3(0, h + 0.25, 0),
        new THREE.Vector3(-0.1, h + 0.25, 0),
        new THREE.Vector3(-0.1, h + 0.2, 0)
      ]);
      const faucetLine = new THREE.Line(faucetGeom, lineMaterial);
      sinkGroup.add(faucetLine);

      sinkGroup.position.set(x, 0, z);
      sinkGroup.userData = {
        baseX: x,
        baseY: 0,
        baseZ: z,
        type: 'bench',
      };
      floorPlanGroup.add(sinkGroup);
    }

    // Helper: Add desktop computer workstation
    function addComputer(x, z, angle = 0) {
      const pcGroup = new THREE.Group();
      
      // Monitor
      const monW = 0.45;
      const monH = 0.3;
      const monD = 0.03;
      const monGeom = new THREE.BoxGeometry(monW, monH, monD);
      const monMesh = new THREE.Mesh(monGeom, benchMaterial);
      monMesh.position.set(0, 0.35, 0);
      pcGroup.add(monMesh);
      const monLine = new THREE.LineSegments(new THREE.EdgesGeometry(monGeom), benchLineMaterial);
      monLine.position.copy(monMesh.position);
      pcGroup.add(monLine);

      // Stand
      const standGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6);
      const standMesh = new THREE.Mesh(standGeom, benchMaterial);
      standMesh.position.set(0, 0.1, 0);
      pcGroup.add(standMesh);
      const standLine = new THREE.LineSegments(new THREE.EdgesGeometry(standGeom), benchLineMaterial);
      standLine.position.copy(standMesh.position);
      pcGroup.add(standLine);

      // Keyboard
      const kbGeom = new THREE.BoxGeometry(0.35, 0.02, 0.12);
      const kbMesh = new THREE.Mesh(kbGeom, benchMaterial);
      kbMesh.position.set(0, 0.01, 0.18);
      pcGroup.add(kbMesh);
      const kbLine = new THREE.LineSegments(new THREE.EdgesGeometry(kbGeom), benchLineMaterial);
      kbLine.position.copy(kbMesh.position);
      pcGroup.add(kbLine);

      pcGroup.position.set(x, 0, z);
      pcGroup.rotation.y = angle;
      pcGroup.userData = {
        baseX: x,
        baseY: 0,
        baseZ: z,
        type: 'bench',
      };
      floorPlanGroup.add(pcGroup);
    }

    // Helper: Add stool/chair
    function addChair(x, z) {
      const chairGroup = new THREE.Group();

      // seat cushion
      const seatGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 8);
      const seatMesh = new THREE.Mesh(seatGeom, benchMaterial);
      seatMesh.position.set(0, 0.38, 0);
      chairGroup.add(seatMesh);

      const seatEdges = new THREE.EdgesGeometry(seatGeom);
      const seatLine = new THREE.LineSegments(seatEdges, benchLineMaterial);
      seatLine.position.copy(seatMesh.position);
      chairGroup.add(seatLine);

      // single support post
      const postGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.38, 4);
      const postMesh = new THREE.Mesh(postGeom, benchMaterial);
      postMesh.position.set(0, 0.19, 0);
      chairGroup.add(postMesh);

      const postEdges = new THREE.EdgesGeometry(postGeom);
      const postLine = new THREE.LineSegments(postEdges, benchLineMaterial);
      postLine.position.copy(postMesh.position);
      chairGroup.add(postLine);

      chairGroup.position.set(x, 0, z);
      chairGroup.userData = {
        baseX: x,
        baseY: 0,
        baseZ: z,
        type: 'bench',
      };

      floorPlanGroup.add(chairGroup);
    }

    // Helper: Add cabinet/fume hood/biosafety cabinet
    function addEquipment(x, z, w, d, h = 0.85) {
      const equipGroup = new THREE.Group();

      const geometry = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geometry, benchMaterial);
      mesh.position.set(0, h / 2, 0);
      equipGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, lineMaterial);
      line.position.copy(mesh.position);
      equipGroup.add(line);

      equipGroup.position.set(x, 0, z);
      equipGroup.userData = {
        baseX: x,
        baseY: 0,
        baseZ: z,
        type: 'bench',
      };

      floorPlanGroup.add(equipGroup);
    }

    // Helper: Add small conical beaker flask
    function addScientificBeaker(x, z, size = 0.15) {
      const flaskGroup = new THREE.Group();
      const h = size * 1.5;

      // Cone shape (base diameter size, top diameter size/3, height h)
      const coneGeom = new THREE.CylinderGeometry(size/3, size, h, 8);
      const mesh = new THREE.Mesh(coneGeom, benchMaterial);
      mesh.position.set(0, h/2 + 0.5, 0); // rest on top of bench (bench is h=0.5)
      flaskGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(coneGeom);
      const line = new THREE.LineSegments(edges, lineMaterial);
      line.position.copy(mesh.position);
      flaskGroup.add(line);

      // Neck tube
      const neckGeom = new THREE.CylinderGeometry(size/3, size/3, size/2, 8);
      const neckMesh = new THREE.Mesh(neckGeom, benchMaterial);
      neckMesh.position.set(0, h + size/4 + 0.5, 0);
      flaskGroup.add(neckMesh);

      const neckEdges = new THREE.EdgesGeometry(neckGeom);
      const neckLine = new THREE.LineSegments(neckEdges, lineMaterial);
      neckLine.position.copy(neckMesh.position);
      flaskGroup.add(neckLine);

      flaskGroup.position.set(x, 0, z);
      flaskGroup.userData = {
        baseX: x,
        baseY: 0,
        baseZ: z,
        type: 'bench',
      };
      floorPlanGroup.add(flaskGroup);
    }

    // Helper: Add detailed distillation setup with glass tubes and boiling flasks
    function addDistillationSetup(x, z) {
      const distGroup = new THREE.Group();
      const benchH = 0.5;

      // 1. Heating Mantle box base
      const baseW = 0.35, baseH = 0.2, baseD = 0.35;
      const baseGeom = new THREE.BoxGeometry(baseW, baseH, baseD);
      const baseMesh = new THREE.Mesh(baseGeom, benchMaterial);
      baseMesh.position.set(-0.25, benchH + baseH/2, 0);
      distGroup.add(baseMesh);
      const baseLine = new THREE.LineSegments(new THREE.EdgesGeometry(baseGeom), benchLineMaterial);
      baseLine.position.copy(baseMesh.position);
      distGroup.add(baseLine);

      // 2. Boiling Flask (round cylinder on heating mantle)
      const flaskGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 8);
      const flaskMesh = new THREE.Mesh(flaskGeom, benchMaterial);
      flaskMesh.position.set(-0.25, benchH + baseH + 0.1, 0);
      distGroup.add(flaskMesh);
      const flaskLine = new THREE.LineSegments(new THREE.EdgesGeometry(flaskGeom), lineMaterial);
      flaskLine.position.copy(flaskMesh.position);
      distGroup.add(flaskLine);

      // 3. Condenser tube (angled line segments)
      const condenserPoints = [
        new THREE.Vector3(-0.25, benchH + baseH + 0.2, 0),     // start from neck of boiling flask
        new THREE.Vector3(-0.25, benchH + baseH + 0.4, 0),     // vertical neck
        new THREE.Vector3(0.25, benchH + baseH + 0.1, 0),      // angled tube going down to right
        new THREE.Vector3(0.25, benchH + 0.2, 0)               // vertical drop into receiving beaker
      ];
      const condenserGeom = new THREE.BufferGeometry().setFromPoints(condenserPoints);
      const condenserLine = new THREE.Line(condenserGeom, lineMaterial);
      distGroup.add(condenserLine);

      // Outer jacket around condenser (cooling cylinder)
      const jacketGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 6);
      const jacketMesh = new THREE.Mesh(jacketGeom, benchMaterial);
      jacketMesh.position.set(0, benchH + baseH + 0.22, 0);
      jacketMesh.rotation.z = -Math.PI / 6; // align along angled condenser line
      distGroup.add(jacketMesh);
      const jacketLine = new THREE.LineSegments(new THREE.EdgesGeometry(jacketGeom), lineMaterial);
      jacketLine.position.copy(jacketMesh.position);
      jacketLine.rotation.copy(jacketMesh.rotation);
      distGroup.add(jacketLine);

      // 4. Receiving Beaker
      const rx = 0.25;
      const beakerH = 0.2, beakerW = 0.2;
      const beakerGeom = new THREE.CylinderGeometry(beakerW/2, beakerW/2, beakerH, 8);
      const beakerMesh = new THREE.Mesh(beakerGeom, benchMaterial);
      beakerMesh.position.set(rx, benchH + beakerH/2, 0);
      distGroup.add(beakerMesh);
      const beakerLine = new THREE.LineSegments(new THREE.EdgesGeometry(beakerGeom), lineMaterial);
      beakerLine.position.copy(beakerMesh.position);
      distGroup.add(beakerLine);

      distGroup.position.set(x, 0, z);
      distGroup.userData = {
        baseX: x,
        baseY: 0,
        baseZ: z,
        type: 'bench',
      };
      floorPlanGroup.add(distGroup);
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

    // 4. Room dividers (Inner walls) - ADJUSTED to avoid penetrating outer walls
    addWall(-7.5, 0, thickness, 5.5, 1.2, 'inner_wall');
    addWall(-9.25, -0.5, 3.3, thickness, 1.2, 'inner_wall'); // Adjusted w/center
    addWall(-4.875, -0.5, 5.0, thickness, 1.2, 'inner_wall'); // Adjusted w/center
    addWall(-7.5, -3.2, 5.8, thickness, 1.2, 'inner_wall');
    addWall(-7.5, 2.8, 5.8, thickness, 1.2, 'inner_wall');
    
    addWall(7.5, 0, thickness, 5.5, 1.2, 'inner_wall');
    addWall(9.25, -0.5, 3.3, thickness, 1.2, 'inner_wall');  // Adjusted w/center
    addWall(7.5, -3.2, 5.8, thickness, 1.2, 'inner_wall');
    addWall(7.5, 2.8, 5.8, thickness, 1.2, 'inner_wall');
    
    addWall(-2.8, 1.8, 1.2, thickness, 1.2, 'inner_wall');
    addWall(-2.8, -1.8, 1.2, thickness, 1.2, 'inner_wall');
    addWall(2.2, 1.8, 1.2, thickness, 1.2, 'inner_wall');
    addWall(2.2, -1.8, 1.2, thickness, 1.2, 'inner_wall');

    // 5. Furniture (Benches, Chairs, Equipment, Sinks, Computers, Beakers, and Distillation setups)
    // Left Lab Zone
    for (let z = -2.2; z <= 2.2; z += 1.1) {
      addBench(-9.2, z, 1.4, 0.4);
      addBench(-5.8, z, 1.4, 0.4);
      
      // Chairs for lab technicians
      addChair(-8.3, z);
      addChair(-6.7, z);

      // Add a computer monitor on some benches
      if (z === 0) {
        addComputer(-9.2, z + 0.15, Math.PI / 2);
      } else if (z > 0) {
        // Add chemical beaker flasks on benches and overhead shelves
        addScientificBeaker(-9.2, z - 0.2, 0.12);
        addScientificBeaker(-5.8, z + 0.2, 0.10);
      } else {
        // Add a distillation setup on the middle benches
        addDistillationSetup(-5.8, z);
      }
    }
    // Sinks at the ends of left benches
    addSink(-9.2, -3.2, 0.4, 0.4);
    addSink(-5.8, 3.2, 0.4, 0.4);
    
    // Right Lab Zone
    for (let z = -2.2; z <= 2.2; z += 1.1) {
      addBench(9.2, z, 1.4, 0.4);
      addChair(8.3, z);
      
      if (z <= 0) {
        // Computers facing the desk chairs
        addComputer(9.2, z - 0.1, -Math.PI / 2);
      } else {
        // Distillation and beaker setup for biology/chemistry landlord preview
        addDistillationSetup(9.2, z);
        addScientificBeaker(9.2, z + 0.4, 0.12);
      }
    }
    // Sink at the end of right bench
    addSink(9.2, -3.2, 0.4, 0.4);

    // Heavy lab equipment (biosafety cabinets, diagnostic units, columns)
    addEquipment(-10.5, -3.8, 0.7, 0.7, 1.1); // Back-left fume hood
    addEquipment(-4.5, -3.8, 0.9, 0.7, 1.0);  // Cleanroom equipment box
    addEquipment(10.5, 3.8, 0.7, 0.7, 1.1);   // Right diagnostic unit
    addEquipment(4.5, 3.8, 0.9, 0.7, 1.0);    // Fume hood right

    // Scale down the model (0.72x) to completely prevent border/viewport edge clipping
    floorPlanGroup.scale.set(0.72, 0.72, 0.72);
    
    // Offset parent group slightly
    floorPlanGroup.position.set(0, -0.2, 0);

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
