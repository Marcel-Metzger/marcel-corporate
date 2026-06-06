/**
 * Marcel-Philippe Metzger — Corporate Professional
 * Calm, precise, controlled interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileMenu();
    initScrollProgress();
    initReveal();
    initCounters();
    initActiveNav();
});

/* Sticky nav background on scroll */
function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* Mobile menu */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    const close = () => {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        toggle.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* Reading progress bar */
function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;
    const update = () => {
        const h = document.documentElement;
        const scrolled = h.scrollHeight - h.clientHeight;
        const pct = scrolled > 0 ? (h.scrollTop / scrolled) * 100 : 0;
        bar.style.width = pct + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
}

/* Reveal on scroll */
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in'));
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || (i * 70);
                setTimeout(() => entry.target.classList.add('in'), delay);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(el => io.observe(el));
}

/* Animated stat counters */
function initCounters() {
    const nums = document.querySelectorAll('.hero-stat-num[data-count]');
    if (!nums.length) return;

    const animate = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    nums.forEach(el => io.observe(el));
}

/* Highlight active nav link */
function initActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length) return;

    const map = {};
    links.forEach(l => {
        const id = l.getAttribute('href');
        if (id && id.startsWith('#')) map[id.slice(1)] = l;
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                map[entry.target.id]?.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => io.observe(s));
}
