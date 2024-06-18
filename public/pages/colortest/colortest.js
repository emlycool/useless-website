const hexOptions = [
    '#cc0000', '#cc1a00', '#cc3300', '#cc6600', 
    '#cc8000', '#cc9900', '#b3b300', '#a6cc00', 
    '#99cc00', '#66cc00', '#00cc66', '#00cccc', 
    '#00b3e6', '#00a6cc', '#0080cc', '#0066cc',
    '#004ccc', '#000099', '#330099', '#660099', 
    '#9900cc', '#b300cc', '#cc00cc', '#cc00b3', 
    '#cc0099', '#cc007f'
];

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const colors = document.getElementById("colors");

    hexOptions.forEach(hexColor => {
        const colorBox = document.createElement('div');
        colorBox.style.backgroundColor = hexColor; // Set background color
        colorBox.className = 'colorBox'; // Assign class name for styling
        colors.appendChild(colorBox);
    });
});
