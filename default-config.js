/**
 * AI Analytics Insights Dashboard Default Configuration
 * 
 * This file contains default configuration values including a default API key.
 * These values will be used when no user configuration is found in localStorage.
 */

// Default configuration with API key
const DEFAULT_CONFIG = {
    apiKey: 'test_api_key_for_local_testing',
    selectedModel: 'gemini-1.5-flash',
    selectedTeams: {
        product: true,
        business: true,
        tech: true,
        marketing: true
    }
};

// Export the default configuration
window.DEFAULT_CONFIG = DEFAULT_CONFIG;