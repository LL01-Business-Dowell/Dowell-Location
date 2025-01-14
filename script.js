// Fetch and populate the dropdown with JSON files
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('countryDropdown');
    const jsonFiles = ['country1.json', 'country2.json', 'country3.json']; // Update with your actual JSON file names

    jsonFiles.forEach(file => {
        const option = document.createElement('option');
        option.value = file;
        option.textContent = file.replace('.json', '');
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
            // Show JSON data
            jsonDisplay.textContent = JSON.stringify(data, null, 2);

            // Enable CSV download button
            downloadButton.disabled = false;
            downloadButton.onclick = () => {
                const csv = convertJsonToCsv(data);
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
