<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    require_once "vendor/autoload.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoProdutoEstoqueRepository($pdo);

    $excluir = $repository->excluir_todos_produtos();

    if($excluir){
        $resposta['sucesso'] = true;
        $resposta['mensagem'] = "Sucesso";
    }else{
        $resposta['sucesso'] = false;
        $resposta['mensagem'] = "Erro ao executar!";
    }
    
    echo json_encode($resposta);