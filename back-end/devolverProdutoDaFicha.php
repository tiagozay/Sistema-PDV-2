<?php

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoFichaRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoEstoqueRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoFichaRepository;

    $resposta = ['sucesso' => "", 'mensagem' => "", 'ficha'=> ""];

    require_once "autoloader.php";

    $id_produto = isset($_POST['id_produto']) ? $_POST['id_produto'] : exit();
    $id_ficha = isset($_POST['id_ficha']) ? $_POST['id_ficha'] : exit();


    $pdo = ConnectionCreator::CreateConnection();

    //Busca a ficha e devolve produto
    $ficha_repository = new PdoFichaRepository($pdo);

    $ficha = $ficha_repository->ficha_com_produtos($id_ficha);

    $ficha->devolve_produto($id_produto);


    //Pega o produto devolvido
    $produto_ficha = $ficha->produto_com_id($id_produto);


    //Volta o estoque
    $produto_estoque_repository = new PdoProdutoEstoqueRepository($pdo);

    $produto_estoque = $produto_estoque_repository->produto_com_codigo($produto_ficha->getCodigo());

    $produto_estoque->aumentar_estoque($produto_ficha->getQtde());
    

    //Salva as alterações no banco
    $produto_ficha_repository = new PdoProdutoFichaRepository($pdo);

    $produto_ficha_repository->save($produto_ficha);
    $produto_estoque_repository->save($produto_estoque);
    $ficha_repository->save($ficha);

    $resposta['ficha'] = $ficha;
    $resposta['sucesso'] = true;

    echo json_encode($resposta);


?>