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
    class ProdutoVenda extends Produto
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

        public function alterarCodigo(string $novoCodigo): void
        {
            $this->codigo = $novoCodigo;
        }

        public static function alteraCodigoDeProdutos(array $produtos, string $novoCodigo): void
        {
            foreach($produtos as $produto){
                $produto->alterarCodigo($novoCodigo);
            }
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
                'id_venda' => $this->venda->id,
                'codigo' => $this->codigo,
                'descricao' => $this->descricao,
                'un' => $this->un,
                'vl_unitario' => $this->vl_unitario,
                'qtde' => $this->qtde,
                'vl_total' => $this->vl_total,
                'avulso' => $this->avulso,
            ];
        }
    }
?>