
// sign up button
document.querySelector('#btnLandingPageSignUp').addEventListener('click', () => {
    console.log("sign up button clicked");
    fetch('http://localhost:8000/signUp')
    .then(response => response.text())
    .then(html => {
        document.querySelector('#divLandingPage').classList.add('d-none');
        document.querySelector('#divSignUp').innerHTML = html;
        document.querySelector('#divSignUp').classList.remove('d-none');

    })
    .catch(error => {
        console.error('Error fetching the sign-up page:', error);
    });
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
