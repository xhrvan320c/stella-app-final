#!/usr/bin/env node

// Stella App - Supabase Quick Setup Script
// Run this script to quickly configure your Supabase connection

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 Stella App - Supabase Quick Setup\n');
console.log('This script will help you configure your Supabase connection.\n');

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    try {
        console.log('Please provide your Supabase project details:\n');
        
        const projectUrl = await askQuestion('https://jzwfaisthvcgnwnsipvn.supabase.co');
        const anonKey = await askQuestion('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6d2ZhaXN0aHZjZ253bnNpcHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTQxMjMsImV4cCI6MjA2OTM5MDEyM30.8Bx78Z0ht2VV_ggpD-JuMOeJIIQdgvz3TDa-S8NH-CU');
        
        // Validate inputs
        if (!projectUrl || !projectUrl.includes('supabase.co')) {
            console.error('❌ Invalid project URL. Please check and try again.');
            process.exit(1);
        }
        
        if (!anonKey || anonKey.length < 100) {
            console.error('❌ Invalid anon key. Please check and try again.');
            process.exit(1);
        }
        
        // Optional OAuth setup
        console.log('\n🔐 OAuth Setup (optional - press Enter to skip):');
        const googleClientId = await askQuestion('Google Client ID (optional): ');
        const facebookClientId = await askQuestion('Facebook App ID (optional): ');
        const appleClientId = await askQuestion('Apple Client ID (optional): ');
        
        // Read the config template
        const configPath = path.join(__dirname, 'config', 'supabase-config.js');
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Replace placeholders
        configContent = configContent.replace('https://jzwfaisthvcgnwnsipvn.supabase.co', projectUrl);
        configContent = configContent.replace('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6d2ZhaXN0aHZjZ253bnNpcHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTQxMjMsImV4cCI6MjA2OTM5MDEyM30.8Bx78Z0ht2VV_ggpD-JuMOeJIIQdgvz3TDa-S8NH-CU', anonKey);
        
        if (googleClientId) {
            configContent = configContent.replace('your-google-client-id', googleClientId);
            configContent = configContent.replace('enabled: true,', 'enabled: true,');
        }
        
        if (facebookClientId) {
            configContent = configContent.replace('your-facebook-app-id', facebookClientId);
        }
        
        if (appleClientId) {
            configContent = configContent.replace('your-apple-client-id', appleClientId);
        }
        
        // Write the updated config
        fs.writeFileSync(configPath, configContent);
        
        console.log('\n✅ Configuration updated successfully!');
        console.log('\nNext steps:');
        console.log('1. Run the database schema in your Supabase SQL Editor');
        console.log('2. Copy the contents of database/schema.sql');
        console.log('3. Paste and run it in your Supabase dashboard');
        console.log('4. Open your app and test the connection');
        console.log('\nFor detailed instructions, see SUPABASE_SETUP.md');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Check if running in Node.js environment
if (typeof require !== 'undefined' && require.main === module) {
    main();
} else {
    console.log('This script should be run with Node.js: node setup-supabase.js');
}

module.exports = { main };
