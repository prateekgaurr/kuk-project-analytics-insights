/**
 * AI Analytics Insights Dashboard Configuration
 * 
 * This file handles configuration storage and retrieval for the dashboard.
 * It uses localStorage to persist user settings between sessions.
 */

// Import default configuration from default-config.js
// The actual default values are defined in default-config.js

// Configuration manager
const ConfigManager = {
    /**
     * Load configuration from localStorage
     * @returns {Object} The configuration object
     */
    load: function() {
        try {
            const savedConfig = localStorage.getItem('aiAnalyticsConfig');
            if (savedConfig) {
                return JSON.parse(savedConfig);
            }
        } catch (error) {
            console.error('Error loading config:', error);
        }
        return window.DEFAULT_CONFIG || {
            apiKey: '',
            selectedModel: 'gemini-1.5-flash',
            selectedTeams: {
                product: true,
                business: true,
                tech: true,
                marketing: true
            }
        };
    },

    /**
     * Save configuration to localStorage
     * @param {Object} config - The configuration object to save
     */
    save: function(config) {
        try {
            localStorage.setItem('aiAnalyticsConfig', JSON.stringify(config));
            return true;
        } catch (error) {
            console.error('Error saving config:', error);
            return false;
        }
    },

    /**
     * Get a specific configuration value
     * @param {string} key - The configuration key to retrieve
     * @returns {any} The configuration value
     */
    get: function(key) {
        const config = this.load();
        return config[key];
    },

    /**
     * Set a specific configuration value
     * @param {string} key - The configuration key to set
     * @param {any} value - The value to set
     */
    set: function(key, value) {
        const config = this.load();
        config[key] = value;
        return this.save(config);
    },

    /**
     * Clear all saved configuration
     */
    clear: function() {
        localStorage.removeItem('aiAnalyticsConfig');
    }
};

// Export the ConfigManager for use in other files
window.ConfigManager = ConfigManager;