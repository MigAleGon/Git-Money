<?php

header("Content-Type: application/json; charset=utf-8");

try{
    require_once __DIR__ . "/conexion.php";

    // Consulta el usuario provisional y ordena por fecha, hora e ID descendentes.
    $resultado = $conexion->query("SELECT id, concepto, idcategoria AS categoria,
                                          fecha, hora, importe, tipo, procedencia, 
                                          nota AS notas, medioPago AS \"medioPago\"
                                   FROM movimiento
                                   WHERE idusuario = 1
                                   ORDER BY fecha DESC, hora DESC, id DESC");

    // Devuelve las filas como registros con nombres de columnas.
    $respuesta = $resultado->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $error){
    // Registra el detalle en el servidor y devuelve un mensaje genérico al cliente.
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se han podido consultar los movimientos"
    ];
}

echo json_encode($respuesta);
