<?php

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;

    require_once "vendor/autoload.php";

    $entityManager = EntityManagerCreator::create();

    $query = $entityManager->createQuery("DELETE FROM PDV\Domain\Model\ProdutoEstoque");

    if($query->execute()){
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }else{
        header('HTTP/1.1 500 Internal Server Error');
    }

?>