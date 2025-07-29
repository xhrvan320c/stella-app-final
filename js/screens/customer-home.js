// Stella App - Customer Home Screen Component
export class CustomerHomeScreen {
    constructor(props = {}) {
        this.props = props;
    }

    async render() {
        return `
            <div class="customer-home">
                <div class="home-hero">
                    <div class="home-greeting">
                        <h1>Good morning, Alex!</h1>
                        <p>Discover amazing clothing from local stores</p>
                    </div>
                    <div class="home-location">
                        <i data-lucide="map-pin"></i>
                        <div class="home-location-text">
                            <p class="home-location-label">Deliver to</p>
                            <p class="home-location-address">123 Main St, Downtown</p>
                        </div>
                    </div>
                </div>
                
                <div class="home-search">
                    <div class="glass-search">
                        <i data-lucide="search" class="search-icon"></i>
                        <input type="text" class="glass-input" placeholder="Search for clothes, brands, stores...">
                    </div>
                    <div class="search-suggestions">
                        <span class="search-suggestion">Dresses</span>
                        <span class="search-suggestion">Casual Wear</span>
                        <span class="search-suggestion">Accessories</span>
                    </div>
                </div>
                
                <div class="home-categories">
                    <div class="section-header">
                        <h2 class="section-title">Categories</h2>
                        <a href="#" class="section-action">View All</a>
                    </div>
                    <div class="categories-grid">
                        <div class="category-item">
                            <div class="category-icon"><i data-lucide="shirt"></i></div>
                            <p class="category-name">Shirts</p>
                        </div>
                        <div class="category-item">
                            <div class="category-icon"><i data-lucide="crown"></i></div>
                            <p class="category-name">Dresses</p>
                        </div>
                        <div class="category-item">
                            <div class="category-icon"><i data-lucide="glasses"></i></div>
                            <p class="category-name">Accessories</p>
                        </div>
                        <div class="category-item">
                            <div class="category-icon"><i data-lucide="footprints"></i></div>
                            <p class="category-name">Shoes</p>
                        </div>
                    </div>
                </div>
                
                <div class="home-featured">
                    <div class="section-header">
                        <h2 class="section-title">Featured Stores</h2>
                        <a href="#" class="section-action">View All</a>
                    </div>
                    <div class="featured-stores">
                        <div class="featured-store">
                            <div class="featured-store-image" style="background-image: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400')">
                                <div class="featured-store-badge">New</div>
                            </div>
                            <div class="featured-store-info">
                                <h3 class="featured-store-name">Fashion Central</h3>
                                <p class="featured-store-category">Clothing & Accessories</p>
                                <div class="featured-store-stats">
                                    <div class="store-rating">
                                        <i data-lucide="star"></i>
                                        <span>4.8</span>
                                    </div>
                                    <span class="store-distance">0.5 km</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        this.setupEventListeners();
        this.loadUserData();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.glass-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Category clicks
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', this.handleCategoryClick.bind(this));
        });

        // Store clicks
        const storeItems = document.querySelectorAll('.featured-store');
        storeItems.forEach(item => {
            item.addEventListener('click', this.handleStoreClick.bind(this));
        });
    }

    handleSearch(event) {
        const query = event.target.value;
        console.log('Search query:', query);
        // Implement search functionality
    }

    handleCategoryClick(event) {
        const categoryName = event.currentTarget.querySelector('.category-name').textContent;
        console.log('Category clicked:', categoryName);
        // Navigate to category products
    }

    handleStoreClick(event) {
        const storeName = event.currentTarget.querySelector('.featured-store-name').textContent;
        console.log('Store clicked:', storeName);
        // Navigate to store products
    }

    async loadUserData() {
        try {
            const user = window.stellaApp?.getCurrentUser();
            if (user) {
                // Update greeting with user name
                const greeting = document.querySelector('.home-greeting h1');
                if (greeting) {
                    const name = user.user_metadata?.full_name || user.email.split('@')[0];
                    greeting.textContent = `Good morning, ${name}!`;
                }
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    cleanup() {
        // Clean up event listeners and timers
        console.log('🧹 Customer home screen cleaned up');
    }
}