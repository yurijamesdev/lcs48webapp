document.addEventListener('DOMContentLoaded', function() {
    // Navigation buttons
    const myProjectsButton = document.getElementById('myprojectsbtn');
    const chatRoomButton = document.getElementById('chatroombtn');
    const allProjectsButton = document.getElementById('allprojectsbtn');
    const newProjectBtn = document.getElementById('newprojectbtn');
    const logOutButton = document.querySelector('.logout-btn');

    console.log('myProjectsButton:', myProjectsButton);
    console.log('chatRoomButton:', chatRoomButton);
    console.log('allProjectsButton:', allProjectsButton);
    console.log('newProjectBtn:', newProjectBtn);
    console.log('logOutButton:', logOutButton);

    if (myProjectsButton) {
        myProjectsButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/myprojects';
        });
    }

    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/newproject';
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

    if (logOutButton) {
        logOutButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/';
        });
    }

    // Project form
    const projectForm = document.getElementById('project-form');

    console.log('projectForm:', projectForm);

    if (projectForm) {
        projectForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form data
            const projectName = projectForm.elements['project-name'].value;
            const task = projectForm.elements['task'].value;
            const dueDate = projectForm.elements['due-date'].value;

            // Get selected checkboxes for assigned users
            const assignedUsers = [];
            const checkboxes = document.querySelectorAll('input[name="assign-to[]"]:checked');
            checkboxes.forEach(checkbox => {
                assignedUsers.push(checkbox.value);
            });

            // Prepare data to send to server
            const projectData = {
                projectName,
                task,
                dueDate,
                assignedUsers
            };

            // Send data to server via fetch API
            fetch('/newproject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            })
            .then(response => response.json())
            .then(data => {
                console.log(' ')
                // Redirect to all projects page
                window.location.href = '/myprojects';
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    const projectTable = document.querySelector('table');

    // Fetch projects data from backend
    fetch('/projects')
        .then(response => response.json())
        .then(data => {
            data.forEach(project => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${project.project_name}</td>
                    <td>${project.created_on}</td>
                    <td>${project.created_by}</td>
                    <td>${project.assigned_to}</td>
                    <td>${project.due_date}</td>
                `;
                projectTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
        });
});
