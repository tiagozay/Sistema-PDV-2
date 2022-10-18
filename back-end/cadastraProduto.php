<?php
    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\ProdutoEstoque;

    require_once "vendor/autoload.php"; 

    $codigo = $_POST['codigo'];
    $descricao = $_POST['descricao'];
    $un = $_POST['un'];
    $vl_unitario = $_POST['vl_unitario'];
    $qtde = $_POST['qtde'];

    $entityManager = EntityManagerCreator::create();

    $produto = new ProdutoEstoque($codigo, $descricao, $un, $qtde, $vl_unitario);

    try{

        $entityManager->persist($produto);

        $entityManager->flush();

        header('HTTP/1.1 200 OK');

    }catch( Exception ){

        header('HTTP/1.1 500 Internal Server Error');

    }

?>
