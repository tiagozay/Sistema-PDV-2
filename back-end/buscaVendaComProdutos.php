<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Venda;

    $id =  isset($_GET['id']) ? $_GET['id'] : exit();

    $entityManager = EntityManagerCreator::create();
    
    try{    
        $venda = $entityManager->find(Venda::class, $id);
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
        exit();
    }

    echo json_encode($venda->toArray());

?>