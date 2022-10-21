<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Cliente;
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoClienteRepository;
    
    $entityManager = EntityManagerCreator::create();

    $repository = $entityManager->getRepository(Cliente::class);

    $clientes = $repository->findAll();

    $clientes = Cliente::toArrays($clientes);

    echo json_encode($clientes);
?>