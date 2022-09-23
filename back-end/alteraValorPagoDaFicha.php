<?php

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoFichaRepository;

    $resposta = ['sucesso' => "", 'mensagem' => "", 'ficha'=> ""];

    require_once "autoloader.php";

    $id_ficha = isset($_POST['id_ficha']) ? $_POST['id_ficha'] : exit();
    $valor_pago = isset($_POST['valor_pago']) ? $_POST['valor_pago'] : exit();


    $pdo = ConnectionCreator::CreateConnection();

    //Busca a ficha e altera o valor pago
    $ficha_repository = new PdoFichaRepository($pdo);

    $ficha = $ficha_repository->ficha_com_produtos($id_ficha);

    $ficha->alteraValorPago($valor_pago);

    //Salva alterações no banco
    $resposta['sucesso'] = $ficha_repository->save($ficha);

    $resposta['ficha'] = $ficha;

    echo json_encode($resposta);


?>