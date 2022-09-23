var dialog = document.querySelector("#dialog-modal-identificar-cliente");
let btn_fechar = document.querySelector("#dialog-modal-identificar-cliente__btnFechar");

dialog.onclose = ()=>{
    cancela_selecao_cliente();

    dialog_informar_cliente__tabela.innerHTML = "";

    dialog_informar_cliente__campo_nome.value = "";
    dialog_informar_cliente__campo_cpf.value = "";
}

let zayDataTable__clientes_dialog_identificar;
let dialog_informar_cliente__tabela = document.querySelector("#dialog-modal-identificar-cliente__tabela");
let loader_buscar_clientes = document.querySelector("#dialog_modal_identificar_cliente__div_loader_buscar_clientes");


let dialog_informar_cliente__campo_nome = document.querySelector("#dialog-modal-identificar-cliente_divFiltros__nome");
let dialog_informar_cliente__campo_cpf = document.querySelector("#dialog-modal-identificar-cliente_divFiltros__cpf");

let btn_confirmar_cliente = document.querySelector("#dialog-modal-identificar-cliente__btns__btnConfirmar");
let btn_nao_informar_cliente = document.querySelector("#dialog-modal-identificar-cliente__btns__btnNaoInformar");
let btn_cliente_nao_cadastrado = document.querySelector("#btn_cliente_nao_cadastrado");

let clientes = {};


let cliente_identificado = null;


function ediciona_evento_de_click_nos_clientes()
{

    let trs_clientes = dialog_informar_cliente__tabela.querySelectorAll(".dialog_modal_identificar_cliente__tabela__tbody_tr");
    
    trs_clientes.forEach( tr => tr.addEventListener("click", function(){

        let id_cliente = cliente_selecionado(this);

        let cliente = clientes.find( cliente => {
            return cliente.id == id_cliente;
        });

        cliente_identificado = cliente;

    }));

}

function abrir_modal_identificar_cliente()
{

    dialog_informar_cliente__campo_nome.addEventListener("input", busca_cliente_por_nome);
    dialog_informar_cliente__campo_cpf.addEventListener("input", busca_cliente_por_cpf);

    dialog.showModal();

    return new Promise( (resolve, reject) => {

        btn_fechar.onclick = () => {
            fecha_modal_identificar_cliente();
        };

        btn_confirmar_cliente.onclick = () => {
            fecha_modal_identificar_cliente();
            resolve(cliente_identificado);
        }

        btn_nao_informar_cliente.onclick = () => {
            fecha_modal_identificar_cliente();
            reject();
        };

        btn_cliente_nao_cadastrado.onclick = () => {
    
            abrir_modal_cliente_nao_cadastrado()
            .then( cliente => {
                resolve(cliente);
                fecha_modal_identificar_cliente();
            } );
    
        }

        loader_buscar_clientes.classList.remove("display-none");

        zay_request(
            'POST',
            './back-end/buscaClientesOrdenados.php',
            {ordem: 'ordem_alfabetica'},
            (resposta) => {
    
                loader_buscar_clientes.classList.add("display-none");
    
                try{
                    clientes = JSON.parse(resposta);
                }catch{
                    abrir_mensagem_lateral_da_tela("Não foi possível buscar clientes!");
                    return;
                }
    
                let clientes_formatados = formata_clientes(clientes);
    
                zayDataTable__clientes_dialog_identificar = new ZayDataTable(
                    'venda_clientes_identificar',
                    dialog_informar_cliente__tabela,
                    {Nome: 'nome', Cpf: 'cpf'},
                    'id',
                    clientes_formatados,
                    [],
                    null,
                    100,
                    'dialog_modal_identificar_cliente__tabela__thead_tr',
                    'dialog_modal_identificar_cliente__tabela__thead_td',
                    'dialog_modal_identificar_cliente__tabela__tbody_tr',
                    'dialog_modal_identificar_cliente__tabela__tbody_td',
                    'dialog_modal_identificar_cliente__tabela__mensagemSemRegistros',
                    'dialog_modal_identificar_cliente__tabela__navPaginacao',
                    'dialog_modal_identificar_cliente__tabela__paginacao__btnVoltarEAvancar',
                    'dialog_modal_identificar_cliente__tabela__paginacao__btnNumeroDaPagina',
                    'dialog_modal_identificar_cliente__tabela__paginacao__btnPaginacaoSelecionado',
                    'dialog_modal_identificar_cliente__tabela__paginacao__btnPaginacaoDesativado'
                );
    
                ediciona_evento_de_click_nos_clientes()
        
            },
            () => {
                abrir_mensagem_lateral_da_tela("Não foi possível buscar clientes!");
                loader_buscar_clientes.classList.add("display-none");
            }
        )

    } );

}

let modal_cliente_nao_cadastrado = document.querySelector("#dialog_modal_cadastrar_cliente_na_venda"); 
let modal_cliente_nao_cadastrado_form = document.querySelector("#form_cadastrar_cliente_na_venda");

let loader_cadastrar_cliente_na_venda = document.querySelector("#div_loader_cadastrar_cliente_na_venda");

function abrir_modal_cliente_nao_cadastrado() // Promise
{
    
    return new Promise( (resolve, reject) => {

        modal_cliente_nao_cadastrado_form.onsubmit = function(event){

            event.preventDefault();
    
            let nome = modal_cliente_nao_cadastrado_form.nome.value.trim();
            let cpf = modal_cliente_nao_cadastrado_form.cpf.value.trim();
        
            cpf = cpf.length > 0 ? remove_mascara_cpf(cpf) : cpf;
        
            if(nome.length == 0){
                abre_mensagem_erro_form_cadastrar_cliente_na_venda("Campo nome é obrigatório!");
                return;
            }
        
            if(cpf.length > 0){
                if(!valida_cpf(cpf)){
                    abre_mensagem_erro_form_cadastrar_cliente_na_venda("Cpf inválido!");
                    return;
                }
            }
        
            remove_mensagem_erro_form_cadastrar_cliente_na_venda();
    
            loader_cadastrar_cliente_na_venda.classList.remove("display-none");
    
            zay_request(
                'POST',
                './back-end/cadastraCliente.php',
                {nome, cpf},
                resposta => {

                    loader_cadastrar_cliente_na_venda.classList.add("display-none");
        
                    try{
                        resposta = JSON.parse(resposta);
                    }catch{
                        fecha_modal_cadastrar_cliente_na_venda();
                        abrir_mensagem_lateral_da_tela("Erro ao cadastrar cliente!");
                    }
        
                    if(resposta.sucesso){
                        resolve({id: resposta.id, nome: nome, cpf: cpf});
                        abrir_mensagem_lateral_da_tela("Cliente cadastrado com sucesso!");
                        fecha_modal_cadastrar_cliente_na_venda();
                    }else{
                        fecha_modal_cadastrar_cliente_na_venda();
                        abrir_mensagem_lateral_da_tela("Erro ao cadastrar cliente!");
                    }
        
                },
                () => {
                    loader_cadastrar_cliente.classList.add("display-none");
                    fecha_modal_cadastrar_cliente_na_venda();
                    abrir_mensagem_lateral_da_tela("Erro ao cadastrar cliente!");
                }
            );
    
        }
    
        modal_cliente_nao_cadastrado.showModal();

    });

}

function abre_mensagem_erro_form_cadastrar_cliente_na_venda(mensagem)
{
    let p_mensagem = document.querySelector("#erro_formulario_cadastro_cliente_na_venda");
    p_mensagem.classList.remove("display-none");
    p_mensagem.textContent = mensagem;
}
function remove_mensagem_erro_form_cadastrar_cliente_na_venda()
{
    let p_mensagem = document.querySelector("#erro_formulario_cadastro_cliente_na_venda");
    p_mensagem.classList.add("display-none");
    p_mensagem.textContent = "";
}

function fecha_modal_cadastrar_cliente_na_venda()
{
    modal_cliente_nao_cadastrado.close();
}

function cliente_nao_cadastrado()
{
    fecha_modal_identificar_cliente();
}

function atualiza_lista_clientes(clientes)
{
    let clientes_formatados = formata_clientes(clientes);

    zayDataTable__clientes_dialog_identificar.atualiza_registros(clientes_formatados);

    ediciona_evento_de_click_nos_clientes();
}

function busca_cliente_por_nome(event)
{
    dialog_informar_cliente__campo_cpf.value = "";

    let nome_digitado = event.target.value.trim();

    let clientes_encontrados = clientes.filter( cliente =>{
        let reg = new RegExp(nome_digitado, 'i');
        return reg.test(cliente.nome);
    });

    atualiza_lista_clientes(clientes_encontrados);

    cancela_selecao_cliente();    
}

function busca_cliente_por_cpf(event)
{
    dialog_informar_cliente__campo_nome.value = "";

    let cpf_digitado = event.target.value;

    cpf_digitado = remove_mascara_cpf(cpf_digitado);
    
    let clientes_encontrados = clientes.filter( cliente =>{
        let reg = new RegExp(cpf_digitado, 'i');
        return reg.test(cliente.cpf);
    });

    atualiza_lista_clientes(clientes_encontrados)

    cancela_selecao_cliente();
}

function cancela_selecao_cliente()
{
    let trs_clientes = dialog_informar_cliente__tabela.querySelectorAll(".dialog_modal_identificar_cliente__tabela__tbody_tr");
    trs_clientes.forEach( tr => tr.classList.remove("tr_cliente_selecionado"));

    btn_confirmar_cliente.classList.add("dialog-modal-identificar-cliente__btns__btnConfirmar-desabilitado");
    btn_confirmar_cliente.setAttribute("disabled", true);
}

function cliente_selecionado(elemento_clicado)
{
    let trs_clientes = dialog_informar_cliente__tabela.querySelectorAll(".dialog_modal_identificar_cliente__tabela__tbody_tr");
    trs_clientes.forEach( tr => tr.classList.remove("tr_cliente_selecionado"));

    let tr_selecionada = elemento_clicado;
    tr_selecionada.classList.add("tr_cliente_selecionado");
    
    btn_confirmar_cliente.classList.remove("dialog-modal-identificar-cliente__btns__btnConfirmar-desabilitado");
    btn_confirmar_cliente.removeAttribute("disabled");

    return tr_selecionada.dataset.id;

}

function formata_clientes(array_clientes)
{

    let clientes_formatados = array_clientes.map( cliente => formata_cliente(cliente) );

    return clientes_formatados;
 
}

function formata_cliente(cliente)
{
    class Cliente{
        constructor(id, nome, cpf){
            this.id = id;
            this.nome = nome;
            this.cpf = cpf;
        }
    }

    return new Cliente(
        cliente.id,
        cliente.nome ? cliente.nome : "Não informado",
        cliente.cpf ? formata_cpf(cliente.cpf) : "Não informado",
    );

}

function fecha_modal_identificar_cliente()
{
    var dialog = document.querySelector("#dialog-modal-identificar-cliente");
    dialog.close();
}