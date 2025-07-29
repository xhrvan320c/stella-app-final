// Stella App - Profile Screen Component
export class ProfileScreen {
    constructor(props = {}) {
        this.props = props;
    }

    async render() {
        return `
            <div class="profile-screen">
                <div class="header">
                    <h1>Profile</h1>
                </div>
                <div class="profile-content">
                    <div class="profile-card">
                        <div class="profile-avatar">
                            <div class="avatar-circle">A</div>
                        </div>
                        <div class="profile-info">
                            <h2>Alex Johnson</h2>
                            <p>alex@example.com</p>
                        </div>
                    </div>
                    
                    <div class="profile-menu">
                        <div class="menu-item">
                            <i data-lucide="user"></i>
                            <span>Edit Profile</span>
                            <i data-lucide="chevron-right"></i>
                        </div>
                        <div class="menu-item">
                            <i data-lucide="map-pin"></i>
                            <span>Addresses</span>
                            <i data-lucide="chevron-right"></i>
                        </div>
                        <div class="menu-item">
                            <i data-lucide="bell"></i>
                            <span>Notifications</span>
                            <i data-lucide="chevron-right"></i>
                        </div>
                        <div class="menu-item">
                            <i data-lucide="help-circle"></i>
                            <span>Help & Support</span>
                            <i data-lucide="chevron-right"></i>
                        </div>
                        <div class="menu-item">
                            <i data-lucide="log-out"></i>
                            <span>Sign Out</span>
                            <i data-lucide="chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('Profile screen initialized');
    }

    cleanup() {
        console.log('🧹 Profile screen cleaned up');
    }
}