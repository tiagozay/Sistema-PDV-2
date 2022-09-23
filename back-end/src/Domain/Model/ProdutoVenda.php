<?php
    namespace PDV\Domain\Model;

    use JsonSerializable;

    class ProdutoVenda extends Produto implements JsonSerializable
    {
        protected ?int $id_produto_estoque;
        protected float $qtde;
        protected float $vl_total;
        protected bool $avulso;

        public function __construct(?int $id, ?int $id_produto_estoque, string $codigo, string $descricao, string $un, float $qtde, float $vl_unitario, float $vl_total, bool $avulso)
        {
            parent::__construct($id, $codigo, $descricao, $un, $vl_unitario);
            $this->id_produto_estoque = $id_produto_estoque; 
            $this->qtde = $qtde;
            $this->vl_total = $vl_total;
            $this->avulso = $avulso;
        }

        public function getIdProdutoEstoque(): ?int
        {
            return $this->id_produto_estoque;
        }

        public function getQtde(): float
        {
            return $this->qtde;
        }

        public function getVlTotal(): float
        {
            return $this->vl_total;
        }

        public function getAvulso(): bool
        {
            return $this->avulso;
        }

        public function jsonSerialize() {
            $vars = array_merge(get_object_vars($this));
            return $vars;
        }
    }
?>