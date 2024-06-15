/* NOTES:
 * - Add 'load more' button to 'websites' element, load first 5 results, then append 5 more results each time 'load more' is clicked
 * - Complete 'learn more' page
 */

import { getWebsiteArray } from '../js/websites.js';

getWebsiteArray().then(websiteObject => {
    // When 'Randomize' is clicked, randomly select a website and open it in a new tab.
    const randomizeButton = document.getElementById("randomize-button");
    randomizeButton.addEventListener("click", () => {
        const keys = Object.keys(websiteObject);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];
        const randomUrl = websiteObject[randomKey].url;
        window.open(randomUrl, "_blank");
    });

    // Convert websiteObject to an array
    const websitesArray = Object.entries(websiteObject);

    // Set default card sort, sorted by most recent first
    generateWebsiteCards(websitesArray.sort((a, b) => b[1].created_at - a[1].created_at)); 

    // Sorting order of website cards, based on user input in sortDropdown
    const sortDropdown = document.getElementById("sort__select")
    sortDropdown.addEventListener("change", function() {
        if (sortDropdown.value == "most-recent") {
            // Generate new cards, sorted by most recent first
            websitesArray.sort((a, b) => b[1].created_at - a[1].created_at);
            generateWebsiteCards(websitesArray);

        } else if (sortDropdown.value == "alphabetical") {
            // Generate new cards, sorted in alphabetical order
            websitesArray.sort((a, b) => {
                const nameA = a[1].name.toUpperCase();
                const nameB = b[1].name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            generateWebsiteCards(websitesArray);
        }
    });

    // Generate website cards with data from websitesArray
    function generateWebsiteCards(websitesArray) {
        console.log(websitesArray);
        let websitesElement = document.getElementById("websites");
        websitesElement.innerHTML = "";
        for (let i = 0; i < websitesArray.length; i++) {

            // Create website card <div>
            const websiteCard = document.createElement("div")
            websiteCard.classList.add("website")

            // Create website number <div>
            const numberDiv = document.createElement("div")
            numberDiv.textContent = i + 1;
            numberDiv.classList.add("website__number");

            // Create website info <div>
            const infoDiv = document.createElement("div");
            infoDiv.classList.add("website__info");

            // Create developer <p> tag and add 'developer_name'
            const developerElement = document.createElement("p");
            developerElement.textContent = "Created by " + websitesArray[i][1].developer_name;
            developerElement.classList.add("website__info__developer");
 
            // Convert 'created_at' to uploadDate object
            var uploadEpoch = websitesArray[i][1].created_at;
            var uploadDate = new Date(0);
            uploadDate.setUTCMilliseconds(uploadEpoch)
            
            // Create upload date <p> tag, format and add uploadDate
            const uploadDateElement = document.createElement("p");
            const formattedDate = formatDateToUTCString(uploadDate);
            uploadDateElement.textContent = "Submitted on " + formattedDate;
            uploadDateElement.classList.add("website__info__upload-date");

            // Create name <h2> tag and add 'name'
            const nameElement = document.createElement("h2");
            nameElement.textContent = websitesArray[i][1].name;
            nameElement.classList.add("website__info__name");

            // Create description <p> tag and add 'description'
            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = websitesArray[i][1].description;
            descriptionElement.classList.add("website__info__description");

            // Create link <a> tag and add 'url', class for styling
            const linkElement = document.createElement("a");
            linkElement.href = websitesArray[i][1].url;
            linkElement.target = "_blank";
            linkElement.classList.add("website__info__link");

            // Create link button <div>
            const linkButton = document.createElement("div");
            linkButton.innerHTML = 'Visit Website <i class="fa-solid fa-arrow-right"></i>';
            linkButton.classList.add("button");

            // Append link button <div> to link element <a>
            linkElement.appendChild(linkButton)

            // Append info elements to info div
            infoDiv.appendChild(developerElement);
            infoDiv.appendChild(nameElement);
            infoDiv.appendChild(descriptionElement);
            infoDiv.appendChild(uploadDateElement);
            infoDiv.appendChild(linkElement);

            // Append number and info <div> to website card <div>
            websiteCard.appendChild(numberDiv);
            websiteCard.appendChild(infoDiv);

            // Append website card <div> to websites element <div>
            websitesElement.appendChild(websiteCard);
        };
    }
}).catch(error => {
    console.error('Error fetching websites:', error);
});

// Convert dates from UTC to (DD,MMM,YYYY) format
function formatDateToUTCString(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${month} ${day}, ${year}`;
}