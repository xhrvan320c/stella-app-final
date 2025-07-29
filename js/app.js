// Stella App - Main Application Entry Point
import { Router } from './router.js';
import { SupabaseClient } from './supabase-client.js';
import { UIComponents } from './components/ui-components.js';

class StellaApp {
    constructor() {
        this.router = null;
        this.supabase = null;
        this.ui = null;
        this.currentUser = null;
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Stella App...');
            
            // Initialize core components
            this.ui = new UIComponents();
            this.supabase = new SupabaseClient();
            this.router = new Router();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Check authentication state
            await this.checkAuthState();
            
            // Start the router
            this.router.start();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log('✅ Stella App initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Stella App:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Online/Offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.ui.showToast('Connection restored', 'success');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.ui.showToast('You are offline. Some features may be limited.', 'warning');
        });

        // App visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.currentUser) {
                this.refreshUserData();
            }
        });

        // Bottom navigation
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) {
            bottomNav.addEventListener('click', (e) => {
                const navItem = e.target.closest('.nav-item');
                if (navItem) {
                    const screen = navItem.dataset.screen;
                    if (screen) {
                        this.router.navigate(screen);
                        this.updateBottomNav(screen);
                    }
                }
            });
        }

        // FAB button
        const fab = document.getElementById('fab');
        if (fab) {
            fab.addEventListener('click', () => {
                this.handleFabClick();
            });
        }

        // Global error handling
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showError('An unexpected error occurred.');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showError('An unexpected error occurred.');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Touch gestures for mobile
        this.setupTouchGestures();
    }

    async checkAuthState() {
        try {
            const session = await this.supabase.getSession();
            if (session?.user) {
                this.currentUser = session.user;
                console.log('👤 User authenticated:', this.currentUser.email);
            } else {
                console.log('👤 No authenticated user');
            }
        } catch (error) {
            console.error('Failed to check auth state:', error);
        }
    }

    async refreshUserData() {
        if (!this.currentUser || !this.isOnline) return;
        
        try {
            // Refresh user profile and preferences
            const { data: profile } = await this.supabase.getUserProfile(this.currentUser.id);
            if (profile) {
                this.currentUser.profile = profile;
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    }

    updateBottomNav(activeScreen) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === activeScreen) {
                item.classList.add('active');
            }
        });
    }

    handleFabClick() {
        const currentRoute = this.router.getCurrentRoute();
        
        switch (currentRoute) {
            case 'customer-home':
            case 'store-list':
                this.router.navigate('search');
                break;
            case 'shopkeeper-dashboard':
                this.router.navigate('add-product');
                break;
            case 'delivery-dashboard':
                this.toggleDeliveryStatus();
                break;
            default:
                this.ui.showToast('Quick action not available for this screen', 'info');
        }
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;

        if (ctrl) {
            switch (key) {
                case 'h':
                    e.preventDefault();
                    this.router.navigate('customer-home');
                    break;
                case 's':
                    e.preventDefault();
                    this.router.navigate('store-list');
                    break;
                case 'c':
                    e.preventDefault();
                    this.router.navigate('cart');
                    break;
                case 'o':
                    e.preventDefault();
                    this.router.navigate('order-tracking');
                    break;
                case 'p':
                    e.preventDefault();
                    this.router.navigate('profile');
                    break;
            }
        }

        // Escape key to close modals
        if (key === 'escape') {
            this.ui.closeAllModals();
        }
    }

    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipeGesture(startX, startY, endX, endY);
        });
    }

    handleSwipeGesture(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 100;

        // Horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - go back
                this.router.goBack();
            } else {
                // Swipe left - could implement forward navigation
                console.log('Swipe left detected');
            }
        }
    }

    async toggleDeliveryStatus() {
        if (!this.currentUser) return;

        try {
            const currentStatus = this.currentUser.profile?.delivery_status || 'offline';
            const newStatus = currentStatus === 'online' ? 'offline' : 'online';
            
            await this.supabase.updateDeliveryStatus(this.currentUser.id, newStatus);
            this.currentUser.profile.delivery_status = newStatus;
            
            this.ui.showToast(
                `You are now ${newStatus}`,
                newStatus === 'online' ? 'success' : 'info'
            );
            
            // Update UI
            this.updateDeliveryStatusUI(newStatus);
            
        } catch (error) {
            console.error('Failed to toggle delivery status:', error);
            this.ui.showToast('Failed to update status', 'error');
        }
    }

    updateDeliveryStatusUI(status) {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusValue = document.querySelector('.status-value');
        const statusToggle = document.querySelector('.status-toggle');

        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${status}`;
        }

        if (statusValue) {
            statusValue.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }

        if (statusToggle) {
            statusToggle.classList.toggle('active', status === 'online');
            statusToggle.textContent = status === 'online' ? 'Go Offline' : 'Go Online';
        }
    }

    async syncOfflineData() {
        if (!this.isOnline) return;

        try {
            console.log('🔄 Syncing offline data...');
            
            // Get offline data from localStorage
            const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
            const offlineActions = JSON.parse(localStorage.getItem('offline_actions') || '[]');

            // Sync offline orders
            for (const order of offlineOrders) {
                try {
                    await this.supabase.createOrder(order);
                    console.log('✅ Synced offline order:', order.id);
                } catch (error) {
                    console.error('❌ Failed to sync order:', order.id, error);
                }
            }

            // Sync offline actions
            for (const action of offlineActions) {
                try {
                    await this.supabase.executeAction(action);
                    console.log('✅ Synced offline action:', action.type);
                } catch (error) {
                    console.error('❌ Failed to sync action:', action.type, error);
                }
            }

            // Clear synced data
            if (offlineOrders.length > 0 || offlineActions.length > 0) {
                localStorage.removeItem('offline_orders');
                localStorage.removeItem('offline_actions');
                this.ui.showToast('Offline data synced successfully', 'success');
            }

        } catch (error) {
            console.error('Failed to sync offline data:', error);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');

        if (loadingScreen && mainContent) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    mainContent.classList.remove('hidden');
                }, 300);
            }, 1000); // Show loading for at least 1 second
        }
    }

    showError(message) {
        this.ui.showToast(message, 'error');
    }

    // Public API methods
    getCurrentUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return !!this.currentUser;
    }

    async signOut() {
        try {
            await this.supabase.signOut();
            this.currentUser = null;
            this.router.navigate('splash');
            this.ui.showToast('Signed out successfully', 'success');
        } catch (error) {
            console.error('Failed to sign out:', error);
            this.ui.showToast('Failed to sign out', 'error');
        }
    }

    updateCartBadge(count) {
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            if (count > 0) {
                cartBadge.textContent = count > 99 ? '99+' : count.toString();
                cartBadge.classList.remove('hidden');
            } else {
                cartBadge.classList.add('hidden');
            }
        }
    }

    // Utility methods
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options })
            .format(new Date(date));
    }

    formatDistance(meters) {
        if (meters < 1000) {
            return `${Math.round(meters)}m`;
        } else {
            return `${(meters / 1000).toFixed(1)}km`;
        }
    }

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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stellaApp = new StellaApp();
});

// Export for module usage
export { StellaApp };