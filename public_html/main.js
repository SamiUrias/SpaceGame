//Variables del canvas
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

//Definir variables para las imagenes
var fondo;



//Variable con las caracteristicas del teclado
var teclado = {};

//Estado actual del juego
var juego = {
    estado: "iniciado"
};

//Nave
var nave = {
    x:100,
    y:canvas.height-100,
    alto:50,
    ancho:50
};


//Arreglo que contiene todos los disparos
var disparos = [];

//Arreglo que contiene todos los enemigos
var enemigos = [];


//Limite del canvas
var limite = canvas.width - nave.ancho;


//Definicion de funciones
function loadMedia(){
    fondo = new Image();
    fondo.src = 'fondo.jpg';
    
    fondo.onload = function(){
        var intervalo = window.setInterval(frameLoop,1000/55);
    };
 
}


//Dibuja todo el juego
function frameLoop(){        
        moverNave();
        moverDisparos();
        verificarContacto(); 
        actualizaEnemigos();
        dibujarFondo();
        dibujarEnemigos();
        dibujarDisparos();
        dibujarNave();       
    }
    
function dibujarFondo(){
    ctx.drawImage(fondo,0,0);
}

function dibujarNave(){
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.fillRect(nave.x,nave.y,nave.ancho,nave.alto);
    ctx.restore();
}


function agregarEventosTeclado(){
    agregarEvento(document,"keydown",function(e){   
        //Se pone en true la tecla presionada
        teclado[e.keyCode] = true;
        console.log(e.keyCode);
    });

    agregarEvento(document,"keyup",function(e){
        
        //Se pone en falso la tecla que dejo de ser presionada
        teclado[e.keyCode] = false;
    });
}

function agregarEvento(elemento,nombreDelEvento,funcion) {
    if (elemento.addEventListener){

        //Navegadores que no son Internet Explorer
        elemento.addEventListener(nombreDelEvento,funcion,false);
    }
    else if(elemento.attachEvent) {
        //Internet Explorer
        elemento.attachEvent(nombreDelEvento, funcion);
    }
}
    
function moverNave() {
    
    //Movimiento a la izquierda
    if(teclado[37]){
        nave.x -=10;
        if (nave.x < 00){
            nave.x = 0;
        }
    }
    
    //Movimeinto a la derecha
    if(teclado[39]){
        
        nave.x +=10;
        if (nave.x > limite){
            nave.x = limite;
        }
    }
    
    //Disparo
   if (teclado[32]){
      console.log(teclado.fire);
       if(!teclado.fire){
            fire(); //Dispara
            teclado.fire = true;
       }
   }
   else{
       teclado.fire = false;
    }
}


function moverDisparos(){
    for (var i in disparos) {
        var disparo = disparos[i];
        disparo.y -= 2;
    }
    disparos.filter(function(disparo){
        return disparo.y > 0;
    });
}

function fire(){
    disparos.push({
        x: nave.x +20,
        y: nave.y - 10,
        ancho: 10,
        alto: 30
    });
}

function dibujarDisparos(){
    ctx.save();
    ctx.fillStyle = 'white';
    
    for (i in disparos){
        var disparo = disparos[i];
        
        ctx.fillRect(disparo.x,disparo.y,disparo.ancho,disparo.alto);
    }
    ctx.restore();
}

function dibujarDisparosEnemigos(){
    
}
function dibujarEnemigos(){
    for(var i in enemigos){
        ctx.save();
        
        var enemigo = enemigos[i];
        
        
        if (enemigo.estado == 'vivo') {
            ctx.fillStyle = 'red';
        } 
        else {
            ctx.fillStyle = 'black';
        }
        
        ctx.fillRect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
        ctx.restore();
    }
}

function actualizaEnemigos(){
    if (juego.estado == 'iniciado')
    {
        console.log("Actualizando enemigos");
        for(var i = 0;i<10;i++){
            enemigos.push({
                x:10 + (i*50),
                y:10,
                alto: 40,
                ancho: 40,
                estado: 'vivo',
                contador: 0
            });
            console.log("Enemigo " + i);
        }
        juego.estado = 'jugando';
    }
   
    for (var i in enemigos){
            
        var enemigo = enemigos[i];
        if (!enemigo) {
            continue;
        }

        if (enemigo && enemigo.estado == 'vivo'){
            enemigo.contador++;
            enemigo.x += Math.sin(enemigo.contador * Math.PI/90) *5;
        }
        
        if (enemigo && enemigo.estado == 'hit'){
            enemigo.contador++;
            
            if(enemigo.contador >=20) {
                enemigo.estado = 'muerto';
                enemigo.contador = 0;
            }
        }
        enemigos = enemigos.filter(function(enemigo) {
            if (enemigo && enemigo.estado != 'muerto'){
                return true;
            }
            else {
                return false;
            }
        });
    }
}

function hit(a,b) {
    var hit = false;
    
    //Colision horizontal
    if(b.x + b.ancho >= a.x && b.x < a.x + a.ancho){
        //Colision vetical
        if (b.y + b.alto >= a.y && b.y < a.y + a.alto){
            hit = true;
        }
    }
    
    
    if (b.x <= a.x && b.x + b.ancho >= a.x + a.ancho) {
        if(b.y <= a.y && b.y + b.alto >= a.y + a.alto) {
            hit = true;
        }
    }
    
    if (a.x <= b.x && a.x + a.ancho >= b.x + b.ancho) {
        if(a.y <= b.y && a.y + a.alto >= b.y + b.alto) {
            hit = true;
        }
    }
    
    return hit;
}

function verificarContacto(){
    for (var i in disparos){
        var disparo = disparos[i];
        for(var j in enemigos){
            var enemigo = enemigos[j];
            
            if (hit(disparo,enemigo))
            {
                enemigo.estado = 'hit';
                enemigo.contador = 0;
                console.log("Hubo contacto");
            }
        }
    }
}

//Se cargan las imagenes
agregarEventosTeclado();
loadMedia();


