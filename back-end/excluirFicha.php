<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Ficha;

    $id_ficha = isset($_POST['id']) ? $_POST['id'] : exit();

    $entityManager = EntityManagerCreator::create();

    $ficha = $entityManager->find(Ficha::class , $id_ficha);

    $produtos_ficha = $ficha->getProdutos();

    foreach($produtos_ficha as $produto_ficha){
        $entityManager->remove($produto_ficha);
    }

    try{
        $entityManager->remove($ficha);
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }


?>
