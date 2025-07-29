// Stella App - Supabase Configuration
// Replace these values with your actual Supabase project credentials

export const supabaseConfig = {
    // Your Supabase project URL
    // Find this in your Supabase dashboard under Settings > API
    url: 'https://your-project-ref.supabase.co',
    
    // Your Supabase anon/public key
    // Find this in your Supabase dashboard under Settings > API
    anonKey: 'your-anon-key-here',
    
    // Optional: Service role key (for admin operations)
    // Only use this on the server side, never expose in client code
    serviceRoleKey: 'your-service-role-key-here',
    
    // Database configuration
    database: {
        // Enable real-time subscriptions
        realtime: {
            enabled: true,
            // Channels to subscribe to
            channels: ['orders', 'delivery_tracking', 'notifications']
        },
        
        // Row Level Security settings
        rls: {
            enabled: true
        }
    },
    
    // Storage configuration
    storage: {
        // Bucket names for file uploads
        buckets: {
            avatars: 'avatars',
            products: 'product-images',
            stores: 'store-images'
        }
    },
    
    // Authentication configuration
    auth: {
        // Enable email confirmation
        emailConfirmation: true,
        
        // OAuth providers
        providers: {
            google: {
                enabled: true,
                clientId: 'your-google-client-id'
            },
            facebook: {
                enabled: true,
                clientId: 'your-facebook-app-id'
            },
            apple: {
                enabled: true,
                clientId: 'your-apple-client-id'
            }
        },
        
        // Redirect URLs
        redirectUrls: {
            development: 'http://localhost:3000',
            production: 'https://your-domain.com'
        }
    },
    
    // Edge Functions (if using)
    functions: {
        url: 'https://your-project-ref.functions.supabase.co'
    }
};

// Environment-specific configuration
export const getConfig = () => {
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
    
    return {
        ...supabaseConfig,
        isDevelopment,
        redirectUrl: isDevelopment 
            ? supabaseConfig.auth.redirectUrls.development 
            : supabaseConfig.auth.redirectUrls.production
    };
};