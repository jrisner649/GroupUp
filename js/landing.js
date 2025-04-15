// Add event listeners for all 3 buttons on the landing page
document.querySelector('#btnLandingPageSignUp').addEventListener('click', onClickBtnSignUp)
document.querySelector('#btnLandingPageSignUpBottom').addEventListener('click', onClickBtnSignUp)
document.querySelector('#btnLandingPageLogin').addEventListener('click', () => {
    document.querySelector('#divLandingPage').style = "display: none;"      // hide the landing page
    document.querySelector('#formRegister').style = "display: none;"       // show the registration form
    document.querySelector('#formLogin').style = "display: block;"           // hide the login form
    document.querySelector('#divAccountPages').classList.remove("d-none")   // use d-none class instead of style because style was not working for some reason :)
})

// Will execute both when the bottom sign up button and top right sign up button are clicked
// This function brings up the registration form
function onClickBtnSignUp() {
    document.querySelector('#divLandingPage').style = "display: none;"      // hide the landing page
    document.querySelector('#formLogin').style = "display: none;"           // hide the login form
    document.querySelector('#formRegister').style = "display: block;"       // show the registration form
    document.querySelector('#divAccountPages').classList.remove("d-none")   // use d-none class instead of style because style was not working for some reason :)
}