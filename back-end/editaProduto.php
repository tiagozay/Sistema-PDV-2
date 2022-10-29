<?php

    require_once "vendor/autoload.php";  

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;
    use PDV\Domain\Model\ProdutoFicha;
    use PDV\Domain\Model\ProdutoVenda;

    $id = $_POST['id'];    
    $codigo = $_POST['codigo'];
    $descricao = $_POST['descricao'];
    $un = $_POST['un'];
    $vl_unitario = $_POST['vl_unitario'];
    $qtde = $_POST['qtde_disponivel'];

    $entityManager = EntityManagerCreator::create();

    
    $produtoVendaRepositiry = $entityManager->getRepository(ProdutoVenda::class);

    /** @var ProdutoEstoque */
    $produtoEstoque = $entityManager->find(ProdutoEstoque::class, $id);

    $codigoAntigo = $produtoEstoque->getCodigo();

    $produtoEstoque->editar($codigo, $descricao, $un, $qtde ,$vl_unitario);


    alteraCodigoProdutosFicha($entityManager, $codigoAntigo, $codigo);
    alteraCodigoProdutosVenda($entityManager, $codigoAntigo, $codigo);


    try{
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch( Exception ){
        header('HTTP/1.1 500 Internal Server Error');
    }


    function alteraCodigoProdutosFicha($entityManager, $codigoAntigo, $novoCodigo)
    {
        $produtoFichaRepositiry = $entityManager->getRepository(ProdutoFicha::class);

        /** @var ProdutoFicha[] */
        $produtosFicha = $produtoFichaRepositiry->findBy(['codigo' => $codigoAntigo]);

        ProdutoFicha::alteraCodigoDeProdutos($produtosFicha, $novoCodigo);
    }

    function alteraCodigoProdutosVenda($entityManager, $codigoAntigo, $novoCodigo)
    {
        $produtoVendaRepositiry = $entityManager->getRepository(ProdutoVenda::class);

        /** @var ProdutoVenda[] */
        $produtosVenda = $produtoVendaRepositiry->findBy(['codigo' => $codigoAntigo]);

        ProdutoVenda::alteraCodigoDeProdutos($produtosVenda, $novoCodigo);
    }

?>