<?php
    require_once "vendor/autoload.php";

    use PDV\Infraestrutura\Persistencia\ConnectionCreator;

    $pdo = ConnectionCreator::CreateConnection();

    $stmt_produtos = $pdo->query("SELECT codigo, descricao FROM produtos");
    $produtos = $stmt_produtos->fetchAll(PDO::FETCH_ASSOC);

    $uns = ['UN', 'KG', 'G', 'MT', 'CM', 'MM'];
    $qtdes = [12, 34, 67, 12, 443, 122, 342, 38, 6643, 21, 56, 33, 67, 90, 123, 89, 56, 32, 1289, 45, 67, 45];
    $precos = [12.50, 89.56, 12.34, 2.50, 2.55, 6.80, 19.30, 23.50, 89.90, 96.50, 5, 2, 3.49, 85.40];

    $query = "INSERT INTO sistema_pdv_produtos (codigo, descricao, un, qtde_disponivel, vl_unitario) VALUES ";

    foreach($produtos as $produto){
        $codigo = $produto['codigo'];
        $descricao = $produto['descricao'];
        $un = $uns[rand(0, 5)];
        $qtde = $qtdes[rand(0, 21)];
        $vl_unitario = $precos[rand(0, 13)];

        $query .= "('$codigo', '$descricao', '$un', $qtde, $vl_unitario),";
   
    }

    $array = str_split($query);

    array_pop($array);

    $query = implode($array);

    $query .= ";";

    

    $stmt = $pdo->exec($query);

    // $stmt = $pdo->prepare("INSERT INTO sistema_pdv_produtos (codigo, descricao, un, qtde_disponivel, vl_unitario) values (:codigo, :descricao, :un, :qtde, :vl_unitario)");
    // $stmt->bindValue(":codigo", $codigo);
    // $stmt->bindValue(":descricao", $descricao);
    // $stmt->bindValue(":un", $un);
    // $stmt->bindValue(":qtde", $qtde);
    // $stmt->bindValue(":vl_unitario", $vl_unitario);
    // $stmt->execute();
?>