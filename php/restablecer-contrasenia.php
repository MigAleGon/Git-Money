<?php

header("Content-Type: application/json; charset=utf-8");

$metodo = $_SERVER["REQUEST_METHOD"];

if($metodo !== "POST"){
    http_response_code(405);
    $mensaje = ["mensaje" => "Solo admite peticiones POST"];
    echo json_encode($mensaje);
    exit;
}

$cuerpo = file_get_contents("php://input");

$datos = json_decode($cuerpo, true);

if(!isset($datos["token"], $datos["contrasenia"])){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "Faltan datos"
    ];
    echo json_encode($mensaje);
    exit;
}
if(!is_string($datos["token"]) || strlen($datos["token"]) !== 64 || !ctype_xdigit($datos["token"])){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "El token no es valido"
    ];
    echo json_encode($mensaje);
    exit;
}
if(!is_string($datos["contrasenia"]) || strlen($datos["contrasenia"]) > 72 || trim($datos["contrasenia"]) === ""){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "La contraseña no es valida"
    ];
    echo json_encode($mensaje);
    exit;
}

try{
    $hashtoken = hash("sha256", $datos["token"]);
    
    $contrasenia = password_hash($datos["contrasenia"], PASSWORD_DEFAULT);
    require_once __DIR__ . "/conexion.php";

    $conexion->beginTransaction();

    $sqlToken = "UPDATE token_recuperacion SET
            usado_en = CURRENT_TIMESTAMP
            WHERE hash_token = :hash_token
            AND usado_en IS NULL
            AND expira_en > CURRENT_TIMESTAMP
            RETURNING IDUsuario";
    $consultaToken = $conexion->prepare($sqlToken);
    $consultaToken->execute(["hash_token" => $hashtoken]);

    $idusuario = $consultaToken->fetchColumn();
    
    if($idusuario === false){
        if(isset($conexion) && $conexion->inTransaction()){
            $conexion->rollBack();
        }
        http_response_code(400);
        $mensaje = [
            "correcto" => false,
            "mensaje" => "El token no es válido o ha caducado"
        ];
        echo json_encode($mensaje);
        exit;
    }

    $sqlUsuario = "UPDATE usuario
                   SET hashContrasenia = :contrasenia
                   WHERE id = :idusuario";
    $consultaUsuario = $conexion->prepare($sqlUsuario);
    $consultaUsuario->execute([
        "contrasenia" => $contrasenia,
        "idusuario" => $idusuario
    ]);

    if ($consultaUsuario->rowCount() !== 1) {
        throw new RuntimeException("El restablecimiento no actualizó exactamente una cuenta");
    }

    $conexion->commit();

    $respuesta = [
        "correcto" => true,
        "mensaje" => "Se ha restablecido la contraseña"
    ];


} catch (Throwable $error) {
    if(isset($conexion) && $conexion->inTransaction()){
        $conexion->rollBack();
    }
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se ha podido reestablecer la contraseña"
    ];
}

echo json_encode($respuesta);