<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    require_once "vendor/autoload.php";

    $id =  isset($_POST['id']) ? $_POST['id'] : exit();
    $qtde = $_POST['quantidade'];

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoProdutoEstoqueRepository($pdo);

    $produto = $repository->produto_com_id($id);

    $produto->aumentar_estoque($qtde);

    $repository->save($produto);
    
    if(!$produto->aumentar_estoque($qtde)){
        $resposta['sucesso'] = false;
        $resposta['mensagem'] = "Não foi possível editar quantidade!";
        echo json_encode($resposta);
        exit();
    };

    $resposta['sucesso'] = true;
    $resposta['mensagem'] = "";
    echo json_encode($resposta);
?>