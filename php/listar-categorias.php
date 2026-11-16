<?php

header("Content-Type: application/json; charset=utf-8");

try{
    session_start();

    if(!isset($_SESSION["idusuario"])){
        http_response_code(401);
        $mensaje = [
            "correcto" => false,
            "mensaje" => "Sesión no iniciada"
        ];
        echo json_encode($mensaje);
        exit;
    }

    $idusuario = $_SESSION["idusuario"];
    require_once __DIR__ . "/conexion.php";

    // Recupera las categorías ordenadas alfabéticamente para la interfaz.
    $sql = "SELECT id, nombre, tipo 
            FROM categoria 
            WHERE idusuario = :idusuario
            ORDER BY nombre";
    $resultado = $conexion->prepare($sql);
    $resultado->execute(["idusuario" => $idusuario]);

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
