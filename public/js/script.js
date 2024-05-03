
document.addEventListener('DOMContentLoaded', function() {
    const myProjectsButton = document.getElementById('myprojectsbtn');
    myProjectsButton.addEventListener('click', function(event) {
        // Prevent the default action of the anchor tag (navigation) to be able to handle it programmatically
        event.preventDefault();
        
        // Navigate to the /myprojects route using fetch or window.location.href
        // Method 1: Using fetch
        fetch('/myprojects')
            .then(response => response.text())
            .then(data => {
                document.documentElement.innerHTML = data; // Replace the current HTML with the response from the /myprojects route
            })
            .catch(error => console.error('Error:', error));
        
        // Method 2: Using window.location.href (this will reload the entire page)
        // window.location.href = '/myprojects';
    });
});
