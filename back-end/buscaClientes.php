<?php
    require_once "vendor/autoload.php";


    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoClienteRepository;
    
    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoClienteRepository($pdo);

    $clientes = $repository->todos_clientes();

    echo json_encode($clientes);
?>