<?php
    require_once "autoloader.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoVendaNaoFinalizadaRepository;

    $id =  isset($_POST['id']) ? $_POST['id'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoVendaNaoFinalizadaRepository($pdo);
    
    $venda = $repository->venda_com_produtos($id);

    echo json_encode($venda);

?>