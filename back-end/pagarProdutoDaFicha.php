<?php
    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoFicha;

    require_once "vendor/autoload.php";

    $id_produto = isset($_POST['id_produto']) ? $_POST['id_produto'] : exit();
    $id_ficha = isset($_POST['id_ficha']) ? $_POST['id_ficha'] : exit();

    $entityManager = EntityManagerCreator::create();

    /** @var ProdutoFicha */
    $produto_ficha = $entityManager->find(ProdutoFicha::class, $id_produto);

    //Busca a ficha e devolve produto
    $ficha = $produto_ficha->getFicha();

    $ficha->paga_produto($produto_ficha);

    try{
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }

    echo json_encode($ficha->toArray());

?>