// Add a wrapper div for displaying the group members
let divGroupMembersWrapper = document.createElement("div")
divGroupMembersWrapper.setAttribute('class', 'd-flex justify-content-center flex-column align-items-center')
divGroupMembersWrapper.setAttribute('id', 'divGroupMembersWrapper')
document.querySelector('#divDashboard').appendChild(divGroupMembersWrapper)


// Add the header
let objGroupMembersHeader = document.createElement("h1")
objGroupMembersHeader.innerHTML = 'Group Members'
objGroupMembersHeader.setAttribute('class', 'mt-4')
document.querySelector('#divGroupMembersWrapper').appendChild(objGroupMembersHeader)

// First test out adding the info manually, then create a func to do it
// let h3Franklin = document.createElement('h4')
// h3Franklin.innerHTML = 'Franklin Doane'
// let pFranklinDiscord = document.createElement('p')
// pFranklinDiscord.innerHTML = '@cooldude'

// let h3Seth = document.createElement('h4')
// h3Seth.innerHTML = 'Seth Risner'
// let pSethDiscord = document.createElement('p')
// pSethDiscord.innerHTML = '@littlebison11'


// document.querySelector('#divGroupMembersWrapper').appendChild(h3Franklin)
// document.querySelector('#divGroupMembersWrapper').appendChild(pFranklinDiscord)
// document.querySelector('#divGroupMembersWrapper').appendChild(h3Seth)
// document.querySelector('#divGroupMembersWrapper').appendChild(pSethDiscord)


const testData = [
    {
        name: 'Franklin Doane',
        contactInfo: {
            discord: '@cooldude',
            email: '@fgdoane42@tntech.edu'
        }
    },
    {
        name: 'Seth Risner',
        contactInfo: {
            discord: '@cooldude1',
            email: '@jsrisner42@tntech.edu'
        }
    },
    {
        name: 'Jacob McMurray',
        contactInfo: {
            discord: '@cooldude2',
            email: '@jmmcmurray42@tntech.edu'
        }
    }
]

displayGroupMembers(testData)

// function accepts a JSON obj from the API that contains information on each group member
function displayGroupMembers(arrGroupData) {
    arrGroupData.forEach(member => {
        let objMemberNameHeader = document.createElement('h4')
        objMemberNameHeader.innerHTML = member.name
        document.querySelector('#divGroupMembersWrapper').appendChild(objMemberNameHeader)

        // iterate over each available contact method
        Object.keys(member.contactInfo).forEach(key => {
            console.log(key + ' - ' + member.contactInfo[key])
            let objContactMethod = document.createElement('p')
            objContactMethod.innerHTML = `${key}: ${member.contactInfo[key]}` // the key is the name of the contact method (e.g. Discord), and the value is their specific username
            document.querySelector('#divGroupMembersWrapper').appendChild(objContactMethod) // we add the info to the list
        })
    });
}