<?php
    require_once "autoloader.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;
    
    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoProdutoEstoqueRepository($pdo);

    $produtos = $repository->todos_produtos();

    echo json_encode($produtos);
?>