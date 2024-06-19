import {readDocumentRealtime, updateDocument, readDocument } from './module/database-module.js'

document.addEventListener("DOMContentLoaded", function(){
    const form = document.querySelector("#website-form");

    let url = window.location.href;
    const websiteKey = getQueryParam(url, "website");
    if(!websiteKey){
        window.location.href = '/404.html';
    }
    form?.addEventListener("submit", (event) => handleUpdateWebsiteFormSubmit(event, websiteKey))

    loadFormData(websiteKey, form);

})

function getQueryParam(url, param) {
    let urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get(param);
}

async function handleUpdateWebsiteFormSubmit(event, websiteKey)
{
    event.preventDefault()
    let formdata = Object.fromEntries(new FormData(event.target));
    
    if(!formdata.url || !formdata.name){
        document.getElementById('error-message').textContent = 'Name, URL field are required';
        return;
    } 
    document.getElementById('error-message').textContent = '';

    let website = await readDocument("websites", websiteKey);

    let updatedDocument = {
        ...website,
        ...formdata,
        updated_at: Date.now()
    };

    try {
        updateDocument('websites', websiteKey, updatedDocument)
        document.getElementById('success-message').textContent = "Updated successully!"
        setTimeout(() => {
            document.getElementById('success-message').textContent = ""
        }, 3000);
    } catch (error) {
        console.log(error);
    }


}

function loadFormData(websiteKey, form)
{
    readDocumentRealtime("websites", websiteKey, (website) => {
        console.log(form);
        if(!website){
            window.location.href = '/404.html';
        }

        form.querySelector("[name='name']").value = website.name;
        form.querySelector("[name='description']").value = website.description;
        form.querySelector("[name='url']").value = website.url;
        form.querySelector("[name='developer_name']").value = website.developer_name || '';
    });
}