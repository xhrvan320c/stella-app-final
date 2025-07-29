// Stella App - Product Grid Screen Component
export class ProductGridScreen {
    constructor(props = {}) {
        this.props = props;
    }

    async render() {
        return `
            <div class="product-grid">
                <div class="product-grid-header">
                    <h1 class="product-grid-title">Products</h1>
                    <p class="product-grid-subtitle">Fashion Central</p>
                </div>
                <div class="product-grid-content">
                    <div class="products-grid">
                        <div class="product-card">
                            <div class="product-image" style="background-image: url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300')">
                                <div class="product-badge">New</div>
                            </div>
                            <div class="product-info">
                                <h3 class="product-name">Summer Dress</h3>
                                <p class="product-brand">Fashion Central</p>
                                <div class="product-price">
                                    <span class="price-current">$49.99</span>
                                    <span class="price-original">$69.99</span>
                                </div>
                                <div class="product-rating">
                                    <div class="rating-stars">
                                        <i data-lucide="star" class="star"></i>
                                        <i data-lucide="star" class="star"></i>
                                        <i data-lucide="star" class="star"></i>
                                        <i data-lucide="star" class="star"></i>
                                        <i data-lucide="star" class="star"></i>
                                    </div>
                                    <span class="rating-text">(24)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('Product grid screen initialized');
    }

    cleanup() {
        console.log('🧹 Product grid screen cleaned up');
    }
}