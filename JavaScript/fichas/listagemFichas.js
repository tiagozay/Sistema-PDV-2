let tabela_lista_de_fichas = $("#fichas__listaDeFichas");
let loader_lista_de_fichas = $("#div_loader_lista_fichas");

let input_buscar_ficha_nome = $("#fichas__divFiltros__inputNome");
let input_buscar_ficha_cpf = $("#fichas__divFiltros__inputCpf");

input_buscar_ficha_nome.addEventListener("input", function(event){
    input_buscar_ficha_cpf.value = "";
    busca_ficha_por_nome(event);
});
input_buscar_ficha_cpf.addEventListener("input", function(){
    input_buscar_ficha_nome.value = "";
    busca_ficha_por_cpf(event);
});

let btn_ver_ficha = cria_elemento_dom("button", 'btn_ver_ficha', 'info', 'material-icons');

let btn_excluir_ficha = cria_elemento_dom("button", 'btn_excluir_ficha', 'delete', 'material-icons');

let loader_acoes_lista_de_fichas = cria_elemento_dom('div', 'loader_acoes_lista_de_clientes', '', 'loader');


let zayDataTable__fichas;

let fichas = [];

gerar_lista_de_fichas();

function gerar_lista_de_fichas()
{

    loader_lista_de_fichas.classList.remove("display-none");

    zay_request(
        'GET',
        './back-end/buscaFichas.php',
        {},
        (resposta) => {
    
            console.log(resposta);


            loader_lista_de_fichas.classList.add("display-none");

            try{
                fichas = JSON.parse(resposta);
            }catch{
                abrir_mensagem_lateral_da_tela("Não foi possível buscar as fichas!");
                return;
            }

            fichas = formata_fichas_para_serem_escritas(fichas);
    
            zayDataTable__fichas = new ZayDataTable(
                'lista_fichas',
                tabela_lista_de_fichas,
                {
                    "CPF": 'cpf', 
                    "Nome": 'nome', 
                    "Itens": 'qtde_itens',
                    "Total": 'total',
                    "Valor pago": 'valor_pago',
                },
                'id',
                fichas,
                [
                    new AcaoRegistro(btn_ver_ficha, abrir_modal_ficha),
                    new AcaoRegistro(btn_excluir_ficha, excluir_ficha),

                ],
                loader_acoes_lista_de_fichas,
                100,
                'lista_fichas__tr_thead',
                'lista_fichas__td_thead',
                'lista_fichas__tr_tbody',
                'lista_fichas__td_tbody',
                'lista_fichas__mensagem_sem_registros',
                'lista_fichas__nav_paginacao',
                'lista_fichas__btn_voltar_e_avancar',
                'lista_fichas__btn_pagina',
                'lista_fichas__btn_selecionado',
                'lista_fichas__btn_desativado'  
            );
        },
        () => {
            abrir_mensagem_lateral_da_tela("Não foi possível buscar as fichas!");
        }
    )
}

function atualiza_lista_de_fichas()
{
    zayDataTable__fichas.limpa_lista();

    loader_lista_de_fichas.classList.remove("display-none");

    zay_request(
        'GET',
        './back-end/buscaFichas.php',
        {},
        (resposta) => {
            
            loader_lista_de_fichas.classList.add("display-none");

            fichas = JSON.parse(resposta);
    
            fichas = formata_fichas_para_serem_escritas(fichas);
    
            zayDataTable__fichas.atualiza_registros(fichas);
        }
    )
}

function busca_ficha_por_nome(event)
{
    let nome_digitado = event.target.value;

    let fichas_encontradas = fichas.filter( ficha => {

        let reg = new RegExp(nome_digitado, 'i');
        return reg.test(ficha.nome);
        
    } );

    zayDataTable__fichas.atualiza_registros(fichas_encontradas);
}

function busca_ficha_por_cpf(event)
{
    let cpf_digitado = remove_mascara_cpf(event.target.value);

    let fichas_encontradas = fichas.filter( ficha => {

        let reg = new RegExp(cpf_digitado, 'i');
        return reg.test(remove_mascara_cpf(ficha.cpf));
        
    } );

    zayDataTable__fichas.atualiza_registros(fichas_encontradas);
}

class FichaFormatada
{
    constructor(id, cpf_cliente, nome_cliente, qtde_itens, total, valor_pago)
    {
        this.id = id
        this.cpf = cpf_cliente;
        this.nome = nome_cliente;
        this.qtde_itens = qtde_itens;
        this.total = total;
        this.valor_pago = valor_pago;
    }
}

function formata_fichas_para_serem_escritas(fichas)
{
    return fichas.map( ficha => formata_ficha_para_ser_escrita(ficha) );
}

function formata_ficha_para_ser_escrita(ficha)
{
    return new FichaFormatada(
        ficha.id,
        !ficha.cliente.cpf ? "Não informado" : formata_cpf(ficha.cliente.cpf),
        ficha.cliente.nome,
        ficha.qtde_itens,
        adiciona_virgula_e_duas_casas_para_numero(ficha.total),
        adiciona_virgula_e_duas_casas_para_numero(ficha.valor_pago),
    )
}