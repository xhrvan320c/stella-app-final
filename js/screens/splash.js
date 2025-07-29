// Stella App - Splash Screen Component
export class SplashScreen {
    constructor(props = {}) {
        this.props = props;
        this.animationTimeout = null;
    }

    async render() {
        return `
            <div class="splash-screen">
                <!-- Floating Particles -->
                <div class="splash-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>

                <!-- Logo Container -->
                <div class="splash-logo-container">
                    <div class="splash-logo-glow"></div>
                    <div class="splash-logo">
                        S
                    </div>
                </div>

                <!-- Brand Section -->
                <div class="splash-brand">
                    <h1 class="splash-title">Stella</h1>
                    <p class="splash-tagline">Hyperlocal Clothing Delivery</p>
                </div>

                <!-- Features -->
                <div class="splash-features">
                    <div class="splash-feature">
                        <i data-lucide="zap" class="splash-feature-icon"></i>
                        <p class="splash-feature-text">Lightning-fast delivery from local stores</p>
                    </div>
                    <div class="splash-feature">
                        <i data-lucide="shield-check" class="splash-feature-icon"></i>
                        <p class="splash-feature-text">Secure payments and quality guarantee</p>
                    </div>
                    <div class="splash-feature">
                        <i data-lucide="heart" class="splash-feature-icon"></i>
                        <p class="splash-feature-text">Support your local clothing businesses</p>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="splash-actions">
                    <button class="btn btn-primary splash-get-started" id="get-started-btn">
                        <i data-lucide="arrow-right"></i>
                        Get Started
                    </button>
                    <button class="btn splash-login" id="login-btn">
                        <i data-lucide="log-in"></i>
                        Sign In
                    </button>
                </div>

                <!-- Footer -->
                <div class="splash-footer">
                    <p class="splash-version">Version 1.0.0</p>
                    <p class="splash-copyright">© 2024 Stella. All rights reserved.</p>
                </div>
            </div>
        `;
    }

    async init() {
        this.setupEventListeners();
        this.startAnimations();
        
        // Auto-redirect if user is already authenticated
        await this.checkAuthAndRedirect();
    }

    setupEventListeners() {
        // Get Started button
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                this.handleGetStarted();
            });
        }

        // Login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.handleLogin();
            });
        }

        // Add ripple effects to buttons
        const buttons = document.querySelectorAll('.splash-actions .btn');
        buttons.forEach(button => {
            window.stellaApp?.ui?.addRippleEffect(button);
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const focusedElement = document.activeElement;
                if (focusedElement && focusedElement.classList.contains('btn')) {
                    e.preventDefault();
                    focusedElement.click();
                }
            }
        });

        // Handle swipe gestures for mobile
        this.setupSwipeGestures();
    }

    setupSwipeGestures() {
        let startY = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endY = e.changedTouches[0].clientY;
            const deltaY = startY - endY;
            
            // Swipe up to get started
            if (deltaY > 100) {
                this.handleGetStarted();
            }
        });
    }

    startAnimations() {
        // Stagger feature animations
        const features = document.querySelectorAll('.splash-feature');
        features.forEach((feature, index) => {
            feature.style.animationDelay = `${1 + (index * 0.2)}s`;
        });

        // Auto-advance after delay if no interaction
        this.animationTimeout = setTimeout(() => {
            if (document.visibilityState === 'visible') {
                this.showGetStartedHint();
            }
        }, 8000);
    }

    showGetStartedHint() {
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            // Add a subtle pulse animation
            getStartedBtn.style.animation = 'pulse 2s ease-in-out infinite';
            
            // Show a tooltip
            window.stellaApp?.ui?.showToast(
                'Tap "Get Started" to begin your shopping journey!',
                'info',
                3000
            );
        }
    }

    async checkAuthAndRedirect() {
        try {
            const user = window.stellaApp?.getCurrentUser();
            if (user) {
                // User is already authenticated, redirect to appropriate dashboard
                console.log('👤 User already authenticated, redirecting...');
                
                // Add a small delay for better UX
                setTimeout(() => {
                    const userType = user.user_metadata?.user_type || user.profile?.user_type;
                    switch (userType) {
                        case 'shopkeeper':
                            window.stellaApp.router.navigate('shopkeeper-dashboard');
                            break;
                        case 'delivery_partner':
                            window.stellaApp.router.navigate('delivery-dashboard');
                            break;
                        case 'customer':
                        default:
                            window.stellaApp.router.navigate('customer-home');
                            break;
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to check authentication:', error);
        }
    }

    handleGetStarted() {
        // Add button feedback
        const btn = document.getElementById('get-started-btn');
        if (btn) {
            btn.classList.add('btn-loading');
        }

        // Navigate to signup
        setTimeout(() => {
            window.stellaApp?.router?.navigate('signup');
        }, 500);
    }

    handleLogin() {
        // Add button feedback
        const btn = document.getElementById('login-btn');
        if (btn) {
            btn.style.transform = 'translateY(-2px)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        }

        // Navigate to login
        setTimeout(() => {
            window.stellaApp?.router?.navigate('login');
        }, 200);
    }

    // Handle app state changes
    onAppStateChange(state) {
        if (state === 'background') {
            this.pauseAnimations();
        } else if (state === 'foreground') {
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        const animatedElements = document.querySelectorAll('.splash-logo, .splash-particles, .particle');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        const animatedElements = document.querySelectorAll('.splash-logo, .splash-particles, .particle');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    // Preload next screens for better performance
    async preload() {
        try {
            // Preload common assets
            const imagesToPreload = [
                '/assets/icons/icon-192x192.png',
                '/assets/icons/icon-512x512.png'
            ];

            const preloadPromises = imagesToPreload.map(src => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = src;
                });
            });

            await Promise.allSettled(preloadPromises);
            console.log('✅ Splash screen assets preloaded');

            // Preload next likely screens
            if (window.stellaApp?.router) {
                await window.stellaApp.router.preloadCommonRoutes();
            }

        } catch (error) {
            console.warn('⚠️ Failed to preload some assets:', error);
        }
    }

    // Analytics and tracking
    trackUserInteraction(action, details = {}) {
        // Track user interactions for analytics
        const event = {
            screen: 'splash',
            action: action,
            timestamp: new Date().toISOString(),
            details: details
        };

        // Store in localStorage for later sync
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push(event);
        localStorage.setItem('analytics_events', JSON.stringify(events));

        console.log('📊 Tracked event:', event);
    }

    // Accessibility features
    setupAccessibility() {
        // Add ARIA labels
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            getStartedBtn.setAttribute('aria-label', 'Get started with Stella app');
        }

        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.setAttribute('aria-label', 'Sign in to your account');
        }

        // Add skip link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-purple);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');

            if (firstPaint) {
                console.log(`🎨 First Paint: ${firstPaint.startTime.toFixed(2)}ms`);
            }

            if (firstContentfulPaint) {
                console.log(`🎨 First Contentful Paint: ${firstContentfulPaint.startTime.toFixed(2)}ms`);
            }

            // Measure time to interactive
            setTimeout(() => {
                const timeToInteractive = performance.now();
                console.log(`⚡ Time to Interactive: ${timeToInteractive.toFixed(2)}ms`);
            }, 0);
        }
    }

    cleanup() {
        // Clear timeouts
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }

        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('touchstart', this.handleTouchStart);
        document.removeEventListener('touchend', this.handleTouchEnd);

        // Clean up any running animations
        this.pauseAnimations();

        console.log('🧹 Splash screen cleaned up');
    }
}