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
    ancho:50,
    contador: 0
};


//Arreglo que contiene todos los disparos
var disparos = [];

//Arreglo que contiene todos los disparos enemigos
var disparosEnemigos = [];

//Arreglo que contiene todos los enemigos
var enemigos = [];


//Limite del canvas
var limite = canvas.width - nave.ancho;

var textoRespuesta = {
    contador: -1,
    tiutlo: '',
    subtitulo: ''
};

//Definicion de funciones

function actualizaEnemigos(){
    function agregarDisparosEnemigos(enemigo){
        return {
            x: enemigo.x,
            y: enemigo.y,
            ancho: 10,
            alto: 33,
            contador: 0
        }
    }
    if (juego.estado == 'iniciado')
    {
        
        for(var i = 0;i<10;i++){
            enemigos.push({
                x:10 + (i*50),
                y:10,
                alto: 40,
                ancho: 40,
                estado: 'vivo',
                contador: 0
            });
            
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
            
            if (aleatorio(0,enemigos.length * 10) == 4){
                disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
            }
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

function actualizarEstadoJuego(){
    
    if (juego.estado == 'jugando' && enemigos.length==0){
        juego.estado = 'victoria';
        textoRespuesta.tiutlo = 'Derrotaste a los enemigos';
        textoRespuesta.subtitulo = 'Presiona la tecla R para reiniciar';
        textoRespuesta.contador = 0;
    }
    
    if (textoRespuesta.contador >= 0){
        textoRespuesta.contador++;
    }
    
    if ((juego.estado == 'perdido' || juego.estado=='victoria')&&teclado[82]){
        juego.estado='iniciado';
        nave.estado='vivo';
        textoRespuesta.contador=-1;
    }
}
function aleatorio(inferior,superior){
    var posiblidades = superior - inferior;
    var a; //Variable aleatoria
    a =Math.random() * posiblidades;
    a = Math.floor(a);
    return parseInt(inferior)+a;
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

function agregarEventosTeclado(){
    agregarEvento(document,"keydown",function(e){   
        //Se pone en true la tecla presionada
        teclado[e.keyCode] = true;
        
    });

    agregarEvento(document,"keyup",function(e){
        
        //Se pone en falso la tecla que dejo de ser presionada
        teclado[e.keyCode] = false;
    });
}


function backgroundMusic(){
    audio = new Audio();
    audio.src = "Sounds/FASE.mp3";
    audio.volume = audio.volume/4;
    audio.loop = true;
    audio.play();
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
    for (var i in disparosEnemigos){
        var disparo = disparosEnemigos[i];
        ctx.save();
        ctx.fillStyle = 'yellow';
        ctx.fillRect(disparo.x, disparo.y, disparo.ancho, disparo.alto);
        ctx.restore();
        
    }
}

function dibujarEnemigos(){
    for(var i in enemigos){
        ctx.save();
        
        var enemigo = enemigos[i];
        var img = document.getElementById("enemy");
        
        if (enemigo.estado == 'vivo') {
            ctx.fillStyle = 'red';
        } 
        else {
            ctx.fillStyle = 'black';
        }
        
        //ctx.fillRect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
        ctx.drawImage(img,enemigo.x,enemigo.y);
        ctx.restore();
    }
}

function dibujarFondo(){
    ctx.drawImage(fondo,0,0);
}

function dibujarNave(){
    var img = document.getElementById("ship");
    ctx.save();
    ctx.fillStyle = 'red';
    //ctx.fillRect(nave.x,nave.y,nave.ancho,nave.alto);
    ctx.drawImage(img,nave.x,nave.y);
    ctx.restore();
}

function dibujarTexto(){
    
    if (textoRespuesta.contador == -1){
        return;
    }
    var alpha = textoRespuesta.contador/50.0;
    if (alpha>1){
        for (var i in enemigos){
            delete enemigos[i];
        }
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    
    if (juego.estado == 'perdido'){
        ctx.fillStyle = 'white';
        ctx.font = 'Bold 40pt Arial';
        ctx.fillText(textoRespuesta.tiutlo,140,200);
        ctx.font = '14pt Arial';
        ctx.fillText(textoRespuesta.subtitulo, 190,250);
        
    }
    
    if (juego.estado == 'victoria'){
        ctx.fillStyle = 'white';
        ctx.font = 'Bold 40pt Arial';
        ctx.fillText(textoRespuesta.tiutlo,80,200);
        ctx.font = '14pt Arial';
        ctx.fillText(textoRespuesta.subtitulo, 190,250);
        
    }
}
function fire(){
    disparos.push({
        x: nave.x +20,
        y: nave.y - 10,
        ancho: 10,
        alto: 30
    });
}

//Dibuja todo el juego
function frameLoop(){  
    actualizarEstadoJuego();
    moverNave();
    moverDisparos();
    moverDisparosEnemigos();
    verificarContacto(); 
    actualizaEnemigos();
    dibujarFondo();
    dibujarEnemigos();
    dibujarDisparosEnemigos();
    dibujarDisparos();
    dibujarTexto();
    dibujarNave();       
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

function loadMedia(){
    fondo = new Image();
    fondo.src = 'fondo.jpg';
    
    fondo.onload = function(){
        var intervalo = window.setInterval(frameLoop,1000/55);
    };
 
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

function moverDisparosEnemigos(){
    for(var i in disparosEnemigos){
        var disparo = disparosEnemigos[i];
        disparo.y += 3;
    }
    
    disparosEnemigos = disparosEnemigos.filter(function(disparo){
        return disparo.y < canvas.height;
    });
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
      
       if(!teclado.fire){
            fire(); //Dispara
            teclado.fire = true;
            
            audio = new Audio();
            audio.src = "Sounds/shoot.mp3";
            audio.play();
       }
   }
   else{
       teclado.fire = false;
    }
    
    if (nave.estado == 'hit'){
        nave.contador++;
        if (nave.contador >=20){
            nave.contador=0;
            nave.estado='muerto';
            juego.estado='perdido';
            
            audio = new Audio();
            audio.src = "Sounds/glass_breaking.wav";
            audio.play();
            
            textoRespuesta.tiutlo = 'Game Over'
            textoRespuesta.subtitulo = 'presiona R para continuar';
            textoRespuesta.contador =0;
        }
    }
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
                
                audio = new Audio();
                audio.src = "Sounds/explosion.mp3";
                audio.play();
                
            }
        }
    }
    
    if(nave.estado == 'hit' || nave.estado == 'muerto'){
        //Esta vivo
        return;
    }
    for (var i in disparosEnemigos){
        disparo = disparosEnemigos[i];
        
        if (hit(disparo,nave)){
            nave.estado = 'hit';
            console.log("contacto");
        }
    }
        
        
}

//Se cargan las imagenes
agregarEventosTeclado(); //Se cargan los eventos del teclado
loadMedia(); //Se carga el juego
backgroundMusic();


