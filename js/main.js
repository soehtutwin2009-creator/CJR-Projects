const body = document.body;
const heroCanvas = document.getElementById('hero-canvas');
const backToTop = document.getElementById('back-to-top');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks = document.querySelectorAll('.nav-link');
const counts = document.querySelectorAll('[data-count-item] .about-stat-number, .hero-stat-number');
const faqItems = document.querySelectorAll('.faq-item');
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const testimonialsTrack = document.getElementById('testimonials-track');
const testimonialNext = document.getElementById('testimonial-next');
const testimonialPrev = document.getElementById('testimonial-prev');
const testimonialDots = document.getElementById('testimonial-dots');
const growthBars = document.querySelectorAll('.growth-bar-fill');
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const inputs = form.querySelectorAll('input[required], textarea[required]');
const newsletterForm = document.getElementById('newsletter-form');
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const heroStats = document.querySelectorAll('.hero-stat-number');

let currentTestimonialIndex = 0;
const testimonialCount = testimonialsTrack.children.length;
const testimonialWidth = testimonialsTrack.querySelector('.testimonial-card')?.clientWidth || 0;

const setActiveTestimonial = (index) => {
  currentTestimonialIndex = (index + testimonialCount) % testimonialCount;
  testimonialsTrack.style.transform = `translateX(-${currentTestimonialIndex * testimonialWidth}px)`;
  document.querySelectorAll('.testimonial-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentTestimonialIndex);
  });
};

const initTestimonialDots = () => {
  for (let i = 0; i < testimonialCount; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'testimonial-dot';
    dot.addEventListener('click', () => setActiveTestimonial(i));
    testimonialDots.appendChild(dot);
  }
  setActiveTestimonial(0);
};

const updateCursor = (event) => {
  const { clientX, clientY } = event;
  cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
  cursorRing.style.transform = `translate(${clientX}px, ${clientY}px)`;
};

const toggleMobileNav = () => {
  const open = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
  body.style.overflow = open ? 'hidden' : '';
};

const animateCount = (element, target) => {
  const duration = 1400;
  const start = performance.now();
  const initial = Number(element.textContent) || 0;
  const diff = target - initial;

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = Math.floor(initial + diff * progress);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const handleScroll = () => {
  const scrollY = window.scrollY;
  backToTop.classList.toggle('show', scrollY > 650);
  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (!section) return;
    const sectionTop = section.offsetTop - 120;
    const sectionBottom = sectionTop + section.offsetHeight;
    link.classList.toggle('active', scrollY >= sectionTop && scrollY < sectionBottom);
  });
};

const filterPortfolio = (filter) => {
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });

  portfolioItems.forEach((item) => {
    const category = item.dataset.category;
    const shouldShow = filter === 'all' || category === filter;
    item.classList.toggle('hidden', !shouldShow);
  });
};

const validateField = (input) => {
  const error = input.nextElementSibling;
  if (!input.checkValidity()) {
    error.textContent = input.validity.valueMissing ? 'This field is required.' : 'Please enter a valid value.';
    return false;
  }
  error.textContent = '';
  return true;
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  let valid = true;
  inputs.forEach((input) => {
    valid = validateField(input) && valid;
  });
  if (!valid) return;
  formSuccess.classList.add('active');
  form.reset();
  setTimeout(() => formSuccess.classList.remove('active'), 4500);
};

const initFAQ = () => {
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    button.addEventListener('click', () => {
      item.classList.toggle('active');
      const expanded = item.classList.contains('active');
      button.setAttribute('aria-expanded', expanded);
    });
  });
};

const initFilters = () => {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => filterPortfolio(button.dataset.filter));
  });
};

const initScrollReveal = () => {
  gsap.utils.toArray('[data-reveal]').forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 30,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
      },
    });
  });
};

const initHeroAnimation = () => {
  if (!heroCanvas) return;
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 18);

  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  const pointLight = new THREE.PointLight(0xc4b5fd, 1.8, 120);
  pointLight.position.set(20, 20, 20);
  scene.add(ambient, pointLight);

  const geometry = new THREE.TorusKnotGeometry(5, 1.5, 180, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0x7665f1, metalness: 0.45, roughness: 0.25, emissive: 0x2c1f7e, emissiveIntensity: 0.25 });
  const knot = new THREE.Mesh(geometry, material);
  knot.rotation.x = Math.PI * 0.1;
  scene.add(knot);

  const particles = new THREE.BufferGeometry();
  const particleCount = 700;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.55 });
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  window.addEventListener('resize', onResize);

  const cursor = { x: 0, y: 0 };
  window.addEventListener('mousemove', (event) => {
    cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
    cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  const animate = () => {
    requestAnimationFrame(animate);
    knot.rotation.y += 0.006;
    knot.rotation.x += 0.004;
    particleSystem.rotation.y += 0.0015;
    particleSystem.rotation.x += 0.0007;
    camera.position.x += (cursor.x * 3 - camera.position.x) * 0.05;
    camera.position.y += (cursor.y * 1.9 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  animate();
};

const initLoadingSequence = () => {
  body.classList.add('loading');
  // Desktop users should be able to scroll while the cinematic overlay runs.
  const isDesktop = window.innerWidth >= 900 && !('ontouchstart' in window);
  if (!isDesktop) {
    // on touch devices and small screens block scrolling while loading
    body.style.overflow = 'hidden';
  } else {
    // let pointer events pass through the overlay so users can scroll on desktop
    if (loadingScreen) loadingScreen.style.pointerEvents = 'none';
  }
  let progress = 0;

  const maxDuration = 30000; // maximum 30 seconds
  const startTime = Date.now();

  const loadAnimation = setInterval(() => {
    const elapsed = Date.now() - startTime;
    // slightly accelerate progress during early phase for a faster feel
    const speedMultiplier = elapsed < 5000 ? 1.8 : elapsed < 15000 ? 1.2 : 1.0;
    const inc = Math.floor((Math.random() * 8 + 4) * speedMultiplier);
    progress += inc;
    if (progress >= 100) progress = 100;
    // keep UI showing under 100 until finish to allow animation
    loadingBar.style.width = `${progress}%`;
    loadingPercentage.textContent = `${Math.min(Math.floor(progress), 99)}%`;
    if (progress >= 100) {
      clearInterval(loadAnimation);
      setTimeout(() => {
        gsap.to('#loading-screen', { autoAlpha: 0, duration: 1.2, onComplete: () => {
          gsap.killTweensOf('#loading-screen');
          if (loadingScreen) loadingScreen.style.display = 'none';
          body.classList.remove('loading');
          body.style.overflow = '';
          if (loadingScreen) loadingScreen.style.pointerEvents = '';
        }});
      }, 650);
    }
  }, 100);

  // force-complete if animation takes longer than maxDuration (30s)
  const forcedFinish = setTimeout(() => {
    clearInterval(loadAnimation);
    loadingBar.style.width = `100%`;
    loadingPercentage.textContent = `100%`;
    gsap.to('#loading-screen', { autoAlpha: 0, duration: 0.9, onComplete: () => {
      if (loadingScreen) loadingScreen.style.display = 'none';
      body.classList.remove('loading');
      body.style.overflow = '';
      if (loadingScreen) loadingScreen.style.pointerEvents = '';
    }});
  }, maxDuration);

  // if the window finishes loading earlier, finish the sequence immediately
  window.addEventListener('load', () => {
    clearTimeout(forcedFinish);
    clearInterval(loadAnimation);
    loadingBar.style.width = `100%`;
    loadingPercentage.textContent = `100%`;
    setTimeout(() => {
      gsap.to('#loading-screen', { autoAlpha: 0, duration: 0.9, onComplete: () => {
        if (loadingScreen) loadingScreen.style.display = 'none';
        body.classList.remove('loading');
        body.style.overflow = '';
        if (loadingScreen) loadingScreen.style.pointerEvents = '';
      }});
    }, 200);
  });
};

const initScrollTriggerAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-badge, .hero-title, .hero-subtitle, .hero-actions, .hero-stats, .scroll-indicator', {
    opacity: 0,
    y: 30,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.2,
  });

  gsap.from('.section-header', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section-header',
      start: 'top 90%',
    },
  });

  gsap.utils.toArray('.service-card, .feature-card, .growth-card, .portfolio-item, .testimonial-card, .founder-card').forEach((card) => {
    gsap.from(card, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 92%',
      },
    });
  });

  gsap.utils.toArray('.about-stat, .timeline-item').forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 24,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 92%',
      },
    });
  });

  document.querySelectorAll('.hero-stat-number').forEach((element) => {
    const target = Number(element.dataset.count) || Number(element.textContent) || 0;
    gsap.fromTo(element, { innerText: 0 }, {
      innerText: target,
      duration: 1.9,
      ease: 'power1.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: '.hero-stats',
        start: 'top 95%',
      },
      onUpdate() {
        element.textContent = Math.floor(this.targets()[0].innerText).toString();
      },
    });
  });

  document.querySelectorAll('.about-stat-number').forEach((element) => {
    const target = Number(element.dataset.target) || Number(element.textContent) || 0;
    gsap.fromTo(element, { innerText: 0 }, {
      innerText: target,
      duration: 1.8,
      ease: 'power1.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 90%',
      },
      onUpdate() {
        element.textContent = Math.floor(this.targets()[0].innerText).toString();
      },
    });
  });

  document.querySelectorAll('.growth-bar').forEach((bar) => {
    const fill = bar.querySelector('.growth-bar-fill');
    const value = Number(bar.querySelector('.growth-bar-value').dataset.value) || 0;
    gsap.to(fill, {
      width: `${value}%`,
      ease: 'power2.out',
      duration: 1.3,
      scrollTrigger: {
        trigger: bar,
        start: 'top 90%',
      },
    });
    gsap.fromTo(bar.querySelector('.growth-bar-value'), { innerText: 0 }, {
      innerText: value,
      duration: 1.3,
      ease: 'power1.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: bar,
        start: 'top 90%',
      },
      onUpdate() {
        bar.querySelector('.growth-bar-value').textContent = `${Math.floor(this.targets()[0].innerText)}%`;
      },
    });
  });
};

const initSmoothInteractions = () => {
  document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      cursorRing.style.transform += ' scale(1.35)';
      cursorRing.style.opacity = '0.7';
    });
    element.addEventListener('mouseleave', () => {
      cursorRing.style.transform = cursorRing.style.transform.replace(' scale(1.35)', '');
      cursorRing.style.opacity = '0.95';
    });
  });
};

window.addEventListener('mousemove', updateCursor);
window.addEventListener('scroll', handleScroll);
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
mobileNavLinks.forEach((link) => link.addEventListener('click', toggleMobileNav));
form.addEventListener('submit', handleFormSubmit);
inputs.forEach((input) => input.addEventListener('input', () => validateField(input)));
newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  window.alert('Thank you for subscribing to the CJR newsletter!');
});

filterPortfolio('all');
initFilters();
initFAQ();
initTestimonialDots();
initHeroAnimation();
initLoadingSequence();
initScrollTriggerAnimations();
initSmoothInteractions();

window.addEventListener('resize', () => {
  if (testimonialsTrack) {
    const width = testimonialsTrack.querySelector('.testimonial-card')?.clientWidth || 0;
    testimonialsTrack.style.transform = `translateX(-${currentTestimonialIndex * width}px)`;
  }
});
