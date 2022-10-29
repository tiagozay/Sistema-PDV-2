<?php
    namespace PDV\Domain\Model;

    use Doctrine\ORM\Mapping\Column;
    use Doctrine\ORM\Mapping\Entity;
    use JsonSerializable;

    #[Entity()]
    class ProdutoEstoque extends Produto
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

        public static function toArrays(array $produtos): array
        {
            return array_map(function($produto){
                return $produto->toArray();
            }, $produtos);
        }

        public function toArray(): array
        {   
            return [
                'id' => $this->id,
                'codigo' => $this->codigo,
                'descricao' => $this->descricao,
                'un' => $this->un,
                'vl_unitario' => $this->vl_unitario,
                'qtde_disponivel' => $this->qtde_disponivel,
            ];
        }
    }
?>