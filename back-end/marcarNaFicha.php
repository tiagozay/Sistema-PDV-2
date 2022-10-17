<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    require_once "autoloader.php";

    use PDV\Domain\Helper\DataHelper;
    use PDV\Domain\Model\Cliente;
    use PDV\Domain\Model\Ficha;
    use PDV\Domain\Model\ProdutoFicha;
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoFichaRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    $venda_front = isset($_POST['venda']) ? json_decode($_POST['venda']) : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $ficha_repository = new PdoFichaRepository($pdo);

    $novos_produtos_da_ficha = [];

    foreach($venda_front->produtos as $produto){
        $novos_produtos_da_ficha[] = new ProdutoFicha(
            null,
            DataHelper::dataAtual(),
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


    $cliente = new Cliente(
        $venda_front->cliente->id,
        $venda_front->cliente->cpf,
        $venda_front->cliente->nome
    );
    
    $ficha = $ficha_repository->busca_ficha_de_cliente($cliente);

    if(!$ficha){

        $ficha = new Ficha(
            null,
            $cliente,
            $novos_produtos_da_ficha,
            $venda_front->qtde_itens,
            $venda_front->total,
            0,
        );

    }else{
        $ficha->adiciona_novos_produtos($novos_produtos_da_ficha);
    }

    //Baixa no estoque
    $produto_repository = new PdoProdutoEstoqueRepository($pdo);

    foreach($novos_produtos_da_ficha as $produto_venda){
        if(!$produto_venda->getAvulso()){

            $produto_do_banco = $produto_repository->produto_com_codigo($produto_venda->getCodigo());

            $produto_do_banco->baixa_no_estoque($produto_venda->getQtde());

            $produto_repository->save($produto_do_banco);

        }
    }

    $save = $ficha_repository->save($ficha);

    $resposta['sucesso'] = $save;
    
    echo json_encode($resposta);

?>