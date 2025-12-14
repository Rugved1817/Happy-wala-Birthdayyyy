//jshint esversion:6

// Enhanced Cursor Trail Animation
// Creates a smooth, flowing trail with particles that follows the mouse cursor

let trailContainer = null;
let roseCursor = null;
let particles = [];
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let velocityX = 0;
let velocityY = 0;
let animationFrame = null;

// Configuration
const config = {
  particleCount: 20, // Number of particles in trail
  particleSpacing: 6, // Distance between particles
  minDistance: 2, // Minimum distance to create new particles
  fadeDuration: 2000, // Fade duration in ms
  sparkleChance: 1.0, // All particles are sparkles (0-1)
};

// Create the trail container
const createTrailContainer = () => {
  trailContainer = document.createElement("div");
  trailContainer.className = "cursor-trail-container";
  document.body.appendChild(trailContainer);
  
  // Create rose cursor as inline SVG
  roseCursor = document.createElement("div");
  roseCursor.className = "rose-cursor";
  roseCursor.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <g transform="translate(50, 50)">
        <!-- Outer petals -->
        <ellipse cx="0" cy="-15" rx="18" ry="25" fill="#ff69b4" opacity="0.9" transform="rotate(0)"/>
        <ellipse cx="0" cy="-15" rx="18" ry="25" fill="#ff1493" opacity="0.9" transform="rotate(45)"/>
        <ellipse cx="0" cy="-15" rx="18" ry="25" fill="#ff69b4" opacity="0.9" transform="rotate(90)"/>
        <ellipse cx="0" cy="-15" rx="18" ry="25" fill="#ff1493" opacity="0.9" transform="rotate(135)"/>
        <ellipse cx="0" cy="-15" rx="18" ry="25" fill="#ff69b4" opacity="0.9" transform="rotate(180)"/>
        <ellipse cx="0" cy="-15" rx="18" ry="25" fill="#ff1493" opacity="0.9" transform="rotate(225)"/>
        <ellipse cx="0" cy="-15" rx="18" ry="25" fill="#ff69b4" opacity="0.9" transform="rotate(270)"/>
        <ellipse cx="0" cy="-15" rx="18" ry="25" fill="#ff1493" opacity="0.9" transform="rotate(315)"/>
        <!-- Middle petals -->
        <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#ffb6c1" opacity="0.95" transform="rotate(22.5)"/>
        <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#ff69b4" opacity="0.95" transform="rotate(67.5)"/>
        <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#ffb6c1" opacity="0.95" transform="rotate(112.5)"/>
        <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#ff69b4" opacity="0.95" transform="rotate(157.5)"/>
        <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#ffb6c1" opacity="0.95" transform="rotate(202.5)"/>
        <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#ff69b4" opacity="0.95" transform="rotate(247.5)"/>
        <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#ffb6c1" opacity="0.95" transform="rotate(292.5)"/>
        <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#ff69b4" opacity="0.95" transform="rotate(337.5)"/>
        <!-- Inner petals -->
        <ellipse cx="0" cy="-5" rx="8" ry="12" fill="#ffc0cb" opacity="1" transform="rotate(0)"/>
        <ellipse cx="0" cy="-5" rx="8" ry="12" fill="#ffb6c1" opacity="1" transform="rotate(45)"/>
        <ellipse cx="0" cy="-5" rx="8" ry="12" fill="#ffc0cb" opacity="1" transform="rotate(90)"/>
        <ellipse cx="0" cy="-5" rx="8" ry="12" fill="#ffb6c1" opacity="1" transform="rotate(135)"/>
        <!-- Center -->
        <circle cx="0" cy="0" r="6" fill="#ff1493" opacity="0.8"/>
        <circle cx="0" cy="0" r="3" fill="#ff69b4"/>
        <!-- Stem -->
        <rect x="-2" y="15" width="4" height="25" fill="#228b22" rx="2"/>
        <rect x="-1.5" y="15" width="3" height="25" fill="#32cd32" rx="1.5"/>
        <!-- Leaves -->
        <ellipse cx="-8" cy="25" rx="6" ry="10" fill="#228b22" transform="rotate(-30)"/>
        <ellipse cx="8" cy="28" rx="6" ry="10" fill="#228b22" transform="rotate(30)"/>
      </g>
    </svg>
  `;
  trailContainer.appendChild(roseCursor);
};

// Create a particle
const createParticle = (x, y, size = null, isSparkle = false) => {
  const particle = document.createElement("div");
  particle.className = isSparkle ? "cursor-trail-sparkle" : "cursor-trail-particle";
  
  const particleSize = size || (Math.random() * 4 + 3);
  particle.style.width = `${particleSize}px`;
  particle.style.height = `${particleSize}px`;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  // Random rotation for sparkles
  if (isSparkle) {
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
  }
  
  // Random delay for staggered animation
  const delay = Math.random() * 0.3;
  particle.style.animationDelay = `${delay}s`;
  
  trailContainer.appendChild(particle);
  
  // Remove after animation
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, config.fadeDuration);
  
  return particle;
};

// Removed line creation - using only sparkles now

// Smooth interpolation for better flow
const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

// Animation loop for smooth trail
const animate = () => {
  // Calculate velocity for dynamic effects
  velocityX = mouseX - lastMouseX;
  velocityY = mouseY - lastMouseY;
  const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
  
  // Smooth mouse position interpolation
  const smoothX = lerp(lastMouseX, mouseX, 0.3);
  const smoothY = lerp(lastMouseY, mouseY, 0.3);
  
  // Update rose cursor position with smooth following
  if (roseCursor) {
    const currentRoseX = parseFloat(roseCursor.style.left) || mouseX;
    const currentRoseY = parseFloat(roseCursor.style.top) || mouseY;
    const roseX = lerp(currentRoseX, mouseX, 0.2);
    const roseY = lerp(currentRoseY, mouseY, 0.2);
    roseCursor.style.left = `${roseX}px`;
    roseCursor.style.top = `${roseY}px`;
    
    // Add subtle rotation based on movement direction
    if (speed > 0.5) {
      const angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
      roseCursor.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
    }
  }
  
  // Create sparkles along the trail
  if (speed > config.minDistance) {
    const distance = Math.sqrt(
      Math.pow(smoothX - lastMouseX, 2) + Math.pow(smoothY - lastMouseY, 2)
    );
    
    if (distance > config.particleSpacing) {
      const steps = Math.floor(distance / config.particleSpacing);
      
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const px = lerp(lastMouseX, smoothX, t);
        const py = lerp(lastMouseY, smoothY, t);
        
        // Create sparkles only - no regular particles, no lines
        const sparkleSize = Math.max(4, 10 - (t * 4)); // Sparkles get smaller further along
        const offsetX = (Math.random() - 0.5) * 15; // Random offset for natural look
        const offsetY = (Math.random() - 0.5) * 15;
        createParticle(px + offsetX, py + offsetY, sparkleSize, true);
      }
      
      lastMouseX = smoothX;
      lastMouseY = smoothY;
    }
  }
  
  animationFrame = requestAnimationFrame(animate);
};

// Handle mouse movement
const handleMouseMove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Initialize cursor trail
export const initCursorTrail = () => {
  createTrailContainer();
  
  // Initialize positions and rose cursor
  const initMouse = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    // Set initial rose cursor position
    if (roseCursor) {
      roseCursor.style.left = `${mouseX}px`;
      roseCursor.style.top = `${mouseY}px`;
    }
  };
  
  // Initialize on first mouse move
  document.addEventListener("mousemove", initMouse, { once: true });
  
  // Start tracking mouse
  document.addEventListener("mousemove", handleMouseMove);
  
  // Start animation loop
  animate();
  
  // Clean up on page unload
  window.addEventListener("beforeunload", () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
};

