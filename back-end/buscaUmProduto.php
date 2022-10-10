<?php
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    require_once "vendor/autoload.php";  

    $id =  isset($_GET['id']) ? $_GET['id'] : exit();
    
    $pdo = ConnectionCreator::CreateConnection();

    $repositorio = new PdoProdutoEstoqueRepository($pdo);

    $produto = $repositorio->produto_com_id($id);

    echo json_encode($produto);
?>