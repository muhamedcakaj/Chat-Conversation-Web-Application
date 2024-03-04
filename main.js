class User {
    constructor(id, name, surname, inboxPersonArray = []) {
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
        return this.inboxPersonArray;
    }
    addElementToInboxPersonArray(element) {
        if (!(this.inboxPersonArray.includes(element))) {
            this.inboxPersonArray.push(element);
        }
    }
    saveInboxMessagesToLocal() {
        localStorage.setItem('inboxPersonArray_' + this.getId(), JSON.stringify(this.inboxPersonArray));
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
        let inboxPersonArray = [];
        peopleArray.push(new User(signupId, signupName, signupSurname, inboxPersonArray));
        saveDataToLocal()
        alert("Log in again to get to the Main Page");
    }
}
function openInbox() {
    document.getElementById("additionalContent").style.display = 'none';
    document.getElementById("inboxOverlay").style.display = 'block';
    let currentUserIndex = findUserIndexInArray(document.getElementById("loggedInId").textContent);
    let arrayOfUser = peopleArray[currentUserIndex].getInboxPersonArray();
    for (let i = 0; i < arrayOfUser.length; i++) {
        let elementAlreadyExists = Array.from(document.getElementById("inboxList").children).some(li => li.id.trim() == arrayOfUser[i]);
        if (!(elementAlreadyExists)) {
            let splitarrayOfUserElement = arrayOfUser[i].split(" ");
            let findUserIndexInArrayWithNameAndSurnamee = findUserIndexInArrayWithNameAndSurname(splitarrayOfUserElement[0], splitarrayOfUserElement[1]);
            let button = document.createElement("button");
            button.textContent = "Chat";
            button.id = peopleArray[findUserIndexInArrayWithNameAndSurnamee].getId();
            button.onclick = function () {
                chat(button.id);
            }
            let li = document.createElement('li');
            li.textContent = arrayOfUser[i];
            li.id = arrayOfUser[i]
            li.appendChild(button);
            let ul = document.getElementById("inboxList");
            ul.appendChild(li);
        }
    }
}
function closeInbox() {
    document.getElementById("inboxOverlay").style.display = 'none';
    document.getElementById("additionalContent").style.display = 'block';
}
function chat(idOfThePersonIWantToChat) {
    document.getElementById("inboxOverlay").style.display = "none";
    document.getElementById("conversationContainer").style.display = "block";
    startConversation(idOfThePersonIWantToChat);
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
        let elementAlreadyExists = Array.from(document.getElementById("searchResults").children).some(li => li.id.trim() == i.getId());
        if (!(elementAlreadyExists)) {
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
}
function startConversation(idOfPersonYouWantToStartConversation) {
    closeSearchButton();
    document.getElementById("additionalContent").style.display = 'none';
    document.getElementById("conversationContainer").style.display = 'block';
    let userYouWantToStartConversationIndexInArray = findUserIndexInArray(idOfPersonYouWantToStartConversation);
    document.getElementById("conversationUserName").innerHTML = peopleArray[userYouWantToStartConversationIndexInArray].getName() + " " + peopleArray[userYouWantToStartConversationIndexInArray].getSurname();
    //Showing message history below code
    let currentUser = findUserIndexInArray(document.getElementById("loggedInId").textContent);
    if (inboxArrayExists(peopleArray[currentUser].getName(), peopleArray[userYouWantToStartConversationIndexInArray].getName())) {
        let inboxArrayIndex = findInboxArrayIndex(peopleArray[currentUser].getName(), peopleArray[userYouWantToStartConversationIndexInArray].getName());
        let inboxArrayFromClassInbox = inboxArray[inboxArrayIndex].getInboxMessagesArray();
        for (let i = 0; i < inboxArrayFromClassInbox.length; i++) {
            let elementAlreadyExists = Array.from(document.getElementById("ul").children).some(li => li.textContent.trim() == inboxArrayFromClassInbox[i]);
            if (!(elementAlreadyExists)) {
                let li = document.createElement('li');
                li.textContent = inboxArrayFromClassInbox[i];
                let ul = document.getElementById("ul");
                ul.appendChild(li);
            }
        }
    } else {
        let arrayForInboxClass = [];
        inboxArray.push(new Inbox(peopleArray[currentUser].getName(), peopleArray[userYouWantToStartConversationIndexInArray].getName(), arrayForInboxClass));
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

    peopleArray[findTheUserYouWantToSendMessageIndex].addElementToInboxPersonArray(peopleArray[currentUser].getName() + " " + peopleArray[currentUser].getSurname());
    peopleArray[findTheUserYouWantToSendMessageIndex].saveInboxMessagesToLocal();
    peopleArray[currentUser].addElementToInboxPersonArray(peopleArray[findTheUserYouWantToSendMessageIndex].getName() + " " + peopleArray[findTheUserYouWantToSendMessageIndex].getSurname());
    peopleArray[currentUser].saveInboxMessagesToLocal();
}
function back() {
    document.getElementById("conversationContainer").style.display = 'none';
    document.getElementById("additionalContent").style.display = 'block';
    document.getElementById("searchOverlay").style.display = 'none';
    let unorderedList = document.getElementById("ul");

    while (unorderedList.firstChild) {
        unorderedList.removeChild(unorderedList.firstChild);
    }
}

function closeInbox() {
    document.getElementById("inboxOverlay").style.display = 'none';
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

    peopleArray.forEach(user => {
        localStorage.setItem(`inboxPersonArray_${user.getId()}`, JSON.stringify(user.getInboxPersonArray()));
    });
}
function loadDataFromLocal() {
    const storedData = localStorage.getItem('peopleData');

    if (storedData) {
        const retrievedArray = JSON.parse(storedData);

        peopleArray.length = 0;
        retrievedArray.forEach(item => {
            const user = new User(item.id, item.name, item.surname, item.inboxPersonArray);
            // Load inboxPersonArray directly
            const storedInboxPersonArray = localStorage.getItem('inboxPersonArray_' + user.getId());
            if (storedInboxPersonArray) {
                user.inboxPersonArray = JSON.parse(storedInboxPersonArray);
            }
            peopleArray.push(user);
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

