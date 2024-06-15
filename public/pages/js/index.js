import { getWebsiteArray } from '../js/websites.js';

getWebsiteArray().then(websiteObject => {
    console.log(websiteObject); 

    const randomizeButton = document.getElementById('randomize-button');

    // When 'Randomize' is clicked, randomly select a website and open it in a new tab.
    randomizeButton.addEventListener('click', () => {
        const keys = Object.keys(websiteObject);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];
        const randomUrl = websiteObject[randomKey].url;
        window.open(randomUrl, '_blank');
    });

    // Generate website cards with data from websiteObject
    let websitesElement = document.getElementById("websites");
    let count = 1;
    
    Object.keys(websiteObject).forEach(key => {
        const websiteData = websiteObject[key];
      
        const websiteCard = document.createElement("div")
        websiteCard.classList.add("website")

        const numberDiv = document.createElement("div")
        numberDiv.textContent = count;
        numberDiv.classList.add("website__number");

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("website__info");

        const developerElement = document.createElement("p");
        developerElement.textContent = `Created by ${websiteData.developer_name}`;
        developerElement.classList.add("website__info__developer");

        const nameElement = document.createElement("h2");
        nameElement.textContent = websiteData.name;
        nameElement.classList.add("website__info__name");

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = websiteData.description;
        descriptionElement.classList.add("website__info__description");

        const linkElement = document.createElement("a");
        const linkButton = document.createElement("div");

        linkElement.href = websiteData.url;
        linkElement.target = "_blank";
        linkElement.classList.add("website__info__link");

        linkButton.textContent = "Visit Website";
        linkButton.classList.add("button");
        linkElement.appendChild(linkButton)

        infoDiv.appendChild(developerElement);
        infoDiv.appendChild(nameElement);
        infoDiv.appendChild(descriptionElement);
        infoDiv.appendChild(linkElement);

        websiteCard.appendChild(numberDiv);
        websiteCard.appendChild(infoDiv);

        websitesElement.appendChild(websiteCard);
        count++;

    });

}).catch(error => {
    console.error('Error fetching websites:', error);
});

