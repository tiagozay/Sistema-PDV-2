<?php

    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;

    $entityManager = EntityManagerCreator::create();

    $repository = $entityManager->getRepository(ProdutoEstoque::class);

    $produtos = $repository->findAll();

    echo json_encode($produtos);
?>