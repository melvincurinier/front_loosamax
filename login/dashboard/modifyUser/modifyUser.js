document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (!userId || (userId == 0)) {
        window.location.href = '../index.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:9090/user?id=${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch user information');
        }

        const userData = await response.json();

        document.getElementById('name').value = userData.name;
        document.getElementById('surname').value = userData.surname;
        document.getElementById('password').value = userData.password;
        document.getElementById('birthyear').value = userData.birthyear;
        document.getElementById('role').value = userData.role;
    } catch (error) {
        console.error(error);
        alert('Failed to load user data.');
    }

    document.getElementById('modifyUserForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const password = document.getElementById('password').value;
        const birthyear = document.getElementById('birthyear').value;
        const role = document.getElementById('role').value;

        try {
            const response = await fetch(`http://localhost:9090/modifyUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: userId,
                    name: name,
                    surname: surname,
                    password: password,
                    birthyear: birthyear,
                    role: role
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update user information');
            }

            alert('User information updated successfully.');
            window.location.href = `../dashboard.html?userId=${userId}`;
        } catch (error) {
            console.error(error);
            alert('Failed to update user information. Please try again later.');
        }
    });
});
