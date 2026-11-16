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
    // Consulta el usuario provisional y ordena por fecha, hora e ID descendentes.
    $sql = "SELECT id, concepto, idcategoria AS categoria,
                                          idcuenta AS cuenta, fecha, hora, importe,
                                          tipo, procedencia, nota AS notas,
                                        medioPago AS \"medioPago\"
                                   FROM movimiento
                                   WHERE idusuario = :idusuario
                                   ORDER BY fecha DESC, hora DESC, id DESC";
    $resultado = $conexion->prepare($sql);
    $resultado->execute(["idusuario" => $idusuario]);

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
