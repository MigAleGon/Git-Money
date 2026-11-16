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

if(!isset($datos["nombre"], $datos["apellidos"], $datos["correo"], $datos["contrasenia"])){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "Faltan datos"
    ];
    echo json_encode($mensaje);
    exit;
}

if(!is_string($datos["nombre"]) || trim($datos["nombre"]) === "" || mb_strlen(trim($datos["nombre"])) > 70){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "El nombre no es válido"
    ];
    echo json_encode($mensaje);
    exit;
}

if(!is_string($datos["apellidos"]) || trim($datos["apellidos"]) === "" || mb_strlen(trim($datos["apellidos"])) > 70){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "El apellido no es válido"
    ];
    echo json_encode($mensaje);
    exit;
}

// filter_var() valida un valor usando el filtro indicado, en este caso email
if(!is_string($datos["correo"]) || trim($datos["correo"]) === "" || mb_strlen(trim($datos["correo"])) > 100 || !filter_var(trim($datos["correo"]), FILTER_VALIDATE_EMAIL)){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "El correo no es válido"
    ];
    echo json_encode($mensaje);
    exit;
}
if(!is_string($datos["contrasenia"]) || trim($datos["contrasenia"]) === "" || mb_strlen($datos["contrasenia"]) > 255){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "La contraseña no es válida"
    ];
    echo json_encode($mensaje);
    exit;
}

try{
    $nombre = trim($datos["nombre"]);
    $apellidos = trim($datos["apellidos"]);
    $correo = trim($datos["correo"]);
    // encripta la contraseña con el algoritmo que indiquemos
    $contrasenia = password_hash($datos["contrasenia"], PASSWORD_DEFAULT);
    require_once __DIR__ . "/conexion.php";

    $sqlCorreo = "SELECT 1 FROM usuario
                  WHERE correoElectronico = :correo";
    $consultaCorreo = $conexion->prepare($sqlCorreo);
    $consultaCorreo->execute(["correo" => $correo]);

    if($consultaCorreo->fetchColumn() !== false){
        http_response_code(409);
        $mensaje = [
            "correcto" => false,
            "mensaje" => "Este correo ya existe"
        ];
        echo json_encode($mensaje);
        exit;
    }

    // beginTransaction() inicia una transaccion al que volver si algo falla
        // *TRANSACCION* trata el grupo de cambios en la BD como un solo cambio
    $conexion->beginTransaction();
    
    $sqlUsuario = "INSERT INTO usuario(nombre, correoElectronico, hashContrasenia, apellidos)
                   VALUES (:nombre, :correo, :contrasenia, :apellidos)
                   RETURNING id";
    $consultaUsuario = $conexion->prepare($sqlUsuario);

    $consultaUsuario->execute([
        "nombre" => $nombre,
        "correo" => $correo,
        "contrasenia" => $contrasenia,
        "apellidos" => $apellidos
    ]);

    $idusuario = $consultaUsuario->fetchColumn();

    $sqlCuenta = "INSERT INTO cuenta(tipo, saldoInicial, nombre, IDUsuario)
                      VALUES ('efectivo', 0, 'Cartera', :idusuario)";
    $consultaCuenta = $conexion->prepare($sqlCuenta);

    $consultaCuenta->execute(["idusuario" => $idusuario]);

    $categoriasIniciales = [
        ["nombre" => "Salario",        "tipo" => "ingreso"],
        ["nombre" => "Ventas",         "tipo" => "ingreso"],
        ["nombre" => "Regalos",        "tipo" => "ingreso"],
        ["nombre" => "Alimentación",   "tipo" => "gasto"],
        ["nombre" => "Transporte",     "tipo" => "gasto"],
        ["nombre" => "Ocio",           "tipo" => "gasto"]
    ];

    $sqlCategoria = "INSERT INTO categoria(nombre, tipo, idusuario)
                      VALUES (:nombre, :tipo, :idusuario)";
    $consultaCategoria = $conexion->prepare($sqlCategoria);

    foreach($categoriasIniciales as $categoria){
        $consultaCategoria->execute([
            "nombre" => $categoria["nombre"],
            "tipo" => $categoria["tipo"],
            "idusuario" => $idusuario
        ]);
    }

    // commit() confirma los cambios si se resolvió sin errores
    $conexion->commit();
    http_response_code(201);

    session_start();
    $_SESSION = [];
    session_regenerate_id(true);
    $_SESSION["idusuario"] = (int) $idusuario;

    $respuesta = [
        "metodo" => $_SERVER["REQUEST_METHOD"],
        "id" => $idusuario,
        "nombre" => $nombre,
        "correo" => $correo,
        "apellidos" => $apellidos
    ];
} catch(Throwable $error) {
    // inTransaction() revisa si la transaccion sigue abierta. Si la transacción tuvo errores sí, sigue abierta
    if(isset($conexion) && $conexion->inTransaction()){
        // rollBack() deshace los cambios de la transacción, así no se nos crea un usuario a medias
        $conexion->rollBack();
    }

    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se ha podido registrar el usuario"
    ];
}

echo json_encode($respuesta);