<?php
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoVendaRepository;

    $ordem = isset($_GET['ordem']) ? $_GET['ordem'] : null;

    require_once "autoloader.php";  

    $pdo = ConnectionCreator::CreateConnection();

    $venda_repository = new PdoVendaRepository($pdo);

    $vendas = $venda_repository->vendas_ordenadas($ordem);

    echo json_encode($vendas);
?>