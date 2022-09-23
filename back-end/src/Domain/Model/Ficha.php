<?php
    namespace PDV\Domain\Model;

        use JsonSerializable;

    class Ficha implements JsonSerializable
    {
        private ?int $id;
        private Cliente $cliente;
        private array $produtos;
        private float $qtde_itens;
        private float $total;
        private float $valor_pago;

        public function __construct(
            ?int $id, 
            Cliente $cliente,
            array $produtos, 
            float $qtde_itens,
            float $total,
            float $valor_pago, 
         )
        {
            $this->id = $id;
            $this->cliente = $cliente;
            $this->produtos = $produtos;
            $this->qtde_itens = $qtde_itens;
            $this->total = $total;
            $this->valor_pago = $valor_pago;
        }

        public function adiciona_novos_produtos(array $produtos)
        {
                $this->produtos = array_merge($this->produtos, $produtos);

                $this->calcula_qtde_de_itens();
                $this->calcula_valor_total();
                $this->calcula_valor_pago();
        }

        public function devolve_produto(int $id_produto)
        {
                $produto = $this->produto_com_id($id_produto);

                $produto->devolver();

                $this->calcula_qtde_de_itens();
                $this->calcula_valor_total();
                $this->calcula_valor_pago();
        }

        public function remove_produto(int $id_produto)
        {
                $produto = $this->produto_com_id($id_produto);

                $indice_produto = array_search($produto, $this->produtos);
                
                array_splice($this->produtos, $indice_produto, 1);

                $this->calcula_qtde_de_itens();
                $this->calcula_valor_total();
                $this->calcula_valor_pago();
        }

        public function paga_produto(int $id_produto)
        {
                $produto = $this->produto_com_id($id_produto);

                $produto->pagar();

                $this->calcula_qtde_de_itens();
                $this->calcula_valor_total();
                $this->calcula_valor_pago();
        }

        public function limpa_ficha()
        {
                $this->produtos = [];
                $this->qtde_itens = 0;
                $this->total = 0;
                $this->valor_pago = 0;
        }

        private function calcula_qtde_de_itens(): void
        {

                $this->qtde_itens = array_reduce($this->produtos, function($acumulador, ProdutoFicha $produto){

                        $quantidade = 0;

                        if($this->ehPendente($produto)){
                                $quantidade = $produto->getQtde();
                        }

                        return $acumulador + $quantidade;

                }, 0);
        }

        private function calcula_valor_total(): void
        {

                $this->total = array_reduce($this->produtos, function($acumulador, ProdutoFicha $produto){

                        $valor = 0;

                        if($this->ehPendente($produto)){
                                $valor = $produto->getVlTotal();
                        }

                        return $acumulador + $valor;

                }, 0);
        }

        private function calcula_valor_pago(): void
        {
                $this->valor_pago = array_reduce($this->produtos, function($acumulador, ProdutoFicha $produto){

                        $valor_pago = 0;

                        if($this->ehPago($produto)){
                                $valor_pago = $produto->getVlTotal();
                        }

                        return $acumulador + $valor_pago;

                }, 0); 
        }



        private function ehPendente($produto): bool
        {
                return $produto->getEstado() == "Pendente";
        }

        private function ehPago($produto): bool
        {
                return $produto->getEstado() == "Pago";
        }

        public function produto_com_id(int $id): ?ProdutoFicha
        {

                $produto_procurado = null;
                
                foreach($this->getProdutos() as $produto)
                {
                        if($produto->getId() == $id){
                                $produto_procurado = $produto;
                                break;
                        }
                }
                return $produto_procurado;
        }

        public function getId(): ?int
        {
                return $this->id;
        }

        public function setId($id)
        {
                $this->id = $id;

                return $this;
        }

        public function getCliente(): Cliente
        {
                return $this->cliente;
        }

        public function setCliente($cliente)
        {
                $this->cliente = $cliente;

                return $this;
        }

        public function getProdutos(): array
        {
                return $this->produtos;
        }

        public function setProdutos(array $produtos)
        {
                $this->produtos = $produtos;

                return $this;
        }

        public function getQtde_itens(): float
        {
                return $this->qtde_itens;
        }

        public function setQtde_itens($qtde_itens)
        {
                $this->qtde_itens = $qtde_itens;

                return $this;
        }

        public function getTotal(): float
        {
                return $this->total;
        }

        public function setTotal($total)
        {
                $this->total = $total;

                return $this;
        }

        public function getValor_pago(): float
        {
                return $this->valor_pago;
        }

        public function setValor_pago($valor_pago)
        {
                $this->valor_pago = $valor_pago;

                return $this;
        }

        public function jsonSerialize()
        {
                $vars = array_merge(get_object_vars($this));
                return $vars;
        }

    }
?>