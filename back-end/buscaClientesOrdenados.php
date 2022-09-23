<?php
    require_once "autoloader.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoClienteRepository;
    
    $ordem = isset($_POST['ordem']) ? $_POST['ordem'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoClienteRepository($pdo);

    $clientes = $repository->todos_clientes_ordenados($ordem);

    echo json_encode($clientes);
?>