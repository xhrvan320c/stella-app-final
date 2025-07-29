# 🌟 Stella - Hyperlocal Clothing Delivery App

A modern, dark-themed Progressive Web App (PWA) for hyperlocal clothing delivery featuring glassmorphism effects, 3D buttons, and multi-role support.

![Stella App Preview](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Stella+App+Preview)

## ✨ Features

### 🎨 **Premium Design System**
- **Dark theme** with purple/violet primary colors and cyan accents
- **Glassmorphism effects** with backdrop blur and transparency
- **3D elevated buttons** with hover animations and depth
- **Glowing text effects** and animated particles
- **Responsive design** optimized for mobile (320px-428px)

### 👥 **Multi-Role Support**
- **Customers** - Browse stores, place orders, track deliveries
- **Shopkeepers** - Manage inventory, process orders, view analytics
- **Delivery Partners** - Accept orders, update delivery status

### 📱 **Progressive Web App**
- **Service Worker** for offline functionality
- **Web App Manifest** for native app-like experience
- **Push Notifications** for order updates
- **Background Sync** for offline actions
- **Installable** on mobile devices

### 🔐 **Authentication System**
- Multi-role signup/login
- Social authentication (Google, Facebook, Apple)
- Email verification
- Password reset functionality

### 🗄️ **Backend Integration**
- **Supabase** for authentication and database
- **Real-time subscriptions** for live updates
- **Row Level Security** for data protection
- **File storage** for images
- **Geospatial queries** for location-based features

## 🚀 Live Demo

**🌐 [View Live App](https://yourusername.github.io/stella-app/)**

Try the different user roles:
- **Customer Experience** - Browse and shop
- **Shopkeeper Dashboard** - Manage your store
- **Delivery Interface** - Handle deliveries

## 📱 Screenshots

### Customer Experience
- **Home Screen** - Location-based store discovery
- **Store Listings** - Browse local clothing stores
- **Product Grid** - Category-based shopping
- **Shopping Cart** - Order management

### Shopkeeper Dashboard
- **Analytics Overview** - Sales metrics and insights
- **Order Management** - Process customer orders
- **Inventory Control** - Manage products and stock

### Delivery Partner
- **Available Orders** - Accept delivery requests
- **Route Optimization** - Efficient delivery planning
- **Earnings Tracking** - Monitor performance

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **PWA**: Service Worker, Web App Manifest
- **Styling**: CSS Custom Properties, Glassmorphism, 3D Effects
- **Icons**: Lucide Icons
- **Deployment**: GitHub Pages

## 🏗️ Project Structure

```
stella-app/
├── index.html                 # Main PWA entry point
├── demo.html                  # Interactive design preview
├── manifest.json             # PWA configuration
├── sw.js                     # Service worker
├── css/                      # Complete design system
│   ├── globals.css           # CSS variables & utilities
│   ├── glassmorphism.css     # Glass morphism effects
│   ├── buttons.css           # 3D button styles
│   ├── components.css        # Reusable UI components
│   └── screens/              # Screen-specific styles
├── js/                       # Application logic
│   ├── app.js               # Main application controller
│   ├── router.js            # SPA routing system
│   ├── supabase-client.js   # Backend integration
│   ├── components/          # UI components
│   └── screens/             # Screen controllers
├── config/                   # Configuration files
├── database/                 # Database schema
└── .github/workflows/        # GitHub Actions
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/stella-app.git
cd stella-app
```

### 2. Set Up Supabase (Optional)
```bash
# Run the setup script
node setup-supabase.js

# Or manually update js/supabase-client.js with your credentials
```

### 3. Local Development
```bash
# Start a local server
python -m http.server 8000
# or
npx serve .

# Visit http://localhost:8000
```

### 4. Deploy to GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select "GitHub Actions" as source
4. The app will auto-deploy on every push!

## ⚙️ Configuration

### Supabase Setup
1. Create a Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Update your credentials in `js/supabase-client.js`:

```javascript
this.config = {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key-here'
};
```

### PWA Configuration
Update `manifest.json` with your app details:
- App name and description
- Icons and screenshots
- Theme colors
- Start URL

## 🎨 Customization

### Colors
Modify CSS variables in `css/globals.css`:
```css
:root {
  --primary-purple: #8B5CF6;
  --accent-cyan: #06B6D4;
  --bg-primary: #0F0F23;
  /* ... */
}
```

### Features
- Add new screens in `js/screens/`
- Extend the router in `js/router.js`
- Add database tables in `database/schema.sql`

## 📊 Features Roadmap

- [x] Multi-role authentication
- [x] Glassmorphism design system
- [x] Real-time order tracking
- [x] PWA functionality
- [x] Responsive design
- [ ] Payment integration
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service
- **Lucide** for the beautiful icon set
- **Unsplash** for placeholder images
- **CSS Glassmorphism** community for design inspiration

## 📞 Support

- 📧 Email: support@stella-app.com
- 💬 Discord: [Join our community](https://discord.gg/stella-app)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/stella-app/issues)

---

**Made with ❤️ for local clothing businesses**

*Stella - Connecting communities through fashion* 🌟