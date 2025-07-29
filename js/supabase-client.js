// Stella App - Supabase Client Integration
export class SupabaseClient {
    constructor() {
        this.supabase = null;
        this.isInitialized = false;
        this.config = {
            url: 'https://jzwfaisthvcgnwnsipvn.supabase.co', // Replace with your Supabase URL
            anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6d2ZhaXN0aHZjZ253bnNpcHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTQxMjMsImV4cCI6MjA2OTM5MDEyM30.8Bx78Z0ht2VV_ggpD-JuMOeJIIQdgvz3TDa-S8NH-CU', // Replace with your Supabase anon key
            isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        };
        
        this.init();
    }

    async init() {
        try {
            // Check if Supabase library is loaded
            if (typeof window.supabase !== 'undefined') {
                this.supabase = window.supabase.createClient(this.config.url, this.config.anonKey, {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: true
                    },
                    realtime: {
                        params: {
                            eventsPerSecond: 10
                        }
                    }
                });
                this.isInitialized = true;
                console.log('✅ Supabase client initialized with project:', this.config.url);
                
                // Set up auth state listener
                this.setupAuthListener();
            } else {
                console.warn('⚠️ Supabase library not loaded, using mock client');
                this.initMockClient();
            }
        } catch (error) {
            console.error('❌ Failed to initialize Supabase client:', error);
            this.initMockClient();
        }
    }

    setupAuthListener() {
        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔐 Auth state changed:', event, session?.user?.email);
            
            if (event === 'SIGNED_IN') {
                this.handleSignIn(session);
            } else if (event === 'SIGNED_OUT') {
                this.handleSignOut();
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('🔄 Token refreshed');
            }
        });
    }

    async handleSignIn(session) {
        try {
            // Create or update user profile
            const { data: existingUser } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (!existingUser) {
                // Create new user profile
                const { error } = await this.supabase
                    .from('users')
                    .insert({
                        id: session.user.id,
                        email: session.user.email,
                        full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
                        user_type: session.user.user_metadata?.user_type || 'customer',
                        phone: session.user.user_metadata?.phone
                    });

                if (error) {
                    console.error('Failed to create user profile:', error);
                } else {
                    console.log('✅ User profile created');
                }
            }
        } catch (error) {
            console.error('Error handling sign in:', error);
        }
    }

    handleSignOut() {
        // Clear any cached data
        localStorage.removeItem('stella_user_preferences');
        localStorage.removeItem('stella_cart');
        console.log('🚪 User signed out, cache cleared');
    }

    initMockClient() {
        // Mock client for development/demo purposes
        this.supabase = {
            auth: {
                signUp: async (credentials) => this.mockSignUp(credentials),
                signInWithPassword: async (credentials) => this.mockSignIn(credentials),
                signInWithOAuth: async (provider) => this.mockOAuthSignIn(provider),
                signOut: async () => this.mockSignOut(),
                getSession: async () => this.mockGetSession(),
                onAuthStateChange: (callback) => this.mockAuthStateChange(callback)
            },
            from: (table) => this.mockTable(table)
        };
        this.isInitialized = true;
        console.log('🔧 Mock Supabase client initialized');
    }

    // Authentication Methods
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;

            console.log('✅ User signed up successfully');
            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('❌ Sign up failed:', error);
            throw new Error(error.message || 'Sign up failed');
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            console.log('✅ User signed in successfully');
            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('❌ Sign in failed:', error);
            throw new Error(error.message || 'Sign in failed');
        }
    }

    async signInWithOAuth(provider) {
        try {
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (error) throw error;

            console.log(`✅ OAuth sign in initiated with ${provider}`);
            return data;
        } catch (error) {
            console.error(`❌ OAuth sign in failed with ${provider}:`, error);
            throw new Error(error.message || 'OAuth sign in failed');
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            console.log('✅ User signed out successfully');
        } catch (error) {
            console.error('❌ Sign out failed:', error);
            throw new Error(error.message || 'Sign out failed');
        }
    }

    async getSession() {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            if (error) throw error;

            return session;
        } catch (error) {
            console.error('❌ Failed to get session:', error);
            return null;
        }
    }

    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange(callback);
    }

    // User Profile Methods
    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return { data };
        } catch (error) {
            console.error('❌ Failed to get user profile:', error);
            throw error;
        }
    }

    async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return { data };
        } catch (error) {
            console.error('❌ Failed to update user profile:', error);
            throw error;
        }
    }

    // Store Methods
    async getStores(filters = {}) {
        try {
            let query = this.supabase
                .from('stores')
                .select(`
                    *,
                    store_categories(name),
                    store_ratings(rating)
                `)
                .eq('is_active', true);

            // Apply filters
            if (filters.category) {
                query = query.eq('category_id', filters.category);
            }

            if (filters.location) {
                // Add geospatial query for nearby stores
                query = query.rpc('nearby_stores', {
                    lat: filters.location.lat,
                    lng: filters.location.lng,
                    radius: filters.radius || 5000
                });
            }

            if (filters.search) {
                query = query.ilike('name', `%${filters.search}%`);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return { data };
        } catch (error) {
            console.error('❌ Failed to get stores:', error);
            throw error;
        }
    }

    async getStore(storeId) {
        try {
            const { data, error } = await this.supabase
                .from('stores')
                .select(`
                    *,
                    store_categories(name),
                    store_ratings(rating, review_count)
                `)
                .eq('id', storeId)
                .single();

            if (error) throw error;
            return { data };
        } catch (error) {
            console.error('❌ Failed to get store:', error);
            throw error;
        }
    }

    // Product Methods
    async getProducts(storeId, filters = {}) {
        try {
            let query = this.supabase
                .from('products')
                .select(`
                    *,
                    product_categories(name),
                    product_images(url, alt_text)
                `)
                .eq('store_id', storeId)
                .eq('is_active', true);

            // Apply filters
            if (filters.category) {
                query = query.eq('category_id', filters.category);
            }

            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
            }

            if (filters.minPrice) {
                query = query.gte('price', filters.minPrice);
            }

            if (filters.maxPrice) {
                query = query.lte('price', filters.maxPrice);
            }

            // Apply sorting
            const sortBy = filters.sortBy || 'created_at';
            const sortOrder = filters.sortOrder || 'desc';
            query = query.order(sortBy, { ascending: sortOrder === 'asc' });

            const { data, error } = await query;

            if (error) throw error;
            return { data };
        } catch (error) {
            console.error('❌ Failed to get products:', error);
            throw error;
        }
    }

    async getProduct(productId) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select(`
                    *,
                    stores(name, id),
                    product_categories(name),
                    product_images(url, alt_text),
                    product_variants(id, name, price, stock_quantity)
                `)
                .eq('id', productId)
                .single();

            if (error) throw error;
            return { data };
        } catch (error) {
            console.error('❌ Failed to get product:', error);
            throw error;
        }
    }

    // Order Methods
    async createOrder(orderData) {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .insert(orderData)
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Order created successfully');
            return { data };
        } catch (error) {
            console.error('❌ Failed to create order:', error);
            throw error;
        }
    }

    async getOrders(userId, filters = {}) {
        try {
            let query = this.supabase
                .from('orders')
                .select(`
                    *,
                    stores(name, id),
                    order_items(
                        *,
                        products(name, images)
                    )
                `)
                .eq('customer_id', userId);

            // Apply filters
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.storeId) {
                query = query.eq('store_id', filters.storeId);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return { data };
        } catch (error) {
            console.error('❌ Failed to get orders:', error);
            throw error;
        }
    }

    async updateOrderStatus(orderId, status, updates = {}) {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .update({ status, ...updates, updated_at: new Date().toISOString() })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;

            console.log(`✅ Order ${orderId} status updated to ${status}`);
            return { data };
        } catch (error) {
            console.error('❌ Failed to update order status:', error);
            throw error;
        }
    }

    // Real-time Subscriptions
    subscribeToOrders(userId, callback) {
        return this.supabase
            .channel('orders')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
                filter: `customer_id=eq.${userId}`
            }, callback)
            .subscribe();
    }

    subscribeToOrderUpdates(orderId, callback) {
        return this.supabase
            .channel(`order_${orderId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: `id=eq.${orderId}`
            }, callback)
            .subscribe();
    }

    // Delivery Partner Methods
    async updateDeliveryStatus(userId, status) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update({ delivery_status: status })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return { data };
        } catch (error) {
            console.error('❌ Failed to update delivery status:', error);
            throw error;
        }
    }

    async getAvailableDeliveries(location, radius = 5000) {
        try {
            const { data, error } = await this.supabase
                .rpc('get_available_deliveries', {
                    lat: location.lat,
                    lng: location.lng,
                    radius: radius
                });

            if (error) throw error;
            return { data };
        } catch (error) {
            console.error('❌ Failed to get available deliveries:', error);
            throw error;
        }
    }

    // File Upload Methods
    async uploadFile(bucket, path, file) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .upload(path, file);

            if (error) throw error;

            console.log('✅ File uploaded successfully');
            return { data };
        } catch (error) {
            console.error('❌ Failed to upload file:', error);
            throw error;
        }
    }

    async getFileUrl(bucket, path) {
        try {
            const { data } = this.supabase.storage
                .from(bucket)
                .getPublicUrl(path);

            return data.publicUrl;
        } catch (error) {
            console.error('❌ Failed to get file URL:', error);
            throw error;
        }
    }

    // Mock Methods for Development
    mockSignUp(credentials) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    id: 'mock-user-id',
                    email: credentials.email,
                    user_metadata: credentials.options?.data || {}
                };
                resolve({ data: { user: mockUser, session: { user: mockUser } }, error: null });
            }, 1000);
        });
    }

    mockSignIn(credentials) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    id: 'mock-user-id',
                    email: credentials.email,
                    user_metadata: { user_type: 'customer' }
                };
                resolve({ data: { user: mockUser, session: { user: mockUser } }, error: null });
            }, 1000);
        });
    }

    mockOAuthSignIn(provider) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { url: `https://mock-oauth-${provider}.com` }, error: null });
            }, 500);
        });
    }

    mockSignOut() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ error: null });
            }, 500);
        });
    }

    mockGetSession() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return null for no session, or mock session for testing
                resolve({ data: { session: null }, error: null });
            }, 200);
        });
    }

    mockAuthStateChange(callback) {
        // Mock auth state changes
        return { data: { subscription: { unsubscribe: () => {} } } };
    }

    mockTable(tableName) {
        return {
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: {}, error: null }),
                    order: () => Promise.resolve({ data: [], error: null })
                }),
                order: () => Promise.resolve({ data: [], error: null })
            }),
            insert: () => ({
                select: () => ({
                    single: () => Promise.resolve({ data: {}, error: null })
                })
            }),
            update: () => ({
                eq: () => ({
                    select: () => ({
                        single: () => Promise.resolve({ data: {}, error: null })
                    })
                })
            })
        };
    }

    // Utility Methods
    isOnline() {
        return navigator.onLine && this.isInitialized;
    }

    async executeAction(action) {
        // Generic method to execute various actions
        switch (action.type) {
            case 'create_order':
                return await this.createOrder(action.data);
            case 'update_order_status':
                return await this.updateOrderStatus(action.orderId, action.status, action.updates);
            case 'update_delivery_status':
                return await this.updateDeliveryStatus(action.userId, action.status);
            default:
                throw new Error(`Unknown action type: ${action.type}`);
        }
    }
}