/* OBSIDIA — Main JS */

// Nav scroll state
const nav = document.querySelector('.nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Active nav link
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentFile || (currentFile === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// Intersection Observer — scroll animations
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.fade-up, .fade-in').forEach(el => io.observe(el));

// Called after dynamic content is injected (Firestore loads)
window.observeAnimate = () => {
  document.querySelectorAll('.fade-up:not(.visible), .fade-in:not(.visible)').forEach(el => io.observe(el));
};

// Pieces page — category filter
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.piece-item').forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = show ? '1' : '0.2';
        item.style.pointerEvents = show ? '' : 'none';
        item.style.transform = show ? '' : 'scale(0.97)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      });
    });
  });
}

