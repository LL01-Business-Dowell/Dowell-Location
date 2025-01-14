// List of JSON files (representing countries)
const jsonFiles = [
    'Australia.json',
    'United Arab Emirates.json',
    'United Kingdom.json',
    'India.json',
    'Japan.json',
    'United States.json',
    'Netherlands.json',
    'Singapore.json'
];

// Populate the dropdown with country names (derived from file names)
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('countryDropdown');

    jsonFiles.forEach(file => {
        const countryName = file.replace('.json', ''); // Extract the country name
        const option = document.createElement('option');
        option.value = file; // Keep the file name as the value
        option.textContent = countryName; // Display the country name
        dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', handleCountrySelection);
});

// Handle selection from the dropdown
function handleCountrySelection(event) {
    const selectedFile = event.target.value;
    const jsonDisplay = document.getElementById('jsonDisplay');
    const downloadButton = document.getElementById('downloadCsv');

    // Fetch the JSON data and display it
    fetch(`jsondb/${selectedFile}`)
        .then(response => response.json())
        .then(data => {
            // Filter data with Population >= 100000
            const filteredData = data.filter(item => parseInt(item.Population) >= 100000);

            // Show filtered JSON data
            jsonDisplay.textContent = JSON.stringify(filteredData, null, 2);

            // Enable CSV download button
            downloadButton.disabled = false;
            downloadButton.onclick = () => {
                const csv = convertJsonToCsv(filteredData);
                downloadFile(`${selectedFile.replace('.json', '')}.csv`, csv);
            };
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
            jsonDisplay.textContent = 'Error loading data.';
            downloadButton.disabled = true;
        });
}

// Function to convert JSON data to CSV format
function convertJsonToCsv(jsonData) {
    const rows = [];

    // Check if the JSON data is an array and has at least one object
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        return '';
    }

    // Extract headers (keys) from the first object in the JSON array
    const headers = Object.keys(jsonData[0]);
    rows.push(headers.join(',')); // Add headers to the CSV

    // Process each object in the JSON array and create rows for CSV
    jsonData.forEach(obj => {
        const row = headers.map(field => {
            let value = obj[field] || ''; 
            
            // Handle special characters by ensuring proper escaping
            value = `"${value.replace(/"/g, '""')}"`; // Escape double quotes
            return value;
        });

        rows.push(row.join(',')); // Add row to CSV
    });

    return rows.join('\n'); // Join all rows with new line characters
}

// Download a file with the specified content
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
