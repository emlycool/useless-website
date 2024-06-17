import { getWebsiteArray } from '../js/websites.js';

// Initializing current website index
let currentIndex = 0;

// Once website array is retrieved, do the following
getWebsiteArray().then(websiteObject => {
	
	 // Initial Setup
	let websitesElement = document.getElementById("websites");
	websitesElement.innerHTML = ""
	let websitesArray = Object.entries(websiteObject).sort((a, b) => b[1].created_at - a[1].created_at);
	
    // Randomize button functionality
    const randomizeButton = document.getElementById("randomize-button");
    randomizeButton.addEventListener("click", () => {
        const keys = Object.keys(websiteObject);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];
        const randomUrl = websiteObject[randomKey].url;
        window.open(randomUrl, "_blank");
    });

	// Create 'load more' button div
    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Load More";
    loadMoreButton.classList.add("button");
    loadMoreButton.addEventListener("click", () => loadMore(currentIndex, websitesArray, websitesElement, loadMoreButton));

    // Load initial website cards
    loadMore(currentIndex, websitesArray, websitesElement, loadMoreButton);

	// Sort website cards, based on user input
    const sortDropdown = document.getElementById("sort__select");
    sortDropdown.addEventListener("change", function() {
        if (sortDropdown.value === "most-recent") {
            websitesArray.sort((a, b) => b[1].created_at - a[1].created_at);
        } else if (sortDropdown.value === "alphabetical") {
            websitesArray.sort((a, b) => {
                const nameA = a[1].name.toUpperCase();
                const nameB = b[1].name.toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
        }
        currentIndex = 0;
        websitesElement.innerHTML = "";
        loadMore(currentIndex, websitesArray, websitesElement, loadMoreButton);
    });

// If websiteArray isn't successfully received, console log an error
}).catch(error => {
    console.error('Error fetching websites:', error);
});

// Function to append more website cards to websitesElement
function loadMore(index, websitesArray, websitesElement, loadMoreButton) {
    const nextIndex = index + 4;
    const remainingWebsites = websitesArray.slice(index, nextIndex);
    generateWebsiteCards(remainingWebsites, websitesElement);
    currentIndex = nextIndex;
    if (currentIndex >= websitesArray.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
    websitesElement.appendChild(loadMoreButton);
}

// Function to convert epoch timestamp to a UTC string
function formatDateToUTCString(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
}

// Function to generate website cards
function generateWebsiteCards(websitesArray, websitesElement) {
    websitesArray.forEach((websiteData, index) => {
        const websiteCard = document.createElement("div");
        websiteCard.classList.add("website");

        const numberDiv = document.createElement("div");
        numberDiv.textContent = currentIndex + index + 1;
        numberDiv.classList.add("website__number");

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("website__info");

        const developerElement = document.createElement("h4");
        developerElement.textContent = "Created by " + websiteData[1].developer_name;
        developerElement.classList.add("website__info__developer");

        const uploadEpoch = websiteData[1].created_at;
        const uploadDate = new Date(0);
        uploadDate.setUTCMilliseconds(uploadEpoch);

        const uploadDateElement = document.createElement("p");
        const formattedDate = formatDateToUTCString(uploadDate);
        uploadDateElement.textContent = "Submitted on " + formattedDate;
        uploadDateElement.classList.add("website__info__upload-date");

        const nameElement = document.createElement("h2");
        nameElement.textContent = websiteData[1].name;
        nameElement.classList.add("website__info__name");

        const descriptionElement = document.createElement("h3");
        descriptionElement.textContent = websiteData[1].description;
        descriptionElement.classList.add("website__info__description");

        const linkElement = document.createElement("a");
        linkElement.href = websiteData[1].url;
        linkElement.target = "_blank";
        linkElement.classList.add("website__info__link");

        const linkButton = document.createElement("div");
        linkButton.innerHTML = 'Visit Website <i class="fa-solid fa-arrow-right"></i>';
        linkButton.classList.add("button");

        linkElement.appendChild(linkButton);

        infoDiv.appendChild(developerElement);
        infoDiv.appendChild(nameElement);
        infoDiv.appendChild(descriptionElement);
        infoDiv.appendChild(uploadDateElement);
        infoDiv.appendChild(linkElement);

        websiteCard.appendChild(numberDiv);
        websiteCard.appendChild(infoDiv);

        websitesElement.appendChild(websiteCard);
    });
}

// Console log welcome message
console.log(
    '%cWelcome to QuirkyWeb!',
    'color:#EB741D; font-family: Courier New, sans-serif;font-size:24px; font-weight:bold; padding:4px;'
);
console.log(
    '%cWhere curiosity meets creativity!',
    'color:#EB741D; font-family: Courier New, sans-serif;font-size:16px; padding:4px;'
);