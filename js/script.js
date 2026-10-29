// variables constantes que detectan el 
// elemento con ese id en el HTML(document)

const botonIngreso = document.getElementById("btn-ingreso")
const botonGasto = document.getElementById("btn-gasto")
const botonCerrar = document.getElementById("btn-cerrar")
const botonGuardar = document.getElementById("btn-guardar")
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
const tarjetaBalance = document.getElementById("tarjeta-balance")
const tarjetaIngresos = document.getElementById("tarjeta-ingresos")
const tarjetaGastos = document.getElementById("tarjeta-gastos")
const cuerpoTabla = document.querySelector("tbody")

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

let tipoMovimiento // ser rellenará al apretar cualquier boton de movimiento

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

function calcularMovimiento() {
    let totalIngresos = 0
    let totalGastos = 0
    let totalBalance = 0
    const ahora = new Date()

    for(const movimiento of movimientos){
        // split divide en un array un texto y lo separa en función
        // del caracter que le indiquemos
        const anio = movimiento.fecha.split("-")[0] 
        const mes = movimiento.fecha.split("-")[1]

        if(anio === String(ahora.getFullYear()) && 
           mes === String((ahora.getMonth() + 1)).padStart(2, "0")) {
            if (movimiento.tipo === "ingreso"){
                totalIngresos += movimiento.importe
            } else if (movimiento.tipo === "gasto"){
                totalGastos -= movimiento.importe
            }
        }

        if(movimiento.tipo === "ingreso"){
            totalBalance += movimiento.importe
        } else if(movimiento.tipo === "gasto"){
            totalBalance -= movimiento.importe
        }
    }


    // toFixed establece el número de decimales que tendrá
    // también lo convierte a String
    tarjetaIngresos.textContent = totalIngresos.toFixed(2) + " €"
    tarjetaGastos.textContent = totalGastos.toFixed(2) + " €"
    tarjetaBalance.textContent = totalBalance.toFixed(2) + " €"
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
})

// GUARDAR VALORES DEL MOVIMIENTO
const movimientos = []

formularioMovimiento.addEventListener("submit", function(evento) {
    evento.preventDefault()
    const conceptoValor = concepto.value.trim()
    const importeValor = Number(importe.value)
    const categoriaValor = categoriaMovimiento.value
    const fechaValor = fecha.value
    const horaValor = hora.value
    const notasValor = notas.value
    
    if(conceptoValor === "") {
        alert("El concepto no puede estar vacío.")
        return 
    }

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

    calcularMovimiento()
    mostrarMovimientos()
    
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

// AÑADE MOVIMIENTOS A LA TABLA
function mostrarMovimientos(){
    cuerpoTabla.replaceChildren()

    for(const movimiento of movimientos){
        const fila = document.createElement("tr") //crea un elemento HTML
        const celdaConcepto = document.createElement("td")
        const celdaCategoria = document.createElement("td")
        const celdaFecha = document.createElement("td")
        const celdaImporte = document.createElement("td")
        
        const partesFecha = movimiento.fecha.split("-")
        const anio = partesFecha[0]
        const mes = partesFecha[1]
        const dia = partesFecha[2]
        const fechaFormateada = dia + "/" + mes + "/" + anio

        let categoriaEncontrada
        if(movimiento.tipo === "ingreso"){
            // finde busca en un array lo que le indiquemos y devuelve el primer elemento
            // que cumple con la condición
            categoriaEncontrada = categoriaIngreso.find(function(valor) {
                return valor.valor === movimiento.categoria
            })
        } else if(movimiento.tipo === "gasto"){
            categoriaEncontrada = categoriaGasto.find(function(valor){
                return valor.valor === movimiento.categoria
            })
        }

        celdaConcepto.textContent = movimiento.concepto
        celdaCategoria.textContent = categoriaEncontrada.texto
        celdaFecha.textContent = fechaFormateada


        if(movimiento.tipo === "ingreso"){
            celdaImporte.textContent = "+" + movimiento.importe.toFixed(2) + " €"
            // classList.add() le añade una clase a el objeto html que indiquemos
            celdaImporte.classList.add("importe-ingreso")
        } else if(movimiento.tipo === "gasto"){
            celdaImporte.textContent = "-" + movimiento.importe.toFixed(2) + " €"
            celdaImporte.classList.add("importe-gasto")
        }

        // append añade al contenedor lo que indiquemos en los parentesis
        fila.append(celdaConcepto)
        fila.append(celdaCategoria)
        fila.append(celdaFecha)
        fila.append(celdaImporte)

        cuerpoTabla.append(fila)
    }
}

comprobarServidor()
probarEnvio()
mostrarMovimientos()