//VARIABLES
const canvas = document.querySelector('#game'); //seleciona la etiqueta canvas
const game = canvas.getContext('2d'); //se define que es 2d
let canvasSize;
let ElementsSize;
let level = 0;
let lives = 3;
//git

let timeStart;
let timeInterval;

const recordTime = document.querySelector('#record');
const result = document.querySelector('#result');

const corazones = document.querySelector('#lives');
const spanTiempo = document.querySelector('#time');


const playerPosition = {//VARIABLES POSICIONES X,Y
    x: undefined,
    y: undefined
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemigosPosition = [];

//BOTONES
const btn_up = document.querySelector('#btn-up');
const btn_down = document.querySelector('#btn-down');
const btn_left = document.querySelector('#btn-left');
const btn_right = document.querySelector('#btn-right');
const reiniciar = document.querySelector('#btn-reset');


/*aca de pone en escucha a la funcion a continuacion y en
load cada vez que el html carge se ejecuta la funcion*/
window.addEventListener('load', SetCanvaSive);

/*evento que escucha el cambio en el tamaño de la ventana dinamicamente*/
window.addEventListener('resize', SetCanvaSive);
reiniciar.addEventListener('click', resetN);

function resetN() {
    level = 0;
    lives = 3;
    timeStart = undefined;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    SetCanvaSive();
}

/*TAMAÑO DEL CANVA*/
function SetCanvaSive() {
    // lugar donde inicia el trazo(se genera un cuadrado)
    //game.fillStyle = 'purple'; //color del cuadrado
    //game.fillRect(0, 50, 100, 100);
    //game.clearRect(0, 0, 50, 50); //borra el cuadrado, segun las coordenadas
    //game.font = '30px Arial'; //tamaño de la fuente
    //game.fillText('Hola', 2, 6); //escribe el texto

    //Tamaño del canvas
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    // para ajustar el tamaño del canvas al tamaño de la ventana como un cuadrado
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    ElementsSize = canvasSize / 10
    ElementsSize = Math.floor(ElementsSize); //redondea el numero hacia abajo
    console.log('tamaño de la division ', ElementsSize)
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}


function startGame() {
    game.font = ElementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];
    if (!map) {
        gameWin();
        return;
    }
    showLives();
    showRecordTime();

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
    }

    const mapRows = map.trim().split('\n'); //se convierte el string en arreglo y se le da espacios

    //Ahora se quiere separar el vector por cada elemento (matriz)
    const mapRowsCols = mapRows.map(row => row.trim().split(''));


    /*for (let row = 1; row <= 10; row++) {
        for (let column = 1; column <= 10; column++) {
            game.fillText(emojis[mapRowsCols[row - 1][column - 1]], ElementsSize * column, ElementsSize * row);
        }
    }*/

    enemigosPosition = [];
    // para hacer lo anterior se puede usar un forEach del siguiente modo

    //SE BORRA TODO
    game.clearRect(0, 0, canvasSize, canvasSize);

    mapRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            //console.log(emojis[col]);
            //col recorre cada una de las posiciones de la matriz y devuelve su contenido
            //console.log(rowI, colI);
            const posx = ElementsSize * (colI + 1);
            const posy = ElementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posx;
                    playerPosition.y = posy;
                    console.log(playerPosition);
                }
            } else if (col == 'I') {
                giftPosition.x = posx;
                giftPosition.y = posy;
                console.log(giftPosition);
            } else if (col == 'X') {
                enemigosPosition.push({
                    x: posx,
                    y: posy
                });
            }
            game.fillText(emojis[col], posx, posy);
        });
    });
    movePlayer();
}

//MOVER JUGADOR AL INICIAR EL JUEGO
function movePlayer() {

    /*REALIZA LAS VALIDACIONES SI DE HIZO UNA COLICION CON EL REGALO*/
    const giftColisionX = playerPosition.x == giftPosition.x;
    const giftColisionY = playerPosition.y == giftPosition.y;
    const giftColision = giftColisionX && giftColisionY;

    if (giftColision) {
        levelWin();
    }

    /* find VALIDA UNA POR UNA LAS POSICIONES SI EL JUGADOR
    * Y EL ENEMIGO ESTAN EN LA MISMA POSICION */
    const enemigoColision = enemigosPosition.find(enemy => {
        const enemyColisionX = enemy.x == playerPosition.x;
        const enemyColisionY = enemy.y == playerPosition.y
        return enemyColisionX && enemyColisionY;
    });
    if (enemigoColision) {
        levelFail();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);

}

function levelWin() {
    console.log('Ganaste');
    level++;
    clearInterval(timeInterval);
    console.log('nivel', level);
    startGame()
}

function gameWin() {
    alert('Terminaste el juego');
    clearInterval(timeInterval);
    const recordTime = localStorage.getItem('record_time');
    let playerTime = Date.now() - timeStart;
    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            result.innerHTML = 'Nuevo record alcanzado';
        } else {
            result.innerHTML = 'No superaste el record';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        alert('Nuevo record');
    }
}

function levelFail() {
    lives--;
    game.fillText(emojis['BLOW'], playerPosition.x, playerPosition.y);
    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    setTimeout(startGame, 500);
}

function showLives() {
    /*
    * se crea un arreglo que  ponen emojis de corazones en las posiciones
    * segun el numero de vidas */
    const heartArray = Array(lives).fill(emojis['HEART'])//se crea un array con la cantidad de vidas
    corazones.innerHTML = heartArray.join(' ');//se une el array con el separador que se le indique
    //console.log(heartArray);
}

function showTime() {
    spanTiempo.innerHTML = Date.now() - timeStart;
}

function showRecordTime() {
    record.innerHTML = localStorage.getItem('record_time');
}

//PARA BOTONES DEL TECLADO DE WINDOWS
window.addEventListener('keydown', moveByKeys);

//EN ESCUCHA LOS BOTONES DENTRO DEL INDEX.HTML
btn_up.addEventListener('click', moveUp);
btn_down.addEventListener('click', moveDown);
btn_left.addEventListener('click', moveLeft);
btn_right.addEventListener('click', moveRight);

//FUNCIONES DE LOS BOTONES DEL TECLADO
function moveByKeys(event) {
    //console.log(event);
    /*METODO ALTERNAIVO
    *if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown(); */

    switch (event.keyCode) {
        case 38: //ES EL NUMERO DEL keyCode DE LA TECLA
            moveUp();
            break;
        case 40:
            moveDown();
            break;
        case 37:
            moveLeft();
            break;
        case 39:
            moveRight();
            break;
    }
}

//FUNCIONES DE LOS BOTONES
function moveUp() {
    console.log('Me quiero mover hacia arriba');
    if ((playerPosition.y - ElementsSize) < ElementsSize) {
        console.log('OUT');
    } else {
        playerPosition.y -= ElementsSize;
        startGame();
    }
}

function moveLeft() {
    console.log('Me quiero mover hacia izquierda');

    if ((playerPosition.x - ElementsSize) < ElementsSize) {
        console.log('IZQ');
    } else {
        playerPosition.x -= ElementsSize;
        startGame();
    }
}

function moveRight() {
    console.log('Me quiero mover hacia derecha');

    if ((playerPosition.x + ElementsSize) > canvasSize) {
        console.log('OUT');
        console.log(playerPosition)
    } else {
        playerPosition.x += ElementsSize;
        startGame();
    }
}

function moveDown() {
    console.log('Me quiero mover hacia abajo')
    if ((playerPosition.y + ElementsSize) > canvasSize) {
        console.log('OUT');
    } else {
        playerPosition.y += ElementsSize;
        startGame();
    }
}