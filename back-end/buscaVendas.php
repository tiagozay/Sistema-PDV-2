<?php
    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Venda;

    $ordem = isset($_GET['ordem']) ? $_GET['ordem'] : null;

    require_once "vendor/autoload.php";  

    $entityManager = EntityManagerCreator::create();

    $venda_repository = $entityManager->getRepository(Venda::class);

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
    
    //Filtra para que só venham as vendas que foram finalizadas
    $somente_vendas = Venda::filtrar($vendas);

    echo json_encode(Venda::toArrays($somente_vendas));
?>