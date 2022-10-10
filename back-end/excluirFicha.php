<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    require_once "vendor/autoload.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoFichaRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    $id_ficha = isset($_POST['id']) ? $_POST['id'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $ficha_repository = new PdoFichaRepository($pdo);

    $produto_repository = new PdoProdutoEstoqueRepository($pdo);

    $ficha = $ficha_repository->ficha_com_produtos($id_ficha);

    $produtos_ficha = $ficha->getProdutos();

    foreach($produtos_ficha as $produto_ficha){
        $pdo->exec("DELETE FROM produtos_ficha WHERE id = {$produto_ficha->getId()}");
    }

    $resposta['sucesso']  = $ficha_repository->excluir_ficha($id_ficha);;
    echo json_encode($resposta);
?>
