<?php
    namespace PDV\Domain\Model;

    use JsonSerializable;

    class ProdutoEstoque extends Produto implements JsonSerializable
    {
        private float $qtde_disponivel;

        public function __construct(?int $id, string $codigo, string $descricao, string $un, float $qtde_diponivel, float $vl_unitario)
        {
            parent::__construct($id, $codigo, $descricao, $un, $vl_unitario);
            $this->qtde_disponivel = $qtde_diponivel;
        }

        public function baixa_no_estoque(float $qtde)
        {
            $this->qtde_disponivel -= $qtde; 
        }

        public function editar(string $codigo, string $descricao, string $un, float $qtde_disponivel ,float $vl_unitario): void
        {
            $this->codigo = $codigo;
            $this->descricao = $descricao;
            $this->un = $un;
            $this->qtde_disponivel = $qtde_disponivel;
            $this->vl_unitario = $vl_unitario;
        }

        public function aumentar_estoque(float $aumento): bool
        {
            if($aumento <= 0){
                return false;
            }

            $this->qtde_disponivel += $aumento;

            return true;
        }
        
        public function getId(): ?int
        {
            return $this->id;
        }

        public function getCodigo(): string
        {
            return $this->codigo;
        }
        
        public function getDescricao(): string
        {
            return $this->descricao;
        }

        public function getUn(): string
        {
            return $this->un;
        }

        public function getQtdeDisponivel(): float
        {
            return $this->qtde_disponivel;
        }

        public function getVlUnitario(): float
        {
            return $this->vl_unitario;
        }

        public function jsonSerialize() 
        {
            $vars = array_merge(get_object_vars($this));
            return $vars;
        }
    }
?>