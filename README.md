# Explosion Effects Library

A comprehensive JavaScript library for creating stunning animated explosion effects using HTML5 Canvas. Features particle systems, glow effects, and an extensible architecture for creating custom explosion animations.

## ✨ Features

- **8 Built-in Effect Types**: Lightning bursts, ring explosions, star bursts, stellar bursts, glow pulses, fire explosions, particle showers, and confetti celebrations
- **Highly Configurable**: Extensive parameter control for position, size, color, particle count, duration, and glow intensity
- **Extensible Architecture**: Easy to create custom explosion effects by extending the base class
- **Performance Optimized**: Efficient rendering with configurable quality settings
- **No Dependencies**: Pure vanilla JavaScript with HTML5 Canvas
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Browser Support**: Compatible with all modern browsers

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>Explosion Effects Demo</title>
</head>
<body>
    <canvas id="canvas" width="800" height="600"></canvas>
    <script src="ExplosionEffect.js"></script>
    <script>
        const canvas = document.getElementById('canvas');
        
        // Create a lightning burst explosion
        const explosion = new ExplosionEffect(canvas, {
            type: 'lightning',
            x: 400,
            y: 300,
            color: '#9966ff',
            duration: 2000,
            size: 1.5
        });
    </script>
</body>
</html>
```

### Interactive Demo

Open `index.html` in your browser to access the full interactive test application with:
- Real-time parameter adjustment
- All 8 effect types
- Color picker and presets
- Auto-play mode
- Click-to-explode functionality

## 🎨 Available Effects

### 1. Lightning Burst
Electric lightning bolt effects radiating from center
```javascript
new ExplosionEffect(canvas, { type: 'lightning', x: 400, y: 300, color: '#9966ff' });
```

### 2. Ring Explosion  
Concentric rings of particles expanding outward
```javascript
new ExplosionEffect(canvas, { type: 'ring', x: 400, y: 300, color: '#00ff88' });
```

### 3. Star Burst
Star-like explosion with multiple radiating rays
```javascript
new ExplosionEffect(canvas, { type: 'star', x: 400, y: 300, color: '#00aaff' });
```

### 4. Stellar Burst
Spectacular stellar explosion with growing translucent orb and intense radiating particles
```javascript
new ExplosionEffect(canvas, { type: 'stellar', x: 400, y: 300, color: '#ff4400' });
```

### 5. Glow Pulse
Pulsing energy waves with intense glow effects
```javascript
new ExplosionEffect(canvas, { type: 'glow', x: 400, y: 300, color: '#ffff00' });
```

### 5. Fire Explosion
Realistic fire and smoke explosion with physics
```javascript
new ExplosionEffect(canvas, { type: 'fire', x: 400, y: 300, color: '#ff4400' });
```

### 6. Particle Shower
Cascading particles with trails and bounce physics
```javascript
new ExplosionEffect(canvas, { type: 'shower', x: 400, y: 300, color: '#ffffff' });
```

### 8. Confetti Explosion
Colorful celebration effect with mixed shapes and realistic physics
```javascript
new ExplosionEffect(canvas, { type: 'confetti', x: 400, y: 300, color: '#ff69b4' });
```

## ⚙️ Configuration Options

All effects support these base options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `x` | number | center | X position of explosion |
| `y` | number | center | Y position of explosion |
| `particleCount` | number | 50 | Number of particles |
| `duration` | number | 2000 | Animation duration (ms) |
| `size` | number | 1.0 | Size multiplier |
| `color` | string | '#ffffff' | Primary color |
| `glowIntensity` | number | 1.0 | Glow effect intensity |
| `autoStart` | boolean | true | Auto-start animation |

Each effect type also has unique options - see the [full documentation](explosioneffect.md) for details.

## 🛠️ Creating Custom Effects

Add custom effects by creating new type cases in the unified ExplosionEffect class:

```javascript
// To add a new effect type, extend the effect type mapping
// and add initialization and rendering methods to ExplosionEffect class

// Example usage of a custom effect configuration:
const customExplosion = new ExplosionEffect(canvas, {
    type: 'custom', // Would need to be added to the class
    x: 400,
    y: 300,
    customProperty: 'value',
    duration: 3000
});

// For advanced customization, you can extend the class:
class CustomExplosionEffect extends ExplosionEffect {
    constructor(canvas, options = {}) {
        super(canvas, { ...options, type: 'custom' });
    }
    
    // Override specific methods for custom behavior
    initializeCustom() {
        // Custom initialization logic
    }
    
    renderCustom(progress) {
        // Custom rendering logic
    }
}
```

## 📱 Interactive Test Application

The included `index.html` provides a comprehensive test environment featuring:

- **Effect Gallery**: Try all 7 explosion types
- **Real-time Controls**: Adjust parameters with live preview
- **Color Picker**: Choose custom colors or use presets
- **Position Control**: Click canvas to set explosion position
- **Auto-play Mode**: Continuous random explosions
- **Performance Stats**: Monitor FPS and effect count
- **Responsive Design**: Works on desktop and mobile

### Test Application Features

- Bootstrap-styled UI with modern design
- Real-time parameter adjustment sliders
- Color picker with quick color presets
- Position control via sliders or canvas clicks
- Auto-play mode with configurable intervals
- Performance monitoring and statistics
- Mobile-responsive controls

## 📚 Documentation

- **[Developer Documentation](explosioneffect.md)**: Comprehensive guide covering usage, configuration, and extensibility
- **[API Reference](explosioneffect.md#api-reference)**: Complete method and property documentation
- **[Examples](explosioneffect.md#examples)**: Code samples and use cases
- **[Performance Guide](explosioneffect.md#performance-considerations)**: Optimization tips and best practices

## 🔧 Installation

### Direct Download
1. Download `ExplosionEffect.js`
2. Include it in your HTML:
   ```html
   <script src="ExplosionEffect.js"></script>
   ```

### CDN (when available)
```html
<script src="https://cdn.jsdelivr.net/gh/markharrison/Explosion@main/ExplosionEffect.js"></script>
```

## 🎯 Use Cases

- **Game Development**: Explosion effects for games
- **Interactive Demos**: Eye-catching visual effects
- **Educational Content**: Physics and animation demonstrations
- **Web Applications**: Enhanced user interactions
- **Digital Art**: Creative visual projects
- **Presentations**: Dynamic visual elements

## 🌟 Examples Gallery

### Click-to-Explode
```javascript
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    new ExplosionEffect(canvas, { type: 'lightning', x, y, color: '#9966ff' });
});
```

### Random Effect Generator
```javascript
const effectTypes = ['lightning', 'ring', 'star', 'stellar', 'glow', 'fire', 'shower', 'confetti'];
const colors = ['#9966ff', '#00ff88', '#00aaff', '#ff4400', '#ffff00', '#ffffff', '#ff69b4'];

setInterval(() => {
    const type = effectTypes[Math.floor(Math.random() * effectTypes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    
    new ExplosionEffect(canvas, { type, x, y, color });
}, 2000);
```

### Effect Sequence
```javascript
// Synchronized multi-effect explosion
new ExplosionEffect(canvas, { type: 'glow', x: 400, y: 300, color: '#ffff00', duration: 3000 });
setTimeout(() => new ExplosionEffect(canvas, { type: 'ring', x: 400, y: 300, color: '#00ff88' }), 500);
setTimeout(() => new ExplosionEffect(canvas, { type: 'stellar', x: 400, y: 300, color: '#ff4400' }), 1000);
setTimeout(() => new ExplosionEffect(canvas, { type: 'lightning', x: 400, y: 300, color: '#9966ff' }), 1500);
setTimeout(() => new ExplosionEffect(canvas, { type: 'confetti', x: 400, y: 300, color: '#ff69b4' }), 2000);
```

## 📋 Browser Support

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support  
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile Browsers**: ✅ Optimized support

## ⚡ Performance

The library is optimized for smooth 60 FPS performance:
- Efficient particle system with object pooling
- GPU-accelerated Canvas rendering
- Configurable quality settings for different devices
- Memory management and cleanup
- Mobile-optimized default settings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-effect`)
3. Commit your changes (`git commit -m 'Add amazing explosion effect'`)
4. Push to the branch (`git push origin feature/amazing-effect`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern particle systems and visual effects
- Built with performance and extensibility in mind
- Designed for both beginners and advanced developers

---

**Ready to add explosive visual effects to your project?** Check out the [interactive demo](index.html) and [developer documentation](explosioneffect.md) to get started!
