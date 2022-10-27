<?php
    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\VendaNaoFinalizada;

    $ordem = isset($_GET['ordem']) ? $_GET['ordem'] : null;

    require_once "vendor/autoload.php";  

    $entityManager = EntityManagerCreator::create();

    $venda_repository = $entityManager->getRepository(VendaNaoFinalizada::class);

    $ordens = [
        'mais_recente' => ['id' => 'DESC'], 
        'mais_antigo' => ['id' => 'ASC']
    ];

    $ordem = isset($ordens[$ordem]) ? $ordens[$ordem] : [];

    try{
        $vendas = $venda_repository->findBy([], $ordem);
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
        exit();
    }

    echo json_encode(VendaNaoFinalizada::toArrays($vendas));
?>