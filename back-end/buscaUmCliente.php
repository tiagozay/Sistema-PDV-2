<?php 
    require_once "vendor/autoload.php"; 

    use PDV\Domain\Helper\EntityManagerCreator; 
    use PDV\Domain\Model\Cliente; 

    $id = isset($_GET['id']) ? $_GET['id'] : exit(); 

    $entityManager = EntityManagerCreator::create();

    /** @var Cliente */ 
    $cliente = $entityManager->find(Cliente::class, $id);

    echo json_encode($cliente->toArray()); 
?>