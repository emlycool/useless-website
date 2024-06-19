import {signOutUser, verifyAuth, handleAuthChanged} from './module/auth-module.js'
import {readAllDocumentsRealtime } from './module/database-module.js'

document.addEventListener("DOMContentLoaded", function(){
    // redirect to login, if user isnt authenticated
    verifyAuth();
    updateUserInfo()
    showAnalytics();

    const logoutBtn = document.querySelector("#log-out-btn");
    logoutBtn?.addEventListener('click', handleLogOut)

})

async function updateUserInfo(){
    let userEl = document.querySelector("#user-name");
    if(userEl){
        handleAuthChanged((user) => userEl.textContent = user?.email)
       
    }
}

function handleLogOut(event){
    signOutUser()
}

function showAnalytics()
{
    let el = document.getElementById("websites-count");   
    if(el){
        readAllDocumentsRealtime("websites", function(websites){
            console.log(websites);
            el.innerHTML = Object.entries(websites).length
        })
    }
}