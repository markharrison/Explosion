# Explosion Effects Library - Developer Documentation

## Overview

The ExplosionEffect library is a comprehensive JavaScript library for creating animated explosion effects using HTML5 Canvas. It provides a unified API for seven distinct explosion effect types through a single class, with particle systems, glow effects, automatic memory management, and configurable parameters.

## Table of Contents

1. [Quick Start](#quick-start)
2. [New Unified Architecture](#unified-architecture)
3. [Built-in Effects](#built-in-effects)
4. [Configuration Options](#configuration-options)
5. [API Reference](#api-reference)
6. [Examples](#examples)
7. [Performance Considerations](#performance-considerations)

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
        const explosion = new ExplosionEffect(canvas, {
            type: 'lightning',
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
    new ExplosionEffect(canvas, { type: 'fire', x: 200, y: 200 }),
    new ExplosionEffect(canvas, { type: 'confetti', x: 400, y: 200 }),
    new ExplosionEffect(canvas, { type: 'glow', x: 600, y: 200 })
];
```

## Unified Architecture

The library now uses a **single `ExplosionEffect` class** with configurable effect types, providing a cleaner and more maintainable API structure:

### Key Improvements

- **Single Class Design**: All effect types are now handled by one `ExplosionEffect` class
- **Type-Based Configuration**: Effects are selected using the `type` option
- **Consistent API**: Same constructor and methods for all effect types
- **Automatic Memory Management**: All particle arrays are automatically cleaned up
- **Complete Fade-out System**: Ensures all particles fade to alpha = 0 within duration

### Effect Types

| Type | Description |
|------|-------------|
| `'lightning'` | Electric lightning bolts radiating from center |
| `'ring'` | Concentric rings of particles expanding outward |
| `'star'` | Multi-ray star explosions with delayed particle release |
| `'glow'` | Pulsing energy waves with intense glow effects |
| `'fire'` | Realistic fire and smoke with smooth fade-in |
| `'shower'` | Cascading particles with trails and bounce physics |
| `'confetti'` | Celebration effect with mixed shapes and realistic physics |

## Built-in Effects
### 1. Lightning Burst (`type: 'lightning'`)

Electric lightning bolts radiating from a central point with jagged segments and intense glow.

```javascript
const lightning = new ExplosionEffect(canvas, {
    type: 'lightning',
    x: 400,
    y: 300,
    color: '#9966ff',
    lightningCount: 12,
    glowIntensity: 2
});
```

**Specific Options:**
- `lightningCount`: Number of lightning bolts (default: 12)

### 2. Ring Explosion (`type: 'ring'`)

Concentric rings of particles expanding outward with a central ring effect.

```javascript
const ring = new ExplosionEffect(canvas, {
    type: 'ring',
    x: 400,
    y: 300,
    color: '#00ff88',
    ringCount: 3,
    glowIntensity: 1.5
});
```

**Specific Options:**
- `ringCount`: Number of particle rings (default: 3)

### 3. Star Burst (`type: 'star'`)

Multi-ray star explosions with delayed particle release for dramatic effect.

```javascript
const star = new ExplosionEffect(canvas, {
    type: 'star',
    x: 400,
    y: 300,
    color: '#00aaff',
    starPoints: 8,
    glowIntensity: 1.8
});
```

**Specific Options:**
- `starPoints`: Number of star points/rays (default: 8)

### 4. Glow Pulse (`type: 'glow'`)

Pulsing energy waves with intense glow and multiple concentric rings.

```javascript
const glow = new ExplosionEffect(canvas, {
    type: 'glow',
    x: 400,
    y: 300,
    color: '#ffff00',
    pulseCount: 4,
    glowIntensity: 3
});
```

**Specific Options:**
- `pulseCount`: Number of pulsing rings (default: 4)

### 5. Fire Explosion (`type: 'fire'`)

Realistic fire and smoke particles with smooth fade-in and enhanced visual clarity.

```javascript
const fire = new ExplosionEffect(canvas, {
    type: 'fire',
    x: 400,
    y: 300,
    color: '#ff4400',
    smokeParticles: 30,
    glowIntensity: 2
});
```

**Specific Options:**
- `smokeParticles`: Number of smoke particles (default: 30)

### 6. Particle Shower (`type: 'shower'`)

Cascading particles with trails, bounce physics, and random colors.

```javascript
const shower = new ExplosionEffect(canvas, {
    type: 'shower',
    x: 400,
    y: 300,
    color: '#ffffff',
    showerHeight: 200,
    glowIntensity: 1
});
```

**Specific Options:**
- `showerHeight`: Height effect parameter (default: 200)

### 7. Confetti Explosion (`type: 'confetti'`)

Enhanced celebration effect with mixed shapes, realistic physics, and optimized performance.

```javascript
const confetti = new ExplosionEffect(canvas, {
    type: 'confetti',
    x: 400,
    y: 300,
    color: '#ff69b4',
    particleCount: 60,
    duration: 3000,
    glowIntensity: 0.5
});
```

**Features:**
- Mixed shapes: 70% rectangles, 30% diamond-shaped pieces
- Vibrant celebration colors (10 different colors)
- Realistic physics with air resistance and flutter effects

## Configuration Options

### Universal Options

These options are available for all effect types:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | `'lightning'` | Effect type to render |
| `x` | number | canvas.width/2 | X position of explosion center |
| `y` | number | canvas.height/2 | Y position of explosion center |
| `particleCount` | number | 50 | Number of particles to generate |
| `duration` | number | 2000 | Animation duration in milliseconds |
| `size` | number | 1 | Size multiplier for all elements |
| `color` | string | `'#ffffff'` | Primary color (hex format) |
| `glowIntensity` | number | 1 | Intensity of glow effects |
| `autoStart` | boolean | true | Whether to start animation automatically |

### Effect-Specific Options

| Effect Type | Specific Options |
|-------------|------------------|
| `lightning` | `lightningCount: 12` - Number of lightning bolts |
| `ring` | `ringCount: 3` - Number of particle rings |
| `star` | `starPoints: 8` - Number of star points/rays |
| `glow` | `pulseCount: 4` - Number of pulsing rings |
| `fire` | `smokeParticles: 30` - Number of smoke particles |
| `shower` | `showerHeight: 200` - Height effect parameter |
| `confetti` | None (uses standard particle options) |

## API Reference

### Constructor

```javascript
new ExplosionEffect(canvas, options)
```

**Parameters:**
- `canvas` (HTMLCanvasElement): Target canvas element
- `options` (Object): Configuration options (see above)

### Methods

#### `start()`
Starts or restarts the animation.

```javascript
const explosion = new ExplosionEffect(canvas, { autoStart: false });
explosion.start();
```

#### `stop()`
Stops the animation and cleans up memory.

```javascript
explosion.stop();
```

#### `clear()`
Clears the canvas without stopping the animation.

```javascript
explosion.clear();
```

#### `cleanup()`
Manually clean up particle arrays and memory objects. Called automatically when animation ends.

```javascript
explosion.cleanup();
```

## Examples

### Basic Effect Creation

```javascript
// Simple lightning effect
const lightning = new ExplosionEffect(canvas, {
    type: 'lightning',
    x: 400,
    y: 300
});
```

### Advanced Configuration

```javascript
// Customized fire explosion
const fire = new ExplosionEffect(canvas, {
    type: 'fire',
    x: 400,
    y: 300,
    particleCount: 80,
    duration: 3000,
    size: 1.5,
    color: '#ff6600',
    glowIntensity: 2.5,
    smokeParticles: 40
});
```

### Sequential Effects

```javascript
// Chain multiple effects
function createSequentialExplosion() {
    const lightning = new ExplosionEffect(canvas, {
        type: 'lightning',
        x: 400,
        y: 300,
        duration: 1000
    });
    
    setTimeout(() => {
        new ExplosionEffect(canvas, {
            type: 'ring',
            x: 400,
            y: 300,
            duration: 2000
        });
    }, 800);
}
```

### Random Position Effects

```javascript
function randomExplosion() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const types = ['lightning', 'ring', 'star', 'glow', 'fire', 'shower', 'confetti'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    new ExplosionEffect(canvas, { type, x, y });
}
```

## Performance Considerations

### Memory Management

- **Automatic Cleanup**: All particle arrays are automatically cleaned up when animations complete
- **Manual Cleanup**: Call `stop()` or `cleanup()` to manually free memory
- **Effect Lifecycle**: Each effect properly manages its memory from creation to destruction

### Performance Optimizations

- **Alpha Threshold**: Particles with alpha < 0.01 are not rendered
- **Pre-calculated Values**: Time-based calculations are optimized for better frame rates
- **Reduced Computational Load**: Minimized trigonometric calculations per frame
- **Consistent 60 FPS**: All effects maintain smooth performance

### Best Practices

1. **Limit Concurrent Effects**: Avoid too many simultaneous explosions
2. **Use Appropriate Particle Counts**: Balance visual quality with performance
3. **Optimize Duration**: Shorter durations reduce computational load
4. **Monitor Frame Rate**: Use the test application's FPS counter to monitor performance
5. **Clean Up**: Always clean up effects when changing scenes or pages

### Browser Compatibility

- Modern browsers with HTML5 Canvas support
- No external dependencies required
- Tested on Chrome, Firefox, Safari, and Edge
- Mobile browser support with touch events