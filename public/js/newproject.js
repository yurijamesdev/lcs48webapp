// app.js
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
            <label for="sub-assign-brian"><input type="radio" id="sub-assign-brian" name="subAssign[]" value="Brian"> Brian</label>
            <label for="sub-assign-konyi"><input type="radio" id="sub-assign-konyi" name="subAssign[]" value="Konyi"> Konyi</label>
            <label for="sub-assign-max"><input type="radio" id="sub-assign-max" name="subAssign[]" value="Max"> Max</label>
        `;
        subProjectSections.appendChild(subProjectSection);
    });

    const form = document.getElementById('project-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = getFormData(form);

        // Log formData for debugging
        console.log('Form Data:', formData);

        fetch('/newproject', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create project'); // Throw an error to be caught below
            }
            // If the response is okay, submit the form manually
            form.submit();
            window.location.href = '/myprojects';
        })
        .catch(error => {
            console.error('Error creating project:', error);
            // Handle error here, e.g., show an error message to the user
        });
    });
});

function getFormData(form) {
    const formData = {};

    // Get the "assign-to" radio button value
    const assignToRadios = form.querySelectorAll('input[name="assign-to"]');
    formData['assign-to'] = Array.from(assignToRadios).find(radio => radio.checked)?.value || '';

    // Get all input fields
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        // Skip empty or undefined fields
        if (!input.value || input.value === 'undefined') {
            return;
        }

        // If the input is for a subtask
        if (input.name.startsWith('sub')) {
            // If the subproject doesn't exist in formData, create an array for it
            const subProjectName = input.name.replace('[]', '');
            if (!formData[subProjectName]) {
                formData[subProjectName] = [];
            }
            // Add the subtask details to the subproject array
            if (input.type === 'radio' && input.checked) {
                formData[subProjectName].push(input.value);
            } else if (input.type !== 'radio') {
                formData[subProjectName].push(input.value);
            }
        } else if (input.name !== 'assign-to') {
            // For non-subtask and non-assign-to inputs, add them directly to formData
            formData[input.name] = input.value;
        }
    });

    // Convert date strings to YYYY-MM-DD format
    formData['dueDate'] = new Date(formData['dueDate']).toISOString().split('T')[0];

    // Loop through sub project due dates and convert them
    formData['subDueDate'].forEach((date, index) => {
        formData['subDueDate'][index] = new Date(date).toISOString().split('T')[0];
    });

    return formData;
}
