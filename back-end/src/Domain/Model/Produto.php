<?php
    namespace PDV\Domain\Model;
    
    abstract class Produto
    {
        protected ?int $id;
        protected string $codigo;
        protected string $descricao;
        protected string $un;
        protected float $vl_unitario;

        public function __construct(?int $id, string $codigo, string $descricao, string $un, float $vl_unitario)
        {
            $this->id = $id;
            $this->codigo = $codigo;
            $this->descricao = $descricao;
            $this->un = $un;
            $this->vl_unitario = $vl_unitario;
        }

        public function getId(): ?int
        {
            return $this->id;
        }

        public function getCodigo(): string
        {
            return $this->codigo;
        }
        
        public function getDescricao(): string
        {
            return $this->descricao;
        }

        public function getUn(): string
        {
            return $this->un;
        }

        public function getVlUnitario(): float
        {
            return $this->vl_unitario;
        }
    }
?>