<?php
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoFichaRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoFichaRepository;
    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;
    use PDV\Domain\Model\ProdutoFicha;

    require_once "vendor/autoload.php";

    $id_produto = isset($_POST['id_produto']) ? $_POST['id_produto'] : exit();
    $id_ficha = isset($_POST['id_ficha']) ? $_POST['id_ficha'] : exit();


    $entityManager = EntityManagerCreator::create();

    /** @var ProdutoFicha */
    $produto_ficha = $entityManager->find(ProdutoFicha::class, $id_produto);

    //Busca a ficha e devolve produto
    $ficha = $produto_ficha->getFicha();

    $ficha->devolve_produto($produto_ficha);


    //Volta o estoque
    $produto_estoque_repository = $entityManager->getRepository(ProdutoEstoque::class);

    $produto_estoque = $produto_estoque_repository->findOneBy(['codigo' => $produto_ficha->getCodigo()]);

    $produto_estoque->aumentar_estoque($produto_ficha->getQtde());
    

    try{
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }
    
    echo json_encode($ficha->toArray());


?>