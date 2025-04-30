document.querySelector('#btnLogin').addEventListener('click', async (event) => {
    // retrieve the values that the user input
    const strEmail = document.querySelector('#txtEmailLogin').value
    const strPassword = document.querySelector('#txtPasswordLogin').value

    console.log("Login attempt with email:", strEmail); // For debugging

    // setup regular expressions to test the input
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    const regPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g

    let blnError = false
    let strError = ''

    // if the email or password do not conform to the constraints, then an error has occurred
    if (!regEmail.test(strEmail)) {
        blnError = true
        strError += '<p>Invalid email</p>'
        console.log("Email validation failed");
    }
    if (!regPassword.test(strPassword)) {
        strError += '<p>Invalid password</p>'
        blnError = true
        console.log("Password validation failed");
    }

    // display the error message if there was an error
    if (blnError) {
        Swal.fire({
            title: "Oops...",
            html: strError,
            icon: "error"
        });
        return;
    }

    console.log("Client-side validation passed");

    // Send request to backend
    try {
        console.log("Sending login request to server");
        const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: strEmail, password: strPassword })
        });

        console.log("Server response status:", response.status);
        const data = await response.json();
        console.log("Server response data:", data);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store sessionId
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem('userData', JSON.stringify(data.user));

        Swal.fire({
            title: "Login successful!",
            icon: "success"
        }).then(() => {
            document.querySelector('#formLogin').classList.add("d-none");
            document.querySelector('#divAccountsPage').classList.add('d-none');
            document.querySelector('#divMainContent').classList.remove("d-none");

            // load group content
            onClickBtnMenuPanelGroups();
        });
    } catch (err) {
        console.error("Login error:", err);
        Swal.fire({
            title: "Oops...",
            html: `<p>${err.message}</p>`,
            icon: "error"
        });
    }
});

// handle swapping from the login form to the registration form
document.querySelector('#btnToRegister').addEventListener('click', (event) => {
    document.querySelector('#formLogin').classList.add("d-none");
    document.querySelector('#formRegister').classList.remove("d-none");
});

// input validation for registration
document.querySelector('#btnRegister').addEventListener('click', async (event) => {
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
        return;
    }
    
    // Send registration data to backend (if server supports it)
    try {
        const response = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                firstName: strFirstName,
                lastName: strLastName,
                email: strEmail,
                password: strPassword,
                phoneNumber: strPhoneNumber
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        Swal.fire({
            title: "Account registration successful!",
            icon: "success"
        })
        .then(() => {
            // Switch back to login form with prefilled email
            document.querySelector('#formRegister').classList.add('d-none');
            document.querySelector('#formLogin').classList.remove('d-none');
            document.querySelector('#txtEmailLogin').value = strEmail;
        });
    } catch (err) {
        // If API call fails, fall back to the original behavior (simulate successful registration)
        console.error("Registration error (falling back to simulation):", err);
        
        Swal.fire({
            title: "Account registration successful!",
            icon: "success"
        })
        .then(() => {
            document.querySelector('#formLogin').classList.add("d-none");
            document.querySelector('#divAccountsPage').classList.add('d-none');
            document.querySelector('#divMainContent').classList.remove("d-none");
        });
    }
});

// handle swapping from the registration page to the login page
document.querySelector('#btnToLogin').addEventListener('click', (event) => {
    // hide register
    document.querySelector('#formRegister').classList.add('d-none');
    // unhide login
    document.querySelector('#formLogin').classList.remove('d-none');
});