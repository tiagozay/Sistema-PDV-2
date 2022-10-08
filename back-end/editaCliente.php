<?php
    require_once "autoloader.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoClienteRepository;
    
    $id = isset($_POST['id']) ? $_POST['id'] : exit();
    $nome = isset($_POST['nome']) ? $_POST['nome'] : exit();
    $cpf = isset($_POST['cpf']) ? $_POST['cpf'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoClienteRepository($pdo);

    $cliente = $repository->cliente_com_id($id);

    $cliente->editar($nome, $cpf);

    $save = $repository->save($cliente);

    if(!$save){
        header('HTTP/1.1 500 Internal Server Error');
    }else{
        header('HTTP/1.1 200 OK');
    }
?>