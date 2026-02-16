// Global variables
let uploadedFile = null;
let fileContent = null;
let selectedTeams = {
    product: true,
    business: true,
    tech: true,
    marketing: true
};

// Load config on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // First try to load from localStorage
        const config = await loadConfig();
        
        // Apply config values if they exist
        if (config) {
            if (config.apiKey) {
                document.getElementById('apiKey').value = config.apiKey;
                updateAnalyzeButton();
            }
            
            if (config.selectedTeams) {
                selectedTeams = config.selectedTeams;
                updateTeamCheckboxes();
            }
        }
    } catch (error) {
        console.log('Error loading config:', error);
    }
});

// Load config from localStorage or use default config
async function loadConfig() {
    // First try to get from localStorage
    const configStr = localStorage.getItem('aiAnalyticsConfig');
    
    if (configStr) {
        return JSON.parse(configStr);
    }
    
    // If not in localStorage, use the default config from window.DEFAULT_CONFIG
    // which is set in default-config.js and may have been updated by setup-env.js
    if (window.DEFAULT_CONFIG) {
        console.log('Using default configuration');
        return window.DEFAULT_CONFIG;
    }
    
    // Fallback to empty config if nothing else is available
    return {
        apiKey: '',
        selectedModel: 'gemini-1.5-flash',
        selectedTeams: {
            product: true,
            business: true,
            tech: true,
            marketing: true
        }
    };
}

// Save config to localStorage
async function saveConfig() {
    const config = {
        apiKey: document.getElementById('apiKey').value,
        selectedTeams: selectedTeams
    };
    localStorage.setItem('aiAnalyticsConfig', JSON.stringify(config));
}

// Update team checkboxes based on selectedTeams object
function updateTeamCheckboxes() {
    for (const team in selectedTeams) {
        const checkbox = document.getElementById(`${team}Checkbox`);
        if (checkbox) {
            checkbox.checked = selectedTeams[team];
        }
    }
}

// DOM elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const fileInfoContainer = document.getElementById('fileInfoContainer');
const apiKeyInput = document.getElementById('apiKey');
const analyzeBtn = document.getElementById('analyzeBtn');
const uploadSection = document.getElementById('uploadSection');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const insightsGrid = document.getElementById('insightsGrid');
const dialogOverlay = document.getElementById('dialogOverlay');
const resetBtn = document.getElementById('resetBtn');
const analysisMeta = document.getElementById('analysisMeta');

// Upload zone click
uploadZone.addEventListener('click', () => {
    fileInput.click();
});

// Drag and drop handlers
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// File input change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// API key input
apiKeyInput.addEventListener('input', updateAnalyzeButton);



// Reset button click
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        resultsSection.classList.remove('active');
        uploadSection.style.display = 'block';
        // Optional: clear file input if desired
        // removeFile(); 
    });
}

// Team checkbox change
document.querySelectorAll('.team-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const team = this.id.replace('Checkbox', '');
        selectedTeams[team] = this.checked;
        saveConfig();
    });
});

// Handle file upload
function handleFile(file) {
    const validTypes = [
        'text/csv',
        'application/json',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|json|xlsx|xls)$/i)) {
        showDialog('❌', 'Invalid File Type', 'Please upload a CSV, JSON, or Excel file.');
        return;
    }

    uploadedFile = file;
    displayFileInfo(file);
    readFileContent(file);
    updateAnalyzeButton();
}

// Display file info
function displayFileInfo(file) {
    const fileSize = (file.size / 1024).toFixed(2);
    const fileSizeUnit = fileSize > 1024 ? `${(fileSize / 1024).toFixed(2)} MB` : `${fileSize} KB`;

    fileInfoContainer.innerHTML = `
        <div class="file-info">
            <div class="file-icon">📄</div>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSizeUnit}</div>
            </div>
            <button class="remove-file" onclick="removeFile()">×</button>
        </div>
    `;
}

// Read file content
function readFileContent(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        fileContent = e.target.result;
    };

    if (file.name.endsWith('.json')) {
        reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        // For Excel files, just store the file for now
        // In production, you'd use a library like SheetJS to parse it
        reader.readAsArrayBuffer(file);
    }
}

// Remove file
function removeFile() {
    uploadedFile = null;
    fileContent = null;
    fileInfoContainer.innerHTML = '';
    fileInput.value = '';
    updateAnalyzeButton();
}

// Update analyze button state
function updateAnalyzeButton() {
    const hasFile = uploadedFile !== null;
    const hasApiKey = apiKeyInput.value.trim().length > 0;
    analyzeBtn.disabled = !(hasFile && hasApiKey);

    // Save API key to config when it changes
    saveConfig();
}

// Analyze button click
analyzeBtn.addEventListener('click', analyzeData);

// Analyze data with Gemini API
async function analyzeData() {
    const apiKey = apiKeyInput.value.trim();
    // Hardcoded model
    const selectedModel = 'gemini-2.0-flash';

    console.log('API Key length:', apiKey.length);
    console.log('Using model:', selectedModel);

    if (!apiKey) {
        showDialog('❌', 'API Key Required', 'Please enter your Gemini API key to continue.');
        return;
    }

    if (!fileContent) {
        showDialog('❌', 'File Not Ready', 'Please wait for the file to finish uploading.');
        return;
    }

    // Show loading
    uploadSection.style.display = 'none';
    loadingSection.classList.add('active');
    resultsSection.classList.remove('active');

    try {
        // Prepare the prompt
        const prompt = `You are an expert analytics consultant. I'm providing you with analytics data from a website/application. 

Please analyze this data and provide actionable insights for the following teams:

1. **Product Team** - Focus on user experience, feature usage, user journey issues, and product improvements
2. **Business Team** - Focus on conversion rates, revenue opportunities, customer acquisition, and business metrics
3. **Tech Team** - Focus on performance issues, technical bottlenecks, page load times, and infrastructure concerns
4. **Marketing Team** - Focus on traffic sources, campaign effectiveness, user engagement, and growth opportunities

For each team, provide:
- Key findings from the data
- Specific actionable recommendations
- Priority level (High/Medium/Low)
- Expected impact

If the data is insufficient or doesn't contain typical analytics metrics (like page views, sessions, bounce rates, conversion data, user behavior, etc.), respond with: "INVALID_DATA: [explanation of what's missing or wrong]"

Here's the analytics data:

${fileContent}

Please structure your response as JSON with this format:
{
  "valid": true/false,
  "error_message": "if invalid, explain why",
  "insights": {
    "product": {
      "key_findings": ["finding 1", "finding 2"],
      "recommendations": ["recommendation 1", "recommendation 2"],
      "priority": "High/Medium/Low",
      "expected_impact": "Description of impact"
    },
    "business": {
      "key_findings": ["finding 1", "finding 2"],
      "recommendations": ["recommendation 1", "recommendation 2"],
      "priority": "High/Medium/Low",
      "expected_impact": "Description of impact"
    },
    "tech": {
      "key_findings": ["finding 1", "finding 2"],
      "recommendations": ["recommendation 1", "recommendation 2"],
      "priority": "High/Medium/Low",
      "expected_impact": "Description of impact"
    },
    "marketing": {
      "key_findings": ["finding 1", "finding 2"],
      "recommendations": ["recommendation 1", "recommendation 2"],
      "priority": "High/Medium/Low",
      "expected_impact": "Description of impact"
    }
  }
}`;

        // Fixed API URL for gemini-2.0-flash
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

        console.log('API URL (without key):', apiUrl.replace(apiKey, 'HIDDEN'));

        requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
            }
        };

        console.log('Request body:', JSON.stringify(requestBody, null, 2).substring(0, 200) + '...');

        const startTime = performance.now();

        // Call Gemini API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log(`Analysis took ${duration} seconds`);

        if (analysisMeta) {
            analysisMeta.textContent = `Analysis done in ${duration} seconds`;
        }

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        const responseText = await response.text();
        console.log('Response text:', responseText.substring(0, 500));

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = JSON.parse(responseText);
                if (errorData.error && errorData.error.message) {
                    errorMessage = errorData.error.message;
                }
            } catch (e) {
                console.error('Could not parse error response');
            }
            throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);

        console.log('Parsed API response:', data);

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Invalid response structure:', data);
            throw new Error('Invalid response from Gemini API');
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log('AI Response text:', aiResponse);

        // Parse the response
        let result;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || aiResponse.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiResponse;
            console.log('Extracted JSON text:', jsonText);
            result = JSON.parse(jsonText);
            console.log('Parsed result:', result);
        } catch (e) {
            console.error('JSON parsing error:', e);
            console.log('Raw AI response:', aiResponse);
            // If JSON parsing fails, treat as text response
            result = {
                valid: !aiResponse.includes('INVALID_DATA'),
                error_message: aiResponse.includes('INVALID_DATA') ? aiResponse : null,
                insights: {
                    product: aiResponse.includes('Product') ? aiResponse : 'Unable to parse insights',
                    business: '',
                    tech: '',
                    marketing: ''
                }
            };
        }

        // Hide loading
        loadingSection.classList.remove('active');

        // Check if data is valid
        if (!result.valid) {
            showDialog(
                '⚠️',
                'Invalid Analytics Data',
                result.error_message || 'The uploaded file does not contain valid analytics data. Please upload a file with metrics like page views, sessions, bounce rates, or user engagement data.'
            );
            uploadSection.style.display = 'block';
            return;
        }

        // Display results
        displayResults(result.insights);

    } catch (error) {
        console.error('Error:', error);
        loadingSection.classList.remove('active');
        
        // Check if the error is related to quota exceeded
        if (error.message && (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('rate'))) {
            showDialog(
                '❌',
                'Quota Exceeded',
                'Quota is completed. Please enter a new API key, obtain from Google AI Studio.'
            );
        } else {
            showDialog(
                '❌',
                'Analysis Failed',
                `An error occurred while analyzing your data: ${error.message}. Please check your API key and try again.`
            );
        }
        
        uploadSection.style.display = 'block';
    }
}

// Display results
function displayResults(insights) {
    insightsGrid.innerHTML = '';

    const teams = [
        { key: 'product', name: 'Product Team', icon: '🎯', class: 'product' },
        { key: 'business', name: 'Business Team', icon: '💼', class: 'business' },
        { key: 'tech', name: 'Tech Team', icon: '⚙️', class: 'tech' },
        { key: 'marketing', name: 'Marketing Team', icon: '📢', class: 'marketing' }
    ];

    teams.forEach(team => {
        // Skip teams that are not selected
        if (!selectedTeams[team.key]) return;

        if (insights[team.key]) {
            console.log(`${team.name} insight:`, insights[team.key]);
            console.log(`Type of insight:`, typeof insights[team.key]);

            const card = document.createElement('div');
            card.className = `insight-card ${team.class}`;
            card.innerHTML = `
                <div class="team-badge">
                    <span>${team.icon}</span>
                    <span>${team.name}</span>
                </div>
                <div class="insight-content" id="content-${team.key}">${formatInsight(insights[team.key])}</div>
                
                <div class="card-actions">
                    <button class="action-btn" onclick="shareInsight('${team.key}', '${team.name}')">
                        <span>✉️</span> Share
                    </button>
                    <button class="action-btn" onclick="exportInsight('${team.key}', '${team.name}')">
                        <span>🖨️</span> Export
                    </button>
                </div>
            `;
            insightsGrid.appendChild(card);
        }
    });

    resultsSection.classList.add('active');
}

// Share insight via mail
window.shareInsight = function (teamKey, teamName) {
    const content = document.getElementById(`content-${teamKey}`).innerText;
    const subject = `AI Analytics Insights - ${teamName}`;
    const body = `Here are the AI insights for the ${teamName}:\n\n${content}\n\nGenerated by AI Analytics Dashboard`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

// Export insight via print
window.exportInsight = function (teamKey, teamName) {
    const content = document.getElementById(`content-${teamKey}`).innerHTML;
    const badge = document.querySelector(`.insight-card.${teamKey} .team-badge`).outerHTML;

    // Create a temporary container for printing
    const printContainer = document.createElement('div');
    printContainer.className = 'print-only insight-card';
    printContainer.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h1>AI Analytics Insights</h1>
            <p>Report for: ${teamName}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        ${badge}
        <div class="insight-content" style="margin-top: 2rem;">
            ${content}
        </div>
    `;

    document.body.appendChild(printContainer);

    window.print();

    // Clean up
    document.body.removeChild(printContainer);
};

// Format insight text
function formatInsight(data) {
    console.log('Formatting insight:', data);
    console.log('Type:', typeof data);

    // Handle null/undefined
    if (!data) return '<p>No insights available</p>';

    let text;

    // If it's an object, convert to formatted text
    if (typeof data === 'object' && !Array.isArray(data)) {
        console.log('Data is object, converting...');
        text = convertObjectToText(data);
    } else if (Array.isArray(data)) {
        // If it's an array, join the items
        text = data.join('\n\n');
    } else {
        // If it's already a string
        text = String(data);
    }

    console.log('Text to format:', text);

    // Convert markdown-style formatting to HTML
    return text
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/###\s+([^\n]+)/g, '<h3>$1</h3>')
        .replace(/##\s+([^\n]+)/g, '<h3>$1</h3>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(?!<h3>|<p>)(.+)/gm, '<p>$1</p>')
        .replace(/<p><\/p>/g, '');
}

// Convert object to readable text
function convertObjectToText(obj) {
    let result = '';

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Format the key as a header
            const formattedKey = key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            result += `## ${formattedKey}\n\n`;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Nested object
                result += convertObjectToText(value) + '\n\n';
            } else if (Array.isArray(value)) {
                // Array - show as list
                value.forEach(item => {
                    result += `• ${item}\n`;
                });
                result += '\n';
            } else {
                // Simple value
                result += `${value}\n\n`;
            }
        }
    }

    return result;
}

// Show dialog
function showDialog(icon, title, message) {
    document.getElementById('dialogIcon').textContent = icon;
    document.getElementById('dialogTitle').textContent = title;
    document.getElementById('dialogMessage').textContent = message;
    dialogOverlay.classList.add('active');
}

// Close dialog
function closeDialog() {
    dialogOverlay.classList.remove('active');
}

// Reupload file
function reuploadFile() {
    closeDialog();
    removeFile();
    resultsSection.classList.remove('active');
    uploadSection.style.display = 'block';
}

// Close dialog on overlay click
dialogOverlay.addEventListener('click', (e) => {
    if (e.target === dialogOverlay) {
        closeDialog();
    }
});