<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    require_once "autoloader.php";  

    $id = $_POST['id'];    
    $codigo = $_POST['codigo'];
    $descricao = $_POST['descricao'];
    $un = $_POST['un'];
    $vl_unitario = $_POST['vl_unitario'];
    $qtde = $_POST['qtde_disponivel'];


    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoProdutoEstoqueRepository($pdo);

    $produto = $repository->produto_com_id($id);

    $produto->editar($codigo, $descricao, $un, $qtde ,$vl_unitario);

    if(!$repository->save($produto)){
        $resposta['sucesso'] = false;
        $resposta['mensagem'] = "Não foi possível editar produto!";
        echo json_encode($resposta);
        exit();
    };
        
    $resposta['sucesso'] = true;
    $resposta['mensagem'] = "";
    echo json_encode($resposta);
?>