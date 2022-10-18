<?php
    namespace PDV\Domain\Model;

    use DateTime;
    use Doctrine\ORM\Mapping\Column;
    use Doctrine\ORM\Mapping\Entity;
    use Doctrine\ORM\Mapping\ManyToOne;
    use JsonSerializable;

    #[Entity()]
    class ProdutoFicha extends Produto implements JsonSerializable
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
            string $data_registro, 
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
            $this->data_registro = $data_registro;
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

        public function setData_registro(DateTime $data_registro)
        {
            $this->data_registro = $data_registro;
        }

        public function setFicha(Ficha $ficha): void
        {
            $this->ficha = $ficha;
            $ficha->adiciona_produto($this);
        }

        public function jsonSerialize() : mixed
        {
            $vars = array_merge(get_object_vars($this));
            return $vars;
        }
    }


    //Pendente
    //Pago
    //Devolvido
    
?>
