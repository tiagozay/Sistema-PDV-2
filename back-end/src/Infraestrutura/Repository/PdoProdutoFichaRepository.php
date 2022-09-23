<?php
    namespace PDV\Infraestrutura\Repository;

    use Exception;
use PDV\Domain\Model\Ficha;
use PDV\Domain\Model\Produto;
    use PDV\Domain\Model\ProdutoFicha;

    class PdoProdutoFichaRepository
    {
        private \PDO $conexao;

        public function __construct(\PDO $pdo)
        {
            $this->conexao = $pdo;
        }

        public function todos_produtos() : array
        {            
            $stmt = $this->conexao->query("SELECT * FROM produtos_ficha");

            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return $this->hidrata_produtos($result);
        }

        public function produto_com_id(int $id): ProdutoFicha
        {
            $stmt = $this->conexao->prepare("SELECT * FROM produtos_ficha WHERE id = ?");
            $stmt->bindValue(1 ,$id);
            $stmt->execute();
            $result = $stmt->fetchAll();
            return $this->hidrata_produtos($result)[0];
        }

        private function hidrata_produtos(array $produtos) : array
        {
            $produtos_list = [];

            foreach($produtos as $produto){
                $produtos_list[] = new ProdutoFicha(
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

            return $produtos_list;
         
        }

        public function save(ProdutoFicha $produto, $id_ficha = null): bool
        {
            if(is_null($produto->getId())){
                return $this->cadastrar_produto($produto,  $id_ficha);
            }

            return $this->editar_produto($produto);

        }

        private function cadastrar_produto(ProdutoFicha $produto, int $id_ficha)
        {

            $stmt = $this->conexao->prepare("INSERT INTO produtos_ficha (
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
                ) values (
                    :data_registro,
                    :codigo, 
                    :descricao, 
                    :un, 
                    :vl_unitario,
                    :qtde, 
                    :vl_total,
                    :estado,
                    :avulso,
                    :ficha,
                    :id_produto_estoque,
                );
            ");

            $stmt->bindValue(':data_registro', $produto->getData_registro());
            $stmt->bindValue(':codigo', $produto->getCodigo());
            $stmt->bindValue(':descricao', $produto->getDescricao());
            $stmt->bindValue(':un', $produto->getUn());
            $stmt->bindValue(':vl_unitario', $produto->getVlUnitario());
            $stmt->bindValue(':qtde', $produto->getQtde());
            $stmt->bindValue(':vl_total', $produto->getVlTotal());
            $stmt->bindValue(':estado', $produto->getEstado());
            $stmt->bindValue(':avulso', $produto->getAvulso());
            $stmt->bindValue(':ficha', $id_ficha);
            $stmt->bindValue(':id_produto_estoque', $produto->getIdProdutoEstoque());


            return $stmt->execute();
            
        }

        private function editar_produto(ProdutoFicha $produto): bool
        {
            $stmt = $this->conexao->prepare("UPDATE produtos_ficha SET 
                data_registro = :data_registro,
                codigo = :codigo,
                descricao = :descricao,
                un = :un,
                vl_unitario = :vl_unitario,
                qtde = :qtde,
                vl_total = :vl_total,
                estado = :estado,
                avulso = :avulso,
                id_produto_estoque = :id_produto_estoque 
                WHERE id = :id"
            );

            $stmt->bindValue(':data_registro', $produto->getData_registro());
            $stmt->bindValue(':codigo', $produto->getCodigo());
            $stmt->bindValue(':descricao', $produto->getDescricao());
            $stmt->bindValue(':un', $produto->getUn());
            $stmt->bindValue(':vl_unitario', $produto->getVlUnitario());
            $stmt->bindValue(':qtde', $produto->getQtde());
            $stmt->bindValue(':vl_total', $produto->getVlTotal());
            $stmt->bindValue(':estado', $produto->getEstado());
            $stmt->bindValue(':avulso', $produto->getAvulso());
            $stmt->bindValue(':id_produto_estoque', $produto->getIdProdutoEstoque());
            $stmt->bindValue(':id', $produto->getId());


            return $stmt->execute();
        }

        public function excluir_produto(int $id): bool
        {
            $stmt = $this->conexao->prepare("DELETE FROM produtos_ficha WHERE id = ?");
            $stmt->bindValue(1, $id);
            return $stmt->execute();
        }
    }
?>