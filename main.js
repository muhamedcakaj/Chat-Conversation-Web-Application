class User {
    constructor(id, name, surname, inboxPersonArray) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.inboxPersonArray = inboxPersonArray;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }

    getSurname() {
        return this.surname;
    }
    getInboxPersonArray() {
        return this.getInboxPersonArray;
    }
    addElementToInboxPersonArray(element) {
        this.inboxPersonArray.push = element;
    }
}
class Inbox {
    constructor(firstUserName, SecondUserName, inboxMessagesArray) {
        this.firstUserName = firstUserName;
        this.SecondUserName = SecondUserName;
        this.inboxMessagesArray = inboxMessagesArray;

    }
    getId() {
        return this.firstUserName + this.SecondUserName;
    }
    getFirstUserName() {
        return this.firstUserName;
    }
    getSecondUserName() {
        return this.SecondUserName;
    }
    getInboxMessagesArray() {
        return this.inboxMessagesArray;
    }
    addElementToInboxMessagesArray(element) {
        this.inboxMessagesArray.push(element);
    }
    printTheElementOfInboxMessagesArray() {
        for (let i of this.inboxMessagesArray) {
            console.log(i);
        }
    }
    saveInboxMessagesToLocal() {
        localStorage.setItem('inboxMessages_' + this.getId(), JSON.stringify(this.inboxMessagesArray));
    }

    loadInboxMessagesFromLocal() {
        const storedMessages = localStorage.getItem('inboxMessages_' + this.getId());

        if (storedMessages) {
            this.inboxMessagesArray = JSON.parse(storedMessages);
        }
    }
}
const peopleArray = [];
const inboxArray = [];
function main(event) {
    event.preventDefault();
    var loginId = document.getElementById("loginId").value;
    var loginName = document.getElementById("loginName").value;
    var loginSurname = document.getElementById("loginSurname").value;

    var signupId = document.getElementById("signupId").value;
    var signupName = document.getElementById("signupName").value;
    var signupSurname = document.getElementById("signupSurname").value;

    if (loginId) {
        if (checkIfUserExistInArray(loginId)) {
            document.getElementById("loginForm").style.display = 'none';
            document.getElementById("signupForm").style.display = 'none';
            document.getElementById("additionalContent").style.display = 'block';
            //=======================================================================
            document.getElementById("loggedInId").innerHTML = loginId;
            document.getElementById("loggedInName").innerHTML = loginName;
            document.getElementById("loggedInSurname").innerHTML = loginSurname;
        } else {
            alert("The user does't exists please sing up and try again");
        }
    } else if (signupId) {
        peopleArray.push(new User(signupId, signupName, signupSurname));
        saveDataToLocal()
        alert("Log in again to get to the Main Page");
    }
}
function openInbox() {
    document.getElementById("additionalContent").style.display = 'none';
    document.getElementById("inboxOverlay").style.display = 'block';
}
function openSearch() {
    document.getElementById("searchOverlay").style.display = 'block';
}
function closeSearchButton() {
    document.getElementById("searchOverlay").style.display = 'none';
    let unorderedList = document.getElementById("searchResults");

    while (unorderedList.firstChild) {
        unorderedList.removeChild(unorderedList.firstChild);
    }
}
function searchButton() {
    let theNameToBeSearched = document.getElementById("searchInput").value;
    let unorderedList = document.getElementById("searchResults");

    for (let i of peopleArray) {
        if (i.getName().toLowerCase().includes(theNameToBeSearched.toLowerCase())) {
            let startConversationButton = document.createElement("button");
            startConversationButton.type = "submit";
            startConversationButton.textContent = "Start Conversation";
            startConversationButton.id = i.getId();
            startConversationButton.onclick = function () {
                startConversation(startConversationButton.id);
            }
            let listItem = document.createElement("li");
            listItem.id = i.getId();
            listItem.textContent = i.getName() + " " + i.getSurname();
            listItem.appendChild(startConversationButton);

            unorderedList.appendChild(listItem);
        }
    }
}
function startConversation(idOfPersonYouWantToStartConversation) {
    closeSearchButton();
    document.getElementById("additionalContent").style.display = 'none';
    document.getElementById("conversationContainer").style.display = 'block';
    let userYouWantToStartConversationIndexInArray = findUserIndexInArray(idOfPersonYouWantToStartConversation);
    document.getElementById("conversationUserName").innerHTML = peopleArray[userYouWantToStartConversationIndexInArray].getName() + " " + peopleArray[userYouWantToStartConversationIndexInArray].getSurname();
    //Showing message history below code
    let currentUser = findUserIndexInArray(document.getElementById("loggedInId").textContent);
    let userIWantToSendMessageNameSurname = document.getElementById("conversationUserName").textContent;
    let split = userIWantToSendMessageNameSurname.split(" ");
    let findTheUserYouWantToSendMessageIndex = findUserIndexInArrayWithNameAndSurname(split[0], split[1]);
    if (inboxArrayExists(peopleArray[currentUser].getName(), peopleArray[findTheUserYouWantToSendMessageIndex].getName())) {
        let inboxArrayIndex = findInboxArrayIndex(peopleArray[currentUser].getName(), peopleArray[findTheUserYouWantToSendMessageIndex].getName());
        let inboxArrayFromClassInbox = inboxArray[inboxArrayIndex].getInboxMessagesArray();
        for (let i = 0; i < inboxArrayFromClassInbox.length; i++) {
            let li = document.createElement('li');
            li.textContent = inboxArrayFromClassInbox[i];
            let ul = document.getElementById("ul");
            ul.appendChild(li);
            count = 1;
        }
    } else {
        let arrayForInboxClass = [];
        inboxArray.push(new Inbox(peopleArray[currentUser].getName(), peopleArray[findTheUserYouWantToSendMessageIndex].getName(), arrayForInboxClass));
    }
}
function sendMessage() {
    let currentUser = findUserIndexInArray(document.getElementById("loggedInId").textContent);
    let userIWantToSendMessageNameSurname = document.getElementById("conversationUserName").textContent;
    let message = hourAndMinutes() + " - " + peopleArray[currentUser].getName() + " " + peopleArray[currentUser].getSurname();
    let split = userIWantToSendMessageNameSurname.split(" ");
    let findTheUserYouWantToSendMessageIndex = findUserIndexInArrayWithNameAndSurname(split[0], split[1]);
    message += "||" + document.getElementById("messageInput").value;

    let inboxArrayIndex = findInboxArrayIndex(peopleArray[currentUser].getName(), peopleArray[findTheUserYouWantToSendMessageIndex].getName());

    inboxArray[inboxArrayIndex].addElementToInboxMessagesArray(message);
    inboxArray[inboxArrayIndex].saveInboxMessagesToLocal();

    let inboxArrayFromClassInbox = inboxArray[inboxArrayIndex].getInboxMessagesArray();
    let li = document.createElement('li');
    li.textContent = inboxArrayFromClassInbox[inboxArrayFromClassInbox.length - 1];

    let ul = document.getElementById("ul");

    ul.appendChild(li);

    document.getElementById("messageInput").innerHTML = "";

}
function back() {
    document.getElementById("conversationContainer").style.display = 'none';
    document.getElementById("additionalContent").style.display = 'block';
}

function checkIfUserExistInArray(personId) {
    for (let i of peopleArray) {
        if (i.getId() == personId) {
            return true;
        }
    }
    return false;
}
function findUserIndexInArray(id) {
    for (let i in peopleArray) {
        if (peopleArray[i].getId() == id) {
            return i;
        }
    }
}
function findUserIndexInArrayWithNameAndSurname(name, surname) {
    for (let i in peopleArray) {
        if ((peopleArray[i].getName() == name) && (peopleArray[i].getSurname() == surname)) {
            return i;
        }
    }
}
function findInboxArrayIndex(name, surname) {
    for (let i in inboxArray) {
        if ((inboxArray[i].getId() == name + surname) || (inboxArray[i].getId() == surname + name)) {
            return i;
        }
    }
}
function inboxArrayExists(name, surname) {
    for (let i in inboxArray) {
        if ((inboxArray[i].getId() == name + surname) || (inboxArray[i].getId() == surname + name)) {
            return true;
        }
    }
    return false;
}
function hourAndMinutes() {
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    var timeString = hours + ":" + minutes;
    return timeString;
}
//Saving the person info in web storage=========================================================================================================================================================
function saveDataToLocal() {
    localStorage.setItem('peopleData', JSON.stringify(peopleArray));
}
function loadDataFromLocal() {
    const storedData = localStorage.getItem('peopleData');

    if (storedData) {
        // Parse the JSON string back into an array of plain objects
        const retrievedArray = JSON.parse(storedData);

        // Convert the plain objects into instances of the Person class
        peopleArray.length = 0;
        retrievedArray.forEach(item => {
            peopleArray.push(new User(item.id, item.name, item.surname, item.inboxPersonArray));
        });
    }
}
function loadDataFromLocal2() {
    const storedData = localStorage.getItem('inboxdata');

    if (storedData) {
        const retrievedArray = JSON.parse(storedData);

        inboxArray.length = 0;
        retrievedArray.forEach(item => {
            const inboxObj = new Inbox(item.firstUserName, item.SecondUserName, item.inboxMessagesArray);
            inboxObj.loadInboxMessagesFromLocal();
            inboxArray.push(inboxObj);
        });
    }
}
loadDataFromLocal2();
loadDataFromLocal();
//=================================================================================================================================================================================================

