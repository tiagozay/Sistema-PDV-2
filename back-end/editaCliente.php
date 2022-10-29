<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Cliente;
    
    $id = isset($_POST['id']) ? $_POST['id'] : exit();
    $nome = isset($_POST['nome']) ? $_POST['nome'] : exit();
    $cpf = isset($_POST['cpf']) ? $_POST['cpf'] : exit();

    $entityManager = EntityManagerCreator::create();

    $cliente = $entityManager->find(Cliente::class, $id);

    $cliente->editar($nome, $cpf);

    try{
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }
?>