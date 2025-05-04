/*
    This file contains fetch functions that will be used to fetch info from the API.
    For now, we will simply use sample data to exhibit the functionalities of the website.
*/

const baseURL = "http://localhost:8000"

async function fetchProjectSurveys() {
    try {
        const response = await fetch(baseURL + `/GroupUp/Surveys?session_id=${strSessionID}&project_id=${strCurrentProjectID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                title: "Oops...",
                html: `<p>${errorData.error}</p>`,
                icon: "error"
            });
            throw new Error(errorData.error);
        }
        const arrSurveys = await response.json(); // Parse the response body as JSON
        console.log(arrSurveys); // Log the fetched data
        return arrSurveys; // Return the fetched data
    }
    catch (error) {
        console.error('Error fetching project leader surveys:', error);
        return []; // Return an empty array in case of an error
    }
}

// Function to fetch the projects the user is a leader of
// This function will be called when the user clicks on the "Projects" button in the menu panel
async function fetchUserProjects() {
    try {
        const response = await fetch(baseURL + `/GroupUp/Projects?session_id=${strSessionID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                title: "Oops...",
                html: `<p>${errorData.error}</p>`,
                icon: "error"
            });
            throw new Error(errorData.error);
        }

        const data = await response.json(); // Parse the response body as JSON
        console.log(data); // Log the fetched data
        return data; // Return the fetched data
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return []; // Return an empty array in case of an error
    }
}

// This function will be called when the user clicks on the "Groups" button in the menu panel while in the Project Management Page
async function fetchProjectGroups() {
    try {
        const response = await fetch(baseURL + `/GroupUp/Projects/Groups?session_id=${strSessionID}&project_id=${strCurrentProjectID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                title: "Oops...",
                html: `<p>${errorData.error}</p>`,
                icon: "error"
            });
            throw new Error(errorData.error);
        }
        const data = await response.json(); // Parse the response body as JSON
        console.log(data); // Log the fetched data
        return data; // Return the fetched data
    }
    catch (error) {
        console.error('Error fetching project groups:', error);
        return []; // Return an empty array in case of an error
    }
}

async function fetchUserGroups() {
    try {
        const response = await fetch(baseURL + `/GroupUp/Groups?session_id=${strSessionID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                title: "Oops...",
                html: `<p>${errorData.error}</p>`,
                icon: "error"
            });
            throw new Error(errorData.error);
        }
        const data = await response.json(); // Parse the response body as JSON
        console.log(data); // Log the fetched data
        return data; // Return the fetched data
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

async function fetchFeedback() {
    try {
        const response = await fetch(baseURL + `/GroupUp/Groups/Feedback?session_id=${strSessionID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                title: "Oops...",
                html: `<p>${errorData.error}</p>`,
                icon: "error"
            });
            throw new Error(errorData.error);
        }
        const data = await response.json(); // Parse the response body as JSON
        console.log(data); // Log the fetched data
        return data; // Return the fetched data
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null; 
    }
}


async function fetchGroupMemberInfo() {
    console.log("Fetching group member info...");
    // try {
    //     const response = await fetch(baseURL + '/group-member-info'); // Replace with actual API endpoint
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok' + response.statusText);
    //     }
    //     const data = await response.json();
    //     return data;
    // }
    // catch (error) {
    //     console.error('There was a problem with the fetch operation:', error);
    //     return null;
    // }
}


