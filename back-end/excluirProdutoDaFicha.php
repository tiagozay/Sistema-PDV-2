<?php

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoFichaRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoFichaRepository;

    $resposta = ['sucesso' => "", 'mensagem' => "", 'ficha'=> ""];

    require_once "vendor/autoload.php";

    $id_produto = isset($_POST['id_produto']) ? $_POST['id_produto'] : exit();
    $id_ficha = isset($_POST['id_ficha']) ? $_POST['id_ficha'] : exit();


    $pdo = ConnectionCreator::CreateConnection();

    //Busca a ficha e devolve produto
    $ficha_repository = new PdoFichaRepository($pdo);

    $ficha = $ficha_repository->ficha_com_produtos($id_ficha);

    $ficha->remove_produto($id_produto);


    //Pega o produto devolvido
    $produto_ficha = $ficha->produto_com_id($id_produto);


    //Salva as alterações no banco
    $produto_ficha_repository = new PdoProdutoFichaRepository($pdo);

    $produto_ficha_repository->excluir_produto($id_produto);
    $ficha_repository->save($ficha);

    $resposta['ficha'] = $ficha;
    $resposta['sucesso'] = true;

    echo json_encode($resposta);


?>