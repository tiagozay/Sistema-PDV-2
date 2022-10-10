<?php
    namespace PDV\Domain\Model;

    use JsonSerializable;

    class Venda implements JsonSerializable
    {
        private ?int $id; 
        private ?string $data_registro;
        private array $produtos;
        private ?Cliente $cliente;
        private float $desconto;
        private float $qtde_itens;
        private float $total;
        private float $total_com_desconto;
        private float $valor_pago;
        private float $troco;

        public function __construct(?int $id, ?string $data_registro, array $produtos, ?Cliente $cliente, float $desconto, float $qtde_itens, float $total, float $total_com_desconto, float $valor_pago, float $troco)
        {
            $this->id = $id;
            $this->data_registro = $data_registro;
            $this->produtos = $produtos;
            $this->cliente = $cliente;
            $this->desconto = $desconto;
            $this->qtde_itens = $qtde_itens;
            $this->total = $total;
            $this->total_com_desconto = $total_com_desconto;
            $this->valor_pago = $valor_pago;
            $this->troco = $troco;
        }

        public function getId(): ?int
        {
            return $this->id;
        }

        public function getProdutos(): array
        {
            return $this->produtos;
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
        
        public function setProdutos(array $produtos)
        {
            $this->produtos = $produtos;

            return $this;
        }

        public function setCliente(?Cliente $cliente)
        {
            $this->cliente = $cliente;

            return $this;
        }

        public function setDesconto(float $cliente)
        {
            $this->cliente = $cliente;

            return $this;
        }

        public function setQtde_itens($qtde_itens)
        {
            $this->qtde_itens = $qtde_itens;

            return $this;
        }

        public function setTotal($total)
        {
            $this->total = $total;

            return $this;
        }

        public function setTotal_com_desconto($total_com_desconto)
        {
            $this->total_com_desconto = $total_com_desconto;

            return $this;
        }

        public function setValor_pago($valor_pago)
        {
            $this->valor_pago = $valor_pago;

            return $this;
        }

        public function setTroco($troco)
        {
            $this->troco = $troco;

            return $this;
        }

        public function jsonSerialize() : mixed
        {
            $vars = array_merge(get_object_vars($this));
            return $vars;
        }
    }
?>