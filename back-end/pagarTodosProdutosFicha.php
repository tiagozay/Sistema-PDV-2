<?php

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Ficha;

    require_once 'autoloader.php';

    $id = isset($_POST['id']) ? $_POST['id'] : exit();

    $entityManager = EntityManagerCreator::create();

    $ficha = $entityManager->find(Ficha::class, $id);

    $ficha->paga_todos_produtos();

    try{
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }

    echo json_encode($ficha->toArray());
?>