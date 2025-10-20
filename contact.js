// CONTACT PAGE JAVASCRIPT
// Form validation and submission handling

(function() {
    'use strict';

    // ===================================
    // FORM VALIDATION
    // ===================================

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateForm() {
        const form = document.getElementById('contactForm');
        if (!form) return false;

        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const subject = document.getElementById('contact-subject');
        const message = document.getElementById('contact-message');

        let isValid = true;

        // Validate name
        if (!name.value.trim()) {
            showError('name-error');
            name.classList.add('error');
            isValid = false;
        } else {
            hideError('name-error');
            name.classList.remove('error');
        }

        // Validate email
        if (!email.value.trim() || !validateEmail(email.value)) {
            showError('email-error');
            email.classList.add('error');
            isValid = false;
        } else {
            hideError('email-error');
            email.classList.remove('error');
        }

        // Validate subject
        if (!subject.value.trim()) {
            showError('subject-error');
            subject.classList.add('error');
            isValid = false;
        } else {
            hideError('subject-error');
            subject.classList.remove('error');
        }

        // Validate message
        if (!message.value.trim() || message.value.length < 10) {
            showError('message-error');
            message.classList.add('error');
            isValid = false;
        } else {
            hideError('message-error');
            message.classList.remove('error');
        }

        return isValid;
    }

    function showError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.classList.add('show');
        }
    }

    function hideError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // ===================================
    // FORM SUBMISSION
    // ===================================

    function handleFormSubmit(e) {
        e.preventDefault();

        if (validateForm()) {
            const submitButton = document.querySelector('.submit-button');
            const successMessage = document.querySelector('.success-message');

            // Show loading state
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            submitButton.textContent = 'Sending...';

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Hide loading state
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                submitButton.textContent = 'Send Message';

                // Show success message
                successMessage.classList.add('show');

                // Reset form
                e.target.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }, 2000); // Simulate 2 second delay
        }
    }

    // ===================================
    // INITIALIZATION
    // ===================================

    function init() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);

            // Real-time validation on blur
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateForm);
                input.addEventListener('input', function() {
                    if (this.classList.contains('error')) {
                        validateForm();
                    }
                });
            });
        }

        console.log('Contact page initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
