<?php
    namespace PDV\Domain\Model;

    use DateTime;
    use PDV\Domain\Helper\DataHelper;
    use Doctrine\ORM\Mapping\Column;
    use Doctrine\ORM\Mapping\Entity;
    use Doctrine\ORM\Mapping\ManyToOne;
    use JsonSerializable;

    #[Entity()]
    class ProdutoFicha extends Produto
    {
        
        #[Column(type:'decimal')]
        private float $qtde;

        #[Column(type:'decimal')]
        private float $vl_total;

        #[Column()]
        private bool $avulso;

        #[Column(type: 'datetime')]
        private DateTime $data_registro;

        #[Column(length: 20)]
        private string $estado;

        #[ManyToOne(Ficha::class, inversedBy: 'produtos')]
        private Ficha $ficha;

        public function __construct(
            string $codigo, 
            string $descricao, 
            string $un, 
            float $qtde, 
            float $vl_unitario, 
            float $vl_total, 
            string $estado, 
            bool $avulso
        ){
            $this->qtde = $qtde;
            $this->vl_total = $vl_total;
            $this->avulso = $avulso;
            $this->data_registro = DataHelper::dataAtual();
            $this->estado = $estado;
            parent::__construct($codigo, $descricao, $un, $vl_unitario);

        }

        public function devolver(): void
        {
            $this->estado = "Devolvido";
        }

        public function pagar(): void
        {
            $this->estado = "Pago";
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

        public function getEstado(): string
        {
            return $this->estado;
        }

        public function getData_registro(): DateTime
        {
            return $this->data_registro;
        }

        public function getFicha(): ?Ficha
        {
            return $this->ficha;
        }

        public function setData_registro(DateTime $data_registro)
        {
            $this->data_registro = $data_registro;
        }

        public function setFicha(Ficha $ficha): void
        {
            $this->ficha = $ficha;
            $ficha->adiciona_produto($this);
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
                'id_ficha' => $this->ficha->id,
                'codigo' => $this->codigo,
                'descricao' => $this->descricao,
                'un' => $this->un,
                'vl_unitario' => $this->vl_unitario,
                'qtde' => $this->qtde,
                'vl_total' => $this->vl_total,
                'avulso' => $this->avulso,
                'data_registro' => $this->data_registro,
                'estado' => $this->estado,
            ];
        }
    }


    //Pendente
    //Pago
    //Devolvido
    
?>
