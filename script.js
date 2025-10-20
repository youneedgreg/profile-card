// ===================================
// PROFILE CARD - VANILLA JAVASCRIPT
// Updated for Stage 1 with Navigation
// ===================================

(function() {
    'use strict';

    // ===================================
    // TIME MANAGEMENT
    // ===================================

    function updateTime() {
        const timeElement = document.querySelector('[data-testid="test-user-time"]');
        
        if (!timeElement) {
            console.log('Time element not found');
            return;
        }

        const currentTime = Date.now();
        timeElement.textContent = currentTime;
        
        // Also update the datetime attribute if it's a <time> element
        if (timeElement.tagName === 'TIME') {
            const date = new Date(currentTime);
            timeElement.setAttribute('datetime', date.toISOString());
        }
    }

    function initializeTime() {
        // Set initial time
        updateTime();
        
        // Update every second
        setInterval(updateTime, 1000);
    }

    // ===================================
    // SOCIAL LINKS MANAGEMENT
    // ===================================

    function initializeSocialLinks() {
        const socialLinks = document.querySelectorAll('[data-testid="test-user-social-links"] a');
        
        if (socialLinks.length === 0) {
            console.log('No social links found');
            return;
        }

        socialLinks.forEach((link) => {
            // Ensure target="_blank" for new tab
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
            
            // Ensure rel="noopener noreferrer" for security
            const currentRel = link.getAttribute('rel') || '';
            const relValues = currentRel.split(' ').filter(Boolean);
            
            if (!relValues.includes('noopener')) {
                relValues.push('noopener');
            }
            if (!relValues.includes('noreferrer')) {
                relValues.push('noreferrer');
            }
            
            link.setAttribute('rel', relValues.join(' '));
        });
        
        console.log(`Initialized ${socialLinks.length} social links`);
    }

    // ===================================
    // NAVIGATION (NEW FOR STAGE 1)
    // ===================================

    function initializeNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                const isActive = navMenu.classList.contains('active');
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
                this.setAttribute('aria-expanded', !isActive);
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu when pressing Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Set active page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ===================================
    // LIST INTERACTIONS
    // ===================================

    function initializeListInteractions() {
        // Add click handlers to hobbies and dislikes for fun interaction
        const hobbies = document.querySelectorAll('[data-testid="test-user-hobbies"] li');
        const dislikes = document.querySelectorAll('[data-testid="test-user-dislikes"] li');
        
        hobbies.forEach(hobby => {
            hobby.style.cursor = 'pointer';
            hobby.addEventListener('click', function() {
                this.style.transform = 'scale(1.1) rotate(5deg)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            });
        });
        
        dislikes.forEach(dislike => {
            dislike.style.cursor = 'pointer';
            dislike.addEventListener('click', function() {
                this.style.transform = 'scale(0.9) rotate(-5deg)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            });
        });
    }

    // ===================================
    // DATA VALIDATION
    // ===================================

    function validateRequiredElements() {
        const requiredTestIds = [
            'test-profile-card',
            'test-user-name',
            'test-user-bio',
            'test-user-time',
            'test-user-avatar',
            'test-user-social-links',
            'test-user-hobbies',
            'test-user-dislikes'
        ];
        
        const results = {};
        let allPresent = true;
        
        requiredTestIds.forEach(testId => {
            const element = document.querySelector(`[data-testid="${testId}"]`);
            results[testId] = !!element;
            if (!element) {
                allPresent = false;
                console.warn(`Missing required element: data-testid="${testId}"`);
            }
        });
        
        if (allPresent) {
            console.log('✅ All required profile card elements are present');
        }
        
        return allPresent;
    }

    // ===================================
    // KEYBOARD NAVIGATION
    // ===================================

    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Press '/' to focus on first social link
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const firstLink = document.querySelector('[data-testid="test-user-social-links"] a');
                if (firstLink) {
                    firstLink.focus();
                }
            }
            
            // Press 'h' to go home
            if (e.key === 'h' && e.ctrlKey === false && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                if (window.location.pathname.includes('about.html') || window.location.pathname.includes('contact.html')) {
                    e.preventDefault();
                    window.location.href = 'index.html';
                }
            }
        });
    }

    // ===================================
    // MAIN INITIALIZATION
    // ===================================

    function init() {
        console.log('Initializing Profile Card (Stage 1)...');
        
        // Validate required elements
        validateRequiredElements();
        
        // Initialize all features
        initializeTime();
        initializeSocialLinks();
        initializeNavigation(); // New for Stage 1
        initializeListInteractions();
        initializeKeyboardShortcuts();
        
        // Mark as initialized
        const card = document.querySelector('[data-testid="test-profile-card"]');
        if (card) {
            card.setAttribute('data-initialized', 'true');
        }
        
        console.log('Profile Card initialized successfully!');
    }

    // ===================================
    // EVENT LISTENERS
    // ===================================

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already loaded
        init();
    }

    // Handle visibility change (pause/resume time updates)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateTime(); // Update immediately when page becomes visible
        }
    });

})();