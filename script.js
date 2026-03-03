const inputNumero = document.getElementById('numero');
let timeoutId;

inputNumero.addEventListener('input', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(generarCarton, 300); // Debounce: espera 300ms después de escribir
});

function generarCarton() {
    const seedValue = inputNumero.value.trim();
    if (!seedValue || isNaN(seedValue) || parseInt(seedValue) < 1) {
        document.getElementById('carton-container').innerHTML = ''; // Limpia si inválido
        return;
    }
    const seed = parseInt(seedValue);

    // Setear la semilla para random determinístico
    Math.seedrandom(seed);

    // Rangos por columna: B(1-15), I(16-30), N(31-45), G(46-60), O(61-75)
    const rangos = [
        { min: 1, max: 15 },   // B
        { min: 16, max: 30 },  // I
        { min: 31, max: 45 },  // N
        { min: 46, max: 60 },  // G
        { min: 61, max: 75 }   // O
    ];

    // Generar cartón 5x5
    const carton = [];
    for (let col = 0; col < 5; col++) {
        const numeros = generarNumerosUnicos(rangos[col].min, rangos[col].max, 5);
        carton.push(numeros);
    }

    // Centro libre (fila 2, columna 2 en 0-index)
    carton[2][2] = 'LIBRE ⭐';

    // Renderizar la tabla
    const container = document.getElementById('carton-container');
    container.innerHTML = ''; // Limpiar anterior
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    ['B', 'I', 'N', 'G', 'O'].forEach(letra => {
        const th = document.createElement('th');
        th.textContent = letra;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let row = 0; row < 5; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 5; col++) {
            const td = document.createElement('td');
            td.textContent = carton[col][row]; // Transponemos para filas
            if (td.textContent === 'LIBRE ⭐') {
                td.classList.add('free');
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table);
}

// Función para generar números únicos en rango, shuffled con random
function generarNumerosUnicos(min, max, count) {
    const numeros = [];
    for (let i = min; i <= max; i++) {
        numeros.push(i);
    }
    // Shuffle con Fisher-Yates
    for (let i = numeros.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
    }
    return numeros.slice(0, count);
}