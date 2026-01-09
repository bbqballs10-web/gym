/**
 * Simple confetti animation for celebrations
 */

const colors = ['#00D9FF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'];

export const launchConfetti = () => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 99999;
    overflow: hidden;
  `;
  document.body.appendChild(container);

  // Create confetti pieces
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const animDuration = Math.random() * 2 + 2;
    const animDelay = Math.random() * 0.5;
    
    confetti.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation: confettiFall ${animDuration}s ease-out ${animDelay}s forwards;
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(confetti);
  }

  // Add keyframes if not exists
  if (!document.getElementById('confetti-keyframes')) {
    const style = document.createElement('style');
    style.id = 'confetti-keyframes';
    style.textContent = `
      @keyframes confettiFall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove container after animation
  setTimeout(() => {
    container.remove();
  }, 4000);
};

export default launchConfetti;
