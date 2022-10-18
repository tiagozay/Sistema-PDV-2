<?php

    require_once "vendor/autoload.php";  

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;

    $id = $_POST['id'];    
    $codigo = $_POST['codigo'];
    $descricao = $_POST['descricao'];
    $un = $_POST['un'];
    $vl_unitario = $_POST['vl_unitario'];
    $qtde = $_POST['qtde_disponivel'];

    $entityManager = EntityManagerCreator::create();

    /** @var ProdutoEstoque */
    $produto = $entityManager->find(ProdutoEstoque::class, $id);

    $produto->editar($codigo, $descricao, $un, $qtde ,$vl_unitario);

    try{
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch( Exception ){
        header('HTTP/1.1 500 Internal Server Error');
    }

?>