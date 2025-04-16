// Sign out button
document.querySelector('#btnSignOut').addEventListener('click', () => {
    // Fire a sweet alert that asks them if they are sure they want to sign out
    Swal.fire({
        title: "Are you sure you want to sign out?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "I'm sure",
      }).then((result) => {
        // If the user pressed confirm, we want to sign them out by bringing them to the landing page
        if (result.isConfirmed) {
          document.querySelector('#divMainContent').classList.add("d-none")
          document.querySelector('#divAccountsPage').classList.add("d-none")
          document.querySelector("#divLandingPage").classList.remove("d-none")
        } 
    });
})