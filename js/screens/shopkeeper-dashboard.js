// Stella App - Shopkeeper Dashboard Component
export class ShopkeeperDashboard {
    constructor(props = {}) {
        this.props = props;
    }

    async render() {
        return `
            <div class="shopkeeper-dashboard">
                <div class="dashboard-header">
                    <div class="dashboard-welcome">
                        <h1>Welcome back, Sarah!</h1>
                        <p>Here's what's happening with your store today</p>
                    </div>
                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <div class="stat-icon"><i data-lucide="shopping-bag"></i></div>
                            <div class="stat-value">24</div>
                            <div class="stat-label">New Orders</div>
                            <div class="stat-change positive">
                                <i data-lucide="trending-up"></i>
                                +12%
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i data-lucide="dollar-sign"></i></div>
                            <div class="stat-value">$1,240</div>
                            <div class="stat-label">Today's Sales</div>
                            <div class="stat-change positive">
                                <i data-lucide="trending-up"></i>
                                +8%
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i data-lucide="package"></i></div>
                            <div class="stat-value">156</div>
                            <div class="stat-label">Products</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i data-lucide="star"></i></div>
                            <div class="stat-value">4.8</div>
                            <div class="stat-label">Rating</div>
                        </div>
                    </div>
                </div>
                <div class="dashboard-content">
                    <div class="dashboard-section">
                        <div class="section-header">
                            <h2 class="section-title">Recent Orders</h2>
                            <a href="#" class="section-action">View All</a>
                        </div>
                        <div class="recent-orders">
                            <div class="order-item">
                                <div class="order-header">
                                    <span class="order-id">#ORD-001</span>
                                    <span class="order-status pending">Pending</span>
                                </div>
                                <div class="order-customer">
                                    <div class="customer-avatar">JD</div>
                                    <div class="customer-info">
                                        <h4>John Doe</h4>
                                        <p>2 items • 5 min ago</p>
                                    </div>
                                </div>
                                <div class="order-footer">
                                    <span class="order-time">2:30 PM</span>
                                    <span class="order-total">$89.99</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('Shopkeeper dashboard initialized');
    }

    cleanup() {
        console.log('🧹 Shopkeeper dashboard cleaned up');
    }
}