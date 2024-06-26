import {signOutUser, verifyAuth } from './module/auth-module.js'
import {deleteDocument, readAllDocumentsRealtime } from './module/database-module.js'

document.addEventListener("DOMContentLoaded", function(){
 getAllWebsites();
})

async function getAllWebsites() {
    const collectionName = "websites";
    const filterField = null;
    const filterValue = null;
    const sortField = "created_at";
    const websiteTable = document.querySelector("#website-table");
    if(!websiteTable){
        return;
    }
    const tbody = websiteTable.querySelector("tbody");
    await readAllDocumentsRealtime(collectionName, function(websites){
        updateTable(tbody, websites)
    });
}

async function getWebsiteArray() {
    const collectionName = "websites";
    const websites = await new Promise((resolve, reject) => {
        readAllDocumentsRealtime(collectionName, function(websites) {
            resolve(websites);
        });
    });
    return websites;
}

function updateTable(tbody, websites)
{
    // Clear existing rows
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Append new rows
    for (const [key, website] of Object.entries(websites)) {
        const row = document.createElement("tr");
        
        // name
        const nameCell = document.createElement("td");
        nameCell.textContent = website.name;
        row.appendChild(nameCell);

        // url
        const urlCell = document.createElement("td");
        urlCell.textContent = website.url;
        row.appendChild(urlCell);

        // last modified
        const updatedAtCell = document.createElement("td");
        updatedAtCell.textContent = new Date(website.updated_at).toLocaleString();
        row.appendChild(updatedAtCell);

        const actionCell = document.createElement("td");
        const editButton = document.createElement("a")
        const deleteButton = document.createElement("button")
        editButton.className = "w3-button w3-green";
        editButton.textContent = "Edit";
        editButton.href = "/edit-website.html?website=" + key
        deleteButton.className = "w3-button w3-red";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.website = key;
        deleteButton.addEventListener("click", handleWebsiteDeleteAction)
        
        actionCell.appendChild(editButton)
        actionCell.appendChild(deleteButton)

        row.appendChild(actionCell);

        tbody.appendChild(row);
    }
}

function handleWebsiteDeleteAction(event) {
    let button = event.target;
    let websiteKey = button.dataset.website;
    let confirmation = confirm("Are you sure you want to delete this website?");
    if (confirmation) {
        deleteDocument("websites", websiteKey);
    }
}

export {
    getWebsiteArray
}