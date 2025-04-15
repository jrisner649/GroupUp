
// input validation for login form
document.querySelector('#btnLogin').addEventListener('click', (event) => {
    // retrieve the values that the user input
    const strEmail = document.querySelector('#txtEmailLogin').value
    const strPassword = document.querySelector('#txtPasswordLogin').value

    // setup regular expressions to test the input
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    const regPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g

    let blnError = false
    let strError = ''

    // if the email or password do not conform to the constraints, then an error has occurred
    if (!regEmail.test(strEmail)) {
        blnError = true
        strError += '<p>Invalid email</p>'
    }
    if (!regPassword.test(strPassword)) {
        strError += '<p>Invalid password</p>'
        blnError = true
    }

    // display the error message if there was an error
    if (blnError) {
        Swal.fire({
            title: "Oops...",
            html: strError,
            icon: "error"
          });
    }
    // else, the input is valid and we simulate a successful account registration
    else {
        Swal.fire({
            title: "Login successful!",
            icon: "success"
        })
        // Since the login was successful, we will display the main page
        .then(() => {
            document.querySelector('#divAccountPages').classList.add("d-none")
            document.querySelector('#divMainContent').classList.remove("d-none")
        })
    }

})

// handle swapping from the login form to the registration form
document.querySelector('#btnToRegister').addEventListener('click', (event) => {
    document.querySelector('#formLogin').style.display = 'none';
    document.querySelector('#formRegister').style.display = 'block';
})

// input validation for registration
document.querySelector('#btnRegister').addEventListener('click', (event) => {

    // retrieve the values that the user input
    const strFirstName = document.querySelector('#txtFirstNameRegister').value
    const strLastName = document.querySelector('#txtLastNameRegister').value
    const strEmail = document.querySelector('#txtEmailRegister').value
    const strPassword = document.querySelector('#txtPasswordRegister').value
    const strPhoneNumber = document.querySelector('#txtPhoneRegister').value
   
    // setup regular expressions to test the input
    const regFirstName = /(([A-Z]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+(([\-\'][A-Za-z]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,})+)?))/g
    const regLastName = /(([A-Z]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+(([\-\'][A-Za-z]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,})+)?))/g
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    const regPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g
    const regPhoneNumber = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/g

    

    let blnError = false
    let strError = '' // keep track what the user needs to change to make their input correct


    // ensure that the password and confirm password fields match
    const strPasswordConf = document.querySelector('#txtPasswordConfRegister').value
    if (strPassword != strPasswordConf) {
        blnError = true
        strError += '<p>The password and confirm password fields do not match.</p>'
    }

    // If any of the fields are incorrect, add a corresponding error message
    if (!regFirstName.test(strFirstName)) {
        blnError = true
        strError += '<p>Invalid first name.</p>'
    }
    if (!regLastName.test(strLastName)) {
        strError += '<p>Invalid last name.</p>'
        blnError = true
    }
    if (!regEmail.test(strEmail)) {
        strError += '<p>Invalid email.</p>'
        blnError = true
    }
    if (!regPassword.test(strPassword)) {
        strError += '<p>Invalid password.</p>'
        blnError = true
    }
    if (!regPhoneNumber.test(strPhoneNumber)) {
        strError += '<p>Invalid phone number.</p>'
        blnError = true
    }

    // display the error message if there was an error
    if (blnError) {
        Swal.fire({
            title: "Oops...",
            html: strError,
            icon: "error"
          });
    }
    // else, the input is valid and we simulate a successful account registration
    else {
        Swal.fire({
            title: "Account registration successful!",
            icon: "success"
        })
        
    }

})

// handle swapping from the registration page to the login page
document.querySelector('#btnToLogin').addEventListener('click', (event) => {
    document.querySelector('#formRegister').style.display = 'none';
    document.querySelector('#formLogin').style.display = 'block';
})

    
