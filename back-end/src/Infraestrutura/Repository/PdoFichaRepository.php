<?php
    namespace PDV\Infraestrutura\Repository;

    use Exception;
    use PDV\Domain\Model\Cliente;
    use PDV\Domain\Model\Ficha;
    use PDV\Domain\Model\ProdutoFicha;

    class PdoFichaRepository
    {
        private \PDO $conexao;

        public function __construct(\PDO $pdo)
        {
            $this->conexao = $pdo;
        }

        public function todas_fichas() : array
        {            
            $stmt = $this->conexao->query("SELECT * FROM ficha");

            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return $this->hidrata_fichas($result);
        }

        public function ficha_com_produtos(int $id) : Ficha
        {            
            $stmt = $this->conexao->query("
                    SELECT  
                    f.id, 
                    f.qtde_itens, 
                    f.total, 
                    f.valor_pago, 
                    c.id as id_cliente, 
                    c.cpf as cpf_cliente, 
                    c.nome as nome_cliente
                    FROM ficha f INNER JOIN cliente c 
                    ON c.id = f.cliente
                    WHERE f.id = $id
                ");

            $result = $stmt->fetch(\PDO::FETCH_ASSOC);

            $ficha = new Ficha(
                $result['id'],
                new Cliente($result['id_cliente'], $result['cpf_cliente'], $result['nome_cliente']),
                [],
                $result['qtde_itens'],
                $result['total'],
                $result['valor_pago'],
            );

            $produtos = $this->busca_produtos_ficha($ficha);

            $ficha->setProdutos($produtos);

            return $ficha;
        }

        // public function todos_clientes_ordenados(string $ordem) : array
        // {            

        //     $query = "SELECT * FROM cliente ";

        //     if($ordem == 'ordem_alfabetica'){
        //         $query .= "ORDER BY nome";
        //     }else if($ordem == 'ordem_alfabetica_dec'){
        //         $query .= "ORDER BY nome desc";
        //     }else if($ordem == 'mais_recente'){
        //         $query .= "ORDER BY id desc";
        //     }else if($ordem == 'mais_antigo'){
        //         $query .= "";
        //     }

        //     $stmt = $this->conexao->query($query);

        //     $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        //     return $this->hidrata_fichas($result);
        // }

        public function ficha_com_id(int $id): Ficha
        {
            $stmt = $this->conexao->prepare("SELECT * FROM ficha WHERE id = ?");
            $stmt->bindValue(1 ,$id);
            $stmt->execute();
            $result = $stmt->fetchAll();
            return $this->hidrata_fichas($result)[0];
        }

        private function busca_cliente_de_uma_lista_da_ficha(array $clientes, int $id_cliente): ?Cliente
        {

            $cliente_buscado = null;

            foreach($clientes as $cliente){
                if($cliente->getId() == $id_cliente){
                    $cliente_buscado = $cliente;
                    break;
                }
            }

            return $cliente_buscado;

        }
        
        public function busca_ficha_de_cliente(Cliente $cliente): ?Ficha
        {
            $stmt = $this->conexao->query("
                SELECT  
                f.id, 
                f.qtde_itens, 
                f.total, 
                f.valor_pago, 
                c.id as id_cliente, 
                c.cpf as cpf_cliente, 
                c.nome as nome_cliente
                FROM ficha f INNER JOIN cliente c 
                ON c.id = f.cliente
                WHERE f.cliente = {$cliente->getId()}
        ");

            $result = $stmt->fetch(\PDO::FETCH_ASSOC);

            if($result){

                $ficha = new Ficha(
                    $result['id'],
                    new Cliente($result['id_cliente'], $result['cpf_cliente'], $result['nome_cliente']),
                    [],
                    $result['qtde_itens'],
                    $result['total'],
                    $result['valor_pago'],
                );

                $produtos = $this->busca_produtos_ficha($ficha);

                $ficha->setProdutos($produtos);

                return $ficha;
            }

            return null;

        }

        private function busca_produtos_ficha(Ficha $ficha): array
        {
            $stmt_produtos = $this->conexao->query("SELECT * FROM produtos_ficha WHERE ficha = {$ficha->getId()}");

            $result_produtos = $stmt_produtos->fetchAll(\PDO::FETCH_ASSOC); 

            $produtos = [];

            foreach($result_produtos as $produto){
                $produtos[] = new ProdutoFicha(
                    $produto['id'],
                    $produto['id_produto_estoque'],
                    $produto['data_registro'],
                    $produto['codigo'],
                    $produto['descricao'],
                    $produto['un'],
                    $produto['qtde'],
                    $produto['vl_unitario'],
                    $produto['vl_total'],
                    $produto['estado'],
                    $produto['avulso'],
                );
            }

            return $produtos;
        }

        private function hidrata_fichas(array $fichas) : array
        {

            $cliente_repository = new PdoClienteRepository($this->conexao);

            $clientes = $cliente_repository->todos_clientes();

            $fichas_list = [];

            foreach($fichas as $ficha){

                $cliente = $this->busca_cliente_de_uma_lista_da_ficha($clientes, $ficha['cliente']);

                $fichas_list[] = new Ficha(
                    $ficha['id'],
                    $cliente,
                    [],
                    $ficha['qtde_itens'],
                    $ficha['total'],
                    $ficha['valor_pago'],
                );
            }

            return $fichas_list;
         
        }

        private function hidrata_produtos(array $produtos)
        {
            return array_map(function($produto){
                return new ProdutoFicha(
                    $produto['id'],
                    $produto['id_produto_estoque'],
                    $produto['data_registro'],
                    $produto['codigo'],
                    $produto['descricao'],
                    $produto['un'],
                    $produto['qtde'],
                    $produto['vl_unitario'],
                    $produto['vl_total'],
                    $produto['estado'],
                    $produto['avulso'],
                );
            }, $produtos);
        }


        public function save(Ficha $ficha): bool
        {
            if(is_null($ficha->getId())){
                return $this->cadastrar_ficha($ficha);
            }

            return $this->editar_ficha($ficha);

        }

        private function cadastrar_ficha(Ficha $ficha): bool
        {

            $stmt = $this->conexao->prepare("INSERT INTO ficha (
                    qtde_itens,
                    total,
                    valor_pago,
                    cliente
                ) values (
                    :qtde_itens,
                    :total,
                    :valor_pago,
                    :cliente
                );
            ");

            $stmt->bindValue(':qtde_itens', $ficha->getQtde_itens());
            $stmt->bindValue(':total', $ficha->getTotal());
            $stmt->bindValue(':valor_pago', $ficha->getValor_pago());
            $stmt->bindValue(':cliente', $ficha->getCliente()->getId());

            $insert = $stmt->execute();

            $id_ficha = $this->conexao->lastInsertId();

            $ficha->setId( $insert ? $id_ficha : null);

            $this->cadastra_produtos_ficha($ficha->getProdutos(), $id_ficha);

            return $insert;
            
        }

        private function cadastra_produtos_ficha(array $produtos, int $id_ficha): void
        {
            if(count($produtos) < 1) return;


            $query_cadastrar_produtos = "";

            foreach($produtos as $produto){
                $query_cadastrar_produtos .= "INSERT INTO produtos_ficha (
                    data_registro,
                    codigo,
                    descricao,
                    un,
                    vl_unitario,
                    qtde,
                    vl_total,
                    estado,
                    avulso,
                    ficha,
                    id_produto_estoque
                ) VALUES (
                    '{$produto->getData_registro()}',
                    '{$produto->getCodigo()}',
                    '{$produto->getDescricao()}',
                    '{$produto->getUn()}',
                    '{$produto->getVlUnitario()}',
                    '{$produto->getQtde()}',
                    '{$produto->getVlTotal()}',
                    '{$produto->getEstado()}',
                    '{$produto->getAvulso()}',
                    '{$id_ficha}',
                    '{$produto->getIdProdutoEstoque()}'
                ); ";
            }

            $this->conexao->exec($query_cadastrar_produtos);
        }

        private function editar_ficha(Ficha $ficha): bool
        {
            $stmt = $this->conexao->prepare("UPDATE ficha SET 
                qtde_itens = :qtde_itens,
                total = :total,
                valor_pago = :valor_pago,
                cliente = :cliente
                WHERE id = :id"
            );

            $stmt->bindValue(':qtde_itens', $ficha->getQtde_itens());
            $stmt->bindValue(':total', $ficha->getTotal());
            $stmt->bindValue(':valor_pago', $ficha->getValor_pago());
            $stmt->bindValue(':cliente', $ficha->getCliente()->getId());
            $stmt->bindValue(':id', $ficha->getId());

            $execute = $stmt->execute();

            $this->cadastra_os_produtos_novos_da_ficha($ficha);

            return $execute;
        }

        private function cadastra_os_produtos_novos_da_ficha(Ficha $ficha) 
        {
            $produtos_ainda_nao_cadastrados = array_filter($ficha->getProdutos(), function(ProdutoFicha $produto){
                return is_null($produto->getId());
            }); 

            $this->cadastra_produtos_ficha($produtos_ainda_nao_cadastrados, $ficha->getId());

        }

        public function excluir_ficha(int $id): bool
        {
            $stmt = $this->conexao->prepare("DELETE FROM ficha WHERE id = ?");
            $stmt->bindValue(1, $id);
            return $stmt->execute();
        }

        // public function excluir_todos_produtos(): bool
        // {
        //     $deletar = $this->conexao->exec("DELETE FROM sistema_pdv_produtos");
        //     return $deletar;
        // }

        // public function verifica_se_produto_ja_foi_cadastrado(ProdutoEstoque $produto): bool
        // {
        //     $stmt_busca_produto = $this->conexao->prepare("SELECT codigo FROM sistema_pdv_produtos WHERE codigo = ?");
        //     $stmt_busca_produto->bindValue(1, $produto->getCodigo());
        //     $stmt_busca_produto->execute();
        //     $produto = $stmt_busca_produto->fetchColumn();

        //     if($produto){
        //         return true;
        //     }

        //     return false;
        // }
    }
?>