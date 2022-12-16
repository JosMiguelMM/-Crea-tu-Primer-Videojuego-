const canvas = document.querySelector('#game'); //seleciona la etiqueta canvas
const game = canvas.getContext('2d'); //se define que es 2d

/*aca de pone en escucha a la funcion a continuacion y en load apenad carge el html
se ejecuta la funcion*/
window.addEventListener('load', startGame);

function startGame() {
    // lugar donde inicia el trazo(se genera un cuadrado)
    game.fillRect(0, 0, 100, 100);
    game.clearRect(0, 0, 50, 50); //borra el cuadrado, segun las coordenadas
}