import {signOutUser, verifyAuth, handleAuthChanged} from './module/auth-module.js'

document.addEventListener("DOMContentLoaded", function(){
    // redirect to login, if user isnt authenticated
    verifyAuth();
    updateUserInfo()

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
    console.log("hit");
    signOutUser()
}