document.querySelector('#btnRegister').addEventListener('click', (event) => {
    const strFirstName = document.querySelector('#txtFirstNameRegister').value
    const strLastName = document.querySelector('#txtLastNameRegister').value
    const strEmail = document.querySelector('#txtEmailRegister').value
    const strPassword = document.querySelector('#txtPasswordRegister').value
    const strPhoneNumber = document.querySelector('#txtPhoneRegister').value
   
    const regFirstName = /(([A-Z]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+(([\-\'][A-Za-z]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,})+)?))/g
    const regLastName = /(([A-Z]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+(([\-\'][A-Za-z]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,})+)?))/g

    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    const regPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g
    const regPhoneNumber = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/g

    let blnError = false

    if (!regFirstName.test(strFirstName)) {
        blnError = true
    }
    if (!regLastName.test(strLastName)) {
        blnError = true
    }
    if (!regEmail.test(strEmail)) {
        blnError = true
    }
    if (!regPassword.test(strPassword)) {
        blnError = true
    }
    if (!regPhoneNumber.test(strPhoneNumber)) {
        blnError = true
    }


    if (blnError) {
        console.log('You have an error')
    }
    else {
        console.log('No errors')
    }

})

document.querySelector('#btnLogin').addEventListener('click', (event) => {
    const strEmail = document.querySelector('#txtEmailLogin').value
    const strPassword = document.querySelector('#txtPasswordLogin').value

    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    const regPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g

    let blnError = false
    if (!regEmail.test(strEmail)) {
        blnError = true
    }
    if (!regPassword.test(strPassword)) {
        blnError = true
    }

    if (blnError) {
        console.log('You have an error')
    }
    else {
        console.log('No errors')
    }

})


    
