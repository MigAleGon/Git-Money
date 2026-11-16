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

    $sql = "SELECT id, tipo, saldoInicial as \"saldoInicial\", nombre 
                                   FROM cuenta 
                                   WHERE idusuario = :idusuario
                                   ORDER BY nombre
                                   ";
    $resultado = $conexion->prepare($sql);
    $resultado->execute(["idusuario" => $idusuario]);

    $respuesta = $resultado->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $error){
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se han podido consultar las cuentas"
    ];
}

echo json_encode($respuesta);
