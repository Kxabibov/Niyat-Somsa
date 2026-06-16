import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

interface ParticleCanvasProps {
    className?: string;
    particleColor?: string;
    lineColor?: string;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
    className = '',
    particleColor = 'rgba(0, 0, 0, 0.85)',
    lineColor = 'rgba(0, 0, 0, 0.40)'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -1000, y: -1000, isActive: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        const dpr = window.devicePixelRatio || 1;

        const setSize = () => {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };
        setSize();
        window.addEventListener('resize', setSize);

        const handleMouseMove = (e: MouseEvent) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            // Ensure we track properly even if hovering over other elements above the canvas
            mouse.current.x = e.clientX - rect.left;
            mouse.current.y = e.clientY - rect.top;
            mouse.current.isActive = true;
        };

        const handleMouseLeave = () => {
            // It's safer to keep it active inside the document, but we can turn it off if mouse leaves the screen
            mouse.current.isActive = false;
            mouse.current.x = -1000;
            mouse.current.y = -1000;
        };

        // Listen on window so elements over the canvas don't block the interaction
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        const particles: Particle[] = [];
        // Slightly denser particles
        const maxParticles = Math.min(Math.floor((width * height) / 8000), 150);

        for (let i = 0; i < maxParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.9,
                vy: (Math.random() - 0.5) * 0.9,
                radius: Math.random() * 2.0 + 1.2, // Slightly larger particles
            });
        }

        let animationFrameId: number;
        const connectionRadius = 140; // larger connection radius for more lines
        const mouseConnectionRadius = 220; // larger mouse radius

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, index) => {
                // Apply slight interaction from mouse (attraction/connection)
                if (mouse.current.isActive) {
                    const dxMouse = p.x - mouse.current.x;
                    const dyMouse = p.y - mouse.current.y;
                    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                    if (distMouse < mouseConnectionRadius) {
                        // Draw line to mouse
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.current.x, mouse.current.y);
                        ctx.save();
                        const force = (mouseConnectionRadius - distMouse) / mouseConnectionRadius;
                        ctx.globalAlpha = force * 0.8;
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                        ctx.restore();

                        // Subtle attraction to mouse
                        p.x -= (dxMouse / distMouse) * force * 1.5;
                        p.y -= (dyMouse / distMouse) * force * 1.5;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionRadius) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        const alpha = 1 - dist / connectionRadius;
                        ctx.save();
                        ctx.globalAlpha = alpha;
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 0.8; // thicker lines
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', setSize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particleColor, lineColor]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            style={{ display: 'block' }}
        />
    );
};

export default ParticleCanvas;
