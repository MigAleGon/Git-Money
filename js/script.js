// variables constantes que detectan el 
// elemento con ese id en el HTML(document)

const botonIngreso = document.getElementById("btn-ingreso")
const botonGasto = document.getElementById("btn-gasto")
const dialogoMovimiento = document.getElementById("dialogo-movimiento")
const botonCerrar = document.getElementById("btn-cerrar")
const tituloMovimiento = document.getElementById("titulo-movimiento")
const formularioMovimiento = document.getElementById("formulario-movimiento")
const fecha = document.getElementById("fecha")
const hora = document.getElementById("hora")
const categoriaMovimiento = document.getElementById("categoria-movimiento")
const concepto = document.getElementById("concepto")
const importe = document.getElementById("importe")
const notas = document.getElementById("notas")

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

function abrirVentana(textoTitulo, tipo){
    tipoMovimiento = tipo
    formularioMovimiento.reset() //limpia el formulario al abrirlo

    //Este obtiene la fecha actual
    const ahora = new Date() 
    // String() convierte un int a texto
    // getFullYear() devuelve el año actual
    const ano = String(ahora.getFullYear()) 
    // padStart() el primer parámetro es la cantidad de caracteres que va a tener nuestro texto como mínimo y el segundo es el relleno de este
    // getMonth() devuelve el mes actual
    const mes = String(ahora.getMonth() + 1).padStart(2, "0") 
    // getDate() devuelve el día actual
    const dia = String(ahora.getDate()).padStart(2, "0")
    const fechaActual = ano + "-" + mes + "-" + dia
    
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

// Función para detectar eventos que ocurren en el html

botonIngreso.addEventListener("click", function(){
    abrirVentana("Registrar ingreso" , "ingreso")
})

botonGasto.addEventListener("click", function() {
    abrirVentana("Registrar gasto", "gasto")
})

botonCerrar.addEventListener("click", function() {
    // Cierra <dialog>
    dialogoMovimiento.close()
})

// GUARDAR VALORES DEL MOVIMIENTO
const movimientos = []

formularioMovimiento.addEventListener("submit", function(evento){
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

    console.log(movimientos, movimientos.length)
    dialogoMovimiento.close()
})