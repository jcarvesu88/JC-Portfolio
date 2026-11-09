(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

  const setMenu = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 30);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = [...document.querySelectorAll('.reveal')];
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-28% 0px -62%', threshold: [0, .2, .5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const previewTabs = [...document.querySelectorAll('.preview-tab')];
  const previewPanels = [...document.querySelectorAll('.orbit-preview')];
  const activatePreview = (name, focus = false) => {
    previewTabs.forEach((tab) => {
      const active = tab.dataset.preview === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    previewPanels.forEach((panel) => {
      const active = panel.dataset.panel === name;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  };
  previewTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activatePreview(tab.dataset.preview));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % previewTabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + previewTabs.length) % previewTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = previewTabs.length - 1;
      activatePreview(previewTabs[next].dataset.preview, true);
    });
  });

  const glow = document.querySelector('.cursor-glow');
  if (glow && !reducedMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    window.addEventListener('pointermove', (event) => { targetX = event.clientX; targetY = event.clientY; }, { passive: true });
    const updateGlow = () => {
      currentX += (targetX - currentX) * .08;
      currentY += (targetY - currentY) * .08;
      glow.style.left = `${currentX}px`;
      glow.style.top = `${currentY}px`;
      requestAnimationFrame(updateGlow);
    };
    updateGlow();
  }

  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .08}px, ${(event.clientY - rect.top - rect.height / 2) * .1}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get('subject'));
    const body = encodeURIComponent(`Hello Joey,\n\n${data.get('message')}\n\nFrom: ${data.get('name')}\nEmail: ${data.get('email')}`);
    window.location.href = `mailto:j.c.t.arvesu11@gmail.com?subject=${subject}&body=${body}`;
  });

  document.querySelectorAll('[data-year]').forEach((element) => { element.textContent = String(new Date().getFullYear()); });

  const canvas = document.querySelector('#particle-canvas');
  if (canvas && !reducedMotion) {
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const createParticles = () => {
      const count = Math.min(68, Math.max(25, Math.floor(width / 20)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .15,
        vy: (Math.random() - .5) * .15,
        radius: Math.random() * 1.25 + .35,
        alpha: Math.random() * .45 + .15
      }));
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(129,224,221,${particle.alpha})`;
        context.fill();

        for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
          const other = particles[otherIndex];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 115) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(105,170,205,${.085 * (1 - distance / 115)})`;
            context.lineWidth = .5;
            context.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    draw();
  }
})();