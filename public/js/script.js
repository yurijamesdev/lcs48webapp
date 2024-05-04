document.addEventListener('DOMContentLoaded', function() {
    const myProjectsButton = document.getElementById('myprojectsbtn');
    const chatRoomButton = document.getElementById('chatroombtn');
    const allProjectsButton = document.getElementById('allprojectsbtn');

    if (myProjectsButton) {
        myProjectsButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/myprojects';
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
