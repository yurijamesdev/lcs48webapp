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
   ;

   const results_body = document.querySelector('#results');

        load_data();

        function load_data() {
            const request = new XMLHttpRequest()

            request.open('get', '/get_data');
            let html = '';

            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                    const results = JSON.parse(request.responseText);
                    results.projects.forEach(result => {
                        html += `
                        <tr>
                            <td>${result.project_name}</td>
                            <td>${result.created_on}</td>
                            <td>${result.created_by}</td>
                            <td>${result.assigned_to}</td>
                            <td>${result.due_date}</td>
                            
                        </tr>
                        `;
                    });

                    results_body.innerHTML = html;
                }
            };
            request.send();
        }
        const projectsList = document.getElementById('projectsList');

        // Fetch projects data from the server
        const request = new XMLHttpRequest();
        request.open('GET', '/get_all_projects');
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    const response = JSON.parse(request.responseText);
                    const projects = response.projects;
    
                    // Loop through the projects and create table rows
                    projects.forEach(project => {
                        const createdOnDate = new Date(project.created_on).toLocaleDateString();
                        const dueDate = new Date(project.due_date).toLocaleDateString();
                        
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${project.project_name}</td>
                            <td>${project.created_on}</td>
                            <td>${project.created_by}</td>
                            <td>${project.assigned_to}</td>
                            <td>${project.due_date}</td>
                        `;
                        projectsList.appendChild(row);
                    });
                } else {
                    console.error('Error fetching projects:', request.statusText);
                }
            }
        };
        request.send();
});
