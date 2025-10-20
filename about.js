// ABOUT PAGE JAVASCRIPT
// Smooth scrolling and enhanced animations

(function() {
    'use strict';

    // ===================================
    // SMOOTH SCROLLING
    // ===================================

    function initializeSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // If it's an anchor link (starts with #), handle smooth scrolling
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
                // For page navigation, let the default behavior handle it
            });
        });
    }

    // ===================================
    // SCROLL-TRIGGERED ANIMATIONS
    // ===================================

    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all about sections
        const sections = document.querySelectorAll('.about-section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // ===================================
    // INTERACTIVE ELEMENTS
    // ===================================

    function initializeInteractiveElements() {
        // Add hover effects to section icons
        const sectionIcons = document.querySelectorAll('.section-icon');
        sectionIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2) rotate(10deg)';
                this.style.transition = 'transform 0.3s ease';
            });

            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });

        // Add click effects to goals list items
        const goalItems = document.querySelectorAll('[data-testid="test-about-goals"] li');
        goalItems.forEach(item => {
            item.addEventListener('click', function() {
                this.style.transform = 'translateX(10px)';
                setTimeout(() => {
                    this.style.transform = 'translateX(0)';
                }, 300);
            });
        });
    }

    // ===================================
    // INITIALIZATION
    // ===================================

    function init() {
        initializeSmoothScrolling();
        initializeScrollAnimations();
        initializeInteractiveElements();

        console.log('About page initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
