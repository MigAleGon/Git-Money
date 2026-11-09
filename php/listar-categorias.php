<?php

header("Content-Type: application/json; charset=utf-8");

try{
    require_once __DIR__ . "/conexion.php";

    // query ejecuta la consulta SQL
    $resultado = $conexion->query("SELECT id, nombre, tipo FROM categoria ORDER BY nombre");

    // fetchAll recoge todas las filas
    // PDO::FETCH_ASSOC hace que cada fila
    //  use los nombres de las columnas como claves del objeto
    $respuesta = $resultado->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $error){
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se han podido consultar las categorías"
    ];
}

echo json_encode($respuesta);