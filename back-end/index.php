<?php

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoVendaRepository;
    use PDV\Domain\Model\VendaNaoFinalizada;
    use PDV\Infraestrutura\Repository\PdoProdutoRepository;
    use PDV\Infraestrutura\Repository\PdoVendaNaoFinalizadaRepository;

    require_once "autoloader.php";  

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoVendaRepository($pdo);
    
    $venda = $repository->venda_com_produtos(456);

?>