<?php

    namespace PDV\Infraestrutura\Repository;

    use PDV\Domain\Model\Cliente;
use PDV\Domain\Model\ProdutoVendaNaoFinalizada;
use PDV\Domain\Model\Venda;
    use PDV\Domain\Model\VendaNaoFinalizada;

    class PdoVendaNaoFinalizadaRepository
    {
        protected \PDO $conexao;

        public function __construct(\PDO $pdo)
        {
            $this->conexao = $pdo;
        }

        public function vendas_ordenadas(?string $ordem): array
        {
            $vendas = [];

            //Na consulta, é usado o LEFT JOIN, pois algumas vendas podem não ter um correspondente na tabela de clientes, pois algumas são cadastradas sem cliente, aí o campo fica null. Se usar INNER JOIN, serão trazidas somente as vendas que tem clientes
            if($ordem == 'mais_antiga' || is_null($ordem)){
                $stmt = $this->conexao->query("SELECT 
                    v.id, 
                    v.data_registro, 
                    v.qtde_itens, 
                    v.valor_total, 
                    v.valor_com_desconto, 
                    v.desconto, 
                    v.valor_pago, 
                    v.troco, 
                    c.id AS id_cliente, 
                    c.cpf, 
                    c.nome  
                    FROM vendas_nao_finalizadas v LEFT JOIN cliente c ON v.cliente = c.id
                ");

                $vendas = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            }else{
                   $stmt = $this->conexao->query("SELECT 
                    v.id, 
                    v.data_registro, 
                    v.qtde_itens, 
                    v.valor_total, 
                    v.valor_com_desconto, 
                    v.desconto, 
                    v.valor_pago, 
                    v.troco, 
                    c.id AS id_cliente, 
                    c.cpf, 
                    c.nome  
                    FROM vendas_nao_finalizadas v LEFT JOIN cliente c ON v.cliente = c.id
                    ORDER BY data_registro DESC
                ");

                $vendas = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }

            return $this->hidrata_vendas($vendas);

            return [];
        }

        public function venda_com_produtos(?int $id)
        {
            $stmt = $this->conexao->query("SELECT 
                v.id, 
                v.data_registro, 
                v.qtde_itens, 
                v.valor_total, 
                v.valor_com_desconto, 
                v.desconto, 
                v.valor_pago, 
                v.troco, 
                c.id AS id_cliente, 
                c.cpf, 
                c.nome  
                FROM vendas_nao_finalizadas v LEFT JOIN cliente c ON v.cliente = c.id
                WHERE v.id = $id
            ");

            $result = $stmt->fetch(\PDO::FETCH_ASSOC);

            $venda = new VendaNaoFinalizada(
                $result['id'],
                $result['data_registro'],
                [],
                new Cliente($result['id_cliente'], $result['cpf'], $result['nome']),
                $result['desconto'],
                $result['qtde_itens'],
                $result['valor_total'],
                $result['valor_com_desconto'],
                $result['valor_pago'],
                $result['troco']
            );
            
            $stmt_produtos = $this->conexao->query("SELECT * FROM produtos_venda_nao_finalizada WHERE venda = {$venda->getId()}");

            $result_produtos = $stmt_produtos->fetchAll(\PDO::FETCH_ASSOC);

            $produtos = [];

            foreach($result_produtos as $produto){
                $produto = new ProdutoVendaNaoFinalizada(
                    $produto['id'],
                    $produto['codigo'],
                    $produto['descricao'],
                    $produto['un'],
                    $produto['qtde'],
                    $produto['vl_unitario'],
                    $produto['vl_total'],
                    $produto['avulso'],
                );

                $produtos[] = $produto;
            }

            $venda->setProdutos($produtos);

            return $venda;

        }

        public function vendas_do_cliente(Cliente $cliente): array
        {
            $stmt = $this->conexao->query("SELECT 
                v.id, 
                v.data_registro, 
                v.qtde_itens, 
                v.valor_total, 
                v.valor_com_desconto, 
                v.desconto, 
                v.valor_pago, 
                v.troco, 
                c.id AS id_cliente, 
                c.cpf, 
                c.nome  
                FROM vendas_nao_finalizadas v LEFT JOIN cliente c ON v.cliente = c.id WHERE v.cliente = {$cliente->getId()}"
            );

            return $this->hidrata_vendas($stmt->fetchAll(\PDO::FETCH_ASSOC));
        }   
        protected function hidrata_vendas(array $vendas) : array
        {

            $vendas_list = [];

            foreach($vendas as $venda){
                $vendas_list[] = new VendaNaoFinalizada(
                    $venda['id'],
                    $venda['data_registro'],
                    [],
                    new Cliente($venda['id_cliente'], $venda['cpf'], $venda['nome']),
                    $venda['desconto'],
                    $venda['qtde_itens'],
                    $venda['valor_total'],
                    $venda['valor_com_desconto'],
                    $venda['valor_pago'],
                    $venda['troco']
                );
            }

            return $vendas_list;
        }

        public function save(VendaNaoFinalizada $vendaNaoFinalizada): bool
        {
            if(is_null($vendaNaoFinalizada->getId())){
                return $this->cadastrar_venda($vendaNaoFinalizada);
            }
        }

        private function cadastrar_venda(VendaNaoFinalizada $venda):bool
        {
            $data = $this->dataAtual();

            $id_cliente = is_null($venda->getCliente()) ? 'null' : $venda->getCliente()->getId();
            
            $insert = $this->conexao->exec("INSERT INTO vendas_nao_finalizadas (
                data_registro, 
                qtde_itens, 
                valor_total, 
                valor_com_desconto, 
                desconto, 
                valor_pago, 
                troco, 
                cliente
            )values (
                '$data', 
                '{$venda->getQtde_itens()}', 
                '{$venda->getTotal()}', 
                '{$venda->getTotal_com_desconto()}', 
                '{$venda->getDesconto()}', 
                '{$venda->getValor_pago()}', 
                '{$venda->getTroco()}', 
                {$id_cliente}
            )
            ");

            $id_venda = $this->conexao->lastInsertId();

            $this->cadastra_produtos_venda($venda->getProdutos(), $id_venda);

            return $insert;
        }

        public function exclui_venda(int $id): bool
        {
            return $this->conexao->exec("DELETE FROM vendas_nao_finalizadas WHERE id = {$id}");
        }

        public function remove_cliente(VendaNaoFinalizada $venda): bool
        {
            $stmt = $this->conexao->query("UPDATE vendas_nao_finalizadas SET cliente = null where id = {$venda->getId()}");
            
            if($stmt === false){
                return false;
            }

            return true;
        }
        
        private function cadastra_cliente(?Cliente $cliente): void
        {
            $stmt = $this->conexao->prepare("INSERT INTO cliente (nome, cpf) VALUES (:nome, :cpf)");
            $stmt->bindValue(':nome', $cliente->getNome());
            $stmt->bindValue(':cpf', $cliente->getCpf());
            $stmt->execute();
            
            $cliente->setId($this->conexao->lastInsertId());
        }

        private function cadastra_produtos_venda(array $produtos, int $id_venda): void
        {
            $query_cadastrar_produtos = "";

            foreach($produtos as $produto){

                $produto_avulso = !$produto->getAvulso() ?  0 : 1;

                $query_cadastrar_produtos .= "INSERT INTO produtos_venda_nao_finalizada (
                    codigo,
                    descricao,
                    un,
                    vl_unitario,
                    qtde,
                    vl_total,
                    avulso,
                    venda
                ) VALUES (
                    '{$produto->getCodigo()}',
                    '{$produto->getDescricao()}',
                    '{$produto->getUn()}',
                    '{$produto->getVlUnitario()}',
                    '{$produto->getQtde()}',
                    '{$produto->getVlTotal()}',
                    '{$produto_avulso}',
                    '{$id_venda}'
                ); ";
            }

            $this->conexao->exec($query_cadastrar_produtos);
        }

        protected function dataAtual() : string
        {
            $timezone = new \DateTimeZone('America/Sao_Paulo');
            $agora = new \DateTime('now', $timezone);
            $data = $agora->format("Y-m-d H:i:s");
            return $data;
        }
        
    }
?>
