<?php
    namespace PDV\Domain\Model;

    use Doctrine\ORM\Mapping\Column;
    use Doctrine\ORM\Mapping\Entity;
    use JsonSerializable;

    #[Entity()]
    class ProdutoEstoque extends Produto implements JsonSerializable
    {

        #[Column(type:'decimal')]
        private float $qtde_disponivel;

        #[Column(length:100, unique:true)]
        protected string $codigo;

        public function __construct(
            string $codigo, 
            string $descricao, 
            string $un, 
            float $qtde_diponivel, 
            float $vl_unitario
        ){
            parent::__construct($codigo, $descricao, $un, $vl_unitario);
            $this->codigo = $codigo;
            $this->qtde_disponivel = $qtde_diponivel;
        }

        public function baixa_no_estoque(float $qtde)
        {
            $this->qtde_disponivel -= $qtde; 
        }

        public function aumentar_estoque(float $aumento): bool
        {
            if($aumento <= 0){
                return false;
            }

            $this->qtde_disponivel += $aumento;

            return true;
        }

        public function editar(string $codigo, string $descricao, string $un, float $qtde_disponivel ,float $vl_unitario): void
        {
            $this->codigo = $codigo;
            $this->descricao = $descricao;
            $this->un = $un;
            $this->qtde_disponivel = $qtde_disponivel;
            $this->vl_unitario = $vl_unitario;
        }

        public function getQtdeDisponivel(): float
        {
            return $this->qtde_disponivel;
        }

        public function jsonSerialize() : mixed
        {
            $vars = array_merge(get_object_vars($this));
            return $vars;
        }
    }
?>