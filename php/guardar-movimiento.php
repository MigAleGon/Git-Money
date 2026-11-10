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
if (!isset($datos["concepto"], $datos["importe"], $datos["categoria"], $datos["fecha"], $datos["hora"], $datos["tipo"])) {
    http_response_code(400);
    $mensaje = ["mensaje" => "Faltan datos"];
    echo json_encode($mensaje);
    exit;
}
if(!is_numeric($datos["importe"]) || $datos["importe"] <= 0){
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
if(!is_string($datos["concepto"]) || trim($datos["concepto"]) === ""){
    http_response_code(400);
    $mensaje = ["mensaje" => "El concepto no es válido"];
    echo json_encode($mensaje);
    exit;
}

try {
    require_once __DIR__ . "/conexion.php";

    // Cuenta y usuario fijos durante esta fase de desarrollo.
    $IDCuenta = 1;
    $IDUsuario = 1;

    // Valores provisionales: el campo ajeno al tipo queda en NULL por la regla SQL.
    if ($datos["tipo"] === "ingreso") {
        $procedencia = "prueba";
        $medioPago = null;
    } else {
        $medioPago = "efectivo";
        $procedencia = null;
    }

    $sql = "INSERT INTO movimiento (concepto, importe, fecha, hora, nota, procedencia, medioPago, tipo, IDCuenta, IDCategoria, IDUsuario)
            VALUES (:concepto, :importe, :fecha, :hora, :nota, :procedencia, :medioPago, :tipo, :IDCuenta, :IDCategoria, :IDUsuario)";

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
        "IDCuenta" => $IDCuenta,
        "IDCategoria" => $datos["categoria"],
        "IDUsuario" => $IDUsuario
    ]);

    $respuesta = [
        "metodo" => $_SERVER["REQUEST_METHOD"],
        "conceptoRecibido" => $datos["concepto"],
        "importeRecibido" => $datos["importe"],
        "procedencia" => $procedencia,
        "medioPago" => $medioPago,
        "idCuenta" => $IDCuenta,
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
