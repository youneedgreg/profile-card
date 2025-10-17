// ===================================
// PROFILE CARD - VANILLA JAVASCRIPT
// No frameworks, no libraries, pure JS!
// ===================================

// Wrap everything in an IIFE to avoid global scope pollution
(function() {
    'use strict';

    // ===================================
    // CONFIGURATION
    // ===================================
    
    const CONFIG = {
        timeUpdateInterval: 1000, // Update time every second (set to null to disable auto-update)
        animationDuration: 300,   // Duration for animations in ms
        imageMaxSize: 5242880,     // Max image size in bytes (5MB)
        allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        debugMode: true           // Set to false in production
    };

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================

    /**
     * Safe query selector with error handling
     * @param {string} selector - CSS selector
     * @returns {Element|null}
     */
    function $(selector) {
        try {
            return document.querySelector(selector);
        } catch (e) {
            console.error(`Invalid selector: ${selector}`, e);
            return null;
        }
    }

    /**
     * Safe query selector for multiple elements
     * @param {string} selector - CSS selector
     * @returns {NodeList}
     */
    function $$(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (e) {
            console.error(`Invalid selector: ${selector}`, e);
            return [];
        }
    }

    /**
     * Log debug messages if debug mode is enabled
     * @param {...any} args - Arguments to log
     */
    function debug(...args) {
        if (CONFIG.debugMode) {
            console.log('[Profile Card]', ...args);
        }
    }

    // ===================================
    // TIME MANAGEMENT
    // ===================================

    /**
     * Update the time display with current timestamp in milliseconds
     */
    function updateTime() {
        const timeElement = $('[data-testid="test-user-time"]');
        
        if (!timeElement) {
            debug('Time element not found');
            return;
        }

        const currentTime = Date.now();
        timeElement.textContent = currentTime;
        
        // Also update the datetime attribute if it's a <time> element
        if (timeElement.tagName === 'TIME') {
            const date = new Date(currentTime);
            timeElement.setAttribute('datetime', date.toISOString());
        }
        
        debug('Time updated:', currentTime);
    }

    /**
     * Initialize time display and auto-update
     */
    function initializeTime() {
        // Set initial time
        updateTime();
        
        // Set up interval if configured
        if (CONFIG.timeUpdateInterval && CONFIG.timeUpdateInterval > 0) {
            setInterval(updateTime, CONFIG.timeUpdateInterval);
            debug(`Time auto-update enabled: every ${CONFIG.timeUpdateInterval}ms`);
        }
    }

    // ===================================
    // SOCIAL LINKS MANAGEMENT
    // ===================================

    /**
     * Ensure all social links have proper attributes for security and accessibility
     */
    function initializeSocialLinks() {
        const socialLinks = $$('[data-testid="test-user-social-links"] a');
        
        if (socialLinks.length === 0) {
            debug('No social links found');
            return;
        }

        socialLinks.forEach((link, index) => {
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
            
            // Add title for better accessibility if not present
            if (!link.hasAttribute('title')) {
                const linkText = link.textContent.trim();
                link.setAttribute('title', `Visit my ${linkText} profile (opens in new tab)`);
            }
            
            // Add event listener for analytics or tracking
            link.addEventListener('click', function(e) {
                debug(`Social link clicked: ${link.textContent.trim()}`);
                // You could add analytics tracking here
            });
        });
        
        debug(`Initialized ${socialLinks.length} social links`);
    }

    // ===================================
    // AVATAR MANAGEMENT
    // ===================================

    /**
     * Handle avatar image upload and preview
     * @param {Event} event - File input change event
     */
    function handleAvatarUpload(event) {
        const file = event.target.files?.[0];
        
        if (!file) {
            debug('No file selected');
            return;
        }

        // Validate file type
        if (!CONFIG.allowedImageTypes.includes(file.type)) {
            alert(`Please select a valid image file. Allowed types: ${CONFIG.allowedImageTypes.join(', ')}`);
            event.target.value = ''; // Clear the input
            return;
        }

        // Validate file size
        if (file.size > CONFIG.imageMaxSize) {
            alert(`Image size must be less than ${CONFIG.imageMaxSize / 1048576}MB`);
            event.target.value = ''; // Clear the input
            return;
        }

        // Read and display the image
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const avatarImg = $('[data-testid="test-user-avatar"]');
            
            if (!avatarImg) {
                debug('Avatar image element not found');
                return;
            }

            // Store old image in case we need to revert
            const oldSrc = avatarImg.src;
            
            // Update image source
            avatarImg.src = e.target.result;
            
            // Update alt text
            const userName = $('[data-testid="test-user-name"]')?.textContent || 'User';
            avatarImg.alt = `Updated profile picture of ${userName}`;
            
            // Add loading animation
            avatarImg.style.opacity = '0.5';
            
            // Simulate loading and fade in
            setTimeout(() => {
                avatarImg.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
                avatarImg.style.opacity = '1';
            }, 100);
            
            debug('Avatar updated successfully');
            
            // Save to localStorage for persistence
            try {
                localStorage.setItem('userAvatar', e.target.result);
                localStorage.setItem('userAvatarTimestamp', Date.now().toString());
            } catch (err) {
                debug('Could not save avatar to localStorage:', err);
            }
        };
        
        reader.onerror = function() {
            alert('Error reading file. Please try again.');
            event.target.value = ''; // Clear the input
        };
        
        reader.readAsDataURL(file);
    }

    /**
     * Initialize avatar functionality
     */
    function initializeAvatar() {
        // Check for saved avatar in localStorage
        try {
            const savedAvatar = localStorage.getItem('userAvatar');
            if (savedAvatar) {
                const avatarImg = $('[data-testid="test-user-avatar"]');
                if (avatarImg) {
                    avatarImg.src = savedAvatar;
                    debug('Loaded saved avatar from localStorage');
                }
            }
        } catch (err) {
            debug('Could not load saved avatar:', err);
        }

        // Set up file upload listener if input exists
        const uploadInput = $('#avatar-upload');
        if (uploadInput) {
            uploadInput.addEventListener('change', handleAvatarUpload);
            
            // Accept only image files
            uploadInput.setAttribute('accept', CONFIG.allowedImageTypes.join(','));
            
            debug('Avatar upload initialized');
        }

        // Add click handler to avatar image (to trigger file input)
        const avatarImg = $('[data-testid="test-user-avatar"]');
        if (avatarImg && uploadInput) {
            avatarImg.style.cursor = 'pointer';
            avatarImg.addEventListener('click', () => {
                uploadInput.click();
            });
        }
    }

    // ===================================
    // KEYBOARD NAVIGATION
    // ===================================

    /**
     * Enhance keyboard navigation
     */
    function initializeKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Press '/' to focus on first social link (common web pattern)
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const firstLink = $('[data-testid="test-user-social-links"] a');
                if (firstLink) {
                    firstLink.focus();
                    debug('Focused on first social link via keyboard shortcut');
                }
            }
            
            // Press 'Escape' to remove focus from current element
            if (e.key === 'Escape') {
                if (document.activeElement && document.activeElement !== document.body) {
                    document.activeElement.blur();
                    debug('Focus removed via Escape key');
                }
            }
        });
        
        debug('Keyboard navigation initialized');
    }

    // ===================================
    // DATA VALIDATION
    // ===================================

    /**
     * Validate that all required data-testid elements exist
     * @returns {boolean} - True if all required elements exist
     */
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
            const element = $(`[data-testid="${testId}"]`);
            results[testId] = !!element;
            if (!element) {
                allPresent = false;
                console.warn(`Missing required element: data-testid="${testId}"`);
            }
        });
        
        if (CONFIG.debugMode) {
            console.table(results);
        }
        
        return allPresent;
    }

    // =========================
    // INTERACTIVE ENHANCEMENTS 
    // =========================

    /**
     * Add interactive hover effects to list items
     */
    function initializeListInteractions() {
        // Add click handlers to hobbies and dislikes for fun interaction
        const hobbies = $$('[data-testid="test-user-hobbies"] li');
        const dislikes = $$('[data-testid="test-user-dislikes"] li');
        
        hobbies.forEach(hobby => {
            hobby.style.cursor = 'pointer';
            hobby.addEventListener('click', function() {
                this.style.transform = 'scale(1.1) rotate(5deg)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
                debug(`Hobby clicked: ${this.textContent}`);
            });
        });
        
        dislikes.forEach(dislike => {
            dislike.style.cursor = 'pointer';
            dislike.addEventListener('click', function() {
                this.style.transform = 'scale(0.9) rotate(-5deg)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
                debug(`Dislike clicked: ${this.textContent}`);
            });
        });
        
        debug('List interactions initialized');
    }

    /**
     * Add copy-to-clipboard functionality for the timestamp
     */
    function initializeTimeCopy() {
        const timeElement = $('[data-testid="test-user-time"]');
        
        if (!timeElement) return;
        
        timeElement.style.cursor = 'pointer';
        timeElement.title = 'Click to copy timestamp';
        
        timeElement.addEventListener('click', function() {
            const timestamp = this.textContent;
            
            // Modern clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(timestamp).then(() => {
                    // Visual feedback
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.background = '#48bb78';
                    this.style.color = 'white';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                        this.style.color = '';
                    }, 1000);
                    
                    debug('Timestamp copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = timestamp;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    debug('Timestamp copied (fallback method)');
                } catch (err) {
                    console.error('Fallback copy failed:', err);
                }
                
                document.body.removeChild(textArea);
            }
        });
    }

    // ===================================
    // MAIN INITIALIZATION
    // ===================================

    /**
     * Initialize all profile card functionality
     */
    function init() {
        debug('Initializing Profile Card...');
        
        // Validate required elements
        const isValid = validateRequiredElements();
        if (!isValid) {
            console.error('Profile Card: Missing required elements. Check console warnings.');
        }
        
        // Initialize all features
        initializeTime();
        initializeSocialLinks();
        initializeAvatar();
        initializeKeyboardNavigation();
        initializeListInteractions();
        initializeTimeCopy();
        
        // Mark as initialized
        const card = $('[data-testid="test-profile-card"]');
        if (card) {
            card.setAttribute('data-initialized', 'true');
        }
        
        debug('Profile Card initialized successfully!');
        
        // Dispatch custom event for external scripts
        document.dispatchEvent(new CustomEvent('profileCardReady', {
            detail: { timestamp: Date.now() }
        }));
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
        if (document.hidden) {
            debug('Page hidden - pausing updates');
            // Could pause time updates here to save resources
        } else {
            debug('Page visible - resuming updates');
            updateTime(); // Update immediately when page becomes visible
        }
    });

    // Expose some functions to global scope if needed
    window.ProfileCard = {
        updateTime: updateTime,
        validateElements: validateRequiredElements,
        version: '1.0.0'
    };

})();