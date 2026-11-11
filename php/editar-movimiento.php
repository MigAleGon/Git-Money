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


if(!is_int($id) || $id <= 0){
    http_response_code(400);
    $mensaje = ["mensaje" => "El ID del movimiento no es válido"];
    echo json_encode($mensaje);
    exit;
}
if (!isset($datos["concepto"], $datos["importe"], $datos["fecha"], $datos["hora"], $datos["categoria"], $datos["tipo"])) {
    http_response_code(400);
    $mensaje = ["mensaje" => "Faltan datos"];
    echo json_encode($mensaje);
    exit;
}
if(!is_string($datos["concepto"]) || trim($datos["concepto"]) === ""){
    http_response_code(400);
    $mensaje = ["mensaje" => "El concepto no es válido"];
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
if($datos["tipo"] === "ingreso"){
    if(!isset($datos["procedencia"]) || !is_string($datos["procedencia"]) || trim($datos["procedencia"]) === ""){
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

try {
    require_once __DIR__ . "/conexion.php";

    $sql = "UPDATE movimiento
            SET concepto = :concepto,
                importe = :importe,
                nota = :notas,
                fecha = :fecha,
                hora = :hora,
                idcategoria = c.id,
                procedencia = :procedencia,
                medioPago = :medioPago
            FROM categoria AS c
            WHERE movimiento.id = :id 
            AND movimiento.idusuario = :idUsuario
            AND c.id = :categoria
            AND c.idusuario = movimiento.idusuario
            AND c.tipo = movimiento.tipo
            AND movimiento.tipo = :tipo";
    $consulta = $conexion->prepare($sql);

    $consulta->execute([
        "id" => $id,
        "concepto" => trim($datos["concepto"]),
        "importe" => $datos["importe"],
        "notas" => $datos["notas"] ?? null,
        "fecha" => $datos["fecha"],
        "hora" => $datos["hora"],
        "categoria" => $datos["categoria"],
        "procedencia" => $procedencia,
        "medioPago" => $medioPago,
        "tipo" => $datos["tipo"],
        "idUsuario" => 1
    ]);

    if ($consulta->rowCount() === 0) {
        http_response_code(404);
        $mensaje = ["mensaje" => "Movimiento no encontrado o categoría no válida"];
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