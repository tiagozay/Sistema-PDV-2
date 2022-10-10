<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    use PDV\Domain\Model\ProdutoEstoque;
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;

    require_once "vendor/autoload.php"; 

    $codigo = $_POST['codigo'];
    $descricao = $_POST['descricao'];
    $un = $_POST['un'];
    $vl_unitario = $_POST['vl_unitario'];
    $qtde = $_POST['qtde'];


    $pdo = ConnectionCreator::CreateConnection();

    $repository = new PdoProdutoEstoqueRepository($pdo);

    $produto = new ProdutoEstoque(null, $codigo, $descricao, $un, $qtde, $vl_unitario);

    try{

        $save = $repository->save($produto);

        if(!$save){
            $resposta['sucesso'] = false;
            $resposta['mensagem'] = "";
            echo json_encode($resposta);

            exit();
        }
       
    }catch(Exception $e){
        $resposta['sucesso'] = false;
        $resposta['mensagem'] = $e->getMessage();
        echo json_encode($resposta);
        exit();
    }

    $resposta['sucesso'] = true;
    $resposta['mensagem'] = "";
    echo json_encode($resposta);

?>
