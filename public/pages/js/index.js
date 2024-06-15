
import { initializeApp } from "firebase/app";

async function getAllWebsites() {
     const collectionName = "websites";
     const filterField = null;
     const filterValue = null;
     const sortField = "created_at";
     const websiteTable = document.querySelector("#website-table");
     const tbody = websiteTable.querySelector("tbody");
     await readAllDocumentsRealtime(collectionName, function(websites){
           updateTable(tbody, websites)
     });

 }
