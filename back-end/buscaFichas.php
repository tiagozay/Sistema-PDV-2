<?php
    require_once "autoloader.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoFichaRepository;
    
    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoFichaRepository($pdo);

    $fichas = $repository->todas_fichas();

    echo json_encode($fichas);
?>