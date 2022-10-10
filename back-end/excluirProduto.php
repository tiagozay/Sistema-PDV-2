<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    require_once "vendor/autoload.php";  

    $id =  isset($_POST['id']) ? $_POST['id'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoProdutoEstoqueRepository($pdo);

    if(!$repository->excluir_produto($id)){
        $resposta['sucesso'] = false;
        $resposta['mensagem'] = "Erro!";
        echo json_encode($resposta);
        exit();
    }
    
    $resposta['sucesso'] = true;
    $resposta['mensagem'] = "";
    echo json_encode($resposta);
    
?>