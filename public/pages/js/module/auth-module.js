import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut, setPersistence, browserSessionPersistence, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {firebaseConfig} from "./firebase-config.js"
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    query, 
    orderByChild, 
    equalTo,
    onValue,
  } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const database = getDatabase();

function registerUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            // ...
            handleAuthorizedSignIn(user);

        })
        .catch((error) => {
            handleRegistrationError(error)
        });
}

async function signInUser(email, password, callback)
{
    let user = null;
    let error = null

    await setPersistence(auth, browserSessionPersistence);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Signed in 
        user = userCredential.user;
        handleAuthorizedSignIn(user);
        callback(user, error);
    
    } catch (error) {
        handleSignError(error, (errorMessage, errorCode) => {
            callback(user, errorMessage)
        })
    }
}


function signOutUser() 
{
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    });
}

function handleSignError(error, callback)
{
    const errorCode = error.code;
    let errorMessage = error.message;
    switch (errorCode) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
        case 'auth/invalid-login-credentials':
            errorMessage = "Invalid credentials";
        break;

        default:
            break;
    }
    callback(errorMessage, errorCode);
}

function handleRegistrationError(error)
{
    const errorCode = error.code;
    const errorMessage = error.message;

    switch (errorCode) {
        case 'auth/weak-password':
            console.log('The password is too weak.');
            break;
        
        case 'auth/email-already-in-use':
            console.log('The email address is already in use by another account.');
        break;
    
        default:
            console.log(errorMessage);
            break;
    }
}

function handleAuthChanged(callback)
{
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}

function verifyAuth(redirect = null)
{
    onAuthStateChanged(auth, (user) => {
        handleAuthorizedSignIn(user);
        if(!user){
            window.location.href = redirect ? redirect : '/login.html'
        }
    });   
}

function handleAuthorizedSignIn(user)
{
    if(!user){
        return;
    }
    const userId = user.uid;
    const userRef = ref(database, "user_roles");

    const userQuery = query(userRef, orderByChild("user_id"), equalTo(userId));

    onValue(userQuery, (snapshot) => {
        if (snapshot.exists()) {
            let results = Object.values(snapshot.val());
            if(results.length){
                let {user_id, role} = results[0]
                if(role == "admin"){
                    return;
                }
            }
        }


        window.location.href = "/403.html"

        
    }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
    });
}

function sendUserPasswordResetEmail(email)
{
    sendPasswordResetEmail(auth, email)
    .then(() => {
        // Password reset email sent!
        // ..
        console.log("Password reset email sent!");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });

}

export {
    registerUser,
    signInUser,
    signOutUser,
    handleSignError,
    handleRegistrationError,
    handleAuthChanged,
    handleAuthorizedSignIn, 
    sendUserPasswordResetEmail,
    verifyAuth,
    getAuth
}