document.addEventListener('DOMContentLoaded', function() {
    const loginFormContainer = document.getElementById('loginFormContainer');
    const createAccountFormContainer = document.getElementById('createAccountFormContainer');
    const toggleFormButton = document.getElementById('toggleFormButton');
    
    toggleFormButton.addEventListener('click', function() {
        if (loginFormContainer.style.display === 'none') {
            loginFormContainer.style.display = 'block';
            createAccountFormContainer.style.display = 'none';
            toggleFormButton.textContent = 'Create Account';
        } else {
            loginFormContainer.style.display = 'none';
            createAccountFormContainer.style.display = 'block';
            toggleFormButton.textContent = 'Login';
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('error');
    
        try {
            const response = await fetch('http://localhost:9090/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
    
            if (!response.ok) {
                throw new Error('Login failed');
            }
    
            const data = await response.json();
            console.log(data);
            
            // Redirigez vers la page de dashboard en passant des informations nécessaires
            if(data != 0) window.location.href = `./dashboard/dashboard.html?userId=${data}`;
        } catch (error) {
            errorElement.textContent = 'Login failed. Please check your credentials and try again.';
        }
    });
    
    document.getElementById('createAccountForm').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;
        const creationErrorElement = document.getElementById('creationError');
    
        try {
            const response = await fetch('http://localhost:9090/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: newUsername, password: newPassword })
            });
    
            if (!response.ok) {
                throw new Error('Account creation failed');
            }
    
            const data = await response.json();
            console.log(data);
            
            // Afficher un message de succès ou rediriger vers la page de connexion
            alert('Account created successfully. Please login with your new credentials.');
        } catch (error) {
            creationErrorElement.textContent = 'Account creation failed. Please try again with different credentials.';
        }
    });
});
