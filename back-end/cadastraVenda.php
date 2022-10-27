<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\DataHelper;
    use PDV\Domain\Model\Cliente;
    use PDV\Domain\Model\ProdutoVenda;
    use PDV\Domain\Model\Venda;
    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;

    $venda_front = isset($_POST['venda']) ? json_decode($_POST['venda']) : exit();

    $entityManager = EntityManagerCreator::create();

    /** @var ProdutoVenda[] */
    $produtos_da_venda = [];

    foreach($venda_front->produtos as $produto){
        $produtos_da_venda[] = new ProdutoVenda(
            $produto->codigo,
            $produto->descricao,
            $produto->un,
            $produto->qtde,
            $produto->vl_unitario,
            $produto->valor_total,
            $produto->avulso
        );
    }


    $cliente;
    if(is_null($venda_front->cliente)){
        $cliente = null;
    }else{
        $cliente = $entityManager->find(Cliente::class, $venda_front->cliente->id);
    }

    $venda = new Venda(
        DataHelper::dataAtual(),
        $cliente,
        $venda_front->desconto,
        $venda_front->qtde_itens,
        $venda_front->total,
        $venda_front->total_com_desconto,
        $venda_front->valor_pago,
        $venda_front->troco
    );

    $venda->adiciona_produtos($produtos_da_venda);

    //Baixa no estoque
    $produtoEstoqueRepository = $entityManager->getRepository(ProdutoEstoque::class);
  
    foreach($produtos_da_venda as $produto_venda){
        if(!$produto_venda->getAvulso()){

            /** @var ProdutoEstoque */
            $produto_do_estoque = $produtoEstoqueRepository->findOneBy(['codigo' => $produto_venda->getCodigo()]);

            $produto_do_estoque->baixa_no_estoque($produto_venda->getQtde());

        }
    }

    try{
        $entityManager->persist($venda);
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }

?>