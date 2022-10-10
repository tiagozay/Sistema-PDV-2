<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    require_once "vendor/autoload.php";

    use PDV\Domain\Model\Cliente;
    use PDV\Domain\Model\Produto;
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Domain\Model\ProdutoVenda;
    use PDV\Infraestrutura\Repository\PdoVendaRepository;
    use PDV\Domain\Model\Venda;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    $venda_front = isset($_POST['venda']) ? json_decode($_POST['venda']) : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $produtos_da_venda = [];

    foreach($venda_front->produtos as $produto){
        $produtos_da_venda[] = new ProdutoVenda(
            null,
            $produto->id_produto_estoque,
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
        $cliente = new Cliente(
            $venda_front->cliente->id,
            $venda_front->cliente->cpf,
            $venda_front->cliente->nome
        );
    }

    $venda = new Venda(
        null,
        null,
        $produtos_da_venda,
        $cliente,
        $venda_front->desconto,
        $venda_front->qtde_itens,
        $venda_front->total,
        $venda_front->total_com_desconto,
        $venda_front->valor_pago,
        $venda_front->troco
    );

    //Baixa no estoque
    $produto_repository = new PdoProdutoEstoqueRepository($pdo);


    $microtime = explode(" ", microtime());
    $inicio = $microtime[0]+$microtime[1];
  
    foreach($produtos_da_venda as $produto_venda){
        if(!$produto_venda->getAvulso()){

            $produto_do_banco = $produto_repository->produto_com_id($produto_venda->getIdProdutoEstoque());

            $produto_do_banco->baixa_no_estoque($produto_venda->getQtde());

            $produto_repository->save($produto_do_banco);

        }
    }
    $microtime = explode(" ", microtime());
    $fim = $microtime[0]+$microtime[1];
  
    echo json_encode( intval(($fim - $inicio) * 1000));
    exit();

    $venda_repository = new PdoVendaRepository($pdo);

    $save = $venda_repository->save($venda);

    $resposta['sucesso'] = $save;
    
    echo json_encode($resposta);

?>