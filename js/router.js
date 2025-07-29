// Stella App - Single Page Application Router
import { SplashScreen } from './screens/splash.js';
import { AuthScreen } from './screens/auth.js';
import { CustomerHomeScreen } from './screens/customer-home.js';
import { StoreListScreen } from './screens/store-list.js';
import { ProductGridScreen } from './screens/product-grid.js';
import { ProductDetailScreen } from './screens/product-detail.js';
import { CartScreen } from './screens/cart.js';
import { OrderTrackingScreen } from './screens/order-tracking.js';
import { ShopkeeperDashboard } from './screens/shopkeeper-dashboard.js';
import { DeliveryDashboard } from './screens/delivery-dashboard.js';
import { ProfileScreen } from './screens/profile.js';

export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.currentScreen = null;
        this.history = [];
        this.maxHistoryLength = 10;
        
        this.setupRoutes();
        this.setupEventListeners();
    }

    setupRoutes() {
        // Define all application routes
        this.routes.set('splash', {
            component: SplashScreen,
            requiresAuth: false,
            showBottomNav: false,
            showFab: false,
            title: 'Welcome to Stella'
        });

        this.routes.set('login', {
            component: AuthScreen,
            requiresAuth: false,
            showBottomNav: false,
            showFab: false,
            title: 'Sign In',
            props: { mode: 'login' }
        });

        this.routes.set('signup', {
            component: AuthScreen,
            requiresAuth: false,
            showBottomNav: false,
            showFab: false,
            title: 'Sign Up',
            props: { mode: 'signup' }
        });

        this.routes.set('customer-home', {
            component: CustomerHomeScreen,
            requiresAuth: true,
            showBottomNav: true,
            showFab: true,
            title: 'Home',
            userTypes: ['customer']
        });

        this.routes.set('store-list', {
            component: StoreListScreen,
            requiresAuth: true,
            showBottomNav: true,
            showFab: true,
            title: 'Stores',
            userTypes: ['customer']
        });

        this.routes.set('product-grid', {
            component: ProductGridScreen,
            requiresAuth: true,
            showBottomNav: true,
            showFab: false,
            title: 'Products',
            userTypes: ['customer']
        });

        this.routes.set('product-detail', {
            component: ProductDetailScreen,
            requiresAuth: true,
            showBottomNav: false,
            showFab: false,
            title: 'Product Details',
            userTypes: ['customer']
        });

        this.routes.set('cart', {
            component: CartScreen,
            requiresAuth: true,
            showBottomNav: true,
            showFab: false,
            title: 'Shopping Cart',
            userTypes: ['customer']
        });

        this.routes.set('order-tracking', {
            component: OrderTrackingScreen,
            requiresAuth: true,
            showBottomNav: true,
            showFab: false,
            title: 'My Orders',
            userTypes: ['customer']
        });

        this.routes.set('shopkeeper-dashboard', {
            component: ShopkeeperDashboard,
            requiresAuth: true,
            showBottomNav: false,
            showFab: true,
            title: 'Dashboard',
            userTypes: ['shopkeeper']
        });

        this.routes.set('delivery-dashboard', {
            component: DeliveryDashboard,
            requiresAuth: true,
            showBottomNav: false,
            showFab: true,
            title: 'Delivery Dashboard',
            userTypes: ['delivery_partner']
        });

        this.routes.set('profile', {
            component: ProfileScreen,
            requiresAuth: true,
            showBottomNav: true,
            showFab: false,
            title: 'Profile',
            userTypes: ['customer', 'shopkeeper', 'delivery_partner']
        });
    }

    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            const route = event.state?.route || this.getDefaultRoute();
            this.navigate(route, event.state?.params, false);
        });

        // Handle link clicks
        document.addEventListener('click', (event) => {
            const link = event.target.closest('[data-route]');
            if (link) {
                event.preventDefault();
                const route = link.dataset.route;
                const params = link.dataset.params ? JSON.parse(link.dataset.params) : {};
                this.navigate(route, params);
            }
        });
    }

    start() {
        // Get initial route from URL or default
        const initialRoute = this.getRouteFromURL() || this.getDefaultRoute();
        this.navigate(initialRoute, {}, false);
    }

    getRouteFromURL() {
        const hash = window.location.hash.slice(1);
        const [route, ...paramParts] = hash.split('/');
        
        if (this.routes.has(route)) {
            return route;
        }
        
        return null;
    }

    getDefaultRoute() {
        const user = window.stellaApp?.getCurrentUser();
        
        if (!user) {
            return 'splash';
        }

        // Route based on user type
        switch (user.user_metadata?.user_type || user.profile?.user_type) {
            case 'shopkeeper':
                return 'shopkeeper-dashboard';
            case 'delivery_partner':
                return 'delivery-dashboard';
            case 'customer':
            default:
                return 'customer-home';
        }
    }

    async navigate(routeName, params = {}, addToHistory = true) {
        try {
            console.log(`🧭 Navigating to: ${routeName}`, params);

            const route = this.routes.get(routeName);
            if (!route) {
                console.error(`Route not found: ${routeName}`);
                this.navigate('customer-home');
                return;
            }

            // Check authentication
            if (route.requiresAuth && !window.stellaApp?.isUserAuthenticated()) {
                console.log('🔒 Authentication required, redirecting to login');
                this.navigate('login');
                return;
            }

            // Check user type permissions
            if (route.userTypes) {
                const user = window.stellaApp?.getCurrentUser();
                const userType = user?.user_metadata?.user_type || user?.profile?.user_type;
                
                if (!route.userTypes.includes(userType)) {
                    console.log(`🚫 Access denied for user type: ${userType}`);
                    this.navigate(this.getDefaultRoute());
                    return;
                }
            }

            // Add to history
            if (addToHistory && this.currentRoute !== routeName) {
                this.addToHistory(this.currentRoute, params);
                
                // Update browser history
                const url = `#${routeName}${Object.keys(params).length ? '/' + Object.keys(params).map(k => `${k}=${params[k]}`).join('/') : ''}`;
                window.history.pushState({ route: routeName, params }, route.title, url);
            }

            // Update document title
            document.title = `${route.title} - Stella`;

            // Show loading state
            this.showLoadingState();

            // Cleanup current screen
            if (this.currentScreen && typeof this.currentScreen.cleanup === 'function') {
                await this.currentScreen.cleanup();
            }

            // Create new screen instance
            const ScreenComponent = route.component;
            const screenProps = { ...route.props, ...params };
            this.currentScreen = new ScreenComponent(screenProps);

            // Render the screen
            await this.renderScreen(this.currentScreen);

            // Update UI elements
            this.updateUIElements(route);

            // Update current route
            this.currentRoute = routeName;

            // Hide loading state
            this.hideLoadingState();

            console.log(`✅ Successfully navigated to: ${routeName}`);

        } catch (error) {
            console.error(`❌ Navigation failed for route: ${routeName}`, error);
            this.hideLoadingState();
            
            // Show error and fallback to safe route
            window.stellaApp?.ui?.showToast('Navigation failed', 'error');
            if (routeName !== 'customer-home') {
                this.navigate('customer-home');
            }
        }
    }

    async renderScreen(screen) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            throw new Error('Main content container not found');
        }

        // Clear current content
        mainContent.innerHTML = '';

        // Render new screen
        if (typeof screen.render === 'function') {
            const content = await screen.render();
            if (typeof content === 'string') {
                mainContent.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                mainContent.appendChild(content);
            }
        }

        // Initialize screen
        if (typeof screen.init === 'function') {
            await screen.init();
        }

        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Scroll to top
        mainContent.scrollTop = 0;
    }

    updateUIElements(route) {
        // Update bottom navigation visibility
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) {
            if (route.showBottomNav) {
                bottomNav.classList.remove('hidden');
            } else {
                bottomNav.classList.add('hidden');
            }
        }

        // Update FAB visibility
        const fab = document.getElementById('fab');
        if (fab) {
            if (route.showFab) {
                fab.classList.remove('hidden');
            } else {
                fab.classList.add('hidden');
            }
        }

        // Update bottom navigation active state
        if (route.showBottomNav) {
            window.stellaApp?.updateBottomNav(this.currentRoute);
        }
    }

    showLoadingState() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.opacity = '0.7';
            mainContent.style.pointerEvents = 'none';
        }
    }

    hideLoadingState() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.pointerEvents = 'auto';
        }
    }

    addToHistory(route, params) {
        if (!route) return;

        this.history.push({ route, params, timestamp: Date.now() });
        
        // Limit history size
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
    }

    goBack() {
        if (this.history.length > 0) {
            const previous = this.history.pop();
            this.navigate(previous.route, previous.params, false);
        } else {
            // Fallback to default route
            this.navigate(this.getDefaultRoute());
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    getHistory() {
        return [...this.history];
    }

    // Utility methods for common navigation patterns
    navigateToStore(storeId) {
        this.navigate('product-grid', { storeId });
    }

    navigateToProduct(productId, storeId) {
        this.navigate('product-detail', { productId, storeId });
    }

    navigateToOrder(orderId) {
        this.navigate('order-tracking', { orderId });
    }

    // Deep linking support
    handleDeepLink(url) {
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname.slice(1); // Remove leading slash
            const params = Object.fromEntries(urlObj.searchParams);
            
            if (this.routes.has(path)) {
                this.navigate(path, params);
            } else {
                console.warn(`Deep link not found: ${path}`);
                this.navigate(this.getDefaultRoute());
            }
        } catch (error) {
            console.error('Invalid deep link:', url, error);
            this.navigate(this.getDefaultRoute());
        }
    }

    // Route guards
    canNavigate(routeName, params = {}) {
        const route = this.routes.get(routeName);
        if (!route) return false;

        // Check authentication
        if (route.requiresAuth && !window.stellaApp?.isUserAuthenticated()) {
            return false;
        }

        // Check user type permissions
        if (route.userTypes) {
            const user = window.stellaApp?.getCurrentUser();
            const userType = user?.user_metadata?.user_type || user?.profile?.user_type;
            
            if (!route.userTypes.includes(userType)) {
                return false;
            }
        }

        return true;
    }

    // Preload route components for better performance
    async preloadRoute(routeName) {
        const route = this.routes.get(routeName);
        if (route && route.component) {
            try {
                // Create instance to trigger any lazy loading
                const instance = new route.component();
                if (typeof instance.preload === 'function') {
                    await instance.preload();
                }
            } catch (error) {
                console.warn(`Failed to preload route: ${routeName}`, error);
            }
        }
    }

    // Batch preload common routes
    async preloadCommonRoutes() {
        const commonRoutes = ['customer-home', 'store-list', 'cart', 'profile'];
        const preloadPromises = commonRoutes.map(route => this.preloadRoute(route));
        
        try {
            await Promise.allSettled(preloadPromises);
            console.log('✅ Common routes preloaded');
        } catch (error) {
            console.warn('⚠️ Some routes failed to preload', error);
        }
    }
}