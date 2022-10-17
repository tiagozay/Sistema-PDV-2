<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    require_once "vendor/autoload.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoVendaRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    $id_venda = isset($_POST['id']) ? $_POST['id'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $venda_repository = new PdoVendaRepository($pdo);

    $produto_estoque_repository = new PdoProdutoEstoqueRepository($pdo);

    $venda = $venda_repository->venda_com_produtos($id_venda);

    $produtos_venda = $venda->getProdutos();

    foreach($produtos_venda as $produto_venda){

        $pdo->exec("DELETE FROM produtos_venda WHERE id = {$produto_venda->getId()}");

        if(!$produto_venda->getAvulso()){
            
            //Busca o produto no estoque pelo Código. Como ele já pode ser sido excluído, passa uma validação para que só realize as operações se ele ainda existir

            $produto = $produto_estoque_repository->produto_com_codigo($produto_venda->getCodigo());

            if($produto){

                $produto->aumentar_estoque($produto_venda->getQtde());

                $produto_estoque_repository->save($produto);

            }
           
        }

    }

    $resposta['sucesso']  = $venda_repository->exclui_venda($id_venda);;
    echo json_encode($resposta);
?>
