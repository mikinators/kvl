/**
 * KVL Game Website - Core JavaScript
 * Minimal, performance-focused functionality
 */

// Mobile Navigation Toggle
const MobileNav = {
    menu: null,
    button: null,
    isOpen: false,

    init() {
        this.menu = document.getElementById('mobile-menu');
        this.button = document.querySelector('[onclick="toggleMenu()"]');
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.button.contains(e.target)) {
                this.close();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },

    toggle() {
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('hidden', !this.isOpen);
        this.button.setAttribute('aria-expanded', this.isOpen);
    },

    close() {
        this.isOpen = false;
        this.menu.classList.add('hidden');
        this.button.setAttribute('aria-expanded', 'false');
    }
};

// Smooth Scroll Navigation
const SmoothScroll = {
    offset: 80, // Height of fixed header

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.scrollTo(target);
                    
                    // Close mobile menu if open
                    if (MobileNav.isOpen) {
                        MobileNav.close();
                    }
                }
            });
        });
    },

    scrollTo(element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - this.offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Intersection Observer for Animations (Optional - minimal fade-in)
const ScrollAnimations = {
    init() {
        // Only run if user hasn't requested reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with animation class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            observer.observe(el);
        });
    }
};

// Form Validation Helper
const FormHelper = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    init() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Basic validation example
                const email = form.querySelector('input[type="email"]');
                if (email && !this.validateEmail(email.value)) {
                    email.style.borderColor = '#dc2626';
                    return;
                }

                // Simulate form submission
                const button = form.querySelector('button[type="submit"], button[type="button"]');
                const originalText = button.textContent;
                
                button.textContent = 'Nosūta...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = 'Nosūtīts!';
                    button.style.backgroundColor = '#16a34a';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                        button.style.backgroundColor = '';
                        form.reset();
                    }, 2000);
                }, 1000);
            });
        });
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    MobileNav.init();
    SmoothScroll.init();
    ScrollAnimations.init();
    FormHelper.init();
    
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('KVL Website Loaded - Fast & Minimal');
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 768 && MobileNav.isOpen) {
            MobileNav.close();
        }
    }, 250);
});