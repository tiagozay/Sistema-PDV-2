<?php

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;

    require_once "vendor/autoload.php";  

    $id =  isset($_POST['id']) ? $_POST['id'] : exit();

    $entityManager = EntityManagerCreator::create();

    $produto = $entityManager->getPartialReference(ProdutoEstoque::class, $id);

    try{
        $entityManager->remove($produto);
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }
    
?>