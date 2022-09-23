<?php
    use PDV\Domain\Model\Cliente;
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoClienteRepository;

    require_once "autoloader.php";  

    $cpf = $_POST['cpf'];
    $nome = $_POST['nome'];

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoClienteRepository($pdo);

    $cliente = new Cliente(null, $cpf, $nome);

    $save = $repository->save($cliente);

    if(!$save){
        header('HTTP/1.1 500 Internal Server Error');
    }else{
        header('HTTP/1.1 200 OK');
    }
?>