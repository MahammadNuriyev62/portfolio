// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Navbar Scroll Effect =====
let lastScrollY = window.scrollY;

function handleNavbarScroll() {
    const currentScrollY = window.scrollY;

    // Add/remove scrolled class
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// ===== Mobile Navigation Toggle =====
function toggleMobileNav() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

navToggle.addEventListener('click', toggleMobileNav);

// Close mobile nav when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileNav();
        }
    });
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
        toggleMobileNav();
    }
});

// ===== Active Navigation Link =====
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Highlight the target element after scrolling
            setTimeout(() => {
                target.classList.add('scroll-highlight');
                setTimeout(() => {
                    target.classList.remove('scroll-highlight');
                }, 1500);
            }, 500);
        }
    });
});

// ===== Intersection Observer for Fade-in Animations =====
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .project-card, .award-card, .education-card, .publication-card, .skill-category, .info-card'
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05,
            rootMargin: '0px 0px 0px 0px'
        }
    );

    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });
}

// ===== Counter Animation for Stats =====
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                    const suffix = finalValue.replace(/[0-9]/g, '');

                    if (!isNaN(numericValue)) {
                        let current = 0;
                        const increment = numericValue / 30;
                        const duration = 1500;
                        const stepTime = duration / 30;

                        const counter = setInterval(() => {
                            current += increment;
                            if (current >= numericValue) {
                                target.textContent = numericValue + suffix;
                                clearInterval(counter);
                            } else {
                                target.textContent = Math.floor(current) + suffix;
                            }
                        }, stepTime);
                    }

                    observer.unobserve(target);
                }
            });
        },
        { threshold: 0.5 }
    );

    stats.forEach(stat => observer.observe(stat));
}

// ===== Typing Effect for Hero Title =====
function setupTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.visibility = 'visible';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 500);
}

// ===== Handle External Links =====
function setupExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// ===== Keyboard Navigation =====
function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // ESC to close mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMobileNav();
        }
    });
}

// ===== Reduce Motion for Users Who Prefer It =====
function respectReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
        // Disable animations
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-base', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');

        // Stop any running animations
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
        });
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    animateCounters();
    setupExternalLinks();
    setupKeyboardNav();
    respectReducedMotion();

    // Initial check for navbar
    handleNavbarScroll();
    setActiveNavLink();
});

// ===== Performance: Debounce scroll events =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to expensive scroll handlers if needed
// window.addEventListener('scroll', debounce(expensiveFunction, 100));

// ===== Console Easter Egg =====
console.log('%c👋 Hi there!', 'font-size: 24px; font-weight: bold; color: #004f90;');
console.log('%cInterested in the code? Check out: https://github.com/MahammadNuriyev62', 'font-size: 14px; color: #666;');
