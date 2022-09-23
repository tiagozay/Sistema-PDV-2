<?php
    require_once "autoloader.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoFichaRepository;

    $id =  isset($_POST['id']) ? $_POST['id'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoFichaRepository($pdo);
    
    $ficha = $repository->ficha_com_produtos($id);

    echo json_encode($ficha);

?>