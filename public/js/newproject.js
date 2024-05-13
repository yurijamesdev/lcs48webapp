document.addEventListener('DOMContentLoaded', function() {
    const addSubProjectBtn = document.getElementById('add-sub-project-btn');
    const subProjectSections = document.getElementById('sub-project-sections');

    addSubProjectBtn.addEventListener('click', function() {
        const subProjectSection = document.createElement('div');
        subProjectSection.classList.add('sub-project-section');
        subProjectSection.innerHTML = `
            <label for="sub-project-name">Sub Project Name:</label>
            <input type="text" name="subProjectName[]" class="sub-project-name">
            <label for="sub-task">Sub Task:</label>
            <input type="text" name="subTask[]" placeholder="Sub Task">
            <label for="sub-due-date">Sub Task Due Date:</label>
            <input type="date" name="subDueDate[]" placeholder="Sub Task Due Date">
            <label>Assign Sub Task To:</label>
            <label for="sub-assign-brian"><input type="radio" id="sub-assign-brian" name="subAssignTo[]" value="Brian"> Brian</label>
            <label for="sub-assign-konyi"><input type="radio" id="sub-assign-konyi" name="subAssignTo[]" value="Konyi"> Konyi</label>
            <label for="sub-assign-max"><input type="radio" id="sub-assign-max" name="subAssignTo[]" value="Max"> Max</label>
            <!-- Add more radio buttons as needed -->
        `;
        subProjectSections.appendChild(subProjectSection);
    });

    const form = document.getElementById('project-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(form);

        // Log formData for debugging
        console.log('Form Data:', formData);

        fetch('/newproject', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/myprojects';
            } else {
                console.error('Failed to create project');
            }
        })
        .catch(error => {
            console.error('Error creating project:', error);
        });
    });
});
