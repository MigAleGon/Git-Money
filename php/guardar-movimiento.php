<?php
header("Content-Type: application/json; charset=utf-8");

// Acepta únicamente solicitudes POST con los datos del movimiento.
$metodo = $_SERVER["REQUEST_METHOD"];

if ($metodo !== "POST"){
    http_response_code(405);
    $mensaje = ["mensaje" => "solo admite peticiones 'POST'"];
    echo json_encode($mensaje);
    exit;
}

// Lee el cuerpo JSON como un array asociativo de PHP.
$cuerpo = file_get_contents("php://input");

$datos = json_decode($cuerpo, true);

// Rechaza JSON incorrecto, datos obligatorios ausentes y valores no válidos.
if (json_last_error() !== JSON_ERROR_NONE){
    http_response_code(400);
    $mensaje = ["mensaje" => "El cuerpo no contiene JSON válido"];
    echo json_encode($mensaje);
    exit;
}
if (!isset($datos["concepto"], $datos["importe"], $datos["categoria"], $datos["cuenta"], $datos["fecha"], $datos["hora"], $datos["tipo"])) {
    http_response_code(400);
    $mensaje = ["mensaje" => "Faltan datos"];
    echo json_encode($mensaje);
    exit;
}
if(!is_string($datos["categoria"]) || !ctype_digit($datos["categoria"]) || $datos["categoria"] <= 0 || $datos["categoria"] > 2147483647){
    http_response_code(400);
    $mensaje = ["mensaje" => "No se ha encontrado la categoría"];
    echo json_encode($mensaje);
    exit;
}
if(!is_string($datos["cuenta"]) || !ctype_digit($datos["cuenta"]) || $datos["cuenta"] <= 0 || $datos["cuenta"] > 2147483647){
    http_response_code(400);
    $mensaje = ["mensaje" => "No se ha encontrado la cuenta"];
    echo json_encode($mensaje);
    exit;
}
// preg_match, expresiones regulares de esas chungas para coincidir un texto
if(!is_string($datos["fecha"]) || preg_match('/\A[0-9]{4}-[0-9]{2}-[0-9]{2}\z/', $datos["fecha"]) !== 1){
    http_response_code(400);
    $mensaje = ["mensaje" => "La fecha introducida no es válida"];
    echo json_encode($mensaje);
    exit;
}
// toma solo el tramo del string que le indiquemos, el primer número es la posición
// y el segundo la longitud
$anio = substr($datos["fecha"], 0, 4);
$mes = substr($datos["fecha"], 5, 2);
$dia = substr($datos["fecha"], 8, 2);
// devuelve true si es una fecha posible, false si no
if(!checkdate($mes, $dia, $anio)){
    http_response_code(400);
    $mensaje = ["mensaje" => "La fecha introducida no es posible"];
    echo json_encode($mensaje);
    exit;
}
// strlen() el length de php
if(!is_string($datos["hora"]) || strlen($datos["hora"]) !== 5 || $datos["hora"][2] !== ":"){
    http_response_code(400);
    $mensaje = ["mensaje" => "La hora introducida no es válida"];
    echo json_encode($mensaje);
    exit;
}
$hora = substr($datos["hora"], 0, 2);
$minutos = substr($datos["hora"], 3, 2);
// ctype_digit, comprueba que sea un número
if(!ctype_digit($hora) || !ctype_digit($minutos) || $hora > 23 || $minutos > 59){
    http_response_code(400);
    $mensaje = ["mensaje" => "La hora introducida no es posible"];
    echo json_encode($mensaje);
    exit;
}
if(!is_numeric($datos["importe"]) || $datos["importe"] <= 0 || $datos["importe"] > 9999999999.99 || $datos["importe"] != round($datos["importe"], 2)){
    http_response_code(400);
    $mensaje = ["mensaje" => "Los datos introducidos son incorrectos"];
    echo json_encode($mensaje);
    exit;
}
if($datos["tipo"] !== "ingreso" && $datos["tipo"] !== "gasto"){
    http_response_code(400);
    $mensaje = ["mensaje" => "El movimiento no tiene un tipo válido"];
    echo json_encode($mensaje);
    exit;
}
// mb_strlen() igual que strlen() pero aceptar caracteres con ñ y tildes
if(!is_string($datos["concepto"]) || trim($datos["concepto"]) === "" || mb_strlen(trim($datos["concepto"])) > 200){
    http_response_code(400);
    $mensaje = ["mensaje" => "El concepto no es válido"];
    echo json_encode($mensaje);
    exit;
}
if($datos["tipo"] === "ingreso"){
    if(!isset($datos["procedencia"]) || !is_string($datos["procedencia"]) || trim($datos["procedencia"]) === "" || mb_strlen(trim($datos["procedencia"])) > 50){
        http_response_code(400);
        $mensaje = ["mensaje" => "La procedencia no es válido"];
        echo json_encode($mensaje);
        exit;
    }
}
if($datos["tipo"] === "gasto"){
    // in_array($variable, [arrayobjetivo], true)
    // revisa que en el array que le hemos indicado exista algun elemento del array objetivo, sí cumple la condición devuelve true
    if(!isset($datos["medioPago"]) || !in_array($datos["medioPago"], ["efectivo", "tarjeta", "transferencia", "otro"], true)){
        http_response_code(400);
        $mensaje = ["mensaje" => "El medio de pago no es válido"];
        echo json_encode($mensaje);
        exit;
    }
}
if(isset($datos["notas"]) && (!is_string($datos["notas"]) || mb_strlen($datos["notas"]) > 500)){
    http_response_code(400);
    $mensaje = ["mensaje" => "La nota debe ser un texto de hasta 500 caracteres"];
    echo json_encode($mensaje);
    exit;
}

try {
    require_once __DIR__ . "/conexion.php";

    // usuario fijos durante esta fase de desarrollo.

    $IDUsuario = 1;

    $existeCategoria = "SELECT 1 FROM categoria
        WHERE id = :categoria
        AND tipo = :tipo
        AND idusuario = :idusuario";
    
    $comprobacionCategoria = $conexion->prepare($existeCategoria);
    
    $comprobacionCategoria->execute([
        "categoria" => $datos["categoria"],
        "tipo" => $datos["tipo"],
        "idusuario" => $IDUsuario
    ]);

    if(!$comprobacionCategoria->fetchColumn()){
        http_response_code(400);
        $mensaje = ["mensaje" => "La categoría no es válida"];
        echo json_encode($mensaje);
        exit;
    }

    $existeCuenta = "SELECT 1 FROM cuenta
        WHERE id = :cuenta
        AND idusuario = :idusuario";

    $comprobacionCuenta = $conexion->prepare($existeCuenta);

    $comprobacionCuenta->execute([
        "cuenta" => $datos["cuenta"],
        "idusuario" => $IDUsuario
    ]);

    if(!$comprobacionCuenta->fetchColumn()){
        http_response_code(400);
        $mensaje = ["mensaje" => "La cuenta no es válida"];
        echo json_encode($mensaje);
        exit;
    }


    // Valores provisionales: el campo ajeno al tipo queda en NULL por la regla SQL.
    if ($datos["tipo"] === "ingreso") {
        $procedencia = trim($datos["procedencia"]);
        $medioPago = null;
    } else {
        $medioPago = $datos["medioPago"];
        $procedencia = null;
    }

    $sql = "INSERT INTO movimiento (concepto, importe, fecha, hora, nota, procedencia, medioPago, tipo, IDCuenta, IDCategoria, IDUsuario)
            VALUES (:concepto, :importe, :fecha, :hora, :nota, :procedencia, :medioPago, :tipo, :IDCuenta, :IDCategoria, :IDUsuario)
            RETURNING id";

    // Vincula los datos a parámetros para no concatenarlos en la consulta SQL.
    $consulta = $conexion->prepare($sql);

    $consulta->execute([
        "concepto" => trim($datos["concepto"]),
        "importe" => $datos["importe"],
        "fecha" => $datos["fecha"],
        "hora" => $datos["hora"],
        "nota" => $datos["notas"] ?? null,
        "procedencia" => $procedencia,
        "medioPago" => $medioPago,
        "tipo" => $datos["tipo"],
        "IDCuenta" => $datos["cuenta"],
        "IDCategoria" => $datos["categoria"],
        "IDUsuario" => $IDUsuario
    ]);

    // obtiene el valor de la primera columna que devuelve el resultado
    $idMovimiento = $consulta->fetchColumn();

    $respuesta = [
        "metodo" => $_SERVER["REQUEST_METHOD"],
        "id" => $idMovimiento,
        "conceptoRecibido" => $datos["concepto"],
        "importeRecibido" => $datos["importe"],
        "procedencia" => $procedencia,
        "medioPago" => $medioPago,
        "idCuenta" => $datos["cuenta"],
        "idUsuario" => $IDUsuario
    ];
} catch (Throwable $error) {
    // Registra el detalle en el servidor y devuelve un mensaje genérico al cliente.
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se ha podido enviar los datos al servidor"
    ];
}

echo json_encode($respuesta);
