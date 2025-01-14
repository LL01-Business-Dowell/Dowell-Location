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

// Convert JSON data to CSV
function convertJsonToCsv(json) {
    const rows = [Object.keys(json[0]).join(','), ...json.map(obj => Object.values(obj).join(','))];
    return rows.join('\n');
}

// Download a file with the specified content
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
