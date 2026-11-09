<?php
header("Content-Type: application/json; charset=utf-8");
// muestra el tipo de petición es decir GET o POSt 
// dependiendo de si solo recibe o también envía, respectivamente
// GET Consulta información sin modificarla
// POST envía datos para que el server los procese
$metodo = $_SERVER["REQUEST_METHOD"]; 

if ($metodo !== "POST"){
    // http_response_code es para controlar las peticiones
    // 405 significa "método no permitido"
    http_response_code(405); 
    $mensaje = ["mensaje" => "solo admite peticiones 'POST'"];
    echo json_encode($mensaje);
    exit; //exit hace que el php se deje de ejecutar
}
// file_get_contents se usa para leer lo que mandamos desde el js
// admite un parámetro, php://input es una dirección especial de php
// sirve para leer el cuerpo de la petición que acaba de recibit
$cuerpo = file_get_contents("php://input");
// json_decode transforma el json a un array asociativo
// el primer parámetro es lo que va a leer
// el segundo (true) nos permite trabajar con las claves de este
$datos = json_decode($cuerpo, true);

// json_last error() permite consultar el error de la última operación
// si no hay error devuelve JSON_ERROR_NONE
if (json_last_error() !== JSON_ERROR_NONE){
    http_response_code(400); // 400 indica petición incorrecta
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

    $IDCuenta = 1;
    $IDUsuario = 1;

    if ($datos["tipo"] === "ingreso") {
        $procedencia = "prueba";
        $medioPago = null;
    } else {
        $medioPago = "efectivo";
        $procedencia = null;
    }
    
    // comando para insertar filas en sql
    $sql = "INSERT INTO movimiento (concepto, importe, fecha, hora, nota, procedencia, medioPago, tipo, IDCuenta, IDCategoria, IDUsuario)
            VALUES (:concepto, :importe, :fecha, :hora, :nota, :procedencia, :medioPago, :tipo, :IDCuenta, :IDCategoria, :IDUsuario)";
    // prepara la conexion con la bd
    $consulta = $conexion->prepare($sql);

    // ejecuta el comando en sql
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
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se ha podido enviar los datos al servidor"
    ];
}





echo json_encode($respuesta);
