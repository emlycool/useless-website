import { getWebsiteArray } from "../js/websites.js";
import { randomColor } from "./randomColor.js";

// setting website index
let currentIndex = 0;
// randomly setting website color
document.querySelector(":root").style.setProperty("--randomColor", randomColor());

// once website array is retrieved, do the following
getWebsiteArray().then(websiteObject => {

	// set the randomize button
	const randomizeButton = document.getElementById("randomize-button")
	randomizeButton.addEventListener("click", () => {
		let randomUrl = getRandomUrl(websiteObject)
		window.open(randomUrl, "_blank");
	});

	// initialize setup
	const websitesArray = Object.entries(websiteObject).sort((a, b) => b[1].created_at - a[1].created_at); // Initial sorting (by most recent)
	const websitesElement = document.getElementById("websites");
	websitesElement.innerHTML = ""

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
		// if user selects 'most recent', sort websitesArray by most recent
		if (sortDropdown.value === "most-recent") {
			websitesArray.sort((a, b) => b[1].created_at - a[1].created_at);
		// if user selects 'A-Z', sort websitesArray in alphabetical order
		} else if (sortDropdown.value === "alphabetical") {
			websitesArray.sort((a, b) => {
				const nameA = a[1].name.toUpperCase().replace(/^the\s+/, '');;
				const nameB = b[1].name.toUpperCase().replace(/^the\s+/, '');;
				if (nameA < nameB) return -1;
				if (nameA > nameB) return 1;
				return 0;
			});
		}
		// reset index and websitesElement
		currentIndex = 0;
		websitesElement.innerHTML = "";
		// load some cards with newly sorted arrway
		loadMore(currentIndex, websitesArray, websitesElement, loadMoreButton);
	});

	// if websiteArray isn't successfully received, console log an error
}).catch(error => {
	console.error('Error fetching websites:', error);
});

// function to retrieve a random url
function getRandomUrl(websiteObject){
	const keys = Object.keys(websiteObject);
	const randomIndex = Math.floor(Math.random() * keys.length);
	const randomKey = keys[randomIndex];
	return websiteObject[randomKey].url;
}

// function to generate website cards
function generateWebsiteCards(websitesArray, websitesElement) {
	websitesArray.forEach((websiteData, index) => {
		const websiteCard = document.createElement("article");
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
		const developerElement = document.createElement("h3");
		developerElement.innerHTML = "Created by " + websiteData[1].developer_name;
		developerElement.classList.add("website__info__developer");

		// convert upload date epoch to UTC time in milliseconds, set as uploadDate
		const uploadDate = new Date(0);
		uploadDate.setUTCMilliseconds(uploadEpoch);

		// upload date element
		const uploadDateElement = document.createElement("p");
		const formattedDate = formatEpochToUTCString(uploadDate);
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
		linkButton.innerHTML = "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> Visit Website";
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

		// if time since post has been uploaded is less than 12 hours, add a 'new' badge
		const currentTime = new Date().getTime();
		const timeSinceUpload = currentTime - websiteData[1].created_at;
		if (timeSinceUpload < 43200000) /* 12 hours in milliseconds */ {
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

// function to load and append more website cards to websitesElement
function loadMore(index, websitesArray, websitesElement, loadMoreButton) {
	const nextIndex = index + 4; // Load 4 results at a time
	const remainingWebsites = websitesArray.slice(index, nextIndex);
	generateWebsiteCards(remainingWebsites, websitesElement);
	currentIndex = nextIndex;
	// If currentIndex surpasses number of total websites, hide loadMoreButton
	if (currentIndex >= websitesArray.length) {
	 	loadMoreButton.style.display = "none";
	// Else, display the loadMoreButton
	} else {
		loadMoreButton.style.display = "block";
	}
	websitesElement.appendChild(loadMoreButton);
}

// function to convert epoch timestamp to a UTC string
function formatEpochToUTCString(date) {
	const day = String(date.getUTCDate()).padStart(2, "0");
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	const month = monthNames[date.getUTCMonth()];
	const year = date.getUTCFullYear();
	return `${month} ${day}, ${year}`;
}

// console log welcome message
console.log(
	"%cWelcome to QuirkyWeb!",
	"font-family: Courier New, sans-serif;font-size:28px; font-weight:bold; padding:4px;"
);