<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Model\Ficha;
    use PDV\Domain\Helper\EntityManagerCreator;

    $id =  isset($_GET['id']) ? $_GET['id'] : exit();

    $entityManager = EntityManagerCreator::create();

    /** @var Ficha */
    $ficha = $entityManager->find(Ficha::class, $id);
    
    echo json_encode($ficha->toArray());

?>