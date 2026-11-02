// Base de datos de palabras con temática de Roblox Studio
const robloxDatabase = [
    { word: "part", hint: "El bloque o pieza básica de construcción en el espacio de trabajo." },
    { word: "script", hint: "Objeto donde escribimos las líneas de código para dar vida al juego." },
    { word: "workspace", hint: "El contenedor principal de la interfaz donde se encuentran todos los objetos visibles." },
    { word: "anchor", hint: "Propiedad para fijar una pieza y evitar que se caiga por la gravedad." },
    { word: "spawn", hint: "El lugar exacto o plataforma donde los personajes de los jugadores aparecen." },
    { word: "explorer", hint: "Ventana lateral en forma de árbol que organiza todos los servicios y objetos." },
    { word: "properties", hint: "Panel lateral que nos permite cambiar el color, material o tamaño de una pieza." },
    { word: "toolbox", hint: "Caja de herramientas de donde puedes sacar modelos prehechos por la comunidad." },
    { word: "material", hint: "Propiedad que define la textura física de una pieza, como Neon, Plástico o Metal." },
    { word: "localscript", hint: "Script especial que se ejecuta únicamente en el dispositivo del jugador (Client)." },
    { word: "vector", hint: "Tipo de dato utilizado para definir posiciones o tamaños en 3D (Vector3.new)." },
    { word: "instance", hint: "Función utilizada en código para crear nuevos objetos desde cero (Instance.new)." }
];

let selectedWordData = {};
let guessedLetters = [];
let lives = 6;
let streak = 0;
const targetStreak = 10;

// Estados del servidor simulando caídas de conexión
const serverStages = [
    "🔴 CRITICAL ERROR: Server Disconnected. (0% Health)",
    "⚠️ Warning: Server Overloaded! Data loss imminent. (15% Health)",
    "⚙️ Lag detected: Script execution is taking too long. (40% Health)",
    "🔧 Maintenance Required: Physics pipeline failure. (60% Health)",
    "⚡ Checking connection: Minor spikes in ping. (80% Health)",
    "🔵 Compiling assets: Workspace updating... (95% Health)",
    "🟢 Server Status: Active and running fine. (100% Health)"
];

const alphabet = "abcdefghijklmnñopqrstuvwxyz";

function startRound() {
    if (streak >= targetStreak) {
        document.getElementById("game-card").innerHTML = `
            <h1 style="color: var(--success-color);">¡DESARROLLADOR PRO! 🏆</h1>
            <p style="font-size: 1.3rem;">¡Felicidades! Completaste una racha de ${streak} publicaciones exitosas en Roblox.</p>
            <button class="restart-btn" onclick="location.reload()">Crear un nuevo mapa</button>
        `;
        return;
    }

    const randomIndex = Math.floor(Math.random() * robloxDatabase.length);
    selectedWordData = robloxDatabase[randomIndex];
    
    guessedLetters = [];
    lives = 6;

    document.getElementById("lives").innerText = `${lives}/6`;
    document.getElementById("streak").innerText = streak;
    document.getElementById("hint-target").innerText = `💡 Pista: ${selectedWordData.hint}`;
    document.getElementById("message-target").innerText = "";
    
    const consoleElement = document.getElementById("hangman-visual");
    consoleElement.innerText = serverStages[lives];
    consoleElement.style.borderLeftColor = "var(--primary-color)";

    renderWord();
    createKeyboard();
}

function renderWord() {
    const displayHtml = selectedWordData.word
        .split("")
        .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
        .join(" ");
    
    document.getElementById("word-target").innerText = displayHtml;

    if (!displayHtml.includes("_")) {
        streak++;
        document.getElementById("streak").innerText = streak;
        document.getElementById("message-target").style.color = "var(--success-color)";
        document.getElementById("message-target").innerText = "¡Código verificado! Cargando siguiente script... 🚀";
        disableAllKeys();
        setTimeout(startRound, 2000);
    }
}

function createKeyboard() {
    const keyboardContainer = document.getElementById("keyboard-container");
    keyboardContainer.innerHTML = "";

    alphabet.split("").forEach(letter => {
        const button = document.createElement("button");
        button.innerText = letter;
        button.classList.add("key");
        button.id = `key-${letter}`;
        button.addEventListener("click", () => handleGuess(letter));
        keyboardContainer.appendChild(button);
    });
}

function handleGuess(letter) {
    document.getElementById(`key-${letter}`).disabled = true;

    if (selectedWordData.word.includes(letter)) {
        guessedLetters.push(letter);
        renderWord();
    } else {
        lives--;
        document.getElementById("lives").innerText = `${lives}/6`;
        
        const consoleElement = document.getElementById("hangman-visual");
        consoleElement.innerText = serverStages[lives];
        
        // Cambiar el color de la barra lateral de la consola según la gravedad
        if (lives <= 2) {
            consoleElement.style.borderLeftColor = "var(--secondary-color)";
        } else if (lives <= 4) {
            consoleElement.style.borderLeftColor = "#ffcd07";
        }

        if (lives <= 0) {
            streak = 0;
            document.getElementById("streak").innerText = streak;
            document.getElementById("word-target").innerText = selectedWordData.word.toUpperCase();
            document.getElementById("message-target").style.color = "var(--secondary-color)";
            document.getElementById("message-target").innerText = "¡Server Crash! Error al compilar.";
            disableAllKeys();
            
            const retryBtn = document.createElement("button");
            retryBtn.innerText = "Reconectar Servidor";
            retryBtn.classList.add("restart-btn");
            retryBtn.onclick = startRound;
            document.getElementById("message-target").appendChild(document.createElement("br"));
            document.getElementById("message-target").appendChild(retryBtn);
        }
    }
}

function disableAllKeys() {
    const buttons = document.querySelectorAll(".key");
    buttons.forEach(btn => btn.disabled = true);
}

window.onload = startRound;
