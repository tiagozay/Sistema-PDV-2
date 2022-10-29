<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    require_once "vendor/autoload.php";

    use PDV\Domain\Helper\EntityManagerCreator;
    use PDV\Domain\Model\Cliente;

    $id = isset($_POST['id']) ? $_POST['id'] : exit();

    $entityManager = EntityManagerCreator::create();

    /** @var Cliente */
    $cliente = $entityManager->find(Cliente::class, $id);

    $ficha = $cliente->getFicha();

    if($ficha){
        echo json_encode('tem_ficha');
        header('HTTP/1.1 500 Internal Server Error');
        exit();
    }

    $vendas_cliente = $cliente->getVendas();

    foreach($vendas_cliente as $venda){
        $venda->removeCliente();
    }

    try{
        $entityManager->remove($cliente);
        $entityManager->flush();
        header('HTTP/1.1 200 OK');
    }catch(Exception){
        header('HTTP/1.1 500 Internal Server Error');
    }

?>