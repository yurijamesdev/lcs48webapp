document.addEventListener('DOMContentLoaded', function() {
    const myProjectsButton = document.getElementById('myprojectsbtn');
    const chatRoomButton = document.getElementById('chatroombtn');
    const allProjectsButton = document.getElementById('allprojectsbtn');
    const logOutButton = document.getElementsByClassName('logout-btn')[0]; // Select the first element with the class

    if (myProjectsButton) {
        myProjectsButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/myprojects';
        });
    }

    if (logOutButton) {
        logOutButton.addEventListener('click', function(event) { // Use logOutButton here
            event.preventDefault();
            window.location.href = '/';
        });
    }

    if (chatRoomButton) {
        chatRoomButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/chat';
        });
    }

    if (allProjectsButton) {
        allProjectsButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/allprojects';
        });
    }
});
