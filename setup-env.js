const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_FILE = 'default-config.js';
const PLACEHOLDER_KEY = 'YOUR_DEFAULT_GEMINI_API_KEY_HERE';
const ENV_VAR_NAME = 'GEMINI_API_KEY';

// Paths
const configPath = path.join(__dirname, CONFIG_FILE);

console.log("All ENV KEYS:");
console.log(Object.keys(process.env));

console.log("GEMINI_API_KEY value:");
console.log(process.env.GEMINI_API_KEY);

console.log(`Checking for environment variable: ${ENV_VAR_NAME}`);

// Check if environment variable exists
if (!process.env[ENV_VAR_NAME]) {
    console.warn(`WARNING: Environment variable ${ENV_VAR_NAME} is not set.`);
    console.warn('Skipping API key injection. The default placeholder will remain.');
    process.exit(0);
}

const apiKey = process.env[ENV_VAR_NAME];

try {
    // Read the config file
    console.log(`Reading configuration file: ${configPath}`);
    let configContent = fs.readFileSync(configPath, 'utf8');

    console.log('Injecting API key...');

// Replace apiKey value regardless of current value
const updatedContent = configContent.replace(
    /apiKey:\s*['"].*?['"]/,
    `apiKey: '${apiKey}'`
);

fs.writeFileSync(configPath, updatedContent, 'utf8');
console.log(`Successfully updated ${CONFIG_FILE} with the API key from environment variables.`);

} catch (error) {
    console.error('Error processing configuration file:', error);
    process.exit(1);
}
