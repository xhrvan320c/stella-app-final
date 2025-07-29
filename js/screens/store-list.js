// Stella App - Store List Screen Component
export class StoreListScreen {
    constructor(props = {}) {
        this.props = props;
    }

    async render() {
        return `
            <div class="store-list">
                <div class="store-list-header">
                    <h1 class="store-list-title">Local Stores</h1>
                    <div class="store-filters">
                        <span class="filter-chip active">All</span>
                        <span class="filter-chip">Fashion</span>
                        <span class="filter-chip">Footwear</span>
                        <span class="filter-chip">Accessories</span>
                    </div>
                </div>
                <div class="store-list-content">
                    <div class="store-grid">
                        <div class="store-card">
                            <div class="store-header">
                                <div class="store-avatar">FC</div>
                                <div class="store-info">
                                    <h3>Fashion Central</h3>
                                    <p>Clothing & Accessories</p>
                                </div>
                            </div>
                            <div class="store-stats">
                                <div class="store-stat">
                                    <i data-lucide="star"></i>
                                    <span>4.8</span>
                                </div>
                                <div class="store-stat">
                                    <i data-lucide="clock"></i>
                                    <span>15 min</span>
                                </div>
                                <div class="store-stat">
                                    <i data-lucide="map-pin"></i>
                                    <span>0.5 km</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('Store list screen initialized');
    }

    cleanup() {
        console.log('🧹 Store list screen cleaned up');
    }
}