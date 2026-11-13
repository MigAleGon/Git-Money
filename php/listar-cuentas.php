<?php

header("Content-Type: application/json; charset=utf-8");

try{
    require_once __DIR__ . "/conexion.php";

    // Recupera las categorías ordenadas alfabéticamente para la interfaz.
    $consulta = $conexion->prepare("SELECT id, tipo, saldoInicial as \"saldoInicial\", nombre 
                                   FROM cuenta 
                                   WHERE idusuario = :idusuario
                                   ORDER BY nombre
                                   ");
    $consulta->execute(["idusuario" => 1]);

    $respuesta = $consulta->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $error){
    // Registra el detalle en el servidor y devuelve un mensaje genérico al cliente.
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se han podido consultar las cuentas"
    ];
}

echo json_encode($respuesta);
