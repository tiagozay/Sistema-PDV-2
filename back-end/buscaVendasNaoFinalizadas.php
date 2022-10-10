<?php
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoVendaNaoFinalizadaRepository;

    $ordem = isset($_GET['ordem']) ? $_GET['ordem'] : null;

    require_once "vendor/autoload.php";  

    $pdo = ConnectionCreator::CreateConnection();

    $venda_repository = new PdoVendaNaoFinalizadaRepository($pdo);

    $vendas = $venda_repository->vendas_ordenadas($ordem);

    echo json_encode($vendas);
?>