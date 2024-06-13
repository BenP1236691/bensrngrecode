const rollButton = document.getElementById('roll');
const autoRollButton = document.getElementById('autoRoll');
const inventoryButton = document.getElementById('inventory');
const resultDiv = document.getElementById('result');

let auras = {};
let potions = {};

// Fetch auras and potions from the backend on load
fetch('http://45.32.48.100:3000/auras')
    .then(response => response.json())
    .then(data => {
        data.forEach(aura => {
            auras[aura.name] = 1 / aura.probability;
        });
    })
    .catch(error => console.error('Error fetching auras:', error));

fetch('http://45.32.48.100:3000/potions')
    .then(response => response.json())
    .then(data => {
        potions = data;
    })
    .catch(error => console.error('Error fetching potions:', error));

rollButton.addEventListener('click', rollAura);
autoRollButton.addEventListener('click', autoRollAura);
inventoryButton.addEventListener('click', () => {
    window.location.href = 'inventory.html';
});

function rollAura() {
    let aura = getAura();
    resultDiv.textContent = `你獲得了 ${aura}`;
    // Store the result in localStorage
    let rolls = JSON.parse(localStorage.getItem('rolls')) || [];
    rolls.push(aura);
    localStorage.setItem('rolls', JSON.stringify(rolls));
}

function autoRollAura() {
    setInterval(rollAura, 1000);
}

function getAura() {
    let totalWeight = 0;
    for (let key in auras) {
        totalWeight += auras[key];
    }
    let random = Math.random() * totalWeight;
    for (let key in auras) {
        random -= auras[key];
        if (random <= 0) {
            return key;
        }
    }
}
