import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Premium3DEffectProps {
  containerId: string;
}

const Premium3DEffect: React.FC<Premium3DEffectProps> = ({ containerId }) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  const frameIdRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    containerRef.current = document.getElementById(containerId);
    if (!containerRef.current) return;

    // Initialize Three.js
    const initThree = () => {
      // Get container dimensions
      const width = containerRef.current!.offsetWidth;
      const height = containerRef.current!.offsetHeight;

      // Create scene
      sceneRef.current = new THREE.Scene();

      // Create camera dengan field of view yang lebih dramatis
      cameraRef.current = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      cameraRef.current.position.z = 20;

      // Create renderer with transparent background
      rendererRef.current = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
      });
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
      rendererRef.current.setClearColor(0x000000, 0);
      containerRef.current!.appendChild(rendererRef.current.domElement);

      // Add enhanced lighting system
      const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
      sceneRef.current.add(ambientLight);

      // Main blue light
      const pointLight1 = new THREE.PointLight(0x00bbff, 8, 60);
      pointLight1.position.set(10, 10, 10);
      sceneRef.current.add(pointLight1);

      // Secondary blue light
      const pointLight2 = new THREE.PointLight(0x0088ff, 5, 50);
      pointLight2.position.set(-10, -10, 15);
      sceneRef.current.add(pointLight2);
      
      // Accent light untuk efek dramatis
      const pointLight3 = new THREE.PointLight(0x80ffff, 3, 80);
      pointLight3.position.set(0, 30, 0);
      sceneRef.current.add(pointLight3);
      
      // Light untuk membuat refleksi yang lebih baik
      const spotLight = new THREE.SpotLight(0xffffff, 2);
      spotLight.position.set(15, 20, 15);
      spotLight.angle = Math.PI / 6;
      spotLight.penumbra = 0.3;
      spotLight.decay = 1;
      spotLight.distance = 100;
      sceneRef.current.add(spotLight);
      
      // Tambahkan Hemisphere light untuk pencahayaan alami
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x00bbff, 0.3);
      sceneRef.current.add(hemiLight);
      
      // Tambahkan Env map cubemap untuk refleksi
      const cubeTextureLoader = new THREE.CubeTextureLoader();
      const cubeTexture = cubeTextureLoader.load([
        'https://threejs.org/examples/textures/cube/Park2/posx.jpg',
        'https://threejs.org/examples/textures/cube/Park2/negx.jpg',
        'https://threejs.org/examples/textures/cube/Park2/posy.jpg',
        'https://threejs.org/examples/textures/cube/Park2/negy.jpg',
        'https://threejs.org/examples/textures/cube/Park2/posz.jpg',
        'https://threejs.org/examples/textures/cube/Park2/negz.jpg',
      ]);
      sceneRef.current.environment = cubeTexture;

      // Add 3D objects
      createObjects();

      // Add mouse move event listener
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);

      // Start animation
      animate();
    };

    const createObjects = () => {
      if (!sceneRef.current) return;

      // Clear existing objects
      if (objectsRef.current.length > 0) {
        objectsRef.current.forEach(obj => sceneRef.current!.remove(obj));
        objectsRef.current = [];
      }

      // Create multiple geometric objects with complex geometries for premium look
      const shapes = [
        new THREE.TetrahedronGeometry(5, 1), // Subdivided for smoother look
        new THREE.OctahedronGeometry(4.5, 2), // Higher detail
        new THREE.IcosahedronGeometry(4, 1),  // Higher detail
        new THREE.DodecahedronGeometry(4, 1), // Higher detail
        new THREE.TorusKnotGeometry(3, 1, 128, 32, 2, 3), // Complex knot geometry
        new THREE.SphereGeometry(3.5, 32, 32), // Highly detailed sphere
        new THREE.BoxGeometry(4, 4, 4, 3, 3, 3) // Subdivided box for better reflections
      ];

      // Materials with ultra premium glass and metallic appearance
      const materials = [
        new THREE.MeshPhysicalMaterial({
          color: 0x00b8ff,
          transparent: true,
          opacity: 0.8,
          metalness: 0.95,
          roughness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.03,
          reflectivity: 1.0,
          side: THREE.DoubleSide,
          envMapIntensity: 1.5
        }),
        new THREE.MeshPhysicalMaterial({
          color: 0x40c8ff,
          transparent: true,
          opacity: 0.7,
          metalness: 0.8,
          roughness: 0.1,
          clearcoat: 0.9,
          clearcoatRoughness: 0.05,
          reflectivity: 0.9,
          side: THREE.DoubleSide,
          envMapIntensity: 1.2
        }),
        new THREE.MeshPhysicalMaterial({
          color: 0x80d8ff,
          transparent: true,
          opacity: 0.6,
          metalness: 0.7,
          roughness: 0.15,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
          reflectivity: 0.8,
          side: THREE.DoubleSide,
          envMapIntensity: 1.0
        })
      ];

      // Create and position objects in 3D space - use more objects for better premium effect
      const radius = 12; // Slightly larger radius for better distribution
      const count = 7; // More objects to show all geometries
      
      for (let i = 0; i < count; i++) {
        const shape = shapes[i % shapes.length];
        const material = materials[i % materials.length];
        const mesh = new THREE.Mesh(shape, material);
        
        // Position objects in a complex 3D pattern
        const angle = (i / count) * Math.PI * 2;
        const heightVariation = Math.sin(i * 0.9) * 6; // Varied heights
        
        // Arrange in a spiral pattern for more 3D effect
        const x = Math.cos(angle) * (radius - i * 0.5);
        const y = Math.sin(angle) * (radius - i * 0.5) + heightVariation;
        const z = Math.sin(i * 0.8) * 7 - 4; // Varied depth
        
        mesh.position.set(x, y, z);
        
        // Initial rotation dengan variasi untuk kesan tidak monoton
        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
        mesh.rotation.z = Math.random() * Math.PI * 0.5;
        
        // Pastikan sceneRef.current ada
        if (sceneRef.current) {
          sceneRef.current.add(mesh);
          objectsRef.current.push(mesh);
        }
      }

      // Add multiple particle systems for premium layered effect
      
      // Layer 1: Regular floating particles (increased count)
      const particleCount1 = 200; // Lebih banyak partikel
      const particleGeometry1 = new THREE.BufferGeometry();
      const particlePositions1 = new Float32Array(particleCount1 * 3);
      const particleSizes1 = new Float32Array(particleCount1);

      for (let i = 0; i < particleCount1; i++) {
        const i3 = i * 3;
        particlePositions1[i3] = (Math.random() - 0.5) * 60;     // Wider distribution
        particlePositions1[i3 + 1] = (Math.random() - 0.5) * 60; // Wider distribution
        particlePositions1[i3 + 2] = (Math.random() - 0.5) * 60; // Wider distribution
        particleSizes1[i] = Math.random() * 0.6 + 0.2;          // Slightly larger
      }

      particleGeometry1.setAttribute('position', new THREE.BufferAttribute(particlePositions1, 3));
      particleGeometry1.setAttribute('size', new THREE.BufferAttribute(particleSizes1, 1));

      // Premium bright cyan particle material
      const particleMaterial1 = new THREE.PointsMaterial({
        color: 0x80ffff,
        size: 0.7,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.8,
        sizeAttenuation: true
      });

      const particles1 = new THREE.Points(particleGeometry1, particleMaterial1);
      
      // Layer 2: Closer foreground particles with different color
      const particleCount2 = 100;
      const particleGeometry2 = new THREE.BufferGeometry();
      const particlePositions2 = new Float32Array(particleCount2 * 3);
      const particleSizes2 = new Float32Array(particleCount2);

      for (let i = 0; i < particleCount2; i++) {
        const i3 = i * 3;
        // More clustered in the foreground
        particlePositions2[i3] = (Math.random() - 0.5) * 40;
        particlePositions2[i3 + 1] = (Math.random() - 0.5) * 40;
        particlePositions2[i3 + 2] = (Math.random() - 0.5) * 20 - 10; // Closer to camera
        particleSizes2[i] = Math.random() * 0.8 + 0.3; // Larger particles
      }

      particleGeometry2.setAttribute('position', new THREE.BufferAttribute(particlePositions2, 3));
      particleGeometry2.setAttribute('size', new THREE.BufferAttribute(particleSizes2, 1));

      // Bright blue particle material
      const particleMaterial2 = new THREE.PointsMaterial({
        color: 0x00b8ff,
        size: 0.9,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.7,
        sizeAttenuation: true
      });

      const particles2 = new THREE.Points(particleGeometry2, particleMaterial2);
      
      // Layer 3: Depth particles - small background dots
      const particleCount3 = 300;
      const particleGeometry3 = new THREE.BufferGeometry();
      const particlePositions3 = new Float32Array(particleCount3 * 3);
      const particleSizes3 = new Float32Array(particleCount3);

      for (let i = 0; i < particleCount3; i++) {
        const i3 = i * 3;
        // Far background distribution
        particlePositions3[i3] = (Math.random() - 0.5) * 100;
        particlePositions3[i3 + 1] = (Math.random() - 0.5) * 100;
        particlePositions3[i3 + 2] = (Math.random() - 0.5) * 50 - 25; // Far behind
        particleSizes3[i] = Math.random() * 0.3 + 0.1; // Smaller particles
      }

      particleGeometry3.setAttribute('position', new THREE.BufferAttribute(particlePositions3, 3));
      particleGeometry3.setAttribute('size', new THREE.BufferAttribute(particleSizes3, 1));

      // Subtle white/light blue particle material
      const particleMaterial3 = new THREE.PointsMaterial({
        color: 0xc0f0ff,
        size: 0.4,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.5,
        sizeAttenuation: true
      });

      const particles3 = new THREE.Points(particleGeometry3, particleMaterial3);
      
      // Add all particle systems to scene
      if (sceneRef.current) {
        sceneRef.current.add(particles1);
        sceneRef.current.add(particles2);
        sceneRef.current.add(particles3);
      }
    };

    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      frameIdRef.current = requestAnimationFrame(animate);
      
      // Waktu untuk animasi yang lebih halus
      const time = Date.now() * 0.001;

      // Rotate objects dengan animasi yang lebih halus dan dinamis
      objectsRef.current.forEach((obj, index) => {
        // Rotasi dasar dengan variasi untuk setiap objek
        obj.rotation.x += 0.003 * (index % 3 + 1);
        obj.rotation.y += 0.007 * ((index % 2) + 1);
        
        // Tambahkan gelombang sinus untuk gerakan organik
        const wobble = Math.sin(time * (0.5 + index * 0.1)) * 0.1;
        obj.rotation.z = wobble;
        
        // Scale pulse effect
        obj.scale.x = obj.scale.y = obj.scale.z = 1.0 + Math.sin(time * 0.7 + index) * 0.05;
        
        // Apply mouse movement influence dengan efek yang lebih dramatis
        const targetX = mouseRef.current.x * 0.15;
        const targetY = mouseRef.current.y * 0.15;
        
        // Gerakan parallax yang lebih kuat
        obj.position.x += (targetX + Math.sin(time * 0.5 + index) * 2 - obj.position.x) * 0.02;
        obj.position.y += (-targetY + Math.cos(time * 0.5 + index) * 2 - obj.position.y) * 0.02;
        
        // Efek Z axis untuk gerakan 3D yang lebih nyata
        const originalZ = Math.sin(index * 0.5) * 5;
        obj.position.z = originalZ + Math.sin(time + index) * 2;
      });

      // Animate lights untuk efek yang lebih dinamis
      if (sceneRef.current) {
        // Dapatkan semua lampu dalam scene
        sceneRef.current.children.forEach((child, childIndex) => {
          if (child instanceof THREE.PointLight || child instanceof THREE.SpotLight) {
            // Gerakan lampu berdasarkan waktu untuk efek dramatis
            child.intensity = child.userData.baseIntensity || (child.intensity * 0.8);
            child.userData.baseIntensity = child.userData.baseIntensity || child.intensity;
            
            // Animasi intensitas sedikit untuk efek berkedip halus
            child.intensity += Math.sin(time * 3) * 0.1;
            
            // Gerakan lampu dalam pola
            if (child instanceof THREE.PointLight) {
              child.position.x += Math.sin(time * 0.5 + childIndex) * 0.1;
              child.position.y += Math.cos(time * 0.5 + childIndex) * 0.1;
            }
          }
        });
      }

      // Move camera dengan animasi yang lebih responsif
      if (cameraRef.current) {
        // Tambahkan pergerakan lembut pada kamera
        cameraRef.current.position.x += (mouseRef.current.x * 0.7 - cameraRef.current.position.x) * 0.03;
        cameraRef.current.position.y += (-mouseRef.current.y * 0.7 - cameraRef.current.position.y) * 0.03;
        
        // Tambahkan sedikit putaran organik pada kamera
        cameraRef.current.rotation.z = Math.sin(time * 0.2) * 0.02;
        
        // Arahkan kamera
        cameraRef.current.lookAt(sceneRef.current.position);
      }

      // Render scene with post-processing for premium look
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    // Initialize and start 3D effect
    initThree();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of geometries and materials
      objectsRef.current.forEach(obj => {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(material => material.dispose());
        } else {
          obj.material.dispose();
        }
      });
      
      // Clear references
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      objectsRef.current = [];
    };
  }, [containerId]);

  return null; // This component doesn't render anything directly, it manipulates the DOM element with the given ID
};

export default Premium3DEffect;