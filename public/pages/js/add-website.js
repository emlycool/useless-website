import {signOutUser, verifyAuth } from './module/auth-module.js'
import {addDocument } from './module/database-module.js'

document.addEventListener("DOMContentLoaded", function(){
    const form = document.querySelector("#website-form");
    form?.addEventListener("submit", handleNewWebsiteFormSubmit)
})

function handleNewWebsiteFormSubmit(event)
{
    event.preventDefault();
    let formdata = Object.fromEntries(new FormData(event.target));
    
    if(!formdata.url || !formdata.name){
        document.getElementById('error-message').textContent = 'Name, URL field are required';
        return;
    } 
    document.getElementById('error-message').textContent = '';

    addDocument('websites', {
        ...formdata,
        created_at: Date.now(),
        updated_at: Date.now()
    })
    window.location.href = '/websites.html'
}