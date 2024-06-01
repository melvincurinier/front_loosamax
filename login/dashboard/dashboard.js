document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (!userId || (userId == 0)) {
        window.location.href = '../index.html';
        return;
    }

    try {
        // Récupérer le solde de l'utilisateur
        const balanceResponse = await fetch(`http://localhost:9090/user?id=${userId}`);

        if (!balanceResponse.ok) {
            throw new Error('Failed to fetch user balance');
        }

        const balanceData = await balanceResponse.json();
        document.getElementById('user-balance').textContent = `Balance: $${balanceData.solde.toFixed(2)}`;

        // Récupérer la liste des matchs
        const matchesResponse = await fetch('http://localhost:9090/allGames');

        if (!matchesResponse.ok) {
            throw new Error('Failed to fetch matches');
        }

        const matchesData = await matchesResponse.json();

        const matchesList = document.getElementById('matches-list');
        matchesData.forEach(match => {
            const team1Name = match.teams[0].teamname;
            const team2Name = match.teams[1].teamname;

            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `./bet/bet.html?userId=${userId}&matchId=${match.idMatch}`;
            link.textContent = `${team1Name} vs ${team2Name}`;
            li.appendChild(link);
            matchesList.appendChild(li);
        });

        // Récupérer les paris de l'utilisateur
        const betsResponse = await fetch(`http://localhost:9090/userBets?userId=${userId}`);

        if (!betsResponse.ok) {
            throw new Error('Failed to fetch user bets');
        }

        const betsData = await betsResponse.json();
        console.log(betsData)

        const betsList = document.getElementById('bets-list');
        betsData.forEach(bet => {
            const li = document.createElement('li');
            li.textContent = `Match: ${bet.game.teams[0].teamname} vs ${bet.game.teams[1].teamname}, Amount: ${bet.sum}`;
            betsList.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        alert('Failed to load user data, matches and bets.');
    }

    // Ajouter des fonds
    document.getElementById('add-funds-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const amount = parseInt(document.getElementById('amount').value);

        try {
            const response = await fetch(`http://localhost:9090/addFunds?userId=${userId}&amount=${amount}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to add funds');
            }

            const balanceResponse = await fetch(`http://localhost:9090/user?id=${userId}`);

            if (!balanceResponse.ok) {
                throw new Error('Failed to fetch user balance');
            }

            const balanceData = await balanceResponse.json();
            document.getElementById('user-balance').textContent = `Balance: $${balanceData.solde.toFixed(2)}`;
            alert('Funds added successfully.');
        } catch (error) {
            console.error(error);
            alert('Failed to add funds. Please try again later.');
        }
    });

    document.getElementById('modifyUserButton').addEventListener('click', function() {
        window.location.href = `./modifyUser/modifyUser.html?userId=${userId}`;
    });
});
