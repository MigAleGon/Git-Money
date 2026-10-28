// variables constantes que detectan el 
// elemento con ese id en el HTML(document)

const botonIngreso = document.getElementById("btn-ingreso")
const botonGasto = document.getElementById("btn-gasto")
const botonCerrar = document.getElementById("btn-cerrar")
const botonesFiltros = document.querySelectorAll(".btn-filtro")
const botonUsuario = document.getElementById("boton-usuario")
const panelUsuario = document.getElementById("panel-usuario")
const menuUsuario = document.querySelector(".usuario-menu") // guarda el primer elemento con dicha clase y lo que contiene
const dialogoMovimiento = document.getElementById("dialogo-movimiento")
const tituloMovimiento = document.getElementById("titulo-movimiento")
const formularioMovimiento = document.getElementById("formulario-movimiento")
const fecha = document.getElementById("fecha")
const hora = document.getElementById("hora")
const categoriaMovimiento = document.getElementById("categoria-movimiento")
const concepto = document.getElementById("concepto")
const importe = document.getElementById("importe")
const notas = document.getElementById("notas")


// función asincrona, como una normal pero 
// permite usar await
async function comprobarServidor() {
    // try y catch sirve para tener los errores controlados
    try{
        // await espera una respuesta del servidor
        // fetch hace la petición al servidor
        const respuesta = await fetch("estado.php")
        // .ok indica si el servidor respondió exitosamente
        if (!respuesta.ok){
            // Crea un mensaje de error personalizado
            throw new Error("No se ha podido conectar con el servidor")
        } 
        // .json() lee el cuerpo del php y lo interpreta como json
        const datos = await respuesta.json()
        console.log(datos.mensaje)
    // catch se ejecuta si el try dio error
    } catch(error){console.log(error.message)}
}

async function probarEnvio() {
    try{
        const movimientoPrueba = {
            "concepto": "Prueba ingreso",
            "importe": 25
        }
        const respuesta = await fetch("guardar-movimiento.php", {
            method: "POST", // Indica al PHP que el método será POST
            headers: {"Content-Type": "application/json"}, // Indica el encabezado del php
            body: JSON.stringify(movimientoPrueba) // convierte el objeto en json
        })
        
        if(!respuesta.ok){
            throw new Error("La prueba del envío fallo exitosamente")
        }

        const datos = await respuesta.json()
        console.log(datos.metodo)

    } catch (error){console.log(error.message)}
}

// DISTINCIÓN DE VENTANAS DE BOTONES
// objetos de categorías
const categoriaIngreso = [{texto: "Nómina", valor: "nomina"},
                          {texto: "Bizum", valor: "bizum"},
                          {texto: "Transacción", valor: "transaccion"},
                          {texto: "Venta", valor: "venta"},
                          {texto: "Regalo", valor: "regalo"}]
const categoriaGasto = [{texto: "Alimentación", valor: "alimentacion"},
                         {texto: "Alquiler", valor: "alquiler"},
                         {texto: "Coche", valor: "coche"},
                         {texto: "Adicciones", valor: "adicciones"},
                         {texto: "Ocio", valor: "ocio"}]

let Movimiento // ser rellenará al apretar cualquier boton de movimiento

function abrirVentana(textoTitulo, tipo) {
    tipoMovimiento = tipo
    formularioMovimiento.reset() //limpia el formulario al abrirlo

    dialogoMovimiento.setAttribute("data-tipo", tipo)

    //Este obtiene la fecha actual
    const ahora = new Date() 
    // String() convierte un int a texto
    // getFullYear() devuelve el año actual
    const anio = String(ahora.getFullYear()) 
    // padStart() el primer parámetro es la cantidad de caracteres que va a tener nuestro texto como mínimo y el segundo es el relleno de este
    // getMonth() devuelve el mes actual
    const mes = String(ahora.getMonth() + 1).padStart(2, "0") 
    // getDate() devuelve el día actual
    const dia = String(ahora.getDate()).padStart(2, "0")
    const fechaActual = anio + "-" + mes + "-" + dia
    
    // getHours() devuelve la hora actual
    const horaNum = String(ahora.getHours()).padStart(2, "0")
    // getMinutes() devuelve los minutos actuales
    const minutos = String(ahora.getMinutes()).padStart(2, "0")
    const horaActual = horaNum + ":" + minutos

    tituloMovimiento.textContent = textoTitulo // textContent cambia el contenido del texto
    fecha.value = fechaActual // value cambia el valor que tiene 
    hora.value = horaActual

    categoriaMovimiento.replaceChildren() // Elimina las opciones por defecto
    const opcionDef = new Option("Selecciona una categoría", "") // crea una nueva opcion

    let categoriasDisponibles
    
    categoriaMovimiento.add(opcionDef)
    if(tipo === "ingreso"){
        categoriasDisponibles = categoriaIngreso
    } else{
        categoriasDisponibles = categoriaGasto
    }

    for(const categoria of categoriasDisponibles){
        const opcion = new Option(categoria.texto, categoria.valor)
        categoriaMovimiento.add(opcion)
    }

    dialogoMovimiento.showModal() // muestra el contenido de <dialog>
}

function calcularIngresos(){
    let totalIngresos = 0
    for(const movimiento of movimientos){
        if(movimiento.tipo === "ingreso"){
            totalIngresos += movimiento.importe
        }
    }
    console.log(totalIngresos)
}

// Función para detectar eventos que ocurren en el html

botonIngreso.addEventListener("click", function() {
    abrirVentana("Registrar ingreso" , "ingreso")
})

botonGasto.addEventListener("click", function() {
    abrirVentana("Registrar gasto", "gasto")
})

botonCerrar.addEventListener("click", function() {
    // Cierra <dialog>
    dialogoMovimiento.close()
})

botonUsuario.addEventListener("click", function() {
    panelUsuario.hidden = !panelUsuario.hidden
    // setAttribute modifica atributos del HTML
    // además convierte el valor automáticamente a string
    // para que HTML lo pueda leer
    botonUsuario.setAttribute("aria-expanded", !panelUsuario.hidden) 
})

// evento es un objeto que pasa el navegador con información de lo que 
// acaba de ocurrir, en este caso sería pulsar una tecla y en el siguiente
// el click
// si hacemos un console.log(evento.target) podemos ver que la consola
// devuelve el contenedor html donde se ha hecho click si el evento
// lo que registra son clicks
document.addEventListener("keydown", function(evento) { 
    if (evento.key === "Escape" && !panelUsuario.hidden) {
        panelUsuario.hidden = true
        botonUsuario.setAttribute("aria-expanded", "false") 
        botonUsuario.focus()
    }
})

document.addEventListener("click", function(evento) {
    if (!panelUsuario.hidden && !menuUsuario.contains(evento.target)) {
        panelUsuario.hidden = true
        botonUsuario.setAttribute("aria-expanded", "false")
    }
    console.log(evento.target)
})

// GUARDAR VALORES DEL MOVIMIENTO
const movimientos = []

formularioMovimiento.addEventListener("submit", function(evento) {
    evento.preventDefault()
    const conceptoValor = concepto.value
    const importeValor = Number(importe.value)
    const categoriaValor = categoriaMovimiento.value
    const fechaValor = fecha.value
    const horaValor = hora.value
    const notasValor = notas.value
    
    const movimiento = {
        concepto: conceptoValor,
        importe: importeValor,
        categoria: categoriaValor,
        fecha: fechaValor,
        hora: horaValor,
        notas: notasValor,
        tipo: tipoMovimiento
    }

    // Push añade el elemento al array
    movimientos.push(movimiento)

    calcularIngresos()
    
    console.log(movimientos, movimientos.length)
    dialogoMovimiento.close()
})

// RECORRER BOTONES FILTRO
for (const boton of botonesFiltros){
    boton.addEventListener("click", function() {
        for(const botonFiltro of botonesFiltros){
            botonFiltro.setAttribute("aria-pressed", "false")
        }
        boton.setAttribute("aria-pressed" , "true")
    })
}

comprobarServidor()
probarEnvio()
