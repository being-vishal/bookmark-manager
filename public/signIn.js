//Sign-IN with Google
const signInWithGoogleBtn = document.getElementById('signInWithGoogleBtn');
var provider = new firebase.auth.GoogleAuthProvider();
const signInWithGoogle = () => {
    auth.signInWithPopup(provider)
    .then((result) => {
        user = result.user;
        location = "app.html";
    }).catch((error) => {
        var errorCode = error.code;
        console.log(errorCode);
        alert('Oops! there was some problem with signing up :( Please try after some time.')
    });
}
signInWithGoogleBtn.addEventListener('click',signInWithGoogle);


//Navbar
const navToggler = document.querySelector(".nav-toggler");
navToggler.addEventListener("click", navToggle);
function navToggle() {
   navToggler.classList.toggle("active");
   const nav = document.querySelector(".nav");
   nav.classList.toggle("open");
   if(nav.classList.contains("open")){
       nav.style.maxHeight = nav.scrollHeight + "px";
   }
   else{
       nav.removeAttribute("style");
   }
} 


//Go to Top 
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
  