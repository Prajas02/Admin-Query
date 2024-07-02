// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCA_bcxdGzaJX_-NxVSb8Hf5cd-g0lsvM0",
    authDomain: "admin-query-page.firebaseapp.com",
    projectId: "admin-query-page",
    storageBucket: "admin-query-page.appspot.com",
    messagingSenderId: "596094075160",
    appId: "1:596094075160:web:5c5e05f2e5e31789115e6d"
};

// initialise authentication

const app = initializeApp(firebaseConfig)

//creating a show message function

function showMessage(messageTitle, messageBody) {
    const popup = document.getElementById('popup')
    document.getElementById('messageTitle').innerText = messageTitle;
    document.getElementById('messageBody').innerText = messageBody;
    popup.classList.add('active')
}

const closeBtn = document.getElementById('closeBtn')
closeBtn.addEventListener('click', () => {
    const popup = document.getElementById('popup')
    popup.classList.remove('active')
})

// craeting the signin functionality
const userloginbtn = document.getElementById('userloginbtn')
userloginbtn.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('LogInEmail').value;
    const password = document.getElementById('LogInPassword').value;
    const auth = getAuth()

    signInWithEmailAndPassword(auth, email, password)
        .then((UserCredential) => {
            showMessage('Login Succesfull', 'You are Logined as Admin. Remember to signout completly after work.');
            setTimeout(() => {
                window.location.replace('user')
            }, 2000)
        })
        .catch((error) => {
            if (error.code == 'auth/invalid-email') {
                showMessage('Login Unsuccessful', 'Please Enter Your Email Address.')
            }
            else if (error.code == 'auth/missing-password') {
                showMessage('Login Unsuccessful', 'Please Enter Your Password.')
            }
            else if (error.code == 'auth/invalid-credential') {
                showMessage('Login Unsuccessful', 'Please Enter Your Correct Credentials.')
            }
            else if (error.code == 'auth/network-request-Failed') {
                showMessage('Login Unsuccessful', 'Please Check Your Network Connection')
            }
        })
})

// creating a logout functionality
const logoutbtn = document.getElementById('logoutbtn')
logoutbtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log("User Signed Out Successfully!")
        window.location.replace('login');
    } catch (error) {
        console.log(error.code);
    }
})