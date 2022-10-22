<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Ficha;
    
    $entityManager = EntityManagerCreator::create();

    $repository = $entityManager->getRepository(Ficha::class);

    $fichas = $repository->findAll();

    echo json_encode(Ficha::toArrays($fichas));
?>