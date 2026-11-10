<?php

header("Content-Type: application/json; charset=utf-8");

// Endpoint de diagnóstico: comprueba que puede abrirse la conexión.
try {
    require_once __DIR__ . "/conexion.php";
    $respuesta = [
        "correcto" => true,
        "mensaje" => "PHP conectado con Git Money"
    ];
} catch (Throwable $error) {
    // Registra el detalle en el servidor y devuelve un mensaje genérico al cliente.
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se ha podido conectar con la base de datos"
    ];
}

echo json_encode($respuesta);
