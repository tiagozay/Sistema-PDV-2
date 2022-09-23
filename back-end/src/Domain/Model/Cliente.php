<?php
    namespace PDV\Domain\Model;

    use JsonSerializable;

    class Cliente implements JsonSerializable
    {
        private ?int $id;
        private ?string $cpf;
        private ?string $nome;

        public function __construct(?int $id, ?string $cpf, ?string $nome)
        {
            $this->id = $id;
            $this->cpf = $cpf;
            $this->nome = $nome;
        }
        
        public function editar(string $nome, string $cpf): void
        {
            $this->nome = $nome;
            $this->cpf = $cpf;
        }

        public function getId(): ?int
        {
            return $this->id;
        }

        public function getCpf(): ?string
        {
            return $this->cpf;
        }

        public function getNome(): ?string
        {
            return $this->nome;
        }

        public function setId(?int $id): void
        {
            $this->id = $id;
        }

        public function setCpf(?string $cpf): void
        {
            $this->cpf = $cpf;
        }

        public function setNome(?string $nome): void
        {
            $this->nome = $nome;
        }

        public function jsonSerialize() {
            $vars = array_merge(get_object_vars($this));
            return $vars;
        }

    }
?>