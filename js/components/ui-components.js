// Stella App - Reusable UI Components
export class UIComponents {
    constructor() {
        this.activeToasts = new Set();
        this.activeModals = new Set();
        this.toastContainer = null;
        this.modalContainer = null;
        
        this.init();
    }

    init() {
        this.createContainers();
        this.setupEventListeners();
    }

    createContainers() {
        // Ensure toast container exists
        this.toastContainer = document.getElementById('toast-container');
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'toast-container';
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }

        // Ensure modal container exists
        this.modalContainer = document.getElementById('modal-container');
        if (!this.modalContainer) {
            this.modalContainer = document.createElement('div');
            this.modalContainer.id = 'modal-container';
            this.modalContainer.className = 'modal-container hidden';
            document.body.appendChild(this.modalContainer);
        }
    }

    setupEventListeners() {
        // Close modals when clicking backdrop
        this.modalContainer.addEventListener('click', (e) => {
            if (e.target === this.modalContainer) {
                this.closeAllModals();
            }
        });

        // Handle escape key for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 5000, title = null) {
        const toast = this.createToast(message, type, title);
        this.toastContainer.appendChild(toast);
        this.activeToasts.add(toast);

        // Trigger show animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toast);
            }, duration);
        }

        return toast;
    }

    createToast(message, type, title) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconMap = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const icon = iconMap[type] || 'info';

        toast.innerHTML = `
            <i data-lucide="${icon}" class="toast-icon"></i>
            <div class="toast-content">
                ${title ? `<h4 class="toast-title">${title}</h4>` : ''}
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i data-lucide="x"></i>
            </button>
        `;

        // Add close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.removeToast(toast);
        });

        return toast;
    }

    removeToast(toast) {
        if (!this.activeToasts.has(toast)) return;

        toast.classList.remove('show');
        this.activeToasts.delete(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    clearAllToasts() {
        this.activeToasts.forEach(toast => {
            this.removeToast(toast);
        });
    }

    // Modal System
    showModal(content, options = {}) {
        const modal = this.createModal(content, options);
        this.modalContainer.appendChild(modal);
        this.activeModals.add(modal);

        // Show modal container
        this.modalContainer.classList.remove('hidden');
        this.modalContainer.classList.add('show');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus management
        this.trapFocus(modal);

        return modal;
    }

    createModal(content, options) {
        const {
            title = '',
            size = 'medium',
            closable = true,
            className = '',
            actions = []
        } = options;

        const modal = document.createElement('div');
        modal.className = `modal ${size} ${className}`;

        let actionsHTML = '';
        if (actions.length > 0) {
            const actionButtons = actions.map(action => 
                `<button class="btn ${action.class || 'btn-secondary'}" data-action="${action.action}">
                    ${action.label}
                </button>`
            ).join('');
            
            actionsHTML = `<div class="modal-footer">${actionButtons}</div>`;
        }

        modal.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                ${closable ? `
                    <button class="modal-close" aria-label="Close modal">
                        <i data-lucide="x"></i>
                    </button>
                ` : ''}
            </div>
            <div class="modal-body">
                ${typeof content === 'string' ? content : ''}
            </div>
            ${actionsHTML}
        `;

        // Add content if it's an element
        if (content instanceof HTMLElement) {
            const modalBody = modal.querySelector('.modal-body');
            modalBody.innerHTML = '';
            modalBody.appendChild(content);
        }

        // Add event listeners
        if (closable) {
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => {
                this.closeModal(modal);
            });
        }

        // Handle action buttons
        const actionButtons = modal.querySelectorAll('[data-action]');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const actionConfig = actions.find(a => a.action === action);
                
                if (actionConfig && actionConfig.handler) {
                    const result = actionConfig.handler(modal, e);
                    
                    // Close modal if handler returns true or doesn't return anything
                    if (result !== false) {
                        this.closeModal(modal);
                    }
                }
            });
        });

        return modal;
    }

    closeModal(modal) {
        if (!this.activeModals.has(modal)) return;

        this.activeModals.delete(modal);

        // Remove modal
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }

        // Hide container if no more modals
        if (this.activeModals.size === 0) {
            this.modalContainer.classList.remove('show');
            this.modalContainer.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        this.activeModals.forEach(modal => {
            this.closeModal(modal);
        });
    }

    // Confirmation Dialog
    showConfirm(message, title = 'Confirm', options = {}) {
        return new Promise((resolve) => {
            const {
                confirmText = 'Confirm',
                cancelText = 'Cancel',
                confirmClass = 'btn-primary',
                cancelClass = 'btn-secondary'
            } = options;

            const actions = [
                {
                    label: cancelText,
                    class: cancelClass,
                    action: 'cancel',
                    handler: () => {
                        resolve(false);
                        return true;
                    }
                },
                {
                    label: confirmText,
                    class: confirmClass,
                    action: 'confirm',
                    handler: () => {
                        resolve(true);
                        return true;
                    }
                }
            ];

            this.showModal(message, {
                title,
                actions,
                size: 'small'
            });
        });
    }

    // Alert Dialog
    showAlert(message, title = 'Alert', options = {}) {
        return new Promise((resolve) => {
            const {
                buttonText = 'OK',
                buttonClass = 'btn-primary'
            } = options;

            const actions = [
                {
                    label: buttonText,
                    class: buttonClass,
                    action: 'ok',
                    handler: () => {
                        resolve(true);
                        return true;
                    }
                }
            ];

            this.showModal(message, {
                title,
                actions,
                size: 'small'
            });
        });
    }

    // Loading Overlay
    showLoading(message = 'Loading...') {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;

        document.body.appendChild(loading);
        document.body.style.overflow = 'hidden';

        return {
            hide: () => {
                if (loading.parentNode) {
                    loading.parentNode.removeChild(loading);
                    document.body.style.overflow = '';
                }
            },
            updateMessage: (newMessage) => {
                const messageEl = loading.querySelector('.loading-message');
                if (messageEl) {
                    messageEl.textContent = newMessage;
                }
            }
        };
    }

    // Form Validation
    validateForm(form) {
        const errors = [];
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            const error = this.validateInput(input);
            if (error) {
                errors.push({ input, error });
                this.showInputError(input, error);
            } else {
                this.clearInputError(input);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const required = input.hasAttribute('required');

        // Required validation
        if (required && !value) {
            return 'This field is required';
        }

        if (!value) return null; // Skip other validations if empty and not required

        // Type-specific validation
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address';
                }
                break;

            case 'password':
                if (value.length < 6) {
                    return 'Password must be at least 6 characters long';
                }
                break;

            case 'tel':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    return 'Please enter a valid phone number';
                }
                break;

            case 'url':
                try {
                    new URL(value);
                } catch {
                    return 'Please enter a valid URL';
                }
                break;
        }

        // Custom validation attributes
        const minLength = input.getAttribute('minlength');
        if (minLength && value.length < parseInt(minLength)) {
            return `Must be at least ${minLength} characters long`;
        }

        const maxLength = input.getAttribute('maxlength');
        if (maxLength && value.length > parseInt(maxLength)) {
            return `Must be no more than ${maxLength} characters long`;
        }

        const pattern = input.getAttribute('pattern');
        if (pattern && !new RegExp(pattern).test(value)) {
            return input.getAttribute('title') || 'Invalid format';
        }

        return null;
    }

    showInputError(input, error) {
        input.classList.add('error');
        
        // Remove existing error message
        this.clearInputError(input);

        // Add new error message
        const errorEl = document.createElement('div');
        errorEl.className = 'auth-error';
        errorEl.innerHTML = `<i data-lucide="alert-circle"></i>${error}`;
        
        input.parentNode.appendChild(errorEl);
    }

    clearInputError(input) {
        input.classList.remove('error', 'success');
        
        const existingError = input.parentNode.querySelector('.auth-error');
        if (existingError) {
            existingError.remove();
        }
    }

    showInputSuccess(input) {
        input.classList.remove('error');
        input.classList.add('success');
        this.clearInputError(input);
    }

    // Utility Functions
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (firstElement) {
            firstElement.focus();
        }

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Animation Helpers
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress.toString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = (startOpacity * (1 - progress)).toString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }

    slideDown(element, duration = 300) {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = (targetHeight * progress) + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = '';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(animate);
    }

    slideUp(element, duration = 300) {
        const startHeight = element.offsetHeight;
        const start = performance.now();
        
        element.style.overflow = 'hidden';
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = (startHeight * (1 - progress)) + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Ripple Effect
    addRippleEffect(element) {
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Debounce utility
    debounce(func, wait) {
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

    // Throttle utility
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}