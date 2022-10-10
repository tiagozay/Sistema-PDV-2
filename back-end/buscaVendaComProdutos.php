<?php
    require_once "vendor/autoload.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoVendaRepository;

    $id =  isset($_POST['id']) ? $_POST['id'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoVendaRepository($pdo);
    
    $venda = $repository->venda_com_produtos($id);

    echo json_encode($venda);

?>