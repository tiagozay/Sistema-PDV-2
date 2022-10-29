<?php

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Ficha;

    require_once "vendor/autoload.php";

    $id_ficha = isset($_POST['id_ficha']) ? $_POST['id_ficha'] : exit();

    $entityManager = EntityManagerCreator::create();

    //Busca a ficha
    /** @var Ficha */
    $ficha = $entityManager->find(Ficha::class, $id_ficha);

    //Busca os produtos e deleta eles do banco
    $produtos_ficha = $ficha->getProdutos();

    foreach($produtos_ficha as $produto){
        $entityManager->remove($produto);
    }

    $ficha->limpa_ficha();

    try{    
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }


    echo json_encode($ficha->toArray());

?>