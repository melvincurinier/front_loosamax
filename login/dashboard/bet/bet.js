document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const matchId = urlParams.get('matchId');

    if (!userId || (userId ==0) || !matchId) {
        window.location.href = '../../index.html';
        return;
    }

    try {
        // Récupérer les détails du match
        const matchResponse = await fetch(`http://localhost:9090/game?id=${matchId}`);

        if (!matchResponse.ok) {
            throw new Error('Failed to fetch match details');
        }

        const matchData = await matchResponse.json();
        const team1Name = matchData.teams[0].teamname;
        const team2Name = matchData.teams[1].teamname;

        document.getElementById('match-details').textContent = `${team1Name} vs ${team2Name}`;

        // Récupérer les cotes du match
        const team1Odds = matchData.sidevic1;
        const team2Odds = matchData.sidevic2;
        const tieOdds = matchData.tie;

        document.getElementById('bet-odds').textContent = `Odds: ${team1Odds} for ${team1Name}, ${team2Odds} for ${team2Name}, ${tieOdds} for Tie`;

        // Gérer la soumission du formulaire pour placer un pari
        document.getElementById('place-bet-form').addEventListener('submit', async function(event) {
            event.preventDefault();

            const betAmount = parseInt(document.getElementById('bet-amount').value);

            const data = {
                "id": {
                    "idUser": userId,
                    "idMatch": matchId
                },
                "user": {
                    "id": userId
                },
                "match": {
                    "idMatch": matchId
                },
                "sum": betAmount
            };

            try {
                // Envoyer la demande de pari
                const response = await fetch(`http://localhost:9090/bet`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Failed to place bet');
                }

                alert('Bet placed successfully.');
                window.location.href = '../dashboard.html?userId=' + userId;
            } catch (error) {
                console.error(error);
                alert('Failed to place bet. Please try again later.');
            }
        });
    } catch (error) {
        console.error(error);
        alert('Failed to load match details and odds.');
    }
});
