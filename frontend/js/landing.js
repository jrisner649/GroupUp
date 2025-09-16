const URL = 'http://localhost:8000';

// sign up button
document.querySelector('#btnLandingPageSignUp').addEventListener('click', () => {
    console.log("sign up button clicked");
    fetch('/component/signUp')
    .then(response => response.text())
    .then(html => {
        document.querySelector('#divMainContent').innerHTML = html
    })
    .catch(error => {
        console.error('Error fetching the sign-up page:', error);
    });
});

// login button
document.querySelector('#btnLandingPageSignUpBottom').addEventListener('click', () => {

    // hide the landing page
    // document.querySelector('#divLandingPage').classList.add('d-none');

    // fetch the login page
    fetch(URL + '/component/signUp')
    .then(response => response.text())
    .then(html => {
        document.body.innerHTML = html
    })
    // document.querySelector('#formLogin').classList.remove('d-none');

});

// login button
document.querySelector('#btnLandingPageLogin').addEventListener('click', () => {

    // hide the landing page
    document.querySelector('#divLandingPage').classList.add('d-none');

    // fetch the login page
    fetch(URL + '/component/login')
    .then(response => response.text())
    .then(html => {
        document.body.innerHTML = html
    })
    document.querySelector('#formLogin').classList.remove('d-none');

});
