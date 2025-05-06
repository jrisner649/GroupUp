/*
    This file contains fetch functions that will be used to fetch info from the API.
    For now, we will simply use sample data to exhibit the functionalities of the website.
*/

const baseURL = "http://localhost:8000"

async function fetchProjectLeaderSurveys(strGroupID) {
    console.log('Fetching surveys for group:', strGroupID, 'session_id:', strSessionID);
    try {
        const response = await fetch(`${baseURL}/GroupUp/survey?session_id=${strSessionID}&group_id=${strGroupID}`);
        console.log('Survey fetch response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Survey fetch error:', errorData);
            Swal.fire('Error', errorData.message || 'Failed to fetch surveys', 'error');
            throw new Error(errorData.message || 'Failed to fetch surveys');
        }
        const surveys = await response.json();
        console.log('Survey fetch success:', surveys);
        return surveys;
    } catch (error) {
        console.error('Error fetching surveys:', error);
        return [];
    }
}

// Function to fetch the projects the user is a leader of
// This function will be called when the user clicks on the "Projects" button in the menu panel
async function fetchUserProjects() {
    console.log('Fetching user projects, session_id:', strSessionID);
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

        const data = await response.json();
        console.log('User projects fetch success:', data);
        return data;
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return [];
    }
}

// This function will be called when the user clicks on the "Groups" button in the menu panel while in the Project Management Page
async function fetchProjectGroups() {
    console.log('Fetching project groups, project_id:', strCurrentProjectID, 'session_id:', strSessionID);
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
        const data = await response.json();
        console.log('Project groups fetch success:', data);
        return data;
    }
    catch (error) {
        console.error('Error fetching project groups:', error);
        return [];
    }
}

async function fetchUserGroups() {
    console.log('Fetching user groups, session_id:', strSessionID);
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
        const data = await response.json();
        console.log('User groups fetch success:', data);
        return data;
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
    console.log('Fetching group member info for group:', strCurrentGroupId, 'session_id:', strSessionID);
    try {
        const response = await fetch(baseURL + `/GroupUp/groupMembers?session_id=${strSessionID}&group_id=${strCurrentGroupId}`);
        console.log('Group members fetch response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Group members fetch error:', errorData);
            Swal.fire('Error', errorData.message || 'Failed to fetch group members', 'error');
            throw new Error(errorData.message || 'Failed to fetch group members');
        }
        const members = await response.json();
        console.log('Group members fetch success:', members);
        return members;
    } catch (error) {
        console.error('Error fetching group members:', error);
        return [];
    }
}