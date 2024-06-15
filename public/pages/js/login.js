import {handleAuthChanged, signInUser } from './module/auth-module.js'

document.addEventListener("DOMContentLoaded", function(){
    "use strict";

    // redirect user to dashboard if signed in
    handleAuthChanged(user => {
        if (user) {
            window.location.href = '/index'
            return;
        }
        document.querySelector("#login-content")?.classList.remove("w3-hide");
    })

    const LoginForm = document.querySelector("#login-form");
    LoginForm?.addEventListener("submit", handleLoginSubmit);
});




function handleLoginSubmit(event)
{
    event.preventDefault()
    let formdata = Object.fromEntries(new FormData(event.target));

    // Validation
    if (!formdata.email || !formdata.password) {
        document.getElementById('error-message').textContent = 'All fields are required';
        return;
    }

    signInUser(formdata.email, formdata.password, (user, error) => {
        if(error){
            document.getElementById('error-message').textContent = error;
        }
    })
}