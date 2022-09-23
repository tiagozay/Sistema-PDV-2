<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    require_once "autoloader.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoVendaNaoFinalizadaRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    $id_venda = isset($_POST['id']) ? $_POST['id'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $venda_repository = new PdoVendaNaoFinalizadaRepository($pdo);

    $produto_repository = new PdoProdutoEstoqueRepository($pdo);

    $venda = $venda_repository->venda_com_produtos($id_venda);

    $produtos_venda = $venda->getProdutos();

    foreach($produtos_venda as $produto_venda){

        $pdo->exec("DELETE FROM produtos_venda_nao_finalizada WHERE id = {$produto_venda->getId()}");

        if(!$produto_venda->getAvulso()){
            
            $produto = $produto_repository->produto_com_id($produto_venda->getIdProdutoEstoque());

            $produto->aumentar_estoque($produto_venda->getQtde());

            $produto_repository->save($produto);
        }

    }

    $resposta['sucesso']  = $venda_repository->exclui_venda($id_venda);;
    echo json_encode($resposta);
?>
