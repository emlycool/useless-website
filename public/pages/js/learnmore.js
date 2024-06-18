import { getWebsiteArray } from "../js/websites.js";
import { randomColor } from "./randomColor.js";

// randomly setting website color
document.querySelector(":root").style.setProperty("--randomColor", randomColor());

// once website array is retrieved, do the following
getWebsiteArray().then(websiteObject => {
	// randomize button
	const randomizeButton = document.getElementById("randomize-button")
	randomizeButton.addEventListener("click", () => {
		let randomUrl = getRandomUrl(websiteObject)
		window.open(randomUrl, "_blank");
	});
    // Attentive
        setTimeout(function () {
            let learnMoreText = document.getElementById("learn-more");
            let textContent = learnMoreText.innerHTML;
            let lastIndex = textContent.lastIndexOf("QuirkyWeb");
            let randomIndex = Math.floor(Math.random() * 7);
            learnMoreText.innerHTML = textContent.substring(0, lastIndex) + "<span id=\"attentive\" class=\"attentive\">QuirkyWeb</span>" + textContent.substring(lastIndex + 9);
            document.getElementById("attentive").addEventListener("click", function () {
                learnMoreText.innerHTML = `<img id=\"attentive-webp\"class=\"attentive-webp attentive-hidden\"src=\"/public/pages/resources/imgs/attentive/attentive${randomIndex + 1}.webp\">`
                setTimeout(function() {
                    document.getElementById("attentive-webp").classList.remove("attentive-hidden");
                }, 1) // 1ms (to trigger the transition)
            });
        }, 300000); // 5 minutes in milliseconds

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

// console log welcome message
console.log(
	"%cWelcome to QuirkyWeb!",
	"font-family: Courier New, sans-serif;font-size:28px; font-weight:bold; padding:4px;"
);