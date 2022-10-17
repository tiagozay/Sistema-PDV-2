<?php
    namespace PDV\Domain\Model;

    use JsonSerializable;

    class ProdutoFicha extends ProdutoVenda implements JsonSerializable
    {
        private string $data_registro;
        private string $estado;


        public function __construct(?int $id, string $data_registro, string $codigo, string $descricao, string $un, float $qtde, float $vl_unitario, float $vl_total, string $estado, bool $avulso)
        {
            parent::__construct($id, $codigo, $descricao, $un, $qtde ,$vl_unitario, $vl_total, $avulso);
            $this->data_registro = $data_registro;
            $this->estado = $estado;

        }

        public function devolver(): void
        {
            $this->estado = "Devolvido";
        }

        public function pagar(): void
        {
            $this->estado = "Pago";
        }
        
        public function getData_registro(): string
        {
            return $this->data_registro;
        }

        public function setData_registro(string $data_registro)
        {
            $this->data_registro = $data_registro;

            return $this;
        }

        public function getEstado(): string
        {
            return $this->estado;
        }

        // public function setEstado(string $estado)
        // {
        //     $this->estado = $estado;

        //     return $this;
        // }

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
