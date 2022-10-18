<?php
    namespace PDV\Domain\Model;

    use Doctrine\ORM\Mapping\Column;
    use Doctrine\ORM\Mapping\Entity;
    use Doctrine\ORM\Mapping\GeneratedValue;
    use Doctrine\ORM\Mapping\Id;
    use Doctrine\ORM\Mapping\MappedSuperclass;

    #[MappedSuperclass()]
    abstract class Produto
    {
        #[Id, Column, GeneratedValue]
        public int $id;

        #[Column(length:100)]
        protected string $codigo;

        #[Column()]
        protected string $descricao;

        #[Column(length:5)]
        protected string $un;

        #[Column(type:'decimal')]
        protected float $vl_unitario;

        public function __construct(string $codigo, string $descricao, string $un, float $vl_unitario)
        {
            $this->codigo = $codigo;
            $this->descricao = $descricao;
            $this->un = $un;
            $this->vl_unitario = $vl_unitario;
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