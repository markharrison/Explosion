# Explosion Effects Library - Developer Documentation

## Overview

The ExplosionEffect library is a comprehensive JavaScript library for creating animated explosion effects using HTML5 Canvas. It provides an extensible framework for creating various types of explosion animations with particle systems, glow effects, and configurable parameters.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Architecture](#core-architecture)
3. [Built-in Effects](#built-in-effects)
4. [Configuration Options](#configuration-options)
5. [Creating Custom Effects](#creating-custom-effects)
6. [API Reference](#api-reference)
7. [Examples](#examples)
8. [Performance Considerations](#performance-considerations)

## Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>Explosion Effect Demo</title>
</head>
<body>
    <canvas id="myCanvas" width="800" height="600"></canvas>
    <script src="ExplosionEffect.js"></script>
    <script>
        const canvas = document.getElementById('myCanvas');
        
        // Create a lightning burst effect
        const explosion = new LightningBurst(canvas, {
            x: 400,
            y: 300,
            color: '#9966ff',
            duration: 2000
        });
    </script>
</body>
</html>
```

### Triggering Multiple Effects

```javascript
// Create different effects at different positions
const effects = [
    new LightningBurst(canvas, { x: 200, y: 200, color: '#9966ff' }),
    new RingExplosion(canvas, { x: 400, y: 200, color: '#00ff88' }),
    new FireExplosion(canvas, { x: 600, y: 200, color: '#ff4400' })
];
```

## Core Architecture

### Base Class: ExplosionEffect

The `ExplosionEffect` class serves as the foundation for all explosion effects. It provides:

- Canvas rendering context management
- Animation loop control
- Particle system utilities
- Common configuration handling

### Key Components

1. **Animation System**: Frame-based animation using `requestAnimationFrame`
2. **Particle System**: Utilities for creating and managing particles
3. **Rendering Pipeline**: Methods for drawing particles with glow effects
4. **Configuration Management**: Flexible parameter system

### Class Hierarchy

```
ExplosionEffect (Base Class)
├── LightningBurst
├── RingExplosion
├── StarBurst
├── GlowPulse
├── FireExplosion
├── ParticleShower
└── ConfettiExplosion
```

## Built-in Effects

### 1. LightningBurst

Creates electric lightning bolt effects radiating from a central point.

**Unique Properties:**
- `lightningCount`: Number of lightning bolts (default: 12)
- Creates jagged, electric-looking rays
- Bright central glow with radiating bolts

**Best Use Cases:** 
- Electric explosions
- Energy discharge effects
- Magical spell effects

### 2. RingExplosion

Generates concentric rings of particles expanding outward.

**Unique Properties:**
- `ringCount`: Number of particle rings (default: 3)
- Creates circular wave patterns
- Progressive ring activation

**Best Use Cases:**
- Shockwave effects
- Impact explosions
- Energy pulses

### 3. StarBurst

Creates star-like explosion patterns with multiple rays.

**Unique Properties:**
- `starPoints`: Number of main rays (default: 8)
- Delayed particle release for dramatic effect
- Secondary particle scatter

**Best Use Cases:**
- Fireworks effects
- Celestial explosions
- Impact bursts

### 4. GlowPulse

Produces pulsing glow effects with multiple wave rings.

**Unique Properties:**
- `pulseCount`: Number of pulse waves (default: 4)
- Continuous pulsing animation
- Intense glow effects

**Best Use Cases:**
- Energy charging effects
- Beacon/signal effects
- Mystical auras

### 5. FireExplosion

Simulates realistic fire and smoke explosion effects.

**Unique Properties:**
- `smokeParticles`: Number of smoke particles (default: 30)
- Color transition from bright to dark
- Gravity and buoyancy effects
- Realistic fire particle behavior

**Best Use Cases:**
- Realistic explosions
- Fire effects
- Combat/destruction scenes

### 6. ParticleShower

Creates cascading particle effects with trails and physics.

**Unique Properties:**
- `showerHeight`: Maximum particle height (default: 200)
- Particle trails and physics simulation
- Bounce and gravity effects
- Colorful particle variety

**Best Use Cases:**
- Celebratory effects
- Particle fountains
- Confetti-like animations

### 7. ConfettiExplosion

Creates realistic confetti effects with colorful paper pieces falling through the air.

**Unique Properties:**
- Rectangular confetti pieces instead of circular particles
- Realistic paper physics with rotation and flutter
- Bright celebratory colors (pink, blue, gold, green, etc.)
- Air resistance and gravity simulation
- Horizontal sway motion for realistic flutter

**Best Use Cases:**
- Celebration scenes
- Party effects
- Achievement notifications
- Festive animations

## Configuration Options

### Global Options (Available for all effects)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `x` | number | canvas.width/2 | X position of explosion center |
| `y` | number | canvas.height/2 | Y position of explosion center |
| `particleCount` | number | 50 | Number of particles to generate |
| `duration` | number | 2000 | Animation duration in milliseconds |
| `size` | number | 1 | Size multiplier for the effect |
| `color` | string | '#ffffff' | Primary color of the effect |
| `glowIntensity` | number | 1 | Intensity of glow effects |
| `autoStart` | boolean | true | Whether to start animation immediately |

### Effect-Specific Options

#### LightningBurst
```javascript
{
    lightningCount: 12,     // Number of lightning bolts
    color: '#9966ff',       // Lightning color
    glowIntensity: 2        // Extra glow for electric effect
}
```

#### RingExplosion
```javascript
{
    ringCount: 3,           // Number of particle rings
    color: '#00ff88',       // Ring color
    glowIntensity: 1.5      // Ring glow intensity
}
```

#### StarBurst
```javascript
{
    starPoints: 8,          // Number of main rays
    color: '#00aaff',       // Star color
    glowIntensity: 1.8      // Star glow intensity
}
```

#### GlowPulse
```javascript
{
    pulseCount: 4,          // Number of pulse waves
    color: '#ffff00',       // Pulse color
    glowIntensity: 3        // Maximum glow intensity
}
```

#### FireExplosion
```javascript
{
    color: '#ff4400',       // Base fire color
    glowIntensity: 2,       // Fire glow intensity
    smokeParticles: 30      // Number of smoke particles
}
```

**Enhanced Features:**
- **Smooth Fade-in**: 20% fade-in period reduces initial visual confusion
- **Realistic Fire Particles**: Individual fire particles with color transitions from bright to dark
- **Smoke Effects**: Delayed smoke particles with growth and transparency effects
- **Clean Visual**: Removed distracting large circle for more authentic fire appearance

#### ParticleShower
```javascript
{
    color: '#ffffff',       // Base particle color
    glowIntensity: 1,       // Particle glow intensity
    showerHeight: 200       // Maximum particle travel height
}
```

#### ConfettiExplosion
```javascript
{
    color: '#ff69b4',       // Primary confetti color (used as base for variety)
    particleCount: 60,      // Number of confetti pieces (optimized for performance)
    glowIntensity: 0.5,     // Subtle glow effect
    duration: 3000          // Longer duration for realistic falling
}
```

**Enhanced Features:**
- **Mixed Shapes**: 70% rectangles, 30% diamond-shaped pieces for visual variety
- **Realistic Physics**: Enhanced air resistance, gravity, and flutter effects
- **Dynamic Motion**: Twirling and horizontal sway that mimics real confetti
- **Vibrant Colors**: 10 celebration colors including hot pink, gold, lime green, and sky blue
- **Performance Optimized**: Reduced particle count and optimized rendering for smooth 60 FPS
- **Complete Fade-out**: Proper alpha blending ensures no particles remain frozen on screen

## Creating Custom Effects

### Step 1: Extend the Base Class

```javascript
class CustomExplosion extends ExplosionEffect {
    constructor(canvas, options = {}) {
        // Define default options specific to your effect
        const defaults = {
            customProperty: 'defaultValue',
            specialParameter: 100
        };
        
        // Merge with base defaults
        super(canvas, { ...defaults, ...options });
        
        // Initialize effect-specific properties
        this.initializeCustomEffect();
    }
    
    initializeCustomEffect() {
        // Set up particles, paths, or other effect elements
        this.particles = [];
        // ... initialization code
    }
    
    render(progress) {
        // progress: 0 to 1 representing animation completion
        
        // Your custom rendering logic here
        // Use this.ctx for canvas drawing
        // Use utility methods like drawParticle(), createParticle()
        
        // Example:
        this.particles.forEach(particle => {
            // Update particle position
            particle.x += particle.vx * progress;
            particle.y += particle.vy * progress;
            
            // Draw particle with glow
            this.drawParticle(particle, this.options.glowIntensity);
        });
    }
}
```

### Step 2: Utilize Base Class Utilities

The base class provides several utility methods:

```javascript
// Create a particle object
const particle = this.createParticle(x, y, velocityX, velocityY, life, size, color);

// Update particle (returns true if particle is still alive)
const isAlive = this.updateParticle(particle, deltaTime);

// Draw particle with glow effects
this.drawParticle(particle, glowIntensity);

// Convert HSL to RGB for color effects
const rgbColor = this.hslToRgb(hue, saturation, lightness);
```

### Step 3: Advanced Techniques

#### Creating Complex Particle Behaviors

```javascript
class HelixExplosion extends ExplosionEffect {
    initializeEffect() {
        this.particles = [];
        
        for (let i = 0; i < this.options.particleCount; i++) {
            const angle = (i / this.options.particleCount) * Math.PI * 4; // Multiple rotations
            const particle = this.createParticle(
                this.options.x,
                this.options.y,
                0, 0, // Will be calculated in render
                2, 3,
                this.hslToRgb(angle * 57.3, 0.8, 0.6) // Color based on angle
            );
            particle.angle = angle;
            particle.radius = 0;
            this.particles.push(particle);
        }
    }
    
    render(progress) {
        this.particles.forEach(particle => {
            // Spiral outward motion
            particle.radius = progress * 150;
            particle.x = this.options.x + Math.cos(particle.angle) * particle.radius;
            particle.y = this.options.y + Math.sin(particle.angle) * particle.radius;
            
            // Vertical helix motion
            const helixOffset = Math.sin(progress * Math.PI * 6 + particle.angle) * 20;
            particle.y += helixOffset;
            
            this.drawParticle(particle, this.options.glowIntensity);
        });
    }
}
```

#### Adding Physics Simulation

```javascript
class PhysicsExplosion extends ExplosionEffect {
    initializeEffect() {
        this.particles = [];
        
        for (let i = 0; i < this.options.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            const particle = this.createParticle(
                this.options.x,
                this.options.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                2 + Math.random(),
                2 + Math.random() * 3,
                this.options.color
            );
            particle.gravity = 98; // Pixels per second squared
            particle.friction = 0.98;
            particle.bounce = 0.7;
            this.particles.push(particle);
        }
    }
    
    render(progress) {
        const deltaTime = 16 / 1000; // Assume 60 FPS
        
        this.particles.forEach(particle => {
            // Apply physics
            particle.vy += particle.gravity * deltaTime;
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            
            // Update position
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // Bounce off canvas edges
            if (particle.y >= this.canvas.height - particle.size) {
                particle.y = this.canvas.height - particle.size;
                particle.vy *= -particle.bounce;
            }
            
            if (particle.x <= particle.size || particle.x >= this.canvas.width - particle.size) {
                particle.vx *= -particle.bounce;
            }
            
            this.drawParticle(particle, this.options.glowIntensity);
        });
    }
}
```

## API Reference

### ExplosionEffect (Base Class)

#### Constructor
```javascript
new ExplosionEffect(canvas, options)
```

#### Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `start()` | Start the animation | None | void |
| `stop()` | Stop the animation and clean up | None | void |
| `clear()` | Clear the canvas | None | void |
| `cleanup()` | Clean up memory objects (called automatically) | None | void |
| `render(progress)` | Render frame (override in subclasses) | progress: number (0-1) | void |

#### Utility Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `createParticle(x, y, vx, vy, life, size, color)` | Create particle object | x,y: position; vx,vy: velocity; life: lifetime; size: radius; color: string | Particle object |
| `updateParticle(particle, deltaTime)` | Update particle state | particle: object; deltaTime: number | boolean (alive) |
| `drawParticle(particle, glowIntensity)` | Draw particle with glow | particle: object; glowIntensity: number | void |
| `hslToRgb(h, s, l)` | Convert HSL to RGB | h: hue (0-360); s,l: saturation/lightness (0-1) | RGB string |

### Effect Classes

All effect classes extend `ExplosionEffect` and accept the same base options plus their specific options.

```javascript
// Lightning effect
new LightningBurst(canvas, options)

// Ring effect  
new RingExplosion(canvas, options)

// Star effect
new StarBurst(canvas, options)

// Glow effect
new GlowPulse(canvas, options)

// Fire effect
new FireExplosion(canvas, options)

// Particle shower effect
new ParticleShower(canvas, options)

// Confetti effect
new ConfettiExplosion(canvas, options)
```

## Examples

### Basic Effect Gallery

```javascript
const canvas = document.getElementById('canvas');
const effects = [
    { type: LightningBurst, x: 150, y: 150, color: '#9966ff' },
    { type: RingExplosion, x: 350, y: 150, color: '#00ff88' },
    { type: StarBurst, x: 550, y: 150, color: '#00aaff' },
    { type: GlowPulse, x: 150, y: 350, color: '#ffff00' },
    { type: FireExplosion, x: 350, y: 350, color: '#ff4400' },
    { type: ParticleShower, x: 550, y: 350, color: '#ffffff' },
    { type: ConfettiExplosion, x: 750, y: 250, color: '#ff69b4' }
];

// Trigger all effects with delays
effects.forEach((config, index) => {
    setTimeout(() => {
        new config.type(canvas, {
            x: config.x,
            y: config.y,
            color: config.color,
            size: 0.8
        });
    }, index * 500);
});
```

### Interactive Explosion on Click

```javascript
const canvas = document.getElementById('canvas');

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Random effect type
    const effects = [LightningBurst, RingExplosion, StarBurst, GlowPulse, FireExplosion, ParticleShower, ConfettiExplosion];
    const EffectClass = effects[Math.floor(Math.random() * effects.length)];
    
    // Random color
    const colors = ['#9966ff', '#00ff88', '#00aaff', '#ffff00', '#ff4400', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    new EffectClass(canvas, {
        x: x,
        y: y,
        color: color,
        size: 0.5 + Math.random() * 1.5
    });
});
```

### Synchronized Multi-Effect Sequence

```javascript
class ExplosionSequence {
    constructor(canvas) {
        this.canvas = canvas;
        this.effects = [];
    }
    
    addEffect(EffectClass, delay, options) {
        this.effects.push({ EffectClass, delay, options });
        return this;
    }
    
    play() {
        this.effects.forEach(({ EffectClass, delay, options }) => {
            setTimeout(() => {
                new EffectClass(this.canvas, options);
            }, delay);
        });
    }
}

// Create a complex sequence
const sequence = new ExplosionSequence(canvas)
    .addEffect(GlowPulse, 0, { x: 400, y: 300, color: '#ffff00', duration: 3000 })
    .addEffect(RingExplosion, 500, { x: 400, y: 300, color: '#00ff88', size: 1.5 })
    .addEffect(LightningBurst, 1000, { x: 400, y: 300, color: '#9966ff', size: 2 })
    .addEffect(FireExplosion, 1500, { x: 400, y: 300, color: '#ff4400', size: 1.2 })
    .addEffect(ParticleShower, 2000, { x: 400, y: 300, color: '#ffffff', size: 0.8 })
    .addEffect(ConfettiExplosion, 2500, { x: 400, y: 300, color: '#ff69b4', size: 1.0 });

sequence.play();
```

### Continuous Random Explosions

```javascript
class RandomExplosionGenerator {
    constructor(canvas, interval = 2000) {
        this.canvas = canvas;
        this.interval = interval;
        this.isRunning = false;
        this.timeoutId = null;
        
        this.effects = [LightningBurst, RingExplosion, StarBurst, GlowPulse, FireExplosion, ParticleShower, ConfettiExplosion];
        this.colors = ['#9966ff', '#00ff88', '#00aaff', '#ffff00', '#ff4400', '#ffffff', '#ff00ff', '#00ffff'];
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.generateNext();
    }
    
    stop() {
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    
    generateNext() {
        if (!this.isRunning) return;
        
        // Random position
        const x = 50 + Math.random() * (this.canvas.width - 100);
        const y = 50 + Math.random() * (this.canvas.height - 100);
        
        // Random effect and color
        const EffectClass = this.effects[Math.floor(Math.random() * this.effects.length)];
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        // Create explosion
        new EffectClass(this.canvas, {
            x: x,
            y: y,
            color: color,
            size: 0.5 + Math.random() * 1.5,
            glowIntensity: 1 + Math.random() * 2
        });
        
        // Schedule next explosion
        this.timeoutId = setTimeout(() => {
            this.generateNext();
        }, this.interval * (0.5 + Math.random()));
    }
}

// Usage
const generator = new RandomExplosionGenerator(canvas, 1500);
generator.start();

// Stop after 30 seconds
setTimeout(() => generator.stop(), 30000);
```

## Performance Considerations

### Recent Performance Improvements

1. **Automatic Memory Cleanup**
   - All effects now automatically clean up particle arrays when animation completes
   - Proper `cleanup()` method called on animation end and when `stop()` is invoked
   - Prevents memory leaks in long-running applications

2. **Optimized Rendering**
   ```javascript
   // Confetti effect improvements:
   // - Pre-calculated time values outside particle loops
   // - Alpha threshold checks (only render if alpha > 0.01)
   // - Reduced glow calculations for low-alpha particles
   // - Optimized particle count (60 vs 80) for better performance
   ```

3. **Enhanced Fade-out System**
   ```javascript
   // All effects now properly fade to alpha = 0 when progress = 1
   const alpha = Math.max(0, 1 - progress); // Ensures complete fade-out
   ```

4. **Improved FPS Monitoring**
   ```javascript
   // Accurate frame rate measurement using requestAnimationFrame
   // More reliable performance metrics in test application
   ```

### Optimization Tips

1. **Particle Count Management**
   ```javascript
   // Adjust particle count based on device capabilities
   const particleCount = window.devicePixelRatio > 1 ? 30 : 50;
   ```

2. **Canvas Size Optimization**
   ```javascript
   // Use appropriate canvas size for device
   const maxSize = Math.min(window.innerWidth, window.innerHeight, 800);
   canvas.width = maxSize;
   canvas.height = maxSize * 0.75;
   ```

3. **Effect Cleanup** *(Now Automatic)*
   ```javascript
   // Effects automatically clean up when animation completes
   const explosion = new LightningBurst(canvas, options);
   // Cleanup happens automatically after options.duration
   
   // Manual cleanup is still available:
   explosion.stop(); // Immediately stops and cleans up
   ```

4. **Memory Management**
   ```javascript
   // Clear canvas regularly in continuous applications
   function clearOldEffects() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
   }
   
   setInterval(clearOldEffects, 5000);
   ```

### Performance Monitoring

```javascript
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
    }
    
    update() {
        this.frameCount++;
        const now = performance.now();
        
        if (now - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
            
            console.log(`FPS: ${this.fps}`);
            
            // Adjust quality based on performance
            if (this.fps < 30) {
                console.warn('Low FPS detected - consider reducing particle count');
            }
        }
    }
}

const monitor = new PerformanceMonitor();
function animationLoop() {
    monitor.update();
    // ... other animation code
    requestAnimationFrame(animationLoop);
}
```

### Browser Compatibility

- **Modern Browsers**: Full support for all features
- **Mobile Devices**: Reduce particle counts for better performance
- **Older Browsers**: Basic functionality with reduced glow effects

### Recommended Settings by Device

```javascript
const getOptimalSettings = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency < 4;
    
    if (isMobile || isLowEnd) {
        return {
            particleCount: 25,
            glowIntensity: 0.5,
            duration: 1500
        };
    } else {
        return {
            particleCount: 75,
            glowIntensity: 2,
            duration: 2500
        };
    }
};

// Use optimal settings
const settings = getOptimalSettings();
const explosion = new LightningBurst(canvas, settings);
```

## Troubleshooting

### Common Issues

1. **Canvas Not Found Error**
   ```javascript
   // Always check if canvas exists
   const canvas = document.getElementById('myCanvas');
   if (!canvas) {
       console.error('Canvas element not found');
       return;
   }
   ```

2. **Effects Not Visible**
   ```javascript
   // Check canvas size and position
   console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
   console.log(`Effect position: ${options.x}, ${options.y}`);
   ```

3. **Poor Performance**
   ```javascript
   // Reduce complexity
   const lowPerformanceOptions = {
       particleCount: 20,
       glowIntensity: 0.5,
       duration: 1000
   };
   ```

4. **Color Not Showing**
   ```javascript
   // Ensure valid color format
   const validColor = '#ff0000'; // Correct
   const invalidColor = 'red';   // May not work in all contexts
   ```

This documentation provides comprehensive guidance for using and extending the Explosion Effects Library. For additional support or feature requests, please refer to the project repository.