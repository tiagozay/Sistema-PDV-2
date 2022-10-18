<?php

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;

    require_once "vendor/autoload.php";  

    $id =  isset($_GET['id']) ? $_GET['id'] : exit();
    
    $entityManager = EntityManagerCreator::create();

    try{
        $produto = $entityManager->find(ProdutoEstoque::class, $id);
        header('HTTP/1.1 200 OK');
    }catch( Exception ){
        header('HTTP/1.1 500 Internal Server Error');
    }

    echo json_encode($produto);
?>