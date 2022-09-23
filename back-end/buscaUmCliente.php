<?php
    require_once "autoloader.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoClienteRepository;
    
    $id = isset($_POST['id']) ? $_POST['id'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoClienteRepository($pdo);

    $cliente = $repository->cliente_com_id($id);

    echo json_encode($cliente);

?>