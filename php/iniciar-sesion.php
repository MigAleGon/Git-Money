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

try{
    require_once __DIR__ . "/conexion.php";

    $sql = "SELECT id, hashcontrasenia FROM usuario
            WHERE correoelectronico = :correo";
   
    $consulta = $conexion->prepare($sql);

    $consulta->execute(["correo" => $datos["correo"]]);
    
    $usuarioEncontrado = $consulta->fetch(PDO::FETCH_ASSOC);

} catch (Throwable $error){
    // Registra el detalle en el servidor y devuelve un mensaje genérico al cliente.
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se han podido consultar las categorías"
    ];
}
