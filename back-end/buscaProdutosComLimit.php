<?php
    require_once "Infraestrutura/ConnectionCreator.php";

    $quantidade = "";

    $query = "";

    if(isset($_POST['numero_do_ultima_quantidade_de_registros_buscada'])){
        $quantidade = $_POST['numero_do_ultima_quantidade_de_registros_buscada'];

        $quantidade -= 20;

        $query = "SELECT * FROM sistema_pdv_produtos LIMIT $quantidade, 20";
    }else{
        $query = "SELECT * FROM sistema_pdv_produtos";
    }

    $pdo = ConnectionCreator::CreateConnection();

    $stmt = $pdo->query($query);

    print_r(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));

?>