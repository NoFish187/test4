//Wert für die Variable "canvas"(Hintergrund)
let canvas = document.getElementById('canvas');
//Wert für die Variable "ctx" (größe vom Canvas)
let ctx = canvas.getContext('2d');
let rows = 10;
let cols = 10;
//Wert für die Variable "snake" (Starterposition)
let snake = [
    { x: 7, y: 3 },
    { x: 8, y: 3 }
];


//Essen als Bild
let foodImage = new Image();
foodImage.src = 'test_2.png';
foodImage.onload = function () {
};

let cellWidth = canvas.width / cols;
let cellHeight = canvas.height / rows;
//Wert für die Variable direction 
let direction = 'LEFT';
//Wert für die Variable "foodCollected"
let foodCollected = false;

let score = 0;

placeFood();

//Geschwindigkeit der Schlange
let gameInterval = setInterval(gameLoop, 150);
//document.addEventListener damit die Function "keydown" funktioniert
document.addEventListener('keydown', keyDown);

draw();

//Funktion "draw" dient als Stift, Grüner Canvas, Blaue Schlange
function draw() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Bestimme die Farbe basierend auf den Zeilen- und Spaltenindizes
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = "rgba(67, 247, 91, 0.562)";
            } else {
                ctx.fillStyle = "rgba(81, 231, 114, 0.712)";
            }
            ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }
    ctx.fillStyle = "cornflowerblue";

    //Damit die Schlange wächst
    snake.forEach(part => add(part.x, part.y));

    //Das Essen soll als Bild ausgegeben werden
    ctx.drawImage(foodImage, food.x * cellWidth, food.y * cellHeight, cellWidth - 1, cellHeight - 1);

    //damit die Funktion aufgerufen wird
    requestAnimationFrame(draw);
}

/**Funktion "testGameOver" dient dazu, dass das Spiel zurückgesetzt 
 wird wenn die Schlange gegen eine Wand oder gegen sich selbst stößst**/
 function testGameOver() {
    let firstPart = snake[0];
    let otherPart = snake.slice(1);
    let duplicatePart = otherPart.find(part => part.x == firstPart.x && part.y == firstPart.y);

    // 1. Schlange läuft gegen die Wand
    if (snake[0].x < 0 ||
        snake[0].x > cols - 1 ||
        snake[0].y < 0 ||
        snake[0].y > rows - 1 ||
        duplicatePart) {

        // Setze die Schlange zurück
        placeFood();
        snake = [
            { x: 7, y: 3 },
            { x: 8, y: 3 },
        ];
        direction = 'LEFT';


        score = 0;
        document.getElementById('score').innerText = "Score: " + score; // Aktualisiere die Anzeige
    }
}

// Funktion zum Neustarten des Spiels
function restartGame() {

    // Setze das Spiel zurück
    score = 0;
    // Setze die Schlange an die gewünschten Startpositionen
    snake = [
        { x: 2, y: 3 },
        { x: 3, y: 3 }
    ];
    direction = 'RIGHT';
    placeFood();
    
    // Starte das Spiel erneut
    gameInterval = setInterval(gameLoop, 150);
}


// Im gameLoop, nach dem Punktestand aktualisieren
if (snake[0].x == food.x &&
    snake[0].y == food.y) {
    foodCollected = true;
    score++;
    document.getElementById('score').innerText = "Score: " + score;


    // Dadurch wird die Funktion ausgeführt
    placeFood();
}

//Funktion damit das Essen zufällig generiert
function placeFood() {
    let randomX, randomY;
    let isFoodOnSnake = true;

    // Solange die Position auf der Schlange ist, generiere eine neue Position
    while (isFoodOnSnake) {
        randomX = Math.floor(Math.random() * cols);
        randomY = Math.floor(Math.random() * rows);

        // Überprüfe, ob die Position von einem Teil der Schlange belegt ist
        isFoodOnSnake = snake.some(part => part.x === randomX && part.y === randomY);
    }

    food = { x: randomX, y: randomY };
}

//Diese Funktion wird verwendet um den Text abzukürzen
function add(x, y) {
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
}

//Diese Funktion dient dazu das nach dem aufsammeln eines Essens die Schlange wächst
function shiftSnake() {
    for (let i = snake.length - 1; i > 0; i--) {
        //Konstante werden erstellt 
        const part = snake[i];
        //Konstante damit bei dem letzten Teil der Schlange ein Teil dazukommt
        const lastPart = snake[i - 1];
        part.x = lastPart.x;
        part.y = lastPart.y
    }
}

/**Funktion "gameloop" dient dazu dass das Spiel am Ende funktioniert 
 es werden die Tasten und das Essen aufsammeln programmiert**/
function gameLoop() {
    //damit die Funktion testgameOver ausgeführt wird
    testGameOver();
    //damit ein neuer Teil generiert wird
    if (foodCollected) {
        snake = [{
            x: snake[0].x,
            y: snake[0].y
        }, ...snake];
        //Wert wird wieder auf Falsch zurückgesetzt damit die Schlange nicht dauerhaft wächst
        foodCollected = false;
    }

    shiftSnake();

    //wenn die linke Pfeiltaste betetigt wird, wird die Schlange in die negative Richtung der Reihen bewegt
    if (direction == 'LEFT') {
        snake[0].x--;
    }
    //wenn die rechte Pfeiltaste betetigt wird, wird die Schlange in die positive Richtung der Reihen bewegt
    if (direction == 'RIGHT') {
        snake[0].x++;
    }
    //wenn die obere Pfeiltaste betetigt wird, wird die Schlange in die negative Richtung der Spalten bewegt
    if (direction == 'UP') {
        snake[0].y--;
    }
    //wenn die untere Pfeiltaste betetigt wird, wird die Schlange in die positive Richtung der Spalten bewegt
    if (direction == 'DOWN') {
        snake[0].y++;
    }

    //der wert der Schleife "foodCollected" wid auf true gestellt damit ein neues Essen generiert wird
    if (snake[0].x == food.x &&
        snake[0].y == food.y) {
        foodCollected = true;
        score++;
        document.getElementById('score').innerText = "Score: " + score;
        //dadurch wird die Funktion ausgeführt
        placeFood();
    }

}

//Funktion "keydown" dient dazu, dass sich die Schlange am Ende bewegen kann
function keyDown(e) {

    if (e.keyCode == 37 && direction != 'RIGHT') { // Links
        direction = 'LEFT';
    }
    if (e.keyCode == 38 && direction != 'DOWN') { // Oben
        direction = 'UP';
    }
    if (e.keyCode == 39 && direction != 'LEFT') { // Rechts
        direction = 'RIGHT';
    }
    if (e.keyCode == 40 && direction != 'UP') { // Unten
        direction = 'DOWN';
    }
}
