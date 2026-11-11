// Referencias a los elementos de la interfaz.
const botonIngreso = document.getElementById("btn-ingreso")
const botonGasto = document.getElementById("btn-gasto")
const botonCerrar = document.getElementById("btn-cerrar")
const botonGuardar = document.getElementById("btn-guardar")
const botonesFiltros = document.querySelectorAll(".btn-filtro")

const dialogoMovimiento = document.getElementById("dialogo-movimiento")
const tituloMovimiento = document.getElementById("titulo-movimiento")
const formularioMovimiento = document.getElementById("formulario-movimiento")
const campoProcedencia = document.getElementById("campo-procedencia")
const procedencia = document.getElementById("procedencia")
const campoMedioPago = document.getElementById("campo-medio-pago")
const medioPago = document.getElementById("medioPago")
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

// Datos del servidor y selección actual de la interfaz.
let categorias = []
let movimientos = []
let tipoMovimiento
let idMovimientoEditar = null
let datosFiltro = "todos"

// Carga las categorías que utiliza el formulario y la tabla.
async function cargarCategorias() {
    try {
        const respuesta = await fetch("php/listar-categorias.php")

        if(!respuesta.ok){
            throw new Error("No se ha podido conectar con el servidor")
        }

        categorias = await respuesta.json()
    } catch(error){console.log(error.message)}
}

// Recupera los movimientos guardados y sustituye la lista en memoria.
async function cargarMovimientos() {
    try {
        const respuesta = await fetch("php/listar-movimientos.php")

        if(!respuesta.ok){
            throw new Error("No se ha podido conectar con el servidor")
        }

        const datos = await respuesta.json()
        movimientos = datos
        for (const movimiento of movimientos){
            movimiento.importe = Number(movimiento.importe)
            movimiento.categoria = String(movimiento.categoria)
            movimiento.hora = movimiento.hora.slice(0, 5)
        }
    } catch(error){console.log(error.message)}
}

// Envía el movimiento al servidor en formato JSON.
async function enviarMovimiento(movimiento) {
    try{
        const respuesta = await fetch("php/guardar-movimiento.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(movimiento)
        })

        if(!respuesta.ok){
            throw new Error("La prueba del envío ha fallado.")
        }

        const datos = await respuesta.json()
        console.log(datos)

        return datos
    } catch (error){
        console.log(error.message)
        return false
    }
}

async function enviarBorrado(id) {
     try{
        const respuesta = await fetch("php/borrar-movimiento.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: id})
        })

        if(!respuesta.ok){
            throw new Error("La prueba del envío ha fallado.")
        }

        const datos = await respuesta.json()
        console.log(datos)

        return datos
    } catch (error){
        console.log(error.message)
        return false
    }
}

async function enviarEdicion(movimiento) {
    try{
        const respuesta = await fetch("php/editar-movimiento.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(movimiento)
        })

        if(!respuesta.ok){
            throw new Error("La prueba del envío ha fallado.")
        }

        const datos = await respuesta.json()
        console.log(datos)

        return datos
    } catch (error){
        console.log(error.message)
        return false
    }
}

// Reutiliza el formulario para ingresos y gastos, reiniciando sus valores.
function abrirVentana(textoTitulo, tipo, movimientoEditar = null) {
    tipoMovimiento = tipo
    formularioMovimiento.reset()

    dialogoMovimiento.setAttribute("data-tipo", tipo)

    if (tipo === "ingreso") {
        campoProcedencia.hidden = false
        procedencia.disabled = false
        procedencia.required = true
        campoMedioPago.hidden = true
        medioPago.disabled = true
        medioPago.required = false
    } else if (tipo === "gasto") {
        campoProcedencia.hidden = true
        procedencia.disabled = true
        procedencia.required = false
        campoMedioPago.hidden = false
        medioPago.disabled = false
        medioPago.required = true
    }

    // Usa la fecha y hora locales para rellenar los campos del formulario.
    const ahora = new Date()
    const anio = String(ahora.getFullYear())
    const mes = String(ahora.getMonth() + 1).padStart(2, "0")
    const dia = String(ahora.getDate()).padStart(2, "0")
    const fechaActual = anio + "-" + mes + "-" + dia

    const horaNum = String(ahora.getHours()).padStart(2, "0")
    const minutos = String(ahora.getMinutes()).padStart(2, "0")
    const horaActual = horaNum + ":" + minutos

    tituloMovimiento.textContent = textoTitulo
    fecha.value = fechaActual
    hora.value = horaActual

    categoriaMovimiento.replaceChildren()
    const opcionDef = new Option("Selecciona una categoría", "")
    categoriaMovimiento.add(opcionDef)

    // Ofrece únicamente categorías del mismo tipo que el movimiento.
    const categoriasDisponibles = categorias.filter(function(categoria) {
        return categoria.tipo === tipo
    })
    for(const categoria of categoriasDisponibles){
        const opcion = new Option(categoria.nombre, categoria.id)
        categoriaMovimiento.add(opcion)
    }

    if (movimientoEditar !== null) {
        idMovimientoEditar = movimientoEditar.id
        concepto.value = movimientoEditar.concepto
        importe.value = movimientoEditar.importe
        categoriaMovimiento.value = movimientoEditar.categoria
        fecha.value = movimientoEditar.fecha
        hora.value = movimientoEditar.hora
        notas.value = movimientoEditar.notas ?? ""

        if (tipoMovimiento === "ingreso"){
            procedencia.value = movimientoEditar.procedencia
        } else if (tipoMovimiento === "gasto") {
            medioPago.value = movimientoEditar.medioPago
        }
    } else {
        idMovimientoEditar = null
    }

    dialogoMovimiento.showModal()
}

// Calcula ingresos y gastos del mes actual, y el balance de todo el historial.
function calcularMovimiento() {
    let totalIngresos = 0
    let totalGastos = 0
    let totalBalance = 0
    const ahora = new Date()

    for(const movimiento of movimientos){
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

    tarjetaIngresos.textContent = totalIngresos.toFixed(2) + " €"
    tarjetaGastos.textContent = totalGastos.toFixed(2) + " €"
    tarjetaBalance.textContent = totalBalance.toFixed(2) + " €"
}

// Apertura y cierre del formulario.
botonIngreso.addEventListener("click", function() {
    abrirVentana("Registrar ingreso" , "ingreso")
})

botonGasto.addEventListener("click", function() {
    abrirVentana("Registrar gasto", "gasto")
})

botonCerrar.addEventListener("click", function() {
    dialogoMovimiento.close()
})

// Menú de usuario aparcado: sus elementos HTML también están comentados.
/*
const botonUsuario = document.getElementById("boton-usuario")
const panelUsuario = document.getElementById("panel-usuario")
const menuUsuario = document.querySelector(".usuario-menu")

botonUsuario.addEventListener("click", function() {
    panelUsuario.hidden = !panelUsuario.hidden

    botonUsuario.setAttribute("aria-expanded", !panelUsuario.hidden)
})

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
*/

// Recoge el formulario, envía los datos y actualiza la vista local.
formularioMovimiento.addEventListener("submit", async function(evento) {
    evento.preventDefault()
    
    if(botonGuardar.disabled === true){
        return
    }

    const conceptoValor = concepto.value.trim()
    const importeValor = Number(importe.value)
    const categoriaValor = categoriaMovimiento.value
    const fechaValor = fecha.value
    const horaValor = hora.value
    const notasValor = notas.value
    let procedenciaValor
    let medioPagoValor

    if(conceptoValor === "") {
        alert("El concepto no puede estar vacío.")
        return
    }

    if (tipoMovimiento === "ingreso") {
        procedenciaValor = procedencia.value.trim()
        medioPagoValor = null
    } else if (tipoMovimiento === "gasto") {
        procedenciaValor = null
        medioPagoValor = medioPago.value
    }

    const movimiento = {
        concepto: conceptoValor,
        importe: importeValor,
        categoria: categoriaValor,
        fecha: fechaValor,
        hora: horaValor,
        procedencia: procedenciaValor,
        medioPago: medioPagoValor,
        notas: notasValor,
        tipo: tipoMovimiento
    }

    if (idMovimientoEditar !== null) {
        movimiento.id = idMovimientoEditar
        const enviado = await enviarEdicion(movimiento)

        if (enviado === false) {
            alert("No se ha podido editar el movimiento")
            return
        } else {
            const movimientoEncontrado = movimientos.find(function(otroMovimiento) {
                return otroMovimiento.id === enviado.id
            })

            movimientoEncontrado.concepto = enviado.concepto
            movimientoEncontrado.importe = Number(enviado.importe)
            movimientoEncontrado.notas = enviado.notas
            movimientoEncontrado.fecha = enviado.fecha
            movimientoEncontrado.hora = enviado.hora
            movimientoEncontrado.categoria = String(enviado.categoria)

            if (tipoMovimiento === "ingreso") {
                movimientoEncontrado.procedencia = enviado.procedencia
                movimientoEncontrado.medioPago = null
            } else if (tipoMovimiento === "gasto") {
                movimientoEncontrado.medioPago = enviado.medioPago
                movimientoEncontrado.procedencia = null
            }

            calcularMovimiento()
            mostrarMovimientos()
            dialogoMovimiento.close()
        }

        return
    }

    botonGuardar.disabled = true

    const guardado = await enviarMovimiento(movimiento)

    botonGuardar.disabled = false

    if(guardado === false){
        alert("El movimiento no se pudo guardar")
        return
    }

    movimiento.id = guardado.id

    movimientos.push(movimiento)

    calcularMovimiento()
    mostrarMovimientos()

    dialogoMovimiento.close()
})

// Mantiene un único filtro activo y vuelve a dibujar la tabla.
for (const boton of botonesFiltros){
    boton.addEventListener("click", function() {
        for(const botonFiltro of botonesFiltros){
            botonFiltro.setAttribute("aria-pressed", "false")
        }
        boton.setAttribute("aria-pressed" , "true")

        datosFiltro = boton.dataset.filtro
        mostrarMovimientos()
    })
}

// Reconstruye la tabla según el filtro, con los movimientos más recientes primero.
function mostrarMovimientos(){
    cuerpoTabla.replaceChildren()

    // Ordena una copia para conservar el orden de la lista original.
    let movimientosCopia = movimientos.slice()

    movimientosCopia.sort(function(a, b) {
        const fechaHoraA = a.fecha + "T" + a.hora
        const fechaHoraB = b.fecha + "T" + b.hora

        if(fechaHoraA > fechaHoraB) {
            return -1
        } else if(fechaHoraA < fechaHoraB) {
            return 1
        } else {
            return 0
        }
    })

    for(const movimiento of movimientosCopia){
        if(datosFiltro === "todos" || datosFiltro === movimiento.tipo){
            const fila = document.createElement("tr")
            const botonesContenedor = document.createElement("span")
            const celdaConcepto = document.createElement("td")
            const celdaCategoria = document.createElement("td")
            const celdaFecha = document.createElement("td")
            const celdaHora = document.createElement("td")
            const celdaImporte = document.createElement("td")
            const botonEditar = document.createElement("button")
            const botonBorrar = document.createElement("button")

            // Convierte la fecha ISO (AAAA-MM-DD) al formato DD/MM/AAAA.
            const partesFecha = movimiento.fecha.split("-")
            const anio = partesFecha[0]
            const mes = partesFecha[1]
            const dia = partesFecha[2]
            const fechaFormateada = dia + "/" + mes + "/" + anio

            let categoriaEncontrada = categorias.find(function(categoria){
                return String(categoria.id) === movimiento.categoria
            })

            celdaConcepto.textContent = movimiento.concepto
            celdaCategoria.textContent = categoriaEncontrada.nombre
            celdaFecha.textContent = fechaFormateada
            celdaHora.textContent = movimiento.hora
            botonEditar.setAttribute("aria-label", "Editar movimiento")
            botonEditar.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="M4 16l-1 5 5-1L21 7l-4-4L4 16Z M14 6l4 4"/>
                        </svg>
                    `
            botonEditar.classList.add("boton-tabla", "boton-editar")
            botonBorrar.setAttribute("aria-label", "Borrar movimiento")
            botonBorrar.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7"/>
                        </svg>
                    `
            botonBorrar.classList.add("boton-tabla", "boton-borrar")
            botonesContenedor.classList.add("acciones-movimiento")

            botonBorrar.addEventListener("click", async function() {
                const confirmado = confirm("Seguo que quieres eliminar el movimiento?") // pide una confirmación antes de ejecutar la acción

                if (!confirmado) {
                    return
                }

                const resultado = await enviarBorrado(movimiento.id)

                if (resultado === false){
                    alert("No se pudo borrar el movimiento.")
                    return
                }

                movimientos = movimientos.filter(function(otroMovimiento) {
                    return movimiento.id !== otroMovimiento.id
                })

                mostrarMovimientos()
                calcularMovimiento()
            })

            botonEditar.addEventListener("click", function() {
                abrirVentana("Editar movimiento", movimiento.tipo, movimiento)
            })

            if(movimiento.tipo === "ingreso"){
                celdaImporte.textContent = "+" + movimiento.importe.toFixed(2) + " €"

                celdaImporte.classList.add("importe-ingreso")
            } else if(movimiento.tipo === "gasto"){
                celdaImporte.textContent = "-" + movimiento.importe.toFixed(2) + " €"
                celdaImporte.classList.add("importe-gasto")
            }

            botonesContenedor.append(botonEditar)
            botonesContenedor.append(botonBorrar)
            celdaImporte.append(botonesContenedor)
            fila.append(celdaConcepto)
            fila.append(celdaCategoria)
            fila.append(celdaFecha)
            fila.append(celdaHora)
            fila.append(celdaImporte)

            cuerpoTabla.append(fila)
        }
    }

    // Muestra un mensaje cuando el filtro no produce filas.
    if(cuerpoTabla.children.length === 0){
        const filaVacia = document.createElement("tr")
        const celdaVacia = document.createElement("td")

        celdaVacia.colSpan = 4
        celdaVacia.classList.add("celda-vacia")
        celdaVacia.textContent = "Aún no se han registrado movimientos"

        filaVacia.append(celdaVacia)
        cuerpoTabla.append(filaVacia)
    }
}

// Dibuja el estado inicial e inicia las peticiones de datos.

async function iniciarPagina(){
    await cargarCategorias()
    await cargarMovimientos()
    mostrarMovimientos()
    calcularMovimiento()
}


iniciarPagina()
