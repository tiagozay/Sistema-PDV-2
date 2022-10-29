<?php
    use PDV\Domain\Model\Cliente;
    use PDV\Domain\Helper\EntityManagerCreator;

    require_once "vendor/autoload.php";  

    $cpf = $_POST['cpf'];
    $nome = $_POST['nome'];

    $entityManager = EntityManagerCreator::create();

    $cliente = new Cliente($cpf, $nome);

    try{
        $entityManager->persist($cliente);
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
        echo json_encode($cliente->id);
    }catch(Exception $e){
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode($e->getCode());
    }
?>