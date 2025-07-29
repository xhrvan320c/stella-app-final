# 🚀 Stella App - Supabase Setup Guide

This guide will help you connect your Stella app to your Supabase project in just a few steps.

## 📋 Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created
3. Basic knowledge of SQL (for database setup)

## 🔧 Step 1: Create Your Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `stella-app`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## 🗄️ Step 2: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of [`database/schema.sql`](database/schema.sql)
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema
5. You should see "Success. No rows returned" - this means it worked!

### What this creates:
- ✅ User profiles and authentication
- ✅ Stores and products tables
- ✅ Orders and order items
- ✅ Reviews and ratings
- ✅ Shopping cart persistence
- ✅ Delivery tracking
- ✅ Notifications system
- ✅ Row Level Security (RLS) policies
- ✅ Useful functions and triggers

## 🔑 Step 3: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ⚙️ Step 4: Configure Your App

1. Open [`config/supabase-config.js`](config/supabase-config.js)
2. Replace the placeholder values:

```javascript
export const supabaseConfig = {
    // Replace with your actual Supabase URL
    url: 'https://your-project-ref.supabase.co',
    
    // Replace with your actual anon key
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    
    // ... rest of config
};
```

## 🔐 Step 5: Configure Authentication

### Email Authentication (Already enabled)
- Users can sign up with email/password
- Email confirmation is enabled by default

### Social Authentication (Optional)

#### Google OAuth:
1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`

#### Facebook OAuth:
1. Go to **Authentication** → **Providers** → **Facebook**
2. Enable Facebook provider
3. Add your Facebook App credentials
4. Add redirect URI in Facebook App settings

#### Apple OAuth:
1. Go to **Authentication** → **Providers** → **Apple**
2. Enable Apple provider
3. Add your Apple App credentials

### Configure Redirect URLs:
1. Go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production domain

## 📁 Step 6: Set Up Storage (Optional)

If you want to enable image uploads:

1. Go to **Storage** in your Supabase dashboard
2. Create these buckets:
   - `avatars` (for user profile pictures)
   - `product-images` (for product photos)
   - `store-images` (for store logos/covers)

3. Set up storage policies for each bucket:

```sql
-- Allow users to upload their own avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view all avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Similar policies for other buckets...
```

## 🧪 Step 7: Test Your Connection

1. Add the Supabase JavaScript library to your HTML:

```html
<!-- Add this to your index.html before your app scripts -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
```

2. Open your app in a browser
3. Check the browser console for:
   - ✅ "Supabase client initialized with project: https://your-project-ref.supabase.co"
   - No error messages

4. Try the authentication flow:
   - Go to the signup page
   - Create a test account
   - Check if the user appears in **Authentication** → **Users** in Supabase

## 🎯 Step 8: Add Sample Data (Optional)

To test your app with sample data, run this SQL in your Supabase SQL Editor:

```sql
-- Insert sample store categories
INSERT INTO public.store_categories (name, description, icon) VALUES
('Fashion Boutique', 'Trendy clothing and accessories', 'shirt'),
('Shoe Store', 'Footwear for all occasions', 'footprints'),
('Accessories Hub', 'Bags, jewelry, and more', 'watch'),
('Sports Wear', 'Athletic and fitness clothing', 'activity');

-- Insert sample stores (you'll need to replace owner_id with actual user IDs)
INSERT INTO public.stores (name, description, address, location, category_id, owner_id) VALUES
('Fashion Central', 'Your one-stop fashion destination', '123 Fashion St, Downtown', ST_Point(-122.4194, 37.7749), 
 (SELECT id FROM public.store_categories WHERE name = 'Fashion Boutique' LIMIT 1),
 'replace-with-actual-user-id');
```

## 🚀 Step 9: Deploy Your App

### Option 1: Netlify
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Set build command: `# No build needed for static site`
4. Set publish directory: `stella-app`
5. Add environment variables if needed

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts

### Option 3: GitHub Pages
1. Push to GitHub
2. Go to repository Settings → Pages
3. Select source branch
4. Your app will be available at `https://username.github.io/repository-name`

## 🔧 Troubleshooting

### Common Issues:

**"Failed to initialize Supabase client"**
- Check that your URL and API key are correct
- Ensure the Supabase library is loaded before your app scripts

**"Row Level Security policy violation"**
- Check that RLS policies are set up correctly
- Ensure users are authenticated before accessing protected data

**"CORS errors"**
- Add your domain to allowed origins in Supabase dashboard
- Check Authentication → URL Configuration

**"Database connection issues"**
- Verify your database schema was created successfully
- Check that all tables exist in the Table Editor

### Getting Help:

1. Check the browser console for detailed error messages
2. Review Supabase logs in your dashboard
3. Consult the [Supabase documentation](https://supabase.com/docs)
4. Join the [Supabase Discord community](https://discord.supabase.com)

## 🎉 You're All Set!

Your Stella app is now connected to Supabase! You can:

- ✅ Sign up and authenticate users
- ✅ Store and retrieve data
- ✅ Handle real-time updates
- ✅ Manage file uploads
- ✅ Send notifications

## 📚 Next Steps

1. **Customize the design** - Modify CSS variables in `css/globals.css`
2. **Add more features** - Extend the database schema as needed
3. **Set up analytics** - Add tracking for user behavior
4. **Configure payments** - Integrate Stripe or other payment providers
5. **Add push notifications** - Set up Firebase Cloud Messaging
6. **Optimize performance** - Add caching and lazy loading

Happy coding! 🚀