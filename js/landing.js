
// sign up button
document.querySelector('#btnLandingPageSignUp').addEventListener('click', () => {
    
    // hide the landing page
    document.querySelector('#divLandingPage').classList.add('d-none');

    // unhide the login/signup page
    document.querySelector('#divAccountsPage').classList.remove('d-none');
    document.querySelector('#formRegister').classList.remove('d-none');


});

// login button
document.querySelector('#btnLandingPageSignUpBottom').addEventListener('click', () => {

    // hide the landing page
    document.querySelector('#divLandingPage').classList.add('d-none');

    // unhide the signup page
    document.querySelector('#divAccountsPage').classList.remove('d-none');
    document.querySelector('#formRegister').classList.remove('d-none');

});

// login button
document.querySelector('#btnLandingPageLogin').addEventListener('click', () => {

    // hide the landing page
    document.querySelector('#divLandingPage').classList.add('d-none');

    // unhide the signup page
    document.querySelector('#divAccountsPage').classList.remove('d-none');
    document.querySelector('#formLogin').classList.remove('d-none');

});
