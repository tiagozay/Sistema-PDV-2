<?php
    namespace PDV\Domain\Model;

    use JsonSerializable;
    use Doctrine\ORM\Mapping\Column;
    use Doctrine\ORM\Mapping\Entity;
    use Doctrine\ORM\Mapping\InheritanceType;
    use Doctrine\ORM\Mapping\DiscriminatorColumn;
    use Doctrine\ORM\Mapping\DiscriminatorMap;
    use Doctrine\ORM\Mapping\ManyToOne;

    #[
        Entity, 
        InheritanceType("SINGLE_TABLE"), 
        DiscriminatorColumn('tipo_da_venda', type:"string"), 
        DiscriminatorMap([
            'venda_finalizada' => ProdutoVenda::class, 
            'venda_nao_finalizada' => ProdutoVendaNaoFinalizada::class
        ])
    ]
    class ProdutoVenda extends Produto implements JsonSerializable
    {
        #[Column(type:'decimal')]
        private float $qtde;

        #[Column(type:'decimal')]
        private float $vl_total;

        #[Column()]
        private bool $avulso;

        #[ManyToOne(targetEntity: Venda::class, inversedBy:'produtos')]
        private Venda $venda;

        public function __construct(
            string $codigo, 
            string $descricao, 
            string $un, 
            float $qtde, 
            float $vl_unitario, 
            float $vl_total, 
            bool $avulso
        ){
            parent::__construct($codigo, $descricao, $un, $vl_unitario);
            $this->qtde = $qtde;
            $this->vl_total = $vl_total;
            $this->avulso = $avulso;
        }

        public function setVenda(Venda $venda): void
        {
            $this->venda = $venda;
        }

        public function getVenda(): Venda
        {
            return $this->venda;
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

        public function jsonSerialize() : mixed
        {
            $vars = array_merge(get_object_vars($this));
            return $vars;
        }
    }
?>