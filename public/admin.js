const serverUrl = 'http://45.32.48.100:443';

document.getElementById('aura-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('aura-name').value;
    const chance = 1 / document.getElementById('aura-chance').value;

    const response = await fetch(`${serverUrl}/auras`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, chance })
    });

    const result = await response.json();
    alert(result.message);
    this.reset();
});

document.getElementById('potion-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('potion-name').value;
    const effect = document.getElementById('potion-effect').value;
    const duration = document.getElementById('potion-duration').value;
    const recipe = document.getElementById('potion-recipe').value;

    const response = await fetch(`${serverUrl}/potions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, effect, duration, recipe })
    });

    const result = await response.json();
    alert(result.message);
    this.reset();
});
