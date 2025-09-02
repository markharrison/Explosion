/**
 * ExplosionEffect - A comprehensive explosion effects library for HTML5 Canvas
 * Author: Mark Harrison
 * License: MIT
 */

class ExplosionEffect {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.effects = [];
        this.animationId = null;
        this.isRunning = false;
        
        // Default options
        this.defaultOptions = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            particleCount: 50,
            duration: 2000,
            size: 1,
            color: '#ffffff',
            glowIntensity: 1,
            autoStart: true
        };
        
        this.options = { ...this.defaultOptions, ...options };
        this.startTime = Date.now();
        
        if (this.options.autoStart) {
            this.start();
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now();
            this.animate();
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.cleanup(); // Ensure cleanup is called when stopping
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.clear();
        
        const elapsed = Date.now() - this.startTime;
        const progress = Math.min(elapsed / this.options.duration, 1);
        
        this.render(progress);
        
        if (progress < 1) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.isRunning = false;
            this.cleanup(); // Clean up memory when animation ends
        }
    }
    
    cleanup() {
        // Override in subclasses to clean up particle arrays and other memory objects
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    render(progress) {
        // Override in subclasses
    }
    
    // Utility methods for effects
    createParticle(x, y, vx, vy, life = 1, size = 1, color = '#ffffff') {
        return {
            x, y, vx, vy, life, size, color,
            startLife: life,
            startSize: size
        };
    }
    
    updateParticle(particle, deltaTime) {
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        particle.life -= deltaTime / 1000;
        return particle.life > 0;
    }
    
    drawParticle(particle, glowIntensity = 1) {
        const alpha = Math.max(0, particle.life / particle.startLife);
        const size = particle.size * (0.5 + alpha * 0.5);
        
        this.ctx.save();
        
        // Add glow effect
        if (glowIntensity > 0) {
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 10 * glowIntensity * alpha;
        }
        
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    // Convert HSL to RGB for color effects
    hslToRgb(h, s, l) {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
        else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
        else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
        else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
        else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];
        
        return `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`;
    }
}

// Lightning Burst Effect
class LightningBurst extends ExplosionEffect {
    constructor(canvas, options = {}) {
        const defaults = {
            lightningCount: 12,
            color: '#9966ff',
            glowIntensity: 2
        };
        super(canvas, { ...defaults, ...options });
        this.lightningBolts = [];
        this.initializeLightning();
    }
    
    initializeLightning() {
        this.lightningBolts = []; // Ensure array is initialized
        for (let i = 0; i < this.options.lightningCount; i++) {
            const angle = (i / this.options.lightningCount) * Math.PI * 2;
            const bolt = {
                angle,
                segments: [],
                maxLength: 100 * this.options.size,
                color: this.options.color
            };
            
            // Create jagged lightning segments
            for (let j = 0; j < 8; j++) {
                const length = (j + 1) * bolt.maxLength / 8;
                const offset = (Math.random() - 0.5) * 20;
                bolt.segments.push({ length, offset });
            }
            
            this.lightningBolts.push(bolt);
        }
    }
    
    render(progress) {
        const centerGlow = 1 - progress;
        const lightningIntensity = Math.sin(progress * Math.PI) * 2;
        
        // Draw central glow
        this.ctx.save();
        this.ctx.shadowColor = this.options.color;
        this.ctx.shadowBlur = 30 * this.options.glowIntensity * centerGlow;
        this.ctx.globalAlpha = centerGlow;
        this.ctx.fillStyle = this.options.color;
        this.ctx.beginPath();
        this.ctx.arc(this.options.x, this.options.y, 15 * this.options.size * centerGlow, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        // Draw lightning bolts
        if (this.lightningBolts && this.lightningBolts.length > 0) {
            this.lightningBolts.forEach(bolt => {
                this.ctx.save();
                this.ctx.strokeStyle = bolt.color;
                this.ctx.lineWidth = 3 * this.options.size;
                this.ctx.shadowColor = bolt.color;
                this.ctx.shadowBlur = 15 * this.options.glowIntensity;
                this.ctx.globalAlpha = lightningIntensity;
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.options.x, this.options.y);
                
                let currentX = this.options.x;
                let currentY = this.options.y;
                
                bolt.segments.forEach(segment => {
                    const targetX = this.options.x + Math.cos(bolt.angle) * segment.length * progress;
                    const targetY = this.options.y + Math.sin(bolt.angle) * segment.length * progress;
                    const offsetX = Math.cos(bolt.angle + Math.PI / 2) * segment.offset;
                    const offsetY = Math.sin(bolt.angle + Math.PI / 2) * segment.offset;
                    
                    this.ctx.lineTo(targetX + offsetX, targetY + offsetY);
                    currentX = targetX + offsetX;
                    currentY = targetY + offsetY;
                });
                
                this.ctx.stroke();
                this.ctx.restore();
            });
        }
    }
    
    cleanup() {
        super.cleanup();
        this.lightningBolts = []; // Clear lightning bolts array to free memory
    }
}

// Ring Explosion Effect
class RingExplosion extends ExplosionEffect {
    constructor(canvas, options = {}) {
        const defaults = {
            ringCount: 3,
            color: '#00ff88',
            glowIntensity: 1.5
        };
        super(canvas, { ...defaults, ...options });
        this.particles = [];
        this.initializeParticles();
    }
    
    initializeParticles() {
        this.particles = []; // Ensure array is initialized
        for (let ring = 0; ring < this.options.ringCount; ring++) {
            const particlesPerRing = 20 + ring * 10;
            for (let i = 0; i < particlesPerRing; i++) {
                const angle = (i / particlesPerRing) * Math.PI * 2;
                const speed = 50 + ring * 30;
                const particle = this.createParticle(
                    this.options.x,
                    this.options.y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    2 - ring * 0.3,
                    3 + ring,
                    this.options.color
                );
                particle.ring = ring;
                this.particles.push(particle);
            }
        }
    }
    
    render(progress) {
        // Update and draw particles
        if (this.particles && this.particles.length > 0) {
            this.particles.forEach(particle => {
                particle.x += particle.vx * progress * 0.02;
                particle.y += particle.vy * progress * 0.02;
                
                const ringProgress = Math.max(0, progress - particle.ring * 0.1);
                const alpha = Math.max(0, 1 - ringProgress);
                
                this.ctx.save();
                this.ctx.globalAlpha = alpha;
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 8 * this.options.glowIntensity;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        }
        
        // Draw central ring
        const ringRadius = 50 * this.options.size * progress;
        const ringAlpha = Math.sin(progress * Math.PI);
        
        this.ctx.save();
        this.ctx.strokeStyle = this.options.color;
        this.ctx.lineWidth = 4 * this.options.size;
        this.ctx.shadowColor = this.options.color;
        this.ctx.shadowBlur = 20 * this.options.glowIntensity;
        this.ctx.globalAlpha = ringAlpha;
        this.ctx.beginPath();
        this.ctx.arc(this.options.x, this.options.y, ringRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    cleanup() {
        super.cleanup();
        this.particles = []; // Clear particles array to free memory
    }
}

// Star Burst Effect
class StarBurst extends ExplosionEffect {
    constructor(canvas, options = {}) {
        const defaults = {
            starPoints: 8,
            color: '#00aaff',
            glowIntensity: 1.8
        };
        super(canvas, { ...defaults, ...options });
        this.particles = [];
        this.initializeParticles();
    }
    
    initializeParticles() {
        this.particles = []; // Ensure array is initialized
        // Main star rays
        for (let i = 0; i < this.options.starPoints; i++) {
            const angle = (i / this.options.starPoints) * Math.PI * 2;
            const speed = 120;
            
            // Multiple particles per ray
            for (let j = 0; j < 8; j++) {
                const particle = this.createParticle(
                    this.options.x,
                    this.options.y,
                    Math.cos(angle) * speed * (0.8 + j * 0.05),
                    Math.sin(angle) * speed * (0.8 + j * 0.05),
                    2.5 - j * 0.2,
                    4 - j * 0.3,
                    this.options.color
                );
                particle.delay = j * 0.05;
                this.particles.push(particle);
            }
        }
        
        // Secondary particles
        for (let i = 0; i < this.options.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 30 + Math.random() * 60;
            const particle = this.createParticle(
                this.options.x,
                this.options.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                1 + Math.random(),
                2 + Math.random() * 2,
                this.options.color
            );
            particle.delay = Math.random() * 0.3;
            this.particles.push(particle);
        }
    }
    
    render(progress) {
        // Draw center glow
        const centerGlow = Math.max(0, 1 - progress * 2);
        this.ctx.save();
        this.ctx.shadowColor = this.options.color;
        this.ctx.shadowBlur = 40 * this.options.glowIntensity * centerGlow;
        this.ctx.globalAlpha = centerGlow;
        this.ctx.fillStyle = this.options.color;
        this.ctx.beginPath();
        this.ctx.arc(this.options.x, this.options.y, 20 * this.options.size * centerGlow, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        // Update and draw particles
        if (this.particles && this.particles.length > 0) {
            this.particles.forEach(particle => {
                const particleProgress = Math.max(0, progress - particle.delay);
                if (particleProgress > 0) {
                    particle.x += particle.vx * particleProgress * 0.02;
                    particle.y += particle.vy * particleProgress * 0.02;
                    
                    const alpha = Math.max(0, 1 - particleProgress);
                    
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.shadowColor = particle.color;
                    this.ctx.shadowBlur = 6 * this.options.glowIntensity;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                }
            });
        }
    }
    
    cleanup() {
        super.cleanup();
        this.particles = []; // Clear particles array to free memory
    }
}

// Glow Pulse Effect
class GlowPulse extends ExplosionEffect {
    constructor(canvas, options = {}) {
        const defaults = {
            pulseCount: 4,
            color: '#ffff00',
            glowIntensity: 3
        };
        super(canvas, { ...defaults, ...options });
    }
    
    render(progress) {
        const pulseFreq = 8;
        const pulse = Math.sin(progress * Math.PI * pulseFreq) * 0.5 + 0.5;
        const overallIntensity = Math.sin(progress * Math.PI);
        
        // Multiple pulse rings
        for (let i = 0; i < this.options.pulseCount; i++) {
            const ringProgress = (progress + i * 0.2) % 1;
            const radius = ringProgress * 80 * this.options.size;
            const alpha = (1 - ringProgress) * overallIntensity * (0.8 + pulse * 0.4);
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.shadowColor = this.options.color;
            this.ctx.shadowBlur = 30 * this.options.glowIntensity * alpha;
            
            // Filled circle
            this.ctx.fillStyle = this.options.color;
            this.ctx.beginPath();
            this.ctx.arc(this.options.x, this.options.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Ring outline
            this.ctx.strokeStyle = this.options.color;
            this.ctx.lineWidth = 3 * this.options.size;
            this.ctx.beginPath();
            this.ctx.arc(this.options.x, this.options.y, radius + 10, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
        
        // Central bright core
        const coreSize = 15 * this.options.size * (1 + pulse * 0.5);
        this.ctx.save();
        this.ctx.shadowColor = this.options.color;
        this.ctx.shadowBlur = 50 * this.options.glowIntensity;
        this.ctx.fillStyle = this.options.color;
        this.ctx.beginPath();
        this.ctx.arc(this.options.x, this.options.y, coreSize, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    cleanup() {
        super.cleanup();
        // GlowPulse doesn't have particle arrays, just the basic cleanup
    }
}

// Fire Explosion Effect
class FireExplosion extends ExplosionEffect {
    constructor(canvas, options = {}) {
        const defaults = {
            color: '#ff4400',
            glowIntensity: 2,
            smokeParticles: 30
        };
        super(canvas, { ...defaults, ...options });
        this.fireParticles = [];
        this.smokeParticles = [];
        this.initializeParticles();
    }
    
    initializeParticles() {
        this.fireParticles = []; // Ensure arrays are initialized
        this.smokeParticles = [];
        
        // Fire particles
        for (let i = 0; i < this.options.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 20 + Math.random() * 80;
            const hue = 10 + Math.random() * 30; // Orange to red range
            const particle = this.createParticle(
                this.options.x,
                this.options.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 20, // Slight upward bias
                1.5 + Math.random(),
                3 + Math.random() * 4,
                this.hslToRgb(hue, 0.9, 0.6)
            );
            particle.gravity = 10;
            particle.originalColor = { h: hue, s: 0.9, l: 0.6 };
            this.fireParticles.push(particle);
        }
        
        // Smoke particles
        for (let i = 0; i < this.options.smokeParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 10 + Math.random() * 30;
            const particle = this.createParticle(
                this.options.x + (Math.random() - 0.5) * 20,
                this.options.y + (Math.random() - 0.5) * 20,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 30,
                2 + Math.random() * 2,
                2 + Math.random() * 3,
                this.hslToRgb(0, 0, 0.3)
            );
            particle.delay = Math.random() * 0.5;
            particle.growth = 1 + Math.random() * 2;
            this.smokeParticles.push(particle);
        }
    }
    
    render(progress) {
        // Add fade-in effect for the first 20% of the animation
        const fadeInProgress = Math.min(progress / 0.2, 1);
        const fadeInFactor = fadeInProgress;
        
        // Update and draw fire particles
        if (this.fireParticles && this.fireParticles.length > 0) {
            this.fireParticles.forEach(particle => {
                particle.x += particle.vx * progress * 0.02;
                particle.y += particle.vy * progress * 0.02 + particle.gravity * progress * 0.01;
                
                // Color transition from bright to dark
                const colorProgress = progress;
                const newL = particle.originalColor.l * (1 - colorProgress * 0.8);
                particle.color = this.hslToRgb(particle.originalColor.h, particle.originalColor.s, newL);
                
                // Apply both fade-in and fade-out
                const alpha = Math.max(0, (1 - progress) * fadeInFactor);
                
                if (alpha > 0) {
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.shadowColor = particle.color;
                    this.ctx.shadowBlur = 12 * this.options.glowIntensity * alpha;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                }
            });
        }
        
        // Update and draw smoke particles
        if (this.smokeParticles && this.smokeParticles.length > 0) {
            this.smokeParticles.forEach(particle => {
                const smokeProgress = Math.max(0, progress - particle.delay);
                if (smokeProgress > 0) {
                    particle.x += particle.vx * smokeProgress * 0.015;
                    particle.y += particle.vy * smokeProgress * 0.015;
                    particle.size = particle.startSize * (1 + particle.growth * smokeProgress);
                    
                    // Apply fade-in to smoke as well
                    const alpha = Math.max(0, (1 - smokeProgress) * 0.6 * fadeInFactor);
                    
                    if (alpha > 0) {
                        this.ctx.save();
                        this.ctx.globalAlpha = alpha;
                        this.ctx.fillStyle = particle.color;
                        this.ctx.beginPath();
                        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.restore();
                    }
                }
            });
        }
    }
    
    cleanup() {
        super.cleanup();
        this.fireParticles = []; // Clear particle arrays to free memory
        this.smokeParticles = [];
    }
}

// Particle Shower Effect
class ParticleShower extends ExplosionEffect {
    constructor(canvas, options = {}) {
        const defaults = {
            color: '#ffffff',
            glowIntensity: 1,
            showerHeight: 200
        };
        super(canvas, { ...defaults, ...options });
        this.particles = [];
        this.initializeParticles();
    }
    
    initializeParticles() {
        this.particles = []; // Ensure array is initialized
        for (let i = 0; i < this.options.particleCount * 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 30 + Math.random() * 100;
            const hue = Math.random() * 360;
            const particle = this.createParticle(
                this.options.x,
                this.options.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                2 + Math.random() * 2,
                1 + Math.random() * 3,
                this.hslToRgb(hue, 0.8, 0.6)
            );
            particle.gravity = 40;
            particle.bounce = 0.7;
            particle.trail = [];
            particle.trailLength = 8;
            this.particles.push(particle);
        }
    }
    
    render(progress) {
        if (this.particles && this.particles.length > 0) {
            this.particles.forEach(particle => {
                // Store trail position
                particle.trail.unshift({ x: particle.x, y: particle.y });
                if (particle.trail.length > particle.trailLength) {
                    particle.trail.pop();
                }
                
                // Update position
                particle.x += particle.vx * progress * 0.02;
                particle.y += particle.vy * progress * 0.02 + particle.gravity * progress * 0.02;
                
                // Bounce off bottom
                if (particle.y > this.canvas.height - 10) {
                    particle.y = this.canvas.height - 10;
                    particle.vy *= -particle.bounce;
                    particle.vx *= 0.9; // Friction
                }
                
                // Draw trail
                particle.trail.forEach((pos, index) => {
                    const trailAlpha = (1 - index / particle.trail.length) * Math.max(0, 1 - progress);
                    if (trailAlpha > 0) {
                        this.ctx.save();
                        this.ctx.globalAlpha = trailAlpha;
                        this.ctx.fillStyle = particle.color;
                        this.ctx.beginPath();
                        const size = particle.size * (1 - index / particle.trail.length);
                        this.ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.restore();
                    }
                });
                
                // Draw particle
                const alpha = Math.max(0, 1 - progress);
                this.ctx.save();
                this.ctx.globalAlpha = alpha;
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 8 * this.options.glowIntensity * alpha;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        }
    }
    
    cleanup() {
        super.cleanup();
        this.particles = []; // Clear particle array to free memory
    }
}

// Confetti Effect
class ConfettiExplosion extends ExplosionEffect {
    constructor(canvas, options = {}) {
        const defaults = {
            color: '#ff69b4',
            particleCount: 60, // Reduced from 80 for better performance
            glowIntensity: 0.5,
            duration: 3000
        };
        super(canvas, { ...defaults, ...options });
        this.confettiPieces = [];
        this.initializeConfetti();
    }
    
    initializeConfetti() {
        this.confettiPieces = [];
        
        // Confetti colors for celebration - more vibrant and distinct
        const confettiColors = [
            '#ff69b4', // Hot pink
            '#00bfff', // Deep sky blue
            '#ffd700', // Gold
            '#32cd32', // Lime green
            '#ff6347', // Tomato red
            '#9370db', // Medium purple
            '#ff8c00', // Dark orange
            '#00ced1', // Dark turquoise
            '#ff1493', // Deep pink
            '#7fff00'  // Chartreuse
        ];
        
        for (let i = 0; i < this.options.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 120; // Faster initial speed
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            
            const piece = {
                x: this.options.x,
                y: this.options.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50, // More upward bias
                width: 6 + Math.random() * 10, // Larger pieces
                height: 8 + Math.random() * 16, // More varied sizes
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.4, // Faster rotation
                color: color,
                gravity: 150 + Math.random() * 75, // Stronger gravity for faster falling
                airResistance: 0.96, // More air resistance
                life: 1,
                flutter: Math.random() * 0.03 + 0.02, // More pronounced flutter
                twirl: Math.random() * 0.1 + 0.05, // Add twirling motion
                shape: Math.random() < 0.7 ? 'rectangle' : 'diamond' // Mix of shapes
            };
            
            this.confettiPieces.push(piece);
        }
    }
    
    render(progress) {
        if (this.confettiPieces && this.confettiPieces.length > 0) {
            // Pre-calculate time-based values outside the loop for better performance
            const time = Date.now() * 0.001;
            
            this.confettiPieces.forEach(piece => {
                // Update position with physics
                piece.vx *= piece.airResistance; // Air resistance
                piece.vy += piece.gravity * progress * 0.02; // Gravity
                
                // Enhanced flutter effect (horizontal sway with twirl) - optimized
                const flutterOffset = Math.sin(time * piece.flutter) * 3;
                const twirlOffset = Math.cos(time * piece.twirl) * 1;
                
                piece.vx += flutterOffset;
                piece.x += twirlOffset;
                
                piece.x += piece.vx * progress * 0.02;
                piece.y += piece.vy * progress * 0.02;
                
                // Update rotation with more dynamic movement
                piece.rotation += piece.rotationSpeed * (1 + Math.sin(time * piece.flutter) * 0.5);
                
                // Calculate alpha to fully fade out by the end
                const alpha = Math.max(0, 1 - progress);
                
                if (alpha > 0.01) { // Only render if alpha is significant
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    
                    // Move to piece position and rotate
                    this.ctx.translate(piece.x, piece.y);
                    this.ctx.rotate(piece.rotation);
                    
                    // Set color and glow
                    this.ctx.fillStyle = piece.color;
                    
                    // Add subtle glow if enabled (reduce glow calculation overhead)
                    if (this.options.glowIntensity > 0 && alpha > 0.1) {
                        this.ctx.shadowColor = piece.color;
                        this.ctx.shadowBlur = 3 * this.options.glowIntensity * alpha;
                    }
                    
                    // Draw different shapes
                    if (piece.shape === 'diamond') {
                        // Draw diamond shape
                        this.ctx.beginPath();
                        this.ctx.moveTo(0, -piece.height/2);
                        this.ctx.lineTo(piece.width/2, 0);
                        this.ctx.lineTo(0, piece.height/2);
                        this.ctx.lineTo(-piece.width/2, 0);
                        this.ctx.closePath();
                        this.ctx.fill();
                    } else {
                        // Draw rectangle
                        this.ctx.fillRect(-piece.width/2, -piece.height/2, piece.width, piece.height);
                    }
                    
                    this.ctx.restore();
                }
            });
        }
    }
    
    cleanup() {
        super.cleanup();
        this.confettiPieces = []; // Clear particle array to free memory
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ExplosionEffect,
        LightningBurst,
        RingExplosion,
        StarBurst,
        GlowPulse,
        FireExplosion,
        ParticleShower,
        ConfettiExplosion
    };
}