<?php

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;

    require_once "vendor/autoload.php";

    $id =  isset($_POST['id']) ? $_POST['id'] : exit();
    $qtde = $_POST['quantidade'];

    $entityManager = EntityManagerCreator::create();

    $produto = $entityManager->find(ProdutoEstoque::class, $id);

    $produto->aumentar_estoque($qtde);

    try{
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }
    
?>