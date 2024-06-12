import {firebaseConfig} from "./firebase-config.js"
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    query, 
    orderByChild, 
    equalTo,
    onValue,
    push,
    get, 
    remove,
    set
  } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();

// Create
function addDocument(collectionName, document){
    const collection  = ref(database, collectionName);

    push(
        collection,
        document
    );
}

// Read
function readDocumentRealtime(collectionName, documentId, callback){
    const docRef = ref(database, `${collectionName}/${documentId}`);
    onValue(docRef, (snapshot) => {
        callback(snapshot.val());
    });
}

async function readDocument(collectionName, documentId){
    const docRef = ref(database, `${collectionName}/${documentId}`);
    const snapshot = await get(docRef);
    return snapshot.val();
}


// Update
function updateDocument(collectionName, documentId, updatedDocument){
    const docRef = ref(database, `${collectionName}/${documentId}`);
    set(docRef, updatedDocument);
}

// Delete
async function deleteDocument(collectionName, documentId){

    const docRef = ref(database, `${collectionName}/${documentId}`);
    remove(docRef);
}

// Read All Documents
async function readAllDocuments(collectionName, filterField = null, filterValue = null, sortField = null){
    let collectionRef = ref(database, collectionName);
    let documents = [];
    if(filterField && filterValue){
        collectionRef = query(collectionRef, orderByChild(filterField), equalTo(filterValue));
    }
    if(sortField){
        collectionRef = query(collectionRef, orderByChild(sortField));
    }
    const snapshot = await get(collectionRef);
    if (snapshot.exists()) {
        // console.log(snapshot.val());
        documents = snapshot.val();
    }
    return documents;
}

function readAllDocumentsRealtime(collectionName, callback, filterField = null, filterValue = null, sortField = null){
    let collectionRef = ref(database, collectionName);
    let documents = [];
    if(filterField && filterValue){
        collectionRef = query(collectionRef, orderByChild(filterField), equalTo(filterValue));
    }
    if(sortField){
        collectionRef = query(collectionRef, orderByChild(sortField));
    }
    onValue(collectionRef, (snapshot) => {
        if (snapshot.exists()) {
            documents = snapshot.val();
            callback(documents)
        }
    });
    return documents;
}


// Count Documents
async function countDocuments(collectionName)
{
    let count = 0;
    const collectionRef = ref(database, collectionName);
    const snapshot = await get(collectionRef);
    if (snapshot.exists()) {
        count = Object.keys(snapshot.val()).length;
    } 
    return count;
}


export {
    addDocument,
    readAllDocuments,
    readAllDocumentsRealtime,
    readDocumentRealtime,
    readDocument,
    updateDocument,
    deleteDocument,
    countDocuments
}