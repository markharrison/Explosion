/**
 * ExplosionEffect - A comprehensive explosion effects library for HTML5 Canvas
 * Author: Mark Harrison
 * License: MIT
 */

// Constants for better maintainability
const EXPLOSION_CONSTANTS = {
    // Animation constants
    ANIMATION_SPEED: 0.02,
    ANIMATION_SPEED_FIRE: 0.015,
    ANIMATION_SPEED_SHOWER: 0.02,
    ANIMATION_SPEED_CONFETTI: 0.02,
    ALPHA_THRESHOLD: 0.01,
    ALPHA_THRESHOLD_GLOW: 0.1,
    FADE_IN_DURATION: 0.2,
    
    // Physics constants
    GRAVITY_FIRE: 10,
    GRAVITY_SHOWER: 40,
    GRAVITY_CONFETTI_MIN: 150,
    GRAVITY_CONFETTI_MAX: 75,
    AIR_RESISTANCE: 0.96,
    BOUNCE_FACTOR: 0.7,
    FRICTION: 0.9,
    
    // Visual constants
    LIGHTNING_SEGMENTS: 8,
    LIGHTNING_OFFSET_MAX: 20,
    RING_PARTICLE_BASE: 20,
    RING_PARTICLE_INCREMENT: 10,
    STAR_PARTICLES_PER_RAY: 8,
    TRAIL_LENGTH: 8,
    
    // Glow and effects
    GLOW_BLUR_BASE: 10,
    GLOW_BLUR_LIGHTNING: 15,
    GLOW_BLUR_FIRE: 12,
    GLOW_BLUR_SHOWER: 8,
    GLOW_BLUR_CONFETTI: 3,
    SHADOW_BLUR_STAR: 40,
    SHADOW_BLUR_RING: 20,
    SHADOW_BLUR_GLOW: 30,
    SHADOW_BLUR_CORE: 50,
    
    // Sizes
    CORE_SIZE_BASE: 15,
    CORE_SIZE_STAR: 20,
    PARTICLE_SIZE_BASE: 3,
    LINE_WIDTH_LIGHTNING: 3,
    LINE_WIDTH_RING: 4,
    LINE_WIDTH_GLOW: 3,
    
    // Colors and effects
    FIRE_HUE_MIN: 10,
    FIRE_HUE_MAX: 30,
    FIRE_SATURATION: 0.9,
    FIRE_LIGHTNESS: 0.6,
    SMOKE_LIGHTNESS: 0.3,
    CONFETTI_SHAPES: {
        RECTANGLE_RATIO: 0.7,
        DIAMOND_RATIO: 0.3
    }
};

class ExplosionEffect {
    /**
     * Create a new ExplosionEffect instance
     * @param {HTMLCanvasElement} canvas - The canvas element to render on
     * @param {Object} options - Configuration options for the effect
     * @param {string} options.type - Effect type ('lightning', 'ring', 'star', 'glow', 'fire', 'shower', 'confetti')
     * @param {number} options.x - X position (default: canvas center)
     * @param {number} options.y - Y position (default: canvas center)
     * @param {number} options.particleCount - Number of particles (default: 50)
     * @param {number} options.duration - Animation duration in ms (default: 2000)
     * @param {number} options.size - Size multiplier (default: 1)
     * @param {string} options.color - Effect color (default: '#ffffff')
     * @param {number} options.glowIntensity - Glow intensity (default: 1)
     * @param {boolean} options.autoStart - Auto-start animation (default: true)
     * @throws {Error} When canvas is invalid or 2D context unavailable
     */
    constructor(canvas, options = {}) {
        // Input validation
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('ExplosionEffect requires a valid HTML Canvas element');
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Unable to get 2D rendering context from canvas');
        }
        
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationId = null;
        this.isRunning = false;
        
        // Default options
        this.defaultOptions = {
            type: 'lightning', // Effect type
            x: canvas.width / 2,
            y: canvas.height / 2,
            particleCount: 50,
            duration: 2000,
            size: 1,
            color: '#ffffff',
            glowIntensity: 1,
            autoStart: true,
            // Effect-specific defaults
            lightningCount: 12,
            ringCount: 3,
            starPoints: 8,
            pulseCount: 4,
            smokeParticles: 30,
            showerHeight: 200
        };
        
        this.options = { ...this.defaultOptions, ...options };
        this.startTime = Date.now();
        
        // Initialize particles and effect-specific data
        this.particles = [];
        this.lightningBolts = [];
        this.fireParticles = [];
        this.smokeParticles = [];
        this.confettiPieces = [];
        this.stellarRays = [];
        
        this.initializeEffect();
        
        if (this.options.autoStart) {
            this.start();
        }
    }
    
    /**
     * Initialize effect based on the selected type
     * Routes to appropriate initialization method
     */
    initializeEffect() {
        // Clear all arrays
        this.particles = [];
        this.lightningBolts = [];
        this.fireParticles = [];
        this.smokeParticles = [];
        this.confettiPieces = [];
        this.stellarRays = [];
        
        // Initialize based on effect type
        switch (this.options.type) {
            case 'lightning':
                this.initializeLightning();
                break;
            case 'ring':
                this.initializeRing();
                break;
            case 'star':
                this.initializeStar();
                break;
            case 'stellar':
                this.initializeStellar();
                break;
            case 'glow':
                // Glow pulse doesn't need particle initialization
                break;
            case 'fire':
                this.initializeFire();
                break;
            case 'shower':
                this.initializeShower();
                break;
            case 'confetti':
                this.initializeConfetti();
                break;
            default:
                console.warn('Unknown effect type:', this.options.type);
                this.options.type = 'lightning';
                this.initializeLightning();
        }
    }
    
    /**
     * Start the explosion animation
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now();
            this.animate();
        }
    }
    
    /**
     * Stop the animation and clean up resources
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.cleanup();
    }
    
    /**
     * Clear the canvas safely with error handling
     */
    clear() {
        try {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } catch (error) {
            console.warn('Failed to clear canvas:', error);
        }
    }
    
    /**
     * Animation loop with error handling
     */
    animate() {
        if (!this.isRunning) return;
        
        try {
            this.clear();
            
            const elapsed = Date.now() - this.startTime;
            const progress = Math.min(elapsed / this.options.duration, 1);
            
            this.render(progress);
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(() => this.animate());
            } else {
                this.isRunning = false;
                this.cleanup();
            }
        } catch (error) {
            console.error('Animation error:', error);
            this.stop(); // Stop animation on error to prevent infinite loops
        }
    }
    
    /**
     * Clean up all particle arrays and animation resources
     */
    cleanup() {
        // Clean up all particle arrays and memory objects
        this.particles = [];
        this.lightningBolts = [];
        this.fireParticles = [];
        this.smokeParticles = [];
        this.confettiPieces = [];
        this.stellarRays = [];
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    render(progress) {
        // Route to appropriate render method based on effect type
        switch (this.options.type) {
            case 'lightning':
                this.renderLightning(progress);
                break;
            case 'ring':
                this.renderRing(progress);
                break;
            case 'star':
                this.renderStar(progress);
                break;
            case 'stellar':
                this.renderStellar(progress);
                break;
            case 'glow':
                this.renderGlow(progress);
                break;
            case 'fire':
                this.renderFire(progress);
                break;
            case 'shower':
                this.renderShower(progress);
                break;
            case 'confetti':
                this.renderConfetti(progress);
                break;
        }
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
    
    // Lightning Effect Methods
    initializeLightning() {
        this.lightningBolts = [];
        for (let i = 0; i < this.options.lightningCount; i++) {
            const angle = (i / this.options.lightningCount) * Math.PI * 2;
            const bolt = {
                angle,
                segments: [],
                maxLength: 100 * this.options.size,
                color: this.options.color
            };
            
            // Create jagged lightning segments
            for (let j = 0; j < EXPLOSION_CONSTANTS.LIGHTNING_SEGMENTS; j++) {
                const length = (j + 1) * bolt.maxLength / EXPLOSION_CONSTANTS.LIGHTNING_SEGMENTS;
                const offset = (Math.random() - 0.5) * EXPLOSION_CONSTANTS.LIGHTNING_OFFSET_MAX;
                bolt.segments.push({ length, offset });
            }
            
            this.lightningBolts.push(bolt);
        }
    }
    
    renderLightning(progress) {
        const centerGlow = 1 - progress;
        const lightningIntensity = Math.sin(progress * Math.PI) * 2;
        
        // Draw central glow
        this.ctx.save();
        this.ctx.shadowColor = this.options.color;
        this.ctx.shadowBlur = EXPLOSION_CONSTANTS.SHADOW_BLUR_RING * this.options.glowIntensity * centerGlow;
        this.ctx.globalAlpha = centerGlow;
        this.ctx.fillStyle = this.options.color;
        this.ctx.beginPath();
        this.ctx.arc(this.options.x, this.options.y, EXPLOSION_CONSTANTS.CORE_SIZE_BASE * this.options.size * centerGlow, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        // Draw lightning bolts
        if (this.lightningBolts && this.lightningBolts.length > 0) {
            this.lightningBolts.forEach(bolt => {
                this.ctx.save();
                this.ctx.strokeStyle = bolt.color;
                this.ctx.lineWidth = EXPLOSION_CONSTANTS.LINE_WIDTH_LIGHTNING * this.options.size;
                this.ctx.shadowColor = bolt.color;
                this.ctx.shadowBlur = EXPLOSION_CONSTANTS.GLOW_BLUR_LIGHTNING * this.options.glowIntensity;
                this.ctx.globalAlpha = lightningIntensity;
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.options.x, this.options.y);
                
                bolt.segments.forEach(segment => {
                    const targetX = this.options.x + Math.cos(bolt.angle) * segment.length * progress;
                    const targetY = this.options.y + Math.sin(bolt.angle) * segment.length * progress;
                    const offsetX = Math.cos(bolt.angle + Math.PI / 2) * segment.offset;
                    const offsetY = Math.sin(bolt.angle + Math.PI / 2) * segment.offset;
                    
                    this.ctx.lineTo(targetX + offsetX, targetY + offsetY);
                });
                
                this.ctx.stroke();
                this.ctx.restore();
            });
        }
    }
    
    // Ring Effect Methods
    initializeRing() {
        this.particles = [];
        for (let ring = 0; ring < this.options.ringCount; ring++) {
            const particlesPerRing = EXPLOSION_CONSTANTS.RING_PARTICLE_BASE + ring * EXPLOSION_CONSTANTS.RING_PARTICLE_INCREMENT;
            for (let i = 0; i < particlesPerRing; i++) {
                const angle = (i / particlesPerRing) * Math.PI * 2;
                const speed = 50 + ring * 30;
                const particle = this.createParticle(
                    this.options.x,
                    this.options.y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    2 - ring * 0.3,
                    EXPLOSION_CONSTANTS.PARTICLE_SIZE_BASE + ring,
                    this.options.color
                );
                particle.ring = ring;
                this.particles.push(particle);
            }
        }
    }
    
    renderRing(progress) {
        // Update and draw particles
        if (this.particles && this.particles.length > 0) {
            this.particles.forEach(particle => {
                particle.x += particle.vx * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED;
                particle.y += particle.vy * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED;
                
                const ringProgress = Math.max(0, progress - particle.ring * 0.1);
                const alpha = Math.max(0, 1 - ringProgress);
                
                if (alpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.shadowColor = particle.color;
                    this.ctx.shadowBlur = EXPLOSION_CONSTANTS.GLOW_BLUR_SHOWER * this.options.glowIntensity;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                }
            });
        }
        
        // Draw central ring
        const ringRadius = 50 * this.options.size * progress;
        const ringAlpha = Math.sin(progress * Math.PI);
        
        this.ctx.save();
        this.ctx.strokeStyle = this.options.color;
        this.ctx.lineWidth = EXPLOSION_CONSTANTS.LINE_WIDTH_RING * this.options.size;
        this.ctx.shadowColor = this.options.color;
        this.ctx.shadowBlur = EXPLOSION_CONSTANTS.SHADOW_BLUR_RING * this.options.glowIntensity;
        this.ctx.globalAlpha = ringAlpha;
        this.ctx.beginPath();
        this.ctx.arc(this.options.x, this.options.y, ringRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    // Star Effect Methods
    initializeStar() {
        this.particles = [];
        // Main star rays
        for (let i = 0; i < this.options.starPoints; i++) {
            const angle = (i / this.options.starPoints) * Math.PI * 2;
            const speed = 120;
            
            // Multiple particles per ray
            for (let j = 0; j < EXPLOSION_CONSTANTS.STAR_PARTICLES_PER_RAY; j++) {
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

    // Stellar Effect Methods
    initializeStellar() {
        this.particles = [];
        this.stellarRays = [];
        
        // Create main stellar rays - sharp linear beams like the reference image
        const numRays = 8; // 8 main rays for clear prominence
        for (let i = 0; i < numRays; i++) {
            const angle = (i / numRays) * Math.PI * 2;
            const ray = {
                angle,
                particles: [],
                intensity: 1.0
            };
            
            // Create long, sharp ray particles extending far from center
            for (let j = 0; j < 40; j++) { // Even more particles for dramatic length
                const speed = 150 + j * 30; // Even higher speeds for extreme extension
                const particle = this.createParticle(
                    this.options.x,
                    this.options.y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    6 - j * 0.12, // Longer life for extended visibility
                    8 + j * 0.6, // Larger particles that increase along ray
                    this.options.color
                );
                particle.delay = j * 0.008; // Much faster release for sharp beam formation
                particle.rayPosition = j; // Track position along ray for effects
                ray.particles.push(particle);
            }
            
            this.stellarRays.push(ray);
        }
        
        // Minimal sparkle particles to avoid interference with rays
        for (let i = 0; i < this.options.particleCount * 0.3; i++) { // Much fewer sparkles
            const angle = Math.random() * Math.PI * 2;
            const speed = 30 + Math.random() * 50; 
            const particle = this.createParticle(
                this.options.x + (Math.random() - 0.5) * 15,
                this.options.y + (Math.random() - 0.5) * 15,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                2 + Math.random() * 1, // Short life 
                1 + Math.random() * 2, // Small sparkles
                this.options.color
            );
            particle.delay = Math.random() * 0.15;
            particle.sparkle = true;
            this.particles.push(particle);
        }
    }
    
    renderStar(progress) {
        // Draw center glow
        const centerGlow = Math.max(0, 1 - progress * 2);
        this.ctx.save();
        this.ctx.shadowColor = this.options.color;
        this.ctx.shadowBlur = EXPLOSION_CONSTANTS.SHADOW_BLUR_STAR * this.options.glowIntensity * centerGlow;
        this.ctx.globalAlpha = centerGlow;
        this.ctx.fillStyle = this.options.color;
        this.ctx.beginPath();
        this.ctx.arc(this.options.x, this.options.y, EXPLOSION_CONSTANTS.CORE_SIZE_STAR * this.options.size * centerGlow, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        // Update and draw particles
        if (this.particles && this.particles.length > 0) {
            this.particles.forEach(particle => {
                const particleProgress = Math.max(0, progress - particle.delay);
                if (particleProgress > 0) {
                    particle.x += particle.vx * particleProgress * EXPLOSION_CONSTANTS.ANIMATION_SPEED;
                    particle.y += particle.vy * particleProgress * EXPLOSION_CONSTANTS.ANIMATION_SPEED;
                    
                    const alpha = Math.max(0, 1 - particleProgress);
                    
                    if (alpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
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
                }
            });
        }
    }

    /**
     * Stellar Effect Rendering
     * Creates sharp linear rays like laser beams matching the reference image
     */
    renderStellar(progress) {
        // Central orb - bright but not overwhelming like reference image
        const orbGrowth = Math.min(progress * 1.5, 1);
        const orbSize = 15 * this.options.size + (orbGrowth * 40 * this.options.size); // Much smaller orb
        const orbAlpha = Math.max(0, (1 - progress * 0.7) * 0.9); // Faster fade
        
        // Draw central orb with minimal glow to not overpower rays
        if (orbAlpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
            // Main orb - bright but contained
            this.ctx.save();
            this.ctx.globalAlpha = orbAlpha;
            this.ctx.shadowColor = this.options.color;
            this.ctx.shadowBlur = 25 * this.options.glowIntensity; // Much less blur
            this.ctx.fillStyle = this.options.color;
            this.ctx.beginPath();
            this.ctx.arc(this.options.x, this.options.y, orbSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            // Bright core
            this.ctx.save();
            this.ctx.globalAlpha = orbAlpha;
            this.ctx.shadowColor = '#ffffff';
            this.ctx.shadowBlur = 15 * this.options.glowIntensity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(this.options.x, this.options.y, orbSize * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        // Render stellar rays as sharp linear beams like reference image
        if (this.stellarRays && this.stellarRays.length > 0) {
            this.stellarRays.forEach(ray => {
                ray.particles.forEach(particle => {
                    const particleProgress = Math.max(0, progress - particle.delay);
                    if (particleProgress > 0) {
                        // Update particle position for sharp linear ray extension
                        particle.x += particle.vx * particleProgress * EXPLOSION_CONSTANTS.ANIMATION_SPEED;
                        particle.y += particle.vy * particleProgress * EXPLOSION_CONSTANTS.ANIMATION_SPEED;
                        
                        // Sharp alpha calculation for defined rays
                        const rayAlpha = Math.max(0, 1 - particleProgress * 0.8);
                        
                        if (rayAlpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
                            // Draw sharp ray particle with minimal blur for laser-beam effect
                            this.ctx.save();
                            this.ctx.globalAlpha = rayAlpha;
                            this.ctx.shadowColor = particle.color;
                            this.ctx.shadowBlur = 12 * this.options.glowIntensity; // Much less blur for sharpness
                            this.ctx.fillStyle = particle.color;
                            this.ctx.beginPath();
                            // Large, defined particles that create clear linear beams
                            const size = particle.size * rayAlpha * 4; // Even larger particles for dramatic visibility
                            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.restore();
                            
                            // Add bright core for ray definition
                            this.ctx.save();
                            this.ctx.globalAlpha = rayAlpha;
                            this.ctx.shadowColor = '#ffffff';
                            this.ctx.shadowBlur = 8 * this.options.glowIntensity;
                            this.ctx.fillStyle = '#ffffff';
                            this.ctx.beginPath();
                            this.ctx.arc(particle.x, particle.y, size * 0.4, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.restore();
                        }
                    }
                });
            });
        }

        // Render minimal sparkle particles
        if (this.particles && this.particles.length > 0) {
            this.particles.forEach(particle => {
                if (particle.sparkle) {
                    const particleProgress = Math.max(0, progress - particle.delay);
                    if (particleProgress > 0) {
                        particle.x += particle.vx * particleProgress * EXPLOSION_CONSTANTS.ANIMATION_SPEED;
                        particle.y += particle.vy * particleProgress * EXPLOSION_CONSTANTS.ANIMATION_SPEED;
                        
                        const alpha = Math.max(0, (1 - particleProgress) * 0.6); // Dimmer sparkles
                        
                        if (alpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
                            this.ctx.save();
                            this.ctx.globalAlpha = alpha;
                            this.ctx.shadowColor = particle.color;
                            this.ctx.shadowBlur = 8 * this.options.glowIntensity; // Minimal glow
                            this.ctx.fillStyle = particle.color;
                            this.ctx.beginPath();
                            this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.restore();
                        }
                    }
                }
            });
        }
    }
    
    /**
     * Glow Effect Rendering
     * Creates pulsing rings with central core
     */
    renderGlow(progress) {
        const pulseFreq = 8;
        const pulse = Math.sin(progress * Math.PI * pulseFreq) * 0.5 + 0.5;
        const overallIntensity = Math.sin(progress * Math.PI);
        
        // Multiple pulse rings
        for (let i = 0; i < this.options.pulseCount; i++) {
            const ringProgress = (progress + i * 0.2) % 1;
            const radius = ringProgress * 80 * this.options.size;
            const alpha = (1 - ringProgress) * overallIntensity * (0.8 + pulse * 0.4);
            
            if (alpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
                this.ctx.save();
                this.ctx.globalAlpha = alpha;
                this.ctx.shadowColor = this.options.color;
                this.ctx.shadowBlur = EXPLOSION_CONSTANTS.SHADOW_BLUR_GLOW * this.options.glowIntensity * alpha;
                
                // Filled circle
                this.ctx.fillStyle = this.options.color;
                this.ctx.beginPath();
                this.ctx.arc(this.options.x, this.options.y, radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Ring outline
                this.ctx.strokeStyle = this.options.color;
                this.ctx.lineWidth = EXPLOSION_CONSTANTS.LINE_WIDTH_GLOW * this.options.size;
                this.ctx.beginPath();
                this.ctx.arc(this.options.x, this.options.y, radius + 10, 0, Math.PI * 2);
                this.ctx.stroke();
                
                this.ctx.restore();
            }
        }
        
        // Central bright core with proper fade-out
        const coreSize = EXPLOSION_CONSTANTS.CORE_SIZE_BASE * this.options.size * (1 + pulse * 0.5);
        const coreAlpha = overallIntensity; // Ensure core fades out with overall intensity
        
        if (coreAlpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
            this.ctx.save();
            this.ctx.globalAlpha = coreAlpha;
            this.ctx.shadowColor = this.options.color;
            this.ctx.shadowBlur = EXPLOSION_CONSTANTS.SHADOW_BLUR_CORE * this.options.glowIntensity * coreAlpha;
            this.ctx.fillStyle = this.options.color;
            this.ctx.beginPath();
            this.ctx.arc(this.options.x, this.options.y, coreSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    
    // Fire Effect Methods
    initializeFire() {
        this.fireParticles = [];
        this.smokeParticles = [];
        
        // Fire particles
        for (let i = 0; i < this.options.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 20 + Math.random() * 80;
            const hue = EXPLOSION_CONSTANTS.FIRE_HUE_MIN + Math.random() * EXPLOSION_CONSTANTS.FIRE_HUE_MAX; // Orange to red range
            const particle = this.createParticle(
                this.options.x,
                this.options.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 20, // Slight upward bias
                1.5 + Math.random(),
                EXPLOSION_CONSTANTS.PARTICLE_SIZE_BASE + Math.random() * 4,
                this.hslToRgb(hue, EXPLOSION_CONSTANTS.FIRE_SATURATION, EXPLOSION_CONSTANTS.FIRE_LIGHTNESS)
            );
            particle.gravity = EXPLOSION_CONSTANTS.GRAVITY_FIRE;
            particle.originalColor = { h: hue, s: EXPLOSION_CONSTANTS.FIRE_SATURATION, l: EXPLOSION_CONSTANTS.FIRE_LIGHTNESS };
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
                2 + Math.random() * EXPLOSION_CONSTANTS.PARTICLE_SIZE_BASE,
                this.hslToRgb(0, 0, EXPLOSION_CONSTANTS.SMOKE_LIGHTNESS)
            );
            particle.delay = Math.random() * 0.5;
            particle.growth = 1 + Math.random() * 2;
            this.smokeParticles.push(particle);
        }
    }
    
    renderFire(progress) {
        // Add fade-in effect for the first portion of the animation
        const fadeInProgress = Math.min(progress / EXPLOSION_CONSTANTS.FADE_IN_DURATION, 1);
        const fadeInFactor = fadeInProgress;
        
        // Update and draw fire particles
        if (this.fireParticles && this.fireParticles.length > 0) {
            this.fireParticles.forEach(particle => {
                particle.x += particle.vx * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED;
                particle.y += particle.vy * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED + particle.gravity * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED / 2;
                
                // Color transition from bright to dark
                const colorProgress = progress;
                const newL = particle.originalColor.l * (1 - colorProgress * 0.8);
                particle.color = this.hslToRgb(particle.originalColor.h, particle.originalColor.s, newL);
                
                // Apply both fade-in and fade-out
                const alpha = Math.max(0, (1 - progress) * fadeInFactor);
                
                if (alpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.shadowColor = particle.color;
                    this.ctx.shadowBlur = EXPLOSION_CONSTANTS.GLOW_BLUR_FIRE * this.options.glowIntensity * alpha;
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
                    particle.x += particle.vx * smokeProgress * EXPLOSION_CONSTANTS.ANIMATION_SPEED_FIRE;
                    particle.y += particle.vy * smokeProgress * EXPLOSION_CONSTANTS.ANIMATION_SPEED_FIRE;
                    particle.size = particle.startSize * (1 + particle.growth * smokeProgress);
                    
                    // Ensure complete fade-out by adjusting for delay
                    const adjustedProgress = Math.min(1, smokeProgress / (1 - particle.delay));
                    const alpha = Math.max(0, (1 - adjustedProgress) * 0.6 * fadeInFactor);
                    
                    if (alpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
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
    
    // Shower Effect Methods
    initializeShower() {
        this.particles = [];
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
    
    renderShower(progress) {
        if (this.particles && this.particles.length > 0) {
            this.particles.forEach(particle => {
                // Store trail position
                particle.trail.unshift({ x: particle.x, y: particle.y });
                if (particle.trail.length > particle.trailLength) {
                    particle.trail.pop();
                }
                
                // Update position
                particle.x += particle.vx * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED_SHOWER;
                particle.y += particle.vy * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED_SHOWER + particle.gravity * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED_SHOWER;
                
                // Bounce off bottom
                if (particle.y > this.canvas.height - 10) {
                    particle.y = this.canvas.height - 10;
                    particle.vy *= -particle.bounce;
                    particle.vx *= 0.9; // Friction
                }
                
                // Draw trail
                particle.trail.forEach((pos, index) => {
                    const trailAlpha = (1 - index / particle.trail.length) * Math.max(0, 1 - progress);
                    if (trailAlpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
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
                if (alpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) {
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.shadowColor = particle.color;
                    this.ctx.shadowBlur = 8 * this.options.glowIntensity * alpha;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                }
            });
        }
    }
    
    // Confetti Effect Methods
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
    
    renderConfetti(progress) {
        if (this.confettiPieces && this.confettiPieces.length > 0) {
            // Pre-calculate time-based values outside the loop for better performance
            const time = Date.now() * 0.001;
            
            this.confettiPieces.forEach(piece => {
                // Update position with physics
                piece.vx *= piece.airResistance; // Air resistance
                piece.vy += piece.gravity * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED_CONFETTI; // Gravity
                
                // Enhanced flutter effect (horizontal sway with twirl) - optimized
                const flutterOffset = Math.sin(time * piece.flutter) * 3;
                const twirlOffset = Math.cos(time * piece.twirl) * 1;
                
                piece.vx += flutterOffset;
                piece.x += twirlOffset;
                
                piece.x += piece.vx * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED_CONFETTI;
                piece.y += piece.vy * progress * EXPLOSION_CONSTANTS.ANIMATION_SPEED_CONFETTI;
                
                // Update rotation with more dynamic movement
                piece.rotation += piece.rotationSpeed * (1 + Math.sin(time * piece.flutter) * 0.5);
                
                // Calculate alpha to fully fade out by the end
                const alpha = Math.max(0, 1 - progress);
                
                if (alpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD) { // Only render if alpha is significant
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    
                    // Move to piece position and rotate
                    this.ctx.translate(piece.x, piece.y);
                    this.ctx.rotate(piece.rotation);
                    
                    // Set color and glow
                    this.ctx.fillStyle = piece.color;
                    
                    // Add subtle glow if enabled (reduce glow calculation overhead)
                    if (this.options.glowIntensity > 0 && alpha > EXPLOSION_CONSTANTS.ALPHA_THRESHOLD_GLOW) {
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
}

// Export for use
/* global module */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExplosionEffect };
}