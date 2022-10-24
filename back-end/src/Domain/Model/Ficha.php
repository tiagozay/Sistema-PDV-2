<?php
        namespace PDV\Domain\Model;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\OneToOne;
use DomainException;
use Exception;
use JsonSerializable;
use Symfony\Component\Console\Event\ConsoleEvent;

        #[Entity]
        class Ficha implements JsonSerializable
        {
                #[Id, Column, GeneratedValue]
                public int $id;

                #[OneToOne(inversedBy: 'ficha', targetEntity:Cliente::class, cascade:['persist'])]
                private Cliente $cliente;

                #[OneToMany(mappedBy: 'ficha', targetEntity: ProdutoFicha::class, cascade:['persist', 'remove'])]
                private Collection $produtos;

                #[Column(type:'decimal')]
                private float $qtde_itens;

                #[Column(type:'decimal')]
                private float $total;

                #[Column(type:'decimal')]
                private float $valor_pago;

                public function __construct(
                        Cliente $cliente,
                        float $qtde_itens,
                        float $total,
                        float $valor_pago, 
                )
                {
                        $this->setCliente($cliente);
                        $this->produtos = new ArrayCollection();
                        $this->qtde_itens = $qtde_itens;
                        $this->total = $total;
                        $this->valor_pago = $valor_pago;
                }

                // public function adiciona_novos_produtos(array $produtos)
                // {
                //         $this->produtos = array_merge($this->produtos, $produtos);

                //         $this->calcula_qtde_de_itens();
                //         $this->calcula_valor_total();
                //         $this->calcula_valor_pago();
                // }

                public function adiciona_produto(ProdutoFicha $produto)
                {
                        if($this->produtos->contains($produto)){
                                return;
                        }
                        $this->produtos->add($produto);
                        $produto->setFicha($this);

                        $this->calcula_qtde_de_itens();
                        $this->calcula_valor_total();
                        $this->calcula_valor_pago();
                }

                public function adiciona_produtos(Array $produtos)
                {
                        foreach($produtos as $produto){
                                $this->adiciona_produto($produto);
                        }
                }

                public function devolve_produto(ProdutoFicha $produto)
                {
                        $produto->devolver();

                        $this->calcula_qtde_de_itens();
                        $this->calcula_valor_total();
                        $this->calcula_valor_pago();
                }

                public function remove_produto(ProdutoFicha $produto)
                {
                        $chaveProduto = $this->buscaChaveProduto($produto);
                        $this->produtos->remove($chaveProduto);

                        $this->calcula_qtde_de_itens();
                        $this->calcula_valor_total();
                        $this->calcula_valor_pago();
                }

                public function paga_produto(ProdutoFicha $produto)
                {
                        $produto->pagar();

                        $this->calcula_qtde_de_itens();
                        $this->calcula_valor_total();
                        $this->calcula_valor_pago();
                }

                public function limpa_ficha()
                {
                        $this->produtos->clear();
                        $this->qtde_itens = 0;
                        $this->total = 0;
                        $this->valor_pago = 0;
                }

                private function calcula_qtde_de_itens(): void
                {

                        $qtde_itens = 0;
                        foreach($this->produtos as $produto){
                                if($this->ehPendente($produto)){
                                        $qtde_itens += $produto->getQtde();
                                }       
                        }

                        $this->qtde_itens = $qtde_itens;
                }

                private function calcula_valor_total(): void
                {

                        $valor_total = 0;
                        foreach($this->produtos as $produto){
                                if($this->ehPendente($produto)){
                                        $valor_total += $produto->getVlTotal();
                                }       
                        }

                        $this->total = $valor_total;
                }

                private function calcula_valor_pago(): void
                {

                        $valor_pago = 0;
                        foreach($this->produtos as $produto){
                                if($this->ehPago($produto)){
                                        $valor_pago += $produto->getVlTotal();
                                }       
                        }

                        $this->valor_pago = $valor_pago;
                }


                public function buscaChaveProduto(ProdutoFicha $produtoFicha): ?int
                {
                        $chave = null;

                        for($i = 0; $i < $this->produtos->count(); $i++){
                                if($this->produtos->get($i)->id == $produtoFicha->id){
                                        $chave = $i;
                                        break;
                                }
                        }

                        return $chave;

                }


                private function ehPendente($produto): bool
                {
                        return $produto->getEstado() == "Pendente";
                }

                private function ehPago($produto): bool
                {
                        return $produto->getEstado() == "Pago";
                }

                public function getCliente(): Cliente
                {
                        return $this->cliente;
                }

                /** @return ProdutoFicha[] */
                public function getProdutos(): iterable
                {
                        return $this->produtos;
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

                private function setCliente(Cliente $cliente)
                {
                        if(!is_null($cliente->getFicha())){
                                throw new DomainException("O cliente informado já possui uma ficha");
                        }

                        $cliente->setFicha($this);
                        $this->cliente = $cliente;
              
                }

                public static function toArrays(array $fichas): array
                {
                    return array_map(function($ficha){
                        return $ficha->toArray();
                    }, $fichas);
                }

                public function toArray(): array
                {
                        return [
                                'id' => $this->id,
                                'qtde_itens' => $this->qtde_itens,
                                'total' => $this->total,
                                'valor_pago' => $this->valor_pago,
                                'cliente' => $this->cliente->toArray(),
                                'produtos' => ProdutoFicha::toArrays($this->produtos->toArray())
                        ];
                }

                public function jsonSerialize(): mixed
                {
                        $vars = array_merge(get_object_vars($this));
                        return $vars;
                }

        }
?>