import { getWebsiteArray } from '../js/websites.js';

// initializing current website index
let currentIndex = 0;
setColor('--color');

// once website array is retrieved, do the following
getWebsiteArray().then(websiteObject => {
	// initial Setup
	const websitesArray = Object.entries(websiteObject).sort((a, b) => b[1].created_at - a[1].created_at);
	const websitesElement = document.getElementById("websites");
	websitesElement.innerHTML = ""
	
    // randomize button functionality
    const randomizeButton = document.getElementById("randomize-button");
    randomizeButton.addEventListener("click", () => {
        const keys = Object.keys(websiteObject);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];
        const randomUrl = websiteObject[randomKey].url;
        window.open(randomUrl, "_blank");
    });

	// create 'load more' button div
    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Load More";
    loadMoreButton.classList.add("button");
    loadMoreButton.addEventListener("click", () => loadMore(currentIndex, websitesArray, websitesElement, loadMoreButton));

    // load initial website cards
    loadMore(currentIndex, websitesArray, websitesElement, loadMoreButton);

	// sort website cards, based on user input
    const sortDropdown = document.getElementById("sort__select");
    sortDropdown.addEventListener("change", function() {
		// if user selects 'most recent', show newest websites first
        if (sortDropdown.value === "most-recent") {
            websitesArray.sort((a, b) => b[1].created_at - a[1].created_at);
		// if user selects 'A-Z', show websites in alphabetical order
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

// if websiteArray isn't successfully received, console log an error
}).catch(error => {
    console.error('Error fetching websites:', error);
});

// function to generate website cards
function generateWebsiteCards(websitesArray, websitesElement) {
    websitesArray.forEach((websiteData, index) => {
        const websiteCard = document.createElement("div");
        websiteCard.classList.add("website");

		// number div
        const numberDiv = document.createElement("div");
        numberDiv.textContent = currentIndex + index + 1;
        numberDiv.classList.add("website__number");

		// time variables
		const uploadEpoch = websiteData[1].created_at;
 
		// info div (stores website name, description, developer name, upload date, visit button)
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("website__info");

		// developer name
        const developerElement = document.createElement("h4");
        developerElement.textContent = "Created by " + websiteData[1].developer_name;
        developerElement.classList.add("website__info__developer");
 
		// convert upload date epoch to UTC time in milliseconds, set as uploadDate
        const uploadDate = new Date(0);
        uploadDate.setUTCMilliseconds(uploadEpoch);

		// upload date element
        const uploadDateElement = document.createElement("p");
        const formattedDate = formatDateToUTCString(uploadDate);
        uploadDateElement.textContent = "Submitted on " + formattedDate;
        uploadDateElement.classList.add("website__info__upload-date");

		// developer name element
        const nameElement = document.createElement("h2");
        nameElement.textContent = websiteData[1].name;
        nameElement.classList.add("website__info__name");

		// description element
        const descriptionElement = document.createElement("h3");
        descriptionElement.textContent = websiteData[1].description;
        descriptionElement.classList.add("website__info__description");

		// link anchor tag
        const linkElement = document.createElement("a");
        linkElement.href = websiteData[1].url;
        linkElement.target = "_blank";
        linkElement.classList.add("website__info__link");

		// link button
        const linkButton = document.createElement("div");
        linkButton.innerHTML = 'Visit Website <i class="fa-solid fa-arrow-right"></i>';
        linkButton.classList.add("button");
		
		// append link button to link anchor tag
        linkElement.appendChild(linkButton);

		// append info elements to info div
        infoDiv.appendChild(developerElement);
        infoDiv.appendChild(nameElement);
        infoDiv.appendChild(descriptionElement);
        infoDiv.appendChild(uploadDateElement);
        infoDiv.appendChild(linkElement);

		// append number div and info div to website card
        websiteCard.appendChild(numberDiv);
        websiteCard.appendChild(infoDiv);

		// if time since post has been uploaded is less than 1 hour, add a 'new' badge
		const currentTime = new Date().getTime();
		const timeSinceUpload = currentTime - websiteData[1].created_at;
		if (timeSinceUpload < 3600000 ){
			// 'new' Badge
			const newBadge = document.createElement("div");
			newBadge.innerHTML = "<p>new</p>"
			newBadge.classList = "website__new-badge"
			websiteCard.appendChild(newBadge);
		}
		 
		// append website card to websites element
        websitesElement.appendChild(websiteCard);
    });
}

// function to append more website cards to websitesElement
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

// function for setting a random color
function setColor(cssVariable) {
	const hexOptions = [
		'#cc0000', '#cc1a00', '#cc3300', '#cc6600', '#cc8000',
		'#cc9900', '#b3b300', '#a6cc00', '#99cc00', '#66cc00',
		'#4dcc00', '#33cc00', '#00cc00', '#00cc4d', '#00cc66',
		'#00cccc', '#00b3e6', '#00a6cc', '#0080cc', '#0066cc',
		'#004ccc', '#000099', '#330099', '#660099', '#9900cc',
		'#b300cc', '#cc00cc', '#cc00b3', '#cc0099', '#cc007f'
	  ];
	const randomHex = Math.floor(Math.random() * hexOptions.length)
	console.log(randomHex)
	const root = document.querySelector(':root');
	root.style.setProperty(cssVariable, hexOptions[randomHex]);
}

// function to convert epoch timestamp to a UTC string
function formatDateToUTCString(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
}

// console log welcome message
console.log(
    '%cWelcome to QuirkyWeb!',
    'color:#EB741D; font-family: Courier New, sans-serif;font-size:24px; font-weight:bold; padding:4px;'
);
console.log(
    '%cWhere curiosity meets creativity!',
    'color:#EB741D; font-family: Courier New, sans-serif;font-size:16px; padding:4px;'
);