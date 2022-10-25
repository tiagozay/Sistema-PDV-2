<?php
    namespace PDV\Domain\Model;

    use DateTime;
    use Doctrine\Common\Collections\ArrayCollection;
    use Doctrine\Common\Collections\Collection;
    use Doctrine\ORM\Mapping\Column;
    use Doctrine\ORM\Mapping\GeneratedValue;
    use Doctrine\ORM\Mapping\Id;
    use Doctrine\ORM\Mapping\OneToMany;
    use Doctrine\ORM\Mapping\Entity;
    use Doctrine\ORM\Mapping\InheritanceType;
    use Doctrine\ORM\Mapping\DiscriminatorColumn;
    use Doctrine\ORM\Mapping\DiscriminatorMap;
use Doctrine\ORM\Mapping\ManyToOne;
use JsonSerializable;

    #[
        Entity, 
        InheritanceType("SINGLE_TABLE"), 
        DiscriminatorColumn('tipo_da_venda', type:"string"), 
        DiscriminatorMap(['venda_nao_finalizada' => VendaNaoFinalizada::class])
    ]
    class Venda implements JsonSerializable
    {
        #[Id, Column(), GeneratedValue()]
        public int $id; 

        #[Column('datetime')]
        private ?DateTime $data_registro;

        #[OneToMany(mappedBy: 'venda', targetEntity: ProdutoVenda::class, cascade:['persist', 'remove'])]
        private Collection $produtos;

        #[ManyToOne(targetEntity: Cliente::class, inversedBy:'vendas')]
        private ?Cliente $cliente;

        #[Column(type:'decimal')]
        private float $desconto;

        #[Column(type:'decimal')]
        private float $qtde_itens;

        #[Column(type:'decimal')]
        private float $total;

        #[Column(type:'decimal')]
        private float $total_com_desconto;

        #[Column(type:'decimal')]
        private float $valor_pago;

        #[Column(type:'decimal')]
        private float $troco;

        public function __construct(?DateTime $data_registro, ?Cliente $cliente, float $desconto, float $qtde_itens, float $total, float $total_com_desconto, float $valor_pago, float $troco)
        {
            $this->data_registro = $data_registro;
            $this->produtos = new ArrayCollection();
            $this->cliente = $cliente;

            if(!is_null($cliente)){
                $cliente->addVenda($this);
            }

            $this->desconto = $desconto;
            $this->qtde_itens = $qtde_itens;
            $this->total = $total;
            $this->total_com_desconto = $total_com_desconto;
            $this->valor_pago = $valor_pago;
            $this->troco = $troco;
        }

        /** @return ProdutoVenda[] */
        public function getProdutos(): iterable
        {
            return $this->produtos;
        }

        public function adiciona_produto(ProdutoVenda $produto):void
        {
            $this->produtos->add($produto);
            $produto->setVenda($this);
        }

        public function getCliente(): ?Cliente
        {
            return $this->cliente;
        }
        
        public function getDesconto(): float
        {
            return $this->desconto;
        }

        public function getQtde_itens(): float
        {
            return $this->qtde_itens;
        }

        public function getTotal(): float
        {
            return $this->total;
        }

        public function getTotal_com_desconto(): float
        {
            return $this->total_com_desconto;
        }

        public function getValor_pago(): float
        {
            return $this->valor_pago;
        }

        public function getTroco(): float
        {
            return $this->troco;
        }
        
        public function removeCliente()
        {
            $this->cliente = null;
        }

        public function setDesconto(float $cliente)
        {
            $this->cliente = $cliente;

        }

        public function setQtde_itens($qtde_itens)
        {
            $this->qtde_itens = $qtde_itens;

        }

        public function setTotal($total)
        {
            $this->total = $total;

        }

        public function setTotal_com_desconto($total_com_desconto)
        {
            $this->total_com_desconto = $total_com_desconto;

        }

        public function setValor_pago($valor_pago)
        {
            $this->valor_pago = $valor_pago;

        }

        public function setTroco($troco)
        {
            $this->troco = $troco;

        }

        public function jsonSerialize() : mixed
        {
            $vars = array_merge(get_object_vars($this));
            return $vars;
        }
    }
?>