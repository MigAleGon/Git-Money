<?php

header("Content-Type: application/json; charset=utf-8");

try{
    require_once __DIR__ . "/conexion.php";

    // Recupera las categorías ordenadas alfabéticamente para la interfaz.
    $resultado = $conexion->query("SELECT id, nombre, tipo FROM categoria ORDER BY nombre");

    $respuesta = $resultado->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $error){
    // Registra el detalle en el servidor y devuelve un mensaje genérico al cliente.
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se han podido consultar las categorías"
    ];
}

echo json_encode($respuesta);
