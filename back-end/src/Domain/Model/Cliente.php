<?php
    namespace PDV\Domain\Model;

    use Doctrine\ORM\Mapping\Column;
    use Doctrine\ORM\Mapping\Entity;
    use Doctrine\ORM\Mapping\Id;
    use Doctrine\ORM\Mapping\GeneratedValue;
    use Doctrine\ORM\Mapping\OneToOne;
    use JsonSerializable;

    #[Entity]
    class Cliente implements JsonSerializable
    {
        #[Id, GeneratedValue, Column()]
        public int $id;

        #[Column(length:11, unique: true, nullable:true)]
        private ?string $cpf;

        #[Column(length:60, nullable:true)]
        private ?string $nome;

        #[OneToOne(mappedBy: 'cliente', targetEntity: Ficha::class)]
        private Ficha $ficha;

        public function __construct(?string $cpf, ?string $nome)
        {
            $this->cpf = $cpf;
            $this->nome = $nome;
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

        public function jsonSerialize(): mixed {
            $vars = array_merge(get_object_vars($this));
            return $vars;
        }

    }
?>