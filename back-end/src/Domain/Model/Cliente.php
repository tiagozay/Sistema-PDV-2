<?php
    namespace PDV\Domain\Model;

    use Doctrine\Common\Collections\ArrayCollection;
    use Doctrine\Common\Collections\Collection;
    use Doctrine\ORM\Mapping\Column;
    use Doctrine\ORM\Mapping\Entity;
    use Doctrine\ORM\Mapping\Id;
    use Doctrine\ORM\Mapping\GeneratedValue;
    use Doctrine\ORM\Mapping\OneToOne;
    use Doctrine\ORM\Mapping\OneToMany;
    use JsonSerializable;

    #[Entity]
    class Cliente
    {
        #[Id, GeneratedValue, Column()]
        public int $id;

        #[Column(length:11, unique: true, nullable:true)]
        private ?string $cpf;

        #[Column(length:60, nullable:true)]
        private ?string $nome;

        #[OneToOne(mappedBy: 'cliente', targetEntity: Ficha::class)]
        private Ficha $ficha;

        #[OneToMany(mappedBy:'cliente', targetEntity:Venda::class)]
        private Collection $vendas;

        public function __construct(?string $cpf, ?string $nome)
        {
            $this->cpf = $cpf;
            $this->nome = $nome;
            $this->vendas = new ArrayCollection();
        }
        
        public function editar(string $nome, string $cpf): void
        {
            $this->nome = $nome;
            $this->cpf = $cpf;
        }

        public function getCpf(): ?string
        {
            return $this->cpf;
        }

        public function getNome(): ?string
        {
            return $this->nome;
        }

        public function getFicha(): ?Ficha
        {
            return isset($this->ficha) ? $this->ficha : null;
        }

        /** @return Venda[] */
        public function getVendas(): iterable
        {
            return $this->vendas;
        }


        public function setCpf(?string $cpf): void
        {
            $this->cpf = $cpf;
        }

        public function setNome(?string $nome): void
        {
            $this->nome = $nome;
        }

        public function setFicha(Ficha $ficha): void
        {
            $this->ficha = $ficha;
        }

        public function addVenda(Venda $venda): void
        {
            $this->vendas->add($venda);
        }
     
        public static function toArrays(array $clientes): array
        {
            return array_map(function($cliente){
                return $cliente->toArray();
            }, $clientes);
        }

        public function toArray(): array
        {
            return [
                'id' => $this->id,
                'cpf' => $this->cpf,
                'nome' => $this->nome
            ];
        }
    }
?>