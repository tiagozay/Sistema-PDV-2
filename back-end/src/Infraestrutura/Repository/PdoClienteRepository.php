<?php
    namespace PDV\Infraestrutura\Repository;

    use Exception;
    use PDV\Domain\Model\Cliente;

    class PdoClienteRepository
    {
        private \PDO $conexao;

        public function __construct(\PDO $pdo)
        {
            $this->conexao = $pdo;
        }

        public function todos_clientes() : array
        {            
            $stmt = $this->conexao->query("SELECT * FROM cliente");

            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return $this->hidrata_clientes($result);
        }

        public function todos_clientes_ordenados(string $ordem) : array
        {            
            //ordem_alfabetica
            //ordem_alfabetica_dec
            //mais_recente
            //mais_antigo

            $query = "SELECT * FROM cliente ";

            if($ordem == 'ordem_alfabetica'){
                $query .= "ORDER BY nome";
            }else if($ordem == 'ordem_alfabetica_dec'){
                $query .= "ORDER BY nome desc";
            }else if($ordem == 'mais_recente'){
                $query .= "ORDER BY id desc";
            }else if($ordem == 'mais_antigo'){
                $query .= "";
            }

            $stmt = $this->conexao->query($query);

            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return $this->hidrata_clientes($result);
        }

        public function cliente_com_id(int $id): Cliente
        {
            $stmt = $this->conexao->prepare("SELECT * FROM cliente WHERE id = ?");
            $stmt->bindValue(1 ,$id);
            $stmt->execute();
            $result = $stmt->fetchAll();
            return $this->hidrata_clientes($result)[0];
        }

        private function hidrata_clientes(array $clientes) : array
        {
            $clientes_list = [];

            foreach($clientes as $cliente){
                $clientes_list[] = new Cliente(
                    $cliente['id'],
                    $cliente['cpf'],
                    $cliente['nome'],
                );
            }

            return $clientes_list;
         
        }

        public function save(Cliente $cliente): bool
        {
            if(is_null($cliente->getId())){
                try{
                    return $this->cadastrar_cliente($cliente);
                }catch(Exception){
                    return false;
                }
               
            }

            try{
                return $this->editar_cliente($cliente);
            }catch(Exception){
                return false;
            }
         

        }

        private function cadastrar_cliente(Cliente $cliente)
        {
            $stmt = $this->conexao->prepare("INSERT INTO cliente (
                    cpf, 
                    nome
                ) values (
                    :cpf, 
                    :nome
                );
            ");

            $stmt->bindValue(':cpf', $cliente->getCpf());
            $stmt->bindValue(':nome', $cliente->getNome());

            return $stmt->execute();
            
        }

        private function editar_cliente(Cliente $cliente): bool
        {
            $stmt = $this->conexao->prepare("UPDATE cliente SET 
                cpf = :cpf, 
                nome = :nome
                WHERE id = :id"
            );

            $stmt->bindValue(':cpf', $cliente->getCpf());
            $stmt->bindValue(':nome', $cliente->getNome());
            $stmt->bindValue(':id', $cliente->getId());

            return $stmt->execute();
        }

        public function excluir_cliente(int $id): bool
        {
            $stmt = $this->conexao->prepare("DELETE FROM cliente WHERE id = ?");
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