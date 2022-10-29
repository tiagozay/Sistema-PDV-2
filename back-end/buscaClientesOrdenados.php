<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Cliente;
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoClienteRepository;
    
    $ordem = isset($_GET['ordem']) ? $_GET['ordem'] : exit();

    $entityManager = EntityManagerCreator::create();


    $repository = $entityManager->getRepository(Cliente::class);

    $ordens = [
        'ordem_alfabetica' => ['nome' => 'ASC'],
        'ordem_alfabetica_dec' => ['nome' => 'DESC'],
        'mais_recente' => ['id' => 'DESC'], 
        'mais_antigo' => ['id' => 'ASC']
    ];

    $ordem = isset($ordens[$ordem]) ? $ordens[$ordem] : [];

    $clientes = $repository->findBy([], $ordem);

    $clientes = Cliente::toArrays($clientes);

    echo json_encode($clientes);
?>