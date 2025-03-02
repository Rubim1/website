import React, { useEffect, useRef } from 'react';

const Loading = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();

    // Handle window resize
    const handleResize = () => {
      setCanvasDimensions();
    };

    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      opacity: number;
      speedX: number;
      speedY: number;
      ctx: CanvasRenderingContext2D;

      constructor(x: number, y: number, size: number, color: string, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.ctx = ctx;
      }

      draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = this.opacity;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY;
        }

        this.draw();
      }
    }

    // Create particles array
    let particlesArray: Particle[] = [];
    const init = () => {
      particlesArray = [];
      for (let i = 0; i < canvas.width / 20; i++) {
        const size = Math.random() * 5 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        particlesArray.push(new Particle(x, y, size, color, ctx));
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(particle => particle.update());
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0"></canvas>
      <div className="relative z-10 text-white text-4xl font-bold animate-pulse">Loading...</div>
    </div>
  );
};

export default Loading;
