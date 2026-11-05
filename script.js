const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

const closeNavigation = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
};

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    closeNavigation();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || menuButton?.getAttribute('aria-expanded') !== 'true') return;
  closeNavigation();
  menuButton.focus();
});

const mobileNavigationQuery = window.matchMedia('(max-width: 700px)');
mobileNavigationQuery.addEventListener('change', closeNavigation);

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.observe').forEach((element) => revealObserver.observe(element));

const canvas = document.querySelector('#network-canvas');
const context = canvas?.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const parallaxQuery = window.matchMedia('(min-width: 701px) and (prefers-reduced-motion: no-preference)');
const parallaxItems = [
  { element: document.querySelector('.network-wrap'), speed: .07, limit: 46 },
  ...Array.from(document.querySelectorAll('.orbit-two, .window-grid, .ai-rings'), (element, index) => ({
    element,
    speed: index % 2 === 0 ? .05 : -.045,
    limit: 30,
  })),
].filter((item) => item.element);

let parallaxFrame = 0;

const updateParallax = () => {
  const viewportCenter = window.innerHeight / 2;

  parallaxItems.forEach(({ element, speed, limit }) => {
    const bounds = element.getBoundingClientRect();
    const distance = bounds.top + bounds.height / 2 - viewportCenter;
    const offset = Math.max(-limit, Math.min(limit, -distance * speed));
    element.style.translate = `0 ${offset.toFixed(2)}px`;
  });

  parallaxFrame = 0;
};

const requestParallaxUpdate = () => {
  if (!parallaxQuery.matches || parallaxFrame) return;
  parallaxFrame = requestAnimationFrame(updateParallax);
};

const syncParallax = () => {
  if (parallaxQuery.matches) {
    updateParallax();
    return;
  }

  parallaxItems.forEach(({ element }) => {
    element.style.translate = '';
  });
};

window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
window.addEventListener('resize', syncParallax);
parallaxQuery.addEventListener('change', syncParallax);
syncParallax();

if (canvas && context) {
  const network = canvas.closest('.network-wrap');
  const nodes = [
    { x: .49, y: .48, radius: 8, group: 0 },
    { x: .22, y: .24, radius: 5, group: 1 },
    { x: .69, y: .18, radius: 4, group: 2 },
    { x: .82, y: .43, radius: 5, group: 1 },
    { x: .71, y: .72, radius: 4, group: 2 },
    { x: .34, y: .79, radius: 5, group: 1 },
    { x: .14, y: .58, radius: 4, group: 2 },
    { x: .39, y: .18, radius: 3, group: 2 },
    { x: .61, y: .35, radius: 3, group: 1 },
    { x: .52, y: .69, radius: 3, group: 2 },
    { x: .29, y: .48, radius: 3, group: 1 },
    { x: .86, y: .66, radius: 3, group: 2 },
  ];
  const links = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,8],[0,9],[1,7],[1,10],[2,8],[3,8],[3,11],[4,9],[4,11],[5,6],[5,9],[6,10]];
  let width = 0;
  let height = 0;
  let frame = 0;
  const pointer = { x: .5, y: .5, targetX: .5, targetY: .5, active: false };

  nodes.forEach((node, index) => {
    node.phase = index * 1.73;
    node.renderX = node.x;
    node.renderY = node.y;
  });

  const resizeCanvas = () => {
    const bounds = canvas.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
  };

  const drawNetwork = (time = 0) => {
    context.clearRect(0, 0, width, height);
    const pulse = reduceMotion ? 0 : Math.sin(time / 900) * 2;

    pointer.x += (pointer.targetX - pointer.x) * .07;
    pointer.y += (pointer.targetY - pointer.y) * .07;

    nodes.forEach((node, index) => {
      const driftX = reduceMotion ? 0 : Math.sin(time / 1500 + node.phase) * .006;
      const driftY = reduceMotion ? 0 : Math.cos(time / 1800 + node.phase) * .006;
      const distanceX = node.x - pointer.x;
      const distanceY = node.y - pointer.y;
      const distance = Math.hypot(distanceX, distanceY);
      const influence = pointer.active ? Math.max(0, 1 - distance / .38) : 0;
      const attraction = index === 0 ? .018 : .035;
      node.renderX = node.x + driftX - distanceX * influence * attraction;
      node.renderY = node.y + driftY - distanceY * influence * attraction;
      node.influence = influence;
    });

    links.forEach(([from, to]) => {
      const activity = Math.max(nodes[from].influence, nodes[to].influence);
      context.strokeStyle = activity > .05 ? `rgba(23, 105, 224, ${.18 + activity * .32})` : '#d7d8dc';
      context.lineWidth = 1 + activity * .45;
      context.beginPath();
      context.moveTo(nodes[from].renderX * width, nodes[from].renderY * height);
      context.lineTo(nodes[to].renderX * width, nodes[to].renderY * height);
      context.stroke();
    });

    nodes.forEach((node, index) => {
      const x = node.renderX * width;
      const y = node.renderY * height;
      const radius = node.radius + (index === 0 ? pulse : 0) + node.influence * 2.5;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = index === 0 ? '#1769e0' : node.group === 1 ? '#0b0b0c' : '#ffffff';
      context.fill();
      context.strokeStyle = index === 0 ? '#1769e0' : '#8d8e92';
      context.stroke();
    });

    if (!reduceMotion) frame = requestAnimationFrame(drawNetwork);
  };

  resizeCanvas();
  drawNetwork();
  network?.addEventListener('pointermove', (event) => {
    if (reduceMotion || event.pointerType === 'touch') return;
    const bounds = canvas.getBoundingClientRect();
    pointer.targetX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    pointer.targetY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    pointer.active = true;
    network.style.setProperty('--pointer-x', `${(pointer.targetX - .5) * 12}px`);
    network.style.setProperty('--pointer-y', `${(pointer.targetY - .5) * 12}px`);
  });
  network?.addEventListener('pointerleave', () => {
    pointer.targetX = .5;
    pointer.targetY = .5;
    pointer.active = false;
    network.style.setProperty('--pointer-x', '0px');
    network.style.setProperty('--pointer-y', '0px');
  });
  window.addEventListener('resize', () => {
    resizeCanvas();
    if (reduceMotion) drawNetwork();
  });
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
