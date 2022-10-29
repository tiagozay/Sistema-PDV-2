<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Cliente;
    use PDV\Domain\Model\Ficha;
    use PDV\Domain\Model\ProdutoEstoque;
    use PDV\Domain\Model\ProdutoFicha;

    $venda_front = isset($_POST['venda']) ? json_decode($_POST['venda']) : exit();

    $entityManager = EntityManagerCreator::create();

    $novos_produtos_da_ficha = [];

    foreach($venda_front->produtos as $produto){
        $novos_produtos_da_ficha[] = new ProdutoFicha(
            $produto->codigo,
            $produto->descricao,
            $produto->un,
            $produto->qtde,
            $produto->vl_unitario,
            $produto->valor_total,
            "Pendente",
            $produto->avulso
        );
    }


    /** @var Cliente */
    $cliente = $entityManager->find(Cliente::class, $venda_front->cliente->id);
    
    $ficha = $cliente->getFicha();

    if(is_null($ficha)){

        $ficha = new Ficha(
            $cliente,
            $venda_front->qtde_itens,
            $venda_front->total,
            0,
        );

        $ficha->adiciona_produtos($novos_produtos_da_ficha);

        $entityManager->persist($ficha);


    }else{
        $ficha->adiciona_produtos($novos_produtos_da_ficha);
    }

    //Baixa no estoque

    $produtoEstoqueRepository = $entityManager->getRepository(ProdutoEstoque::class);

    foreach($novos_produtos_da_ficha as $produto_venda){
        if(!$produto_venda->getAvulso()){

            /** @var ProdutoEstoque */
            $produto_do_estoque = $produtoEstoqueRepository->findOneBy(['codigo' => $produto_venda->getCodigo()]);

            $produto_do_estoque->baixa_no_estoque($produto_venda->getQtde());

        }
    }

    try{
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }

?>