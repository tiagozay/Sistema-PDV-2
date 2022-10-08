var input_codigo_do_produto = document.querySelector("#input-codigo-de-barras-vender");
var input_descricao_do_produto = document.querySelector("#input-descricao-venda");
var lista_produtos_encontrados_venda = document.querySelector("#produtos-encontrados__produtos");
var btn_abrir_form_vender_produto_avulso = document.querySelector("#produtos-encontrados__produtos__btn-vender-avulso");
var form_vender_produto_avulso = document.querySelector("#form-vender-produto-avulso");

var lista_de_produtos_passados__tbody = document.querySelector("#lista-de-produtos-passados__tabela__tbody");
var campos_venda_que_recebem_informacoes = document.querySelectorAll(".campo-venda-que-recebe-informacoes");
var campo_soma_total_da_venda__valor = document.querySelector("#soma-total-da-venda__valor");
var campo_soma_total_da_venda_com_desconto__valor = document.querySelector("#soma-total-da-venda-com-desconto__valor");
var campo_valor_pago_venda = document.querySelector("#input-valor-pago-da-venda__valor");
var troco_da_venda_valor = document.querySelector("#troco-da-venda__valor");
var campo_valor_desconto_venda = document.querySelector("#input-desconto-da-venda__valor");
let btn_cancelar_venda = document.querySelector("#informacoes-finais-da-venda__BtnCancelarVenda");
let btn_marcar_na_ficha = document.querySelector("#informacoes-finais-da-venda__BtnMarcarNaFicha");
let btn_salvar_venda = document.querySelector("#informacoes-finais-da-venda__BtnSalvarVenda");
let btn_finalizar_venda = document.querySelector("#informacoes-finais-da-venda__BtnFinalizarVenda");
var efeito_sonoro_caixa = document.querySelector("#efeito_sonoro_caixa");

var array_produtos_encontrados_na_busca = [];

input_codigo_do_produto.addEventListener("input", recebe_codigo_digitado_a_cada_input_no_campo);
input_descricao_do_produto.addEventListener("input", recebe_descricao_digitada_a_cada_input_no_campo);

form_vender_produto_avulso.addEventListener("submit", passa_produto_avulso);

campos_venda_que_recebem_informacoes.forEach(function(campo){
    campo.addEventListener("keyup", function(){
        atualiza_campos_total_venda_e_troco();
    })
});

document.addEventListener("keydown", function(event){
    if(event.keyCode == 113){
        limpa_e_da_foco_no_input_codigo();
    }
});

function Produto(id, id_produto_estoque, codigo, descricao, un, vl_unitario, qtde, avulso)
{
    this.id = id;
    this.id_produto_estoque = id_produto_estoque;
    this.codigo = codigo;
    this.descricao = descricao;
    this.un = un;
    this.vl_unitario = Number(vl_unitario);
    this.qtde = Number(qtde);
    this.valor_total = 0;
    this.avulso = avulso;

    this.calcular_valor_total = function(){
        this.valor_total = this.vl_unitario * this.qtde; 
    }

    this.calcular_valor_total();

    this.aumentar_quantidade = function(quantidade){
        if(quantidade <= 0){
            return;
        }
        this.qtde += quantidade;
        this.calcular_valor_total();
    }

    this.diminuir_quantidade = function(quantidade){
        if(quantidade <= 0){
            return;
        }

        if(this.qtde < quantidade){
            return;
        }

        this.qtde -= quantidade;
        this.calcular_valor_total();
    }

    this.alterar_quantidade = function(nova_quantidade){
        if(nova_quantidade <= 0){
            return;
        }
        this.qtde = nova_quantidade;
        this.calcular_valor_total();
    }   

}

let venda = null;

abrir_venda();

function cria_objeto_venda()
{
    venda = {
        produtos: [],
        cliente: null,
        desconto: 0,
        qtde_itens: 0,
        total: 0,
        total_com_desconto: 0,
        valor_pago: 0,
        troco: 0,
    
        set_valorPago(valor_pago)
        {
            let valor_numero = Number(valor_pago);
    
            if(isNaN(valor_numero)){
                return;
            }
    
            this.valor_pago = valor_numero;
        },
    
        set_troco(troco)
        {
            troco = Number(troco);
    
            if(isNaN(troco)){
                return;
            }
            
            if(troco <= 0){
                this.troco = 0;
                return;
            }
    
            this.troco = troco;
        },
    
        set_desoconto(desconto)
        {
            let desconto_numero = Number(desconto);
    
            if(isNaN(desconto_numero)){
                return;
            }
    
            this.desconto = desconto_numero;
        },
    
        adicionar_produto(produto)
        {
            let produto_passado = this.busca_produto_passado_pelo_id(produto.id_produto_estoque);

            console.log(produto_passado);

            if(!produto_passado){
                //Produto ainda não foi passado
                this.produtos.push(produto);
            }else{
                //Produto já foi passado
                produto_passado.aumentar_quantidade(produto.qtde);
            }

            this.calcular_valores();
            this.soma_quantidade_de_todos_itens();
        },
    
        remover_produto(id_produto_estoque)
        {
            for(let i = 0; i < this.produtos.length; i++){
                if(this.produtos[i].id_produto_estoque == id_produto_estoque){
                    this.produtos.splice(i, 1);
                    break;
                }
            }
    
            this.calcular_valores();
            this.soma_quantidade_de_todos_itens();
        },
    
        calcular_valores()
        {
            let total = this.produtos.reduce((acumulador, produto)=>{
                return acumulador + produto.valor_total; 
            }, 0);
            
            this.total = total;
    
            this.total_com_desconto = total - this.desconto;
    
            if(this.total_com_desconto == 0){
                this.set_troco(0);
                return;
            }
    
            this.set_troco(this.valor_pago - this.total_com_desconto);
        },

        soma_quantidade_de_todos_itens()
        {
            let total = this.produtos.reduce((acumulador, produto)=>{
                return acumulador + produto.qtde;
            }, 0);
            
            this.qtde_itens = total;
        },
    
        adicionar_desconto(desconto)
        {
            if(desconto > this.total || desconto <= 0){
                return;
            }
            this.set_desoconto(desconto);
            this.calcular_valores();
        },
    
        adicionar_pagamento(pagamento)
        {
            if(pagamento < 0){
                return;
            }
            this.set_valorPago(pagamento);
            this.calcular_valores();
        },
    
        busca_produto_passado_pelo_id(id_produto_estoque)
        {
            let produto = this.produtos.find((produto)=>{
                return produto.id_produto_estoque == id_produto_estoque;
            });
            return produto;
        },
    
        altera_qtde_de_um_produto(id_produto_estoque, nova_quantidade)
        {
            let produto = this.busca_produto_passado_pelo_id(id_produto_estoque);
    
            if(!produto){
                return;
            }
    
            produto.alterar_quantidade(nova_quantidade);
            this.calcular_valores();
            this.soma_quantidade_de_todos_itens();
        },
    
        aumentar_quantidade_produto(id_produto_estoque, quantidade)
        {
            if(quantidade <= 0){
                return;
            }
    
            let produto = this.busca_produto_passado_pelo_id(id_produto_estoque);
    
            if(!produto){
                return;
            }
    
            produto.aumentar_quantidade(quantidade);
    
            this.calcular_valores();
            this.soma_quantidade_de_todos_itens();
        }, 
    
        diminur_quantidade_produto(id_produto_estoque, quantidade)
        {
            if(quantidade <= 0){
                return;
            }
    
            let produto = this.busca_produto_passado_pelo_id(id_produto_estoque);
    
            if(!produto){
                return;
            }
    
            produto.diminuir_quantidade(quantidade);
    
            this.calcular_valores();
            this.soma_quantidade_de_todos_itens();
        }
    
    };
}

function abrir_venda()
{
    if(!venda){
        cria_objeto_venda();
        return;
    }

}

function limpa_venda()
{
    cria_objeto_venda();
    campo_valor_desconto_venda.value = "R$ 0,00";
    campo_valor_pago_venda.value = "R$ 0,00";
    atualiza_campos_total_venda_e_troco();
    escrever_produtos_na_tabela_de_produtos_passados();
    escreve_cliente();
}

function cancelar_venda()
{
    let confirmacao = confirm("Cancelar venda?");
    if(confirmacao){
        limpa_venda();
        abrir_mensagem_lateral_da_tela("Venda cancelada com sucesso!");
    }
}

function marcar_na_ficha()
{
    let loader = document.querySelector("#loader_marcar_na_ficha");

    abrir_modal_identificar_cliente()
    .then( cliente => {
        
        venda.cliente = cliente;
    
        loader.classList.remove("display-none");

        zay_request(
            'POST',
            './back-end/marcarNaFicha.php',
            {venda: JSON.stringify(venda)},
            (resposta) => {            
    
                loader.classList.add("display-none");

                console.log(resposta);

                try{    
                    resposta = JSON.parse(resposta);
                }catch{
                    abrir_mensagem_lateral_da_tela("Não foi possível marcar na ficha!");
                    return;
                }
    
                if(resposta.sucesso){
                    abrir_mensagem_lateral_da_tela("Venda marcada com sucesso!");
                    limpa_venda();
                    atualiza_array_de_produtos_do_banco__async();
                }
            },
            () => {            
                loader.classList.add("display-none");
                abrir_mensagem_lateral_da_tela("Não foi possível marcar na ficha!");
            }
        );

    } )
    .catch( () => {
        alert("Você precisa informar um cliente para marcar na ficha!");
        marcar_na_ficha();
    } )
}

function salvar_venda()
{
    const service = new IdentificarClienteService();
    service.identificarCliente()
    .then( cliente => {

        venda.cliente = cliente;

        envia_venda_nao_finalizada();

    } )
    .catch( (msg) => {
        venda.cliente = null;
        envia_venda_nao_finalizada();
    } )


}

function finalizar_venda()
{   
    if(converte_valor_monetario_para_numero(campo_valor_desconto_venda.value) > venda.total){
        abrir_mensagem_lateral_da_tela("Desconto não pode ser maior que o total!");
        return;
    };

    if(venda.cliente == null){
        //Aqui mesmo que o cliente seja informado ou não, a fução de envia_venda é chamada, já que o mesmo não é obrigatório

        abrir_modal_identificar_cliente()
        .then( cliente => {
            venda.cliente = cliente;
            envia_venda();
        } ).catch( () => {
            venda.cliente = null;
            envia_venda();
        } )

        return;
    }

    envia_venda();
}

function envia_venda_nao_finalizada()
{
    let loader = btn_salvar_venda.querySelector("#loader_salvar_venda");
    let icone = btn_salvar_venda.querySelector("#icone_salvar_venda");

    icone.classList.add("display-none");
    loader.classList.remove("display-none");

    desabilita_e_adiciona_loader_nos_elementos([btn_salvar_venda]);

    zay_request(
        'POST',
        './back-end/cadastraVendaNaoFinalizada.php',
        {venda: JSON.stringify(venda)},
        (resposta)=>{            
            icone.classList.remove("display-none");
            loader.classList.add("display-none");
            habilita_e_remove_loader_dos_elementos([btn_salvar_venda]);

            try{    
                resposta = JSON.parse(resposta);
            }catch{
                abrir_mensagem_lateral_da_tela("Não foi possível salvar venda!");
                return;
            }

            if(resposta.sucesso){
                abrir_mensagem_lateral_da_tela("Venda salva com sucesso!");
                limpa_venda();
                atualiza_array_de_produtos_do_banco__async();
            }
        }
    );
}

function envia_venda()
{
    let loader = btn_finalizar_venda.querySelector("#loader_finalizar_venda");
    let icone = btn_finalizar_venda.querySelector("#icone_finalizar_venda");

    icone.classList.add("display-none");
    loader.classList.remove("display-none");
    desabilita_e_adiciona_loader_nos_elementos([btn_finalizar_venda]);

    zay_request(
        'POST',
        './back-end/cadastraVenda.php',
        {venda: JSON.stringify(venda)},
        (resposta)=>{            
            console.log(resposta);
            icone.classList.remove("display-none");
            loader.classList.add("display-none");
            habilita_e_remove_loader_dos_elementos([btn_finalizar_venda]);

            try{    
                resposta = JSON.parse(resposta);
            }catch{
                abrir_mensagem_lateral_da_tela("Não foi possível finalizar a venda!");
                return;
            }

            if(resposta.sucesso){
                abrir_mensagem_lateral_da_tela("Venda finalizada com sucesso!");
                limpa_venda();
                atualiza_array_de_produtos_do_banco__async();
            }
        }
    );
}

function verifica_se_btns_finais_da_venda_podem_ser_habilitados()
{
    if(venda.produtos.length < 1){
        campo_valor_pago_venda.classList.add('opacidade');
        campo_valor_pago_venda.setAttribute("disabled", true);
        campo_valor_pago_venda.value = "R$ 0,00";
        campo_valor_desconto_venda.classList.add('opacidade');
        campo_valor_desconto_venda.setAttribute("disabled", true);
        campo_valor_desconto_venda.value = "R$ 0,00";
        troco_da_venda_valor.innerHTML = 'R$ 0,00';
        troco_da_venda_valor.classList.add("opacidade");
        btn_cancelar_venda.classList.add("opacidade");
        btn_cancelar_venda.setAttribute("disabled", true);
        btn_marcar_na_ficha.classList.add("opacidade");
        btn_marcar_na_ficha.setAttribute("disabled", true);
        btn_salvar_venda.classList.add("opacidade");
        btn_salvar_venda.setAttribute("disabled", true);
    }else{
        campo_valor_pago_venda.classList.remove('opacidade');
        campo_valor_pago_venda.removeAttribute("disabled");
        campo_valor_desconto_venda.classList.remove('opacidade');
        campo_valor_desconto_venda.removeAttribute("disabled");
        troco_da_venda_valor.classList.remove("opacidade");
        btn_cancelar_venda.classList.remove("opacidade");
        btn_cancelar_venda.removeAttribute("disabled", true);
        btn_marcar_na_ficha.classList.remove("opacidade");
        btn_marcar_na_ficha.removeAttribute("disabled", true);
        btn_salvar_venda.classList.remove("opacidade");
        btn_salvar_venda.removeAttribute("disabled", true);
    }

    if(venda.valor_pago != 0 && venda.valor_pago >= venda.total_com_desconto && venda.produtos.length > 0){
        btn_finalizar_venda.classList.remove("opacidade");
        btn_finalizar_venda.removeAttribute("disabled", true);
    }else{
        btn_finalizar_venda.classList.add("opacidade");
        btn_finalizar_venda.setAttribute("disabled", true);
    };
}


function escreve_cliente()
{
    let campo_nome = document.querySelector("#informacoes-finais-da-venda__cliente__nome");
    let campo_cpf = document.querySelector("#informacoes-finais-da-venda__cliente__cpf");

    if(venda.cliente == null){
        campo_nome.textContent = "Não informado";
        campo_cpf.textContent = "Não informado";
        return;
    }

    campo_nome.textContent = venda.cliente.nome != null ? venda.cliente.nome : "Não informado";
    campo_cpf.textContent = venda.cliente.cpf != null ? formata_cpf(venda.cliente.cpf) : "Não informado";
}

function atualiza_campos_total_venda_e_troco()
{   
    let desconto = converte_valor_monetario_para_numero(campo_valor_desconto_venda.value);
    venda.adicionar_desconto(desconto);
    escreve_total_da_venda();
    
    let valor_pago = converte_valor_monetario_para_numero(campo_valor_pago_venda.value);
    venda.adicionar_pagamento(valor_pago);
    escreve_troco();

    verifica_se_btns_finais_da_venda_podem_ser_habilitados();
}


function escrever_produtos_na_tabela_de_produtos_passados()
{
    let produtos = venda.produtos;

    lista_de_produtos_passados__tbody.innerHTML = "";
    produtos.forEach(function(produto){
        lista_de_produtos_passados__tbody.innerHTML += 
        `
            <tr class="lista-de-produtos-passados__tabela__produto"">
            <td class="lista-de-produtos-passados__tabela__produto__id">${produto.id_produto_estoque}</td>
                <td class="lista-de-produtos-passados__tabela__produto__codigo">${produto.codigo}</td>
                <td class="lista-de-produtos-passados__tabela__produto__descricao">${produto.descricao}</td>
                <td class="lista-de-produtos-passados__tabela__produto__un">${produto.un}</td>
                <td class="lista-de-produtos-passados__tabela__produto__qtde">
                    <div class="lista-de-produtos-passados__tabela__produto__divAlterar">
                        <span class="lista-de-produtos-passados__tabela__produto__qtde__span-quantidade">${arredonda_valor_para_apenas_um_digito(transforma_numero_para_visualizar(produto.qtde))}</span>
                        
                        <button onclick="abrir_form_alterar_quantidade_produto(${produto.id_produto_estoque})" class="lista-de-produtos-passados__tabela__produto__qtde__btn-abrir-form material-icons">edit</button>

                        <form class="lista-de-produtos-passados__tabela__produto__qtde__form">
                            <input name="nova_quantidade" type="number" class="lista-de-produtos-passados__tabela__produto__qtde_input-alterar" step="any">
                            <button class="lista-de-produtos-passados__tabela__produto__qtde_btn-confirmar material-icons">check</button>
                        </form>
                    </div>
                    
                </td>
                <td class="lista-de-produtos-passados__tabela__produto__vlunitario">
                    ${transforma_numero_para_visualizar(produto.vl_unitario)}
                </td>
                <td class="lista-de-produtos-passados__tabela__produto__vltotal">
                    ${transforma_numero_para_visualizar(produto.valor_total)}
                </td>
                <td class="lista-de-produtos-passados__tabela__produto__acoes">
                    <button id="lista-de-produtos-passados__tabela__produto__btn-remover" class="material-icons btn-produto-passado" onclick="remover_produto_da_venda(${produto.id_produto_estoque})">delete</button>

                    <button id="lista-de-produtos-passados__tabela__produto__btn-diminuir" class="material-icons btn-produto-passado" onclick="click_diminuir_quantidade_do_produto(${produto.id_produto_estoque})">remove</button>

                    <button id="lista-de-produtos-passados__tabela__produto__btn-aumentar" class="material-icons btn-produto-passado" onclick="click_aumentar_quantidade_do_produto(${produto.id_produto_estoque})">add</button>

                </td>
            </tr>
        `
    });
    atualiza_campos_total_venda_e_troco();
}

function adicionar_produto_na_lista_de_produtos_passados(produto)
{       
    venda.adicionar_produto(produto);

    escrever_produtos_na_tabela_de_produtos_passados();
    animacao_para_uma_tr(produto.id_produto_estoque);
    atualiza_campos_total_venda_e_troco();
    limpa_lista_de_produtos_encontrados();
    setTimeout(limpar_input_codigo, 200);
    input_descricao_do_produto.value = "";

}

function escreve_total_da_venda()
{
    let total = venda.total;
    let total_com_desconto = venda.total_com_desconto;

    campo_soma_total_da_venda__valor.innerHTML = total.toLocaleString('pt-BR', {style: "currency", currency: "BRL"});
    campo_soma_total_da_venda_com_desconto__valor.innerHTML = total_com_desconto.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
}

function escreve_troco()
{
    let troco = venda.troco;
    if(troco == 0){
        troco_da_venda_valor.classList.add("opacidade-04");
    }else{
        troco_da_venda_valor.classList.remove("opacidade-04");
    }

    troco_da_venda_valor.innerHTML = troco.toLocaleString('pt-BR', {style: "currency", currency: "BRL"});    
}

function remover_produto_da_venda(id)
{
    var confirmacao = confirm("Remover produto da venda?");
    if(confirmacao){
        venda.remover_produto(id);
        emite_som_de_caixa();
        escrever_produtos_na_tabela_de_produtos_passados();
        atualiza_campos_total_venda_e_troco();
    }
}

function click_aumentar_quantidade_do_produto(id)
{
    var quantidade = 1;

    //Se for avulso, não é feita a verificação de estoque, aumenta direto
    var produto_avulso = false;

    var produto = busca_produto_no_banco_pelo_id(id);

    if(!produto){
        //Se cair nesse if e encontrar o produto nos passados, é sinal que o produto foi passado avulso, se não encontrar nos passado é sinal que não é avulso e nem existe
        produto = venda.busca_produto_passado_pelo_id(id);
        if(!produto){
            return;
        }
        produto_avulso = true;
    }
    
    if(produto.un != "UN"){
        var qtde_promt = prompt(`Informe quantos ${produto.un} quer aumentar:`);
        if(qtde_promt == null){
            return;
        }
        quantidade = converte_valor_monetario_para_numero(qtde_promt);
        if(!quantidade){
            alert("Quantidade incorreta!");
            return;
        }
    }

    if(!produto_avulso){
        if(!verifica_se_produto_tem_estoque(id, quantidade)){
            var confirm_quantidade = confirm("Estoque do produto já foi esgotado! Vender mesmo assim?");
            if(!confirm_quantidade){
                return;
            }
        }    
    }
   
    venda.aumentar_quantidade_produto(id, quantidade);
    emite_som_de_caixa();
    escrever_produtos_na_tabela_de_produtos_passados();
    animacao_para_campo_quantidade_de_uma_tr(id);
    atualiza_campos_total_venda_e_troco();
}

function click_diminuir_quantidade_do_produto(id)
{   
    var produto = venda.busca_produto_passado_pelo_id(id);
    var quantidade_atual = produto.qtde;
    var quantidade_para_remover = 1;
    if(produto.un != "UN"){
        var qtde_promt = prompt(`Informe quantos ${produto.un} quer diminuir:`);
        if(qtde_promt == null){
            return;
        }
        quantidade_para_remover = converte_valor_monetario_para_numero(qtde_promt);
        if(!quantidade_para_remover){
            alert("Quantidade incorreta!");
            return;
        }
    }
    if(quantidade_atual <= quantidade_para_remover){
        remover_produto_da_venda(id);
        return;
    }

    venda.diminur_quantidade_produto(id, quantidade_para_remover);

    emite_som_de_caixa();
    animacao_para_campo_quantidade_de_uma_tr(id);
    escrever_produtos_na_tabela_de_produtos_passados();
    atualiza_campos_total_venda_e_troco();
}

function abrir_form_alterar_quantidade_produto(id)
{
    var btn_abrir_input = event.target
    var tr = btn_abrir_input.parentNode;
    var form = tr.querySelector(".lista-de-produtos-passados__tabela__produto__qtde__form");
    var input = tr.querySelector(".lista-de-produtos-passados__tabela__produto__qtde_input-alterar");
    var span_quantidade = tr.querySelector(".lista-de-produtos-passados__tabela__produto__qtde__span-quantidade");

    var quantidade_antiga = venda.busca_produto_passado_pelo_id(id).qtde;

    form.style.display = "flex";
    span_quantidade.style.display = "none";
    btn_abrir_input.style.display = "none";
    input.value = quantidade_antiga;
    input.focus();

    form.onsubmit = function(event){
        event.preventDefault();
        var nova_quantidade = form.nova_quantidade.value;
        if(nova_quantidade <= 0){
            fechar_form_alterar_quantidade_produto(form, btn_abrir_input, span_quantidade);
            alert("Quantidade inválida!");
        }else{
            var produto = busca_produto_no_banco_pelo_id(id);

            if(produto){
                if(converte_valor_monetario_para_numero(produto.qtde_disponivel) < nova_quantidade){
                    var alerta_estoque = confirm("Este produto não tem essa quantidade disponível! Vender mesmo assim?");
                    if(!alerta_estoque){
                        fechar_form_alterar_quantidade_produto(form, btn_abrir_input, span_quantidade);
                        return;
                    }
                }   
            }
            
            venda.altera_qtde_de_um_produto(id, converte_valor_monetario_para_numero(nova_quantidade));
            emite_som_de_caixa();
            escrever_produtos_na_tabela_de_produtos_passados();
            animacao_para_campo_quantidade_de_uma_tr(id);
            atualiza_campos_total_venda_e_troco();
        }

    }

    document.addEventListener("click", function(event){
        var clicado = event.target.classList[0];
        if(
            clicado != "lista-de-produtos-passados__tabela__produto__qtde__form" && 
            clicado != "lista-de-produtos-passados__tabela__produto__qtde_input-alterar" &&
            clicado != "lista-de-produtos-passados__tabela__produto__qtde_btn-confirmar" &&
            clicado != "lista-de-produtos-passados__tabela__produto__qtde__btn-abrir-form"
        ){
            fechar_form_alterar_quantidade_produto(form, btn_abrir_input, span_quantidade, quantidade_antiga);
        }
    });

}

function fechar_form_alterar_quantidade_produto(form, btn_abrir_input, span)
{
    form.style.display = "none";
    btn_abrir_input.style.display = "block";
    span.style.display = "block";
    // span.innerText = quantidade;
}

//Recebe o código de um produto e retora a tr do html correspondente á esse produto 
function recebe_id_e_retorna_a_tr(id)
{
    var produtos = document.querySelectorAll(".lista-de-produtos-passados__tabela__produto");

    var produto_procurado = false;
    produtos.forEach(function(produto){
        if(produto.querySelector(".lista-de-produtos-passados__tabela__produto__id").innerText == id){
            produto_procurado = produto
        }
    });
    return produto_procurado;
}

function verifica_se_produto_esta_cadastrado(id)
{
    let produto_no_banco = busca_produto_no_banco_pelo_id(id);
    if(!produto_no_banco){
        return false;
    }

    return true;

}

//Retorna se produto tem estoque, recebe um produto que vem do banco
function verifica_se_produto_tem_estoque(id, quantidade_a_ser_vendida)
{
    let produto = busca_produto_no_banco_pelo_id(id);

    if(!produto){
        return false;
    }

    var quantidade_disponivel_do_produto_a_ser_vendido = converte_valor_monetario_para_numero(produto.qtde_disponivel);

    var produto_passado = venda.busca_produto_passado_pelo_id(produto.id);

    if(produto_passado){
        quantidade_disponivel_do_produto_a_ser_vendido -= produto_passado.qtde;
    }

    return quantidade_disponivel_do_produto_a_ser_vendido >= quantidade_a_ser_vendida;

}

function recalcula_estoque_disponivel_de_um_produto(id)
{
    var produto_do_banco = busca_produto_no_banco_pelo_id(id)
    var quantidade_disponivel = produto_do_banco.qtde_disponivel;

    var produto_passado = venda.busca_produto_passado_pelo_id(id);
    if(produto_passado){
        quantidade_disponivel = produto_do_banco.qtde_disponivel - produto_passado.qtde;
    }

    return converte_valor_monetario_para_numero(quantidade_disponivel);
}

//Pega número, formata colocando virgula e duas casas decimais
function transforma_numero_para_visualizar(numero)
{   
    var numero_com_casas_corretas = numero.toFixed(2);
    var numero_formatado = numero_com_casas_corretas.replace('.', ',');
    return numero_formatado;
}

//Está função serve pois em alguns lugares onde exibo valores, quando o valor for 5 por ex, ele não apareça 5,00 e sim somente 5. Ela vai ser utilizada onde exibo informações que não sejam financeiras, como quantidade por ex.
function arredonda_valor_para_apenas_um_digito(string)
{
    var final_depois_da_virgula = string.substr(string.indexOf(","));
    if(final_depois_da_virgula == ",00"){
        return string.replace(final_depois_da_virgula, '');
    }
    return string;
}

//Função principal, quando algum produto é passado ela é chamada e faz toda a lógica. Ela é usada para passar produtos que ja estejam cadastrados no banco
function recebe_produto_na_venda(id_produto_estoque, codigo, desc, un, qtde, vlunitario)
{
    var qtde_convertida_para_numero;

    if(!verifica_se_produto_esta_cadastrado(id_produto_estoque)){
        alert("Ops! Produto excluído!");
        return;
    };

    if(un != 'UN'){
        var qtde_do_form = prompt(`Informe quantos ${un} do produto: "${desc}" serão vendidos: `);
        if(qtde_do_form != null){
            qtde_convertida_para_numero = converte_valor_monetario_para_numero(qtde_do_form);
            if(!qtde_convertida_para_numero){
                alert("Quantidade incorreta!\nInforme valores como: 0 0,00 00,00 000,00 000,00 etc");
                return;
            }
            qtde = qtde_convertida_para_numero;
        }else{
            return;
        }
    }

    if(!verifica_se_produto_tem_estoque(id_produto_estoque, qtde)){
        var confirm_quantidade = confirm("Este produto está sem estoque! Vender mesmo assim?");
        if(!confirm_quantidade){
            return;
        }
    }   
    
    let produto = new Produto(null, id_produto_estoque, codigo, desc, un, vlunitario, qtde, false);

    adicionar_produto_na_lista_de_produtos_passados(produto);
    emite_som_de_caixa();
}


function verifica_se_dado_é_numero(valor)
{
    var valor_convertido = Number(valor);
    if(isNaN(valor_convertido)){
        return false;
    }
    return true;
}



function recebe_codigo_digitado_a_cada_input_no_campo()
{
    input_descricao_do_produto.value = "";

    var codigo_digitado = input_codigo_do_produto.value.trim();
    var array_produtos_econtrados = [];
    fechar_form_vender_produto_avulso();

    if(codigo_digitado.length < 1){
        limpa_lista_de_produtos_encontrados();
        return;
    }

    array_produtos_econtrados = busca_produtos_no_banco_pelo_codigo(codigo_digitado);

    if(array_produtos_econtrados.length == 0){
        limpa_lista_de_produtos_encontrados();
        return;
    }

    if(array_produtos_econtrados.length == 1){
        var produto = array_produtos_econtrados[0];
        if(produto.codigo == codigo_digitado){
            recebe_produto_na_venda(
                produto.id,
                produto.codigo,
                produto.descricao,
                produto.un,
                1,
                produto.vl_unitario,
            );
            setTimeout(limpar_input_codigo, 200);
            return;
        }
    }

    array_produtos_encontrados_na_busca = [];
    adiciona_produtos_encontrados_na_lista(array_produtos_econtrados);

}

function recebe_descricao_digitada_a_cada_input_no_campo()
{   
    input_codigo_do_produto.value = "";

    var desc_digitada = input_descricao_do_produto.value.trim();

    var array_produtos_econtrados = [];

    fechar_form_vender_produto_avulso();

    if(desc_digitada.length < 1){
        limpa_lista_de_produtos_encontrados();
        return;
    }

    array_produtos_econtrados = busca_produtos_no_banco_pela_descricao(desc_digitada);

    if(array_produtos_econtrados.length == 0){
        limpa_lista_de_produtos_encontrados();
        return;
    }

    array_produtos_encontrados_na_busca = [];

    adiciona_produtos_encontrados_na_lista(array_produtos_econtrados);

}

function click_produto_encontrado()
{
    let id_produto = this.dataset.id_produto;

    if(!verifica_se_produto_esta_cadastrado(id_produto)){
        alert("Ops! Produto excluído!");
        this.classList.add("opacidade");
        this.onclick = "";
        return;
    };

    let produto = busca_produto_no_banco_pelo_id(id_produto);

    recebe_produto_na_venda(
        produto.id,
        produto.codigo,
        produto.descricao,
        produto.un,
        1,
        produto.vl_unitario
    );
}

function adiciona_produtos_encontrados_na_lista(produtos)
{
    lista_produtos_encontrados_venda.innerHTML = "";

    array_produtos_encontrados_na_busca = produtos.slice(0, 100);

    lista_produtos_encontrados_venda.style.display = "flex";
        
    array_produtos_encontrados_na_busca.forEach((produto)=>{

        qtde_disponivel = recalcula_estoque_disponivel_de_um_produto(produto.id);

        let li = document.createElement("li");
        li.classList.add("produtos-encontrados__produto");
        li.dataset.id_produto = produto.id;
        li.addEventListener("click", click_produto_encontrado);

        let codigo = document.createElement("div");
        codigo.classList.add("produto__codigo");
        codigo.textContent = produto.codigo;

        let descricao = document.createElement("div");
        descricao.classList.add("produto__descricao");
        descricao.textContent = produto.descricao;

        let un = document.createElement("div");
        un.classList.add("produto__un");
        un.textContent = produto.un;

        let preco = document.createElement("div");
        preco.classList.add("produto__preco");
        preco.textContent = converte_valor_monetario_para_numero(produto.vl_unitario).toLocaleString('pt-BR', {style: "currency", currency: "BRL"});

        let quantidade_disponivel = document.createElement("div");
        quantidade_disponivel.classList.add("produto__quantidade-disponivel");
        quantidade_disponivel.textContent = arredonda_valor_para_apenas_um_digito(transforma_numero_para_visualizar( converte_valor_monetario_para_numero(qtde_disponivel)));

        li.appendChild(codigo);
        li.appendChild(descricao);
        li.appendChild(un);
        li.appendChild(preco);
        li.appendChild(quantidade_disponivel);

        lista_produtos_encontrados_venda.appendChild(li);
    });
}
   
function gera_numero_aleatorio(min, max)
{
    return Math.round(Math.random() * (max - min) + min );
}

function gera_id_para_produto_avulso()
{
    var produto_passado = true;
    var id;

    //Fica no loop até gerar um id randômido que não exista na lista de produtos passados. A função venda.busca_produto_passado_pelo_id(id) retorna false se não encontrar, dessa maneira, o loop para e retorna o id gerado
    while(produto_passado){
        id = gera_numero_aleatorio(20000, 25000);
        produto_passado = venda.busca_produto_passado_pelo_id(id);
    }

    return id;
}

function passa_produto_avulso(event)
{
    event.preventDefault();
    var form = form_vender_produto_avulso;

    var id = String(gera_id_para_produto_avulso());
    var codigo = form.codigo.value;
    var descricao = form.descricao.value;
    var un =  form.un.value;
    var vlunitario = form.vlunitario.value;
    var qtde = form.qtde.value;

    if
    (
        codigo.length < 1 ||
        descricao.length < 1 ||
        vlunitario.length < 1 ||
        qtde.length < 1
    ){
        alert("Por favor! preencha todos os campos!");
        return;
    }
   
    let produto = new Produto(null, id ,codigo, descricao, un, converte_valor_monetario_para_numero(vlunitario), qtde, true);

    adicionar_produto_na_lista_de_produtos_passados(produto);
    emite_som_de_caixa();
    limpa_inputs_form_produto_avulso();
}



// ====================================FUÇÕES DE APARÊNCIA========================FUÇÕES DE APARÊNCIA===========//

function animacao_para_campo_quantidade_de_uma_tr(id)
{
    //Pego a td para cada alteração na classe pois se separar em uma váriavel não funciona
    recebe_id_e_retorna_a_tr(id).querySelector(".lista-de-produtos-passados__tabela__produto__qtde").classList.add("cor-preta");
    recebe_id_e_retorna_a_tr(id).querySelector(".lista-de-produtos-passados__tabela__produto__qtde").classList.add("cor-transparente");
    setTimeout(function(){
        recebe_id_e_retorna_a_tr(id).querySelector(".lista-de-produtos-passados__tabela__produto__qtde").classList.remove("cor-preta");
        recebe_id_e_retorna_a_tr(id).querySelector(".lista-de-produtos-passados__tabela__produto__qtde").classList.remove("cor-transparente");
    },1000)
}

function animacao_para_uma_tr(id)
{
    //Pego a tr para cada alteração na classe pois se separar em uma váriavel não funciona
    recebe_id_e_retorna_a_tr(id).classList.add("cor-preta");
    recebe_id_e_retorna_a_tr(id).classList.add("cor-transparente");
    setTimeout(function(){
        recebe_id_e_retorna_a_tr(id).classList.remove("cor-preta");
        recebe_id_e_retorna_a_tr(id).classList.remove("cor-transparente");
    },1000)
}


function emite_som_de_caixa()
{
    efeito_sonoro_caixa.play();
}

function limpa_lista_de_produtos_encontrados()
{
    array_produtos_encontrados_na_busca = [];
    lista_produtos_encontrados_venda.innerHTML = "";
    lista_produtos_encontrados_venda.style.display = "none";
}

function limpa_inputs_form_produto_avulso()
{
    form_vender_produto_avulso.codigo.value = "";
    form_vender_produto_avulso.descricao.value = "";
    form_vender_produto_avulso.un.value = "";
    form_vender_produto_avulso.vlunitario.value = "";
    form_vender_produto_avulso.qtde.value = "";
}


function abrir_form_vender_produto_avulso()
{
    form_vender_produto_avulso.style.display = "block";
    btn_abrir_form_vender_produto_avulso.style.display = "none";
    limpa_lista_de_produtos_encontrados();
}

function fechar_form_vender_produto_avulso()
{
    form_vender_produto_avulso.style.display = "none";
    btn_abrir_form_vender_produto_avulso.style.display = "block";
}

function limpa_e_da_foco_no_input_codigo()
{
    input_codigo_do_produto.value = "";
    input_codigo_do_produto.focus();
}

function limpar_input_codigo()
{
    fechar_form_vender_produto_avulso();
    limpa_lista_de_produtos_encontrados();
    input_codigo_do_produto.value = "";
    input_codigo_do_produto.focus();
}

function limpa_e_da_foco_input_descricao()
{
    fechar_form_vender_produto_avulso();
    limpa_lista_de_produtos_encontrados();
    input_descricao_do_produto.value = "";
    input_descricao_do_produto.focus();
}




// cadatra_100_vendas()
function cadatra_100_vendas()
{
    // finalizar_venda();
    // limpar_venda();

    let clientes = [
        {nome: 'José teixeira',    cpf: '28734902834'}, 
        {nome: 'Luiza dos Santos', cpf: '88412374583'},
        {nome: 'Jorge de andrate dutra neto',   cpf: '28734902834'},
        {nome: 'Zeno zay',         cpf: '75480204904'},
        {nome: 'Tiago zay',        cpf: '13202597906'},
        {nome: 'Sueli maria jablonski zay', cpf: '03776555906'}
    ];

    let produtos = [
        new Produto(null, 123, '7891344010694', 'LUBRIFICANTE MINERAL ESSENCIAL 4T SL/JASO MA 20W-50 PETROBRAS LUBRAX FRASCO 1L', 123, 'UN', '2.55', 20, false),
        new Produto(null, 123, '7891238920102', 'AZULEJO AZUL', 'UN', '2.55', 50, false),
        new Produto(null, 123, '7894675894837', 'MASSA PARA POLIR', 'KG', '25.50', 10, false),
        new Produto(null, 123, '7891344010694', 'LUBRIFICANTE MINERAL ESSENCIAL 4T SL/JASO MA 20W-50 PETROBRAS LUBRAX FRASCO 1L', 'UN', '2.55', 12, false),
        new Produto(null,123,  '7891344234882', 'SAPATO ALTO DE COURRA', 'UN', '350', 12, false),
        new Produto(null, 123, '7894756271273', 'LABORGINI MUITO BOA', 'UN', '220', 12, false),
    ]

    

    for(let i = 0; i < 100; i++){

        cria_objeto_venda();

        let indice =  Math.floor(Math.random() * 6 + 0);

        venda.cliente = clientes[indice];

        venda.adicionar_produto(produtos[indice]);

        envia_venda();

    }
}