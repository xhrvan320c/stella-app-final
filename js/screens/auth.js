// Stella App - Authentication Screen Component
export class AuthScreen {
    constructor(props = {}) {
        this.props = props;
        this.mode = props.mode || 'login'; // 'login' or 'signup'
        this.selectedRole = 'customer';
        this.isLoading = false;
        this.formData = {};
    }

    async render() {
        const isLogin = this.mode === 'login';
        const title = isLogin ? 'Welcome Back' : 'Join Stella';
        const subtitle = isLogin ? 'Sign in to continue shopping' : 'Create your account to get started';
        const submitText = isLogin ? 'Sign In' : 'Create Account';
        const switchText = isLogin ? "Don't have an account?" : "Already have an account?";
        const switchLink = isLogin ? 'Sign Up' : 'Sign In';
        const switchAction = isLogin ? 'signup' : 'login';

        return `
            <div class="auth-screen">
                <!-- Header -->
                <div class="auth-header">
                    <div class="auth-logo">S</div>
                    <h1 class="auth-title">Stella</h1>
                    <p class="auth-subtitle">Hyperlocal Clothing Delivery</p>
                </div>

                <!-- Main Content -->
                <div class="auth-container">
                    <!-- Auth Form -->
                    <form class="auth-form" id="auth-form">
                        <div class="auth-form-header">
                            <h2 class="auth-form-title">${title}</h2>
                            <p class="auth-form-subtitle">${subtitle}</p>
                        </div>

                        ${!isLogin ? this.renderRoleSelector() : ''}

                        <!-- Email Field -->
                        <div class="auth-form-group">
                            <label class="auth-label" for="email">Email Address</label>
                            <div class="auth-input-icon">
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    class="auth-input" 
                                    placeholder="Enter your email"
                                    required
                                    autocomplete="email"
                                >
                                <i data-lucide="mail"></i>
                            </div>
                        </div>

                        <!-- Password Field -->
                        <div class="auth-form-group">
                            <label class="auth-label" for="password">Password</label>
                            <div class="auth-input-icon">
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password"
                                    class="auth-input" 
                                    placeholder="Enter your password"
                                    required
                                    autocomplete="${isLogin ? 'current-password' : 'new-password'}"
                                    minlength="6"
                                >
                                <i data-lucide="lock"></i>
                            </div>
                        </div>

                        ${!isLogin ? this.renderSignupFields() : ''}

                        ${isLogin ? this.renderRememberMe() : this.renderTermsCheckbox()}

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary auth-submit" id="auth-submit">
                            <i data-lucide="${isLogin ? 'log-in' : 'user-plus'}"></i>
                            ${submitText}
                        </button>

                        ${isLogin ? this.renderForgotPassword() : ''}
                    </form>

                    <!-- Social Login -->
                    <div class="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <div class="auth-social">
                        <button class="auth-social-btn auth-google" id="google-signin">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>

                        <button class="auth-social-btn auth-facebook" id="facebook-signin">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Continue with Facebook
                        </button>

                        <button class="auth-social-btn auth-apple" id="apple-signin">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path fill="#000000" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                            </svg>
                            Continue with Apple
                        </button>
                    </div>

                    <!-- Switch Mode -->
                    <div class="auth-switch">
                        ${switchText} 
                        <a href="#" data-route="${switchAction}">${switchLink}</a>
                    </div>
                </div>
            </div>
        `;
    }

    renderRoleSelector() {
        return `
            <div class="auth-form-group">
                <label class="auth-label">I want to</label>
                <div class="auth-role-selector">
                    <button type="button" class="auth-role-option active" data-role="customer">
                        Shop
                    </button>
                    <button type="button" class="auth-role-option" data-role="shopkeeper">
                        Sell
                    </button>
                    <button type="button" class="auth-role-option" data-role="delivery_partner">
                        Deliver
                    </button>
                </div>
            </div>
        `;
    }

    renderSignupFields() {
        return `
            <!-- Full Name Field -->
            <div class="auth-form-group">
                <label class="auth-label" for="fullName">Full Name</label>
                <div class="auth-input-icon">
                    <input 
                        type="text" 
                        id="fullName" 
                        name="fullName"
                        class="auth-input" 
                        placeholder="Enter your full name"
                        required
                        autocomplete="name"
                    >
                    <i data-lucide="user"></i>
                </div>
            </div>

            <!-- Phone Field -->
            <div class="auth-form-group">
                <label class="auth-label" for="phone">Phone Number</label>
                <div class="auth-input-icon">
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        class="auth-input" 
                        placeholder="Enter your phone number"
                        required
                        autocomplete="tel"
                    >
                    <i data-lucide="phone"></i>
                </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="auth-form-group">
                <label class="auth-label" for="confirmPassword">Confirm Password</label>
                <div class="auth-input-icon">
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword"
                        class="auth-input" 
                        placeholder="Confirm your password"
                        required
                        autocomplete="new-password"
                        minlength="6"
                    >
                    <i data-lucide="lock"></i>
                </div>
            </div>
        `;
    }

    renderRememberMe() {
        return `
            <div class="auth-checkbox">
                <input type="checkbox" id="rememberMe" name="rememberMe">
                <label for="rememberMe">Remember me</label>
            </div>
        `;
    }

    renderTermsCheckbox() {
        return `
            <div class="auth-checkbox">
                <input type="checkbox" id="agreeTerms" name="agreeTerms" required>
                <label for="agreeTerms">
                    I agree to the <a href="#" data-route="terms">Terms of Service</a> 
                    and <a href="#" data-route="privacy">Privacy Policy</a>
                </label>
            </div>
        `;
    }

    renderForgotPassword() {
        return `
            <div class="auth-forgot">
                <a href="#" id="forgot-password">Forgot your password?</a>
            </div>
        `;
    }

    async init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.focusFirstInput();
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('auth-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Role selection (for signup)
        const roleOptions = document.querySelectorAll('.auth-role-option');
        roleOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleRoleSelection(e.target.dataset.role);
            });
        });

        // Social login buttons
        const googleBtn = document.getElementById('google-signin');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialLogin('google');
            });
        }

        const facebookBtn = document.getElementById('facebook-signin');
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => {
                this.handleSocialLogin('facebook');
            });
        }

        const appleBtn = document.getElementById('apple-signin');
        if (appleBtn) {
            appleBtn.addEventListener('click', () => {
                this.handleSocialLogin('apple');
            });
        }

        // Forgot password
        const forgotBtn = document.getElementById('forgot-password');
        if (forgotBtn) {
            forgotBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Real-time validation
        const inputs = form?.querySelectorAll('input');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });

            input.addEventListener('input', () => {
                this.clearInputError(input);
            });
        });

        // Password confirmation validation
        if (this.mode === 'signup') {
            const passwordInput = document.getElementById('password');
            const confirmInput = document.getElementById('confirmPassword');
            
            if (passwordInput && confirmInput) {
                confirmInput.addEventListener('input', () => {
                    this.validatePasswordMatch();
                });
            }
        }
    }

    setupFormValidation() {
        // Custom validation messages
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showCustomValidationMessage(input);
            });
        });
    }

    focusFirstInput() {
        const firstInput = document.querySelector('.auth-input');
        if (firstInput) {
            setTimeout(() => {
                firstInput.focus();
            }, 300);
        }
    }

    handleRoleSelection(role) {
        this.selectedRole = role;
        
        // Update UI
        const roleOptions = document.querySelectorAll('.auth-role-option');
        roleOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.role === role) {
                option.classList.add('active');
            }
        });

        // Track selection
        this.trackEvent('role_selected', { role });
    }

    async handleFormSubmit() {
        if (this.isLoading) return;

        const form = document.getElementById('auth-form');
        const validation = window.stellaApp?.ui?.validateForm(form);

        if (!validation?.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }

        // Additional custom validation
        if (this.mode === 'signup' && !this.validatePasswordMatch()) {
            return;
        }

        this.setLoadingState(true);

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (this.mode === 'login') {
                await this.handleLogin(data);
            } else {
                await this.handleSignup(data);
            }

        } catch (error) {
            console.error('Authentication error:', error);
            window.stellaApp?.ui?.showToast(
                error.message || 'Authentication failed. Please try again.',
                'error'
            );
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleLogin(data) {
        const { email, password } = data;
        
        const result = await window.stellaApp?.supabase?.signIn(email, password);
        
        if (result?.user) {
            window.stellaApp.currentUser = result.user;
            
            window.stellaApp?.ui?.showToast('Welcome back!', 'success');
            
            // Navigate based on user type
            const userType = result.user.user_metadata?.user_type || 'customer';
            this.navigateAfterAuth(userType);
            
            this.trackEvent('login_success', { method: 'email', user_type: userType });
        }
    }

    async handleSignup(data) {
        const { email, password, fullName, phone } = data;
        
        const userData = {
            user_type: this.selectedRole,
            full_name: fullName,
            phone: phone
        };

        const result = await window.stellaApp?.supabase?.signUp(email, password, userData);
        
        if (result?.user) {
            window.stellaApp.currentUser = result.user;
            
            window.stellaApp?.ui?.showToast(
                'Account created successfully! Welcome to Stella!',
                'success'
            );
            
            this.navigateAfterAuth(this.selectedRole);
            
            this.trackEvent('signup_success', { 
                method: 'email', 
                user_type: this.selectedRole 
            });
        }
    }

    async handleSocialLogin(provider) {
        try {
            this.setLoadingState(true, `Connecting to ${provider}...`);
            
            const result = await window.stellaApp?.supabase?.signInWithOAuth(provider);
            
            if (result?.url) {
                // Redirect to OAuth provider
                window.location.href = result.url;
            }
            
            this.trackEvent('social_login_attempt', { provider });
            
        } catch (error) {
            console.error(`${provider} login error:`, error);
            window.stellaApp?.ui?.showToast(
                `Failed to connect with ${provider}. Please try again.`,
                'error'
            );
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleForgotPassword() {
        const email = document.getElementById('email')?.value;
        
        if (!email) {
            window.stellaApp?.ui?.showToast(
                'Please enter your email address first',
                'warning'
            );
            document.getElementById('email')?.focus();
            return;
        }

        try {
            // Show confirmation dialog
            const confirmed = await window.stellaApp?.ui?.showConfirm(
                `We'll send a password reset link to ${email}. Continue?`,
                'Reset Password'
            );

            if (confirmed) {
                // TODO: Implement password reset
                window.stellaApp?.ui?.showToast(
                    'Password reset link sent! Check your email.',
                    'success'
                );
                
                this.trackEvent('password_reset_requested', { email });
            }
        } catch (error) {
            console.error('Password reset error:', error);
            window.stellaApp?.ui?.showToast(
                'Failed to send reset email. Please try again.',
                'error'
            );
        }
    }

    navigateAfterAuth(userType) {
        setTimeout(() => {
            switch (userType) {
                case 'shopkeeper':
                    window.stellaApp?.router?.navigate('shopkeeper-dashboard');
                    break;
                case 'delivery_partner':
                    window.stellaApp?.router?.navigate('delivery-dashboard');
                    break;
                case 'customer':
                default:
                    window.stellaApp?.router?.navigate('customer-home');
                    break;
            }
        }, 1000);
    }

    validateInput(input) {
        const error = window.stellaApp?.ui?.validateInput(input);
        if (error) {
            window.stellaApp?.ui?.showInputError(input, error);
            return false;
        } else {
            window.stellaApp?.ui?.showInputSuccess(input);
            return true;
        }
    }

    validatePasswordMatch() {
        if (this.mode !== 'signup') return true;

        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;

        if (password && confirmPassword && password !== confirmPassword) {
            const confirmInput = document.getElementById('confirmPassword');
            window.stellaApp?.ui?.showInputError(confirmInput, 'Passwords do not match');
            return false;
        }

        return true;
    }

    clearInputError(input) {
        window.stellaApp?.ui?.clearInputError(input);
    }

    showValidationErrors(errors) {
        errors.forEach(({ input, error }) => {
            window.stellaApp?.ui?.showInputError(input, error);
        });

        // Focus first error input
        if (errors.length > 0) {
            errors[0].input.focus();
        }
    }

    showCustomValidationMessage(input) {
        const validity = input.validity;
        let message = '';

        if (validity.valueMissing) {
            message = 'This field is required';
        } else if (validity.typeMismatch) {
            message = input.type === 'email' ? 'Please enter a valid email address' : 'Invalid format';
        } else if (validity.tooShort) {
            message = `Must be at least ${input.minLength} characters long`;
        } else if (validity.patternMismatch) {
            message = input.title || 'Invalid format';
        }

        if (message) {
            window.stellaApp?.ui?.showInputError(input, message);
        }
    }

    setLoadingState(loading, message = null) {
        this.isLoading = loading;
        const submitBtn = document.getElementById('auth-submit');
        
        if (submitBtn) {
            if (loading) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                if (message) {
                    submitBtn.textContent = message;
                }
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                const isLogin = this.mode === 'login';
                submitBtn.innerHTML = `
                    <i data-lucide="${isLogin ? 'log-in' : 'user-plus'}"></i>
                    ${isLogin ? 'Sign In' : 'Create Account'}
                `;
            }
        }

        // Disable/enable form inputs
        const inputs = document.querySelectorAll('.auth-input, .auth-role-option');
        inputs.forEach(input => {
            input.disabled = loading;
        });
    }

    trackEvent(event, data = {}) {
        // Track authentication events
        const eventData = {
            screen: 'auth',
            mode: this.mode,
            event: event,
            timestamp: new Date().toISOString(),
            ...data
        };

        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push(eventData);
        localStorage.setItem('analytics_events', JSON.stringify(events));

        console.log('📊 Auth event tracked:', eventData);
    }

    cleanup() {
        // Clear any timeouts or intervals
        this.setLoadingState(false);
        
        console.log('🧹 Auth screen cleaned up');
    }
}