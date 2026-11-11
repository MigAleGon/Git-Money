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

try {
    require_once __DIR__ . "/conexion.php";

    $sql = "DELETE FROM movimiento
            WHERE id = :id AND idusuario = :idUsuario";
    $consulta = $conexion->prepare($sql);

    $consulta->execute([
        "id" => $id,
        "idUsuario" => 1
    ]);

    if($consulta->rowCount() === 0){
        http_response_code(404);
        $mensaje = ["mensaje" => "Movimiento no encontrado"];
        echo json_encode($mensaje);
        exit;
    }

    $respuesta = ["id" => $id];
} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "Correcto" => false,
        "mensaje" => "No se ha podido borrar el movimiento en el servidor"
    ];
}


echo json_encode($respuesta);