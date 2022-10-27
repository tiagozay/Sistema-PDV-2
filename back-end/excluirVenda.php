<?php
    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;
    use PDV\Domain\Model\Venda;

    $id_venda = isset($_POST['id']) ? $_POST['id'] : exit();

    $entityManager = EntityManagerCreator::create();

    $venda = $entityManager->find(Venda::class, $id_venda);

    $produtos_venda = $venda->getProdutos();

    $produtoEstoqueRepository = $entityManager->getRepository(ProdutoEstoque::class);

    foreach($produtos_venda as $produto_venda){

        if(!$produto_venda->getAvulso()){
            
            //Busca o produto no estoque pelo Código. Como ele já pode ser sido excluído, passa uma validação para que só realize as operações se ele ainda existir

            $produto_estoque = $produtoEstoqueRepository->findOneBy(['codigo' => $produto_venda->getCodigo()]);

            if($produto_estoque){

                $produto_estoque->aumentar_estoque($produto_venda->getQtde());

            }
           
        }

        $entityManager->remove($produto_venda);

    }

    try{
        $entityManager->remove($venda);
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }

?>
