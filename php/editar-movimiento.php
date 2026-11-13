<?php
header("Content-Type: application/json; charset=utf-8");

$metodo = $_SERVER["REQUEST_METHOD"];

if ($metodo !== "POST"){
    http_response_code(405);
    $mensaje = ["mensaje" => "solo admite peticiones 'POST'"];
    echo json_encode($mensaje);
    exit;
}

$cuerpo = file_get_contents("php://input");

$datos = json_decode($cuerpo, true);

$id = $datos["id"] ?? null;


if(!is_int($id) || $id <= 0 || $id > 2147483647){
    http_response_code(400);
    $mensaje = ["mensaje" => "El ID del movimiento no es válido"];
    echo json_encode($mensaje);
    exit;
}
if (!isset($datos["concepto"], $datos["importe"], $datos["fecha"], $datos["hora"], $datos["categoria"], $datos["cuenta"], $datos["tipo"])) {
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
if(!is_string($datos["fecha"]) || preg_match('/\A[0-9]{4}-[0-9]{2}-[0-9]{2}\z/', $datos["fecha"]) !== 1){
    http_response_code(400);
    $mensaje = ["mensaje" => "La fecha introducida no es válida"];
    echo json_encode($mensaje);
    exit;
}
if(!is_string($datos["cuenta"]) || !ctype_digit($datos["cuenta"]) || $datos["cuenta"] <= 0 || $datos["cuenta"] > 2147483647){
    http_response_code(400);
    $mensaje = ["mensaje" => "No se ha encontrado la cuenta"];
    echo json_encode($mensaje);
    exit;
}
$anio = substr($datos["fecha"], 0, 4);
$mes = substr($datos["fecha"], 5, 2);
$dia = substr($datos["fecha"], 8, 2);
if(!checkdate($mes, $dia, $anio)){
    http_response_code(400);
    $mensaje = ["mensaje" => "La fecha introducida no es posible"];
    echo json_encode($mensaje);
    exit;
}
if(!is_string($datos["hora"]) || strlen($datos["hora"]) !== 5 || $datos["hora"][2] !== ":"){
    http_response_code(400);
    $mensaje = ["mensaje" => "La hora introducida no es válida"];
    echo json_encode($mensaje);
    exit;
}
$hora = substr($datos["hora"], 0, 2);
$minutos = substr($datos["hora"], 3, 2);
if(!ctype_digit($hora) || !ctype_digit($minutos) || $hora > 23 || $minutos > 59){
    http_response_code(400);
    $mensaje = ["mensaje" => "La hora introducida no es posible"];
    echo json_encode($mensaje);
    exit;
}
if(!is_string($datos["concepto"]) || trim($datos["concepto"]) === "" || mb_strlen(trim($datos["concepto"])) > 200){
    http_response_code(400);
    $mensaje = ["mensaje" => "El concepto no es válido"];
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
if($datos["tipo"] === "ingreso"){
    if(!isset($datos["procedencia"]) || !is_string($datos["procedencia"]) || trim($datos["procedencia"]) === "" || mb_strlen(trim($datos["procedencia"])) > 50){
        http_response_code(400);
        $mensaje = ["mensaje" => "La procedencia no es válido"];
        echo json_encode($mensaje);
        exit;
    }
}
if($datos["tipo"] === "gasto"){
    if(!isset($datos["medioPago"]) || !in_array($datos["medioPago"], ["efectivo", "tarjeta", "transferencia", "otro"], true)){
        http_response_code(400);
        $mensaje = ["mensaje" => "El medio de pago no es válido"];
        echo json_encode($mensaje);
        exit;
    }
}
if ($datos["tipo"] === "ingreso") {
    $procedencia = trim($datos["procedencia"]);
    $medioPago = null;
} else {
    $procedencia = null;
    $medioPago = $datos["medioPago"];
}
if(isset($datos["notas"]) && (!is_string($datos["notas"]) || mb_strlen($datos["notas"]) > 500)){
    http_response_code(400);
    $mensaje = ["mensaje" => "Texto demasiado largo"];
    echo json_encode($mensaje);
    exit;
}

try {
    require_once __DIR__ . "/conexion.php";

    $sql = "UPDATE movimiento
            SET concepto = :concepto,
                importe = :importe,
                nota = :notas,
                fecha = :fecha,
                hora = :hora,
                idcategoria = ca.id,
                idcuenta = cu.id,
                procedencia = :procedencia,
                medioPago = :medioPago
            FROM categoria AS ca, cuenta AS cu
            WHERE movimiento.id = :id 
            AND movimiento.idusuario = :idUsuario
            AND ca.id = :categoria
            AND ca.idusuario = movimiento.idusuario
            AND ca.tipo = movimiento.tipo
            AND movimiento.tipo = :tipo
            AND cu.id = :cuenta
            AND cu.idusuario = movimiento.idusuario";
    $consulta = $conexion->prepare($sql);

    $consulta->execute([
        "id" => $id,
        "concepto" => trim($datos["concepto"]),
        "importe" => $datos["importe"],
        "notas" => $datos["notas"] ?? null,
        "fecha" => $datos["fecha"],
        "hora" => $datos["hora"],
        "categoria" => $datos["categoria"],
        "cuenta" => $datos["cuenta"],
        "procedencia" => $procedencia,
        "medioPago" => $medioPago,
        "tipo" => $datos["tipo"],
        "idUsuario" => 1
    ]);

    if ($consulta->rowCount() === 0) {
        http_response_code(404);
        $mensaje = ["mensaje" => "Movimiento no encontrado o categoría o cuenta no válida"];
        echo json_encode($mensaje);
        exit;
    }

    $respuesta = [
        "id" => $id,
        "concepto" => $datos["concepto"],
        "importe" => $datos["importe"],
        "notas" => $datos["notas"] ?? null,
        "fecha" => $datos["fecha"],
        "hora" => $datos["hora"],
        "categoria" => $datos["categoria"],
        "cuenta" => $datos["cuenta"],
        "procedencia" => $procedencia,
        "medioPago" => $medioPago
    ];
} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "Correcto" => false,
        "mensaje" => "No se ha podido editar el movimiento en el servidor"
    ];
}

echo json_encode($respuesta);
