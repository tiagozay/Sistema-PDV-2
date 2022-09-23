<?php
    namespace PDV\Infraestrutura\Repository;

    use Exception;
    use PDV\Domain\Model\Produto;
    use PDV\Domain\Model\ProdutoEstoque;

    class PdoProdutoEstoqueRepository
    {
        private \PDO $conexao;

        public function __construct(\PDO $pdo)
        {
            $this->conexao = $pdo;
        }

        public function todos_produtos() : array
        {            
            $stmt = $this->conexao->query("SELECT * FROM sistema_pdv_produtos");

            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return $this->hidrata_produtos($result);
        }

        public function produto_com_id(int $id): ?ProdutoEstoque
        {
            $stmt = $this->conexao->prepare("SELECT * FROM sistema_pdv_produtos WHERE id = ?");
            $stmt->bindValue(1 ,$id);
            $stmt->execute();
            $result = $stmt->fetchAll();
            return count($result) > 0 ? $this->hidrata_produtos($result)[0] : null;
        }

        private function hidrata_produtos(array $produtos) : array
        {
            $produtos_list = [];

            foreach($produtos as $produto){
                $produtos_list[] = new ProdutoEstoque(
                    $produto['id'],
                    $produto['codigo'],
                    $produto['descricao'],
                    $produto['un'],
                    $produto['qtde_disponivel'],
                    $produto['vl_unitario']
                );
            }

            return $produtos_list;
         
        }

        public function save(ProdutoEstoque $produto): bool
        {
            if(is_null($produto->getId())){
                return $this->cadastrar_produto($produto);
            }

            return $this->editar_produto($produto);

        }

        private function cadastrar_produto(ProdutoEstoque $produto)
        {
            if($this->verifica_se_produto_ja_foi_cadastrado($produto)){
                throw new Exception("Produto já foi cadatrado");
            }

            $stmt = $this->conexao->prepare("INSERT INTO sistema_pdv_produtos (
                    codigo, 
                    descricao, 
                    un, 
                    qtde_disponivel, 
                    vl_unitario
                ) values (
                    :codigo, 
                    :descricao, 
                    :un, 
                    :qtde_disponivel, 
                    :vl_unitario
                );
            ");

            $stmt->bindValue(':codigo', $produto->getCodigo());
            $stmt->bindValue(':descricao', $produto->getDescricao());
            $stmt->bindValue(':un', $produto->getUn());
            $stmt->bindValue(':qtde_disponivel', $produto->getQtdeDisponivel());
            $stmt->bindValue(':vl_unitario', $produto->getVlUnitario());

            return $stmt->execute();
            
        }

        private function editar_produto(ProdutoEstoque $produto): bool
        {
            $stmt = $this->conexao->prepare("UPDATE sistema_pdv_produtos SET 
                codigo = :codigo, 
                descricao = :descricao, 
                un = :un, 
                qtde_disponivel = :qtde_disponivel,
                vl_unitario = :vl_unitario 
                WHERE id = :id"
            );

            $stmt->bindValue(':codigo', $produto->getCodigo());
            $stmt->bindValue(':descricao', $produto->getDescricao());
            $stmt->bindValue(':un', $produto->getUn());
            $stmt->bindValue(':qtde_disponivel', $produto->getQtdeDisponivel());
            $stmt->bindValue(':vl_unitario', $produto->getVlUnitario());
            $stmt->bindValue(':id', $produto->getId());

            return $stmt->execute();
        }

        public function excluir_produto(int $id): bool
        {
            $stmt = $this->conexao->prepare("DELETE FROM sistema_pdv_produtos WHERE id = ?");
            $stmt->bindValue(1, $id);
            return $stmt->execute();
        }

        public function excluir_todos_produtos(): bool
        {
            $deletar = $this->conexao->exec("DELETE FROM sistema_pdv_produtos");
            return $deletar;
        }

        public function verifica_se_produto_ja_foi_cadastrado(ProdutoEstoque $produto): bool
        {
            $stmt_busca_produto = $this->conexao->prepare("SELECT codigo FROM sistema_pdv_produtos WHERE codigo = ?");
            $stmt_busca_produto->bindValue(1, $produto->getCodigo());
            $stmt_busca_produto->execute();
            $produto = $stmt_busca_produto->fetchColumn();

            if($produto){
                return true;
            }

            return false;
        }
    }
?>