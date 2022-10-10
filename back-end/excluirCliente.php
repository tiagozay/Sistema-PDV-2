<?php
    $resposta = ['sucesso' => "", 'mensagem' => ""];

    require_once "vendor/autoload.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;
    use PDV\Infraestrutura\Repository\PdoClienteRepository;
use PDV\Infraestrutura\Repository\PdoFichaRepository;
use PDV\Infraestrutura\Repository\PdoVendaRepository;
    use PDV\Infraestrutura\Repository\PdoVendaNaoFinalizadaRepository;

    
    $id = isset($_POST['id']) ? $_POST['id'] : exit();

    $pdo = ConnectionCreator::CreateConnection();

    $cliente_repository = new PdoClienteRepository($pdo);

    $venda_repository = new PdoVendaRepository($pdo);

    $venda_nao_finalizada_repository = new PdoVendaNaoFinalizadaRepository($pdo);

    $cliente = $cliente_repository->cliente_com_id($id);

    $ficha_repository = new PdoFichaRepository($pdo);

    $ficha_cliente = $ficha_repository->busca_ficha_de_cliente($cliente);

    if($ficha_cliente){
        $resposta['sucesso'] = false;
        $resposta['mensagem'] = "tem_ficha";

        echo json_encode($resposta);

        exit();
    }


    $vendas_do_cliente = $venda_repository->vendas_do_cliente($cliente);
    $vendas_nao_finalizadas_do_cliente = $venda_nao_finalizada_repository->vendas_do_cliente($cliente);

    foreach($vendas_do_cliente as $venda){
        $venda_repository->remove_cliente($venda);
    }

    foreach($vendas_nao_finalizadas_do_cliente as $venda){
        $venda_nao_finalizada_repository->remove_cliente($venda);
    }

    $resposta['sucesso'] = $cliente_repository->excluir_cliente($id);

    echo json_encode($resposta);

?>