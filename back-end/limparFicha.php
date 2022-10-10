<?php

    use PDV\Domain\Model\ProdutoFicha;
    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoFichaRepository;
    use PDV\Infraestrutura\Repository\PdoProdutoFichaRepository;

    $resposta = ['sucesso' => "", 'mensagem' => "", 'ficha'=> ""];

    require_once "vendor/autoload.php";

    $id_ficha = isset($_POST['id_ficha']) ? $_POST['id_ficha'] : exit();


    $pdo = ConnectionCreator::CreateConnection();

    //Busca a ficha
    $ficha_repository = new PdoFichaRepository($pdo);

    $ficha = $ficha_repository->ficha_com_produtos($id_ficha);


    //Busca os produtos e deleta eles do banco
    $produtos_ficha = $ficha->getProdutos();

    $produtos_ficha_repository = new PdoProdutoFichaRepository($pdo);

    foreach($produtos_ficha as $produto){
        $produtos_ficha_repository->excluir_produto($produto->getId());
    }

    
    //Limpa a ficha
    $ficha->limpa_ficha();

    //Salva as alterações no banco e devolve resposta
    $resposta['ficha'] = $ficha;
    $resposta['sucesso'] = $ficha_repository->save($ficha);

    echo json_encode($resposta);

?>