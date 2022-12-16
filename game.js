const canvas = document.querySelector('#game'); //seleciona la etiqueta canvas
const game = canvas.getContext('2d'); //se define que es 2d

/*aca de pone en escucha a la funcion a continuacion y en load apenad carge el html
se ejecuta la funcion*/
window.addEventListener('load', startGame);

function startGame() {
    // lugar donde inicia el trazo(se genera un cuadrado)
    //game.fillStyle = 'purple'; //color del cuadrado
    //game.fillRect(0, 50, 100, 100);
    //game.clearRect(0, 0, 50, 50); //borra el cuadrado, segun las coordenadas
    //game.font = '30px Arial'; //tamaño de la fuente
    //game.fillText('Hola', 2, 6); //escribe el texto

    let canvasSize;
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    // para ajustar el tamaño del canvas al tamaño de la ventana
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    const ElementsSize = canvasSize / 10;
    console.log(canvasSize, ElementsSize);
    game.font = ElementsSize + 'px Verdana';
    game.textAlign = 'end';

    for (let i = 1; i <= 10; i++) {
        game.fillText(emojis['X'], (ElementsSize * i), (ElementsSize));
    }

}