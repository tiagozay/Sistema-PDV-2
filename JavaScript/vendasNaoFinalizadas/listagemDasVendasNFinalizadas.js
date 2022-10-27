let tabela_lista_de_vendas_nao_finalizadas = document.querySelector("#vendas_nao_finalizadas__lista");
let loader_lista_de_vendas_nao_finalizadas = document.querySelector("#loader_lista_de_vendas_nao_finalizadas");
let select_ordem_lista_de_vendas_nao_finalizadas = document.querySelector("#div_opcoes_lista_de_vendas_nao_finalizadas__select-ordem");

let ordem_da_busca__vendas_nao_finalizadas = "mais_recente";

let zayDataTable__vendasNaoFinalizadas;

let btn_ver_info_venda_nao_finalizada = document.createElement('button');
btn_ver_info_venda_nao_finalizada.classList.add('material-icons');
btn_ver_info_venda_nao_finalizada.id = 'lista_de_vendas_nao_finalizadas__btnVerInfo';
btn_ver_info_venda_nao_finalizada.textContent = 'info';

let btn_excluir_venda_nao_finalizada = document.createElement('button');
btn_excluir_venda_nao_finalizada.classList.add('material-icons');
btn_excluir_venda_nao_finalizada.id = 'lista_de_vendas_nao_finalizadas__btnExcluir';
btn_excluir_venda_nao_finalizada.textContent = 'delete';

let loader_acoes_lista_de_vendas_nao_finalizadas = document.createElement("div");
loader_acoes_lista_de_vendas_nao_finalizadas.classList.add('loader');
loader_acoes_lista_de_vendas_nao_finalizadas.id = 'loader_acoes_lista_de_vendas_nao_finalizadas';


select_ordem_lista_de_vendas_nao_finalizadas.addEventListener("change", ()=>{
    ordem_da_busca__vendas_nao_finalizadas = select_ordem_lista_de_vendas_nao_finalizadas.value;
    atualiza_lista_de_vendas_nao_finalizadas();
});

fetch(`./back-end/buscaVendasNaoFinalizadas.php?ordem=${ordem_da_busca__vendas_nao_finalizadas}`)
.then(resposta => resposta.ok ? resposta.json() : Promise.reject())
.then( vendas => {

    loader_lista_de_vendas_nao_finalizadas.classList.remove("display-flex");

    let vendas_simplificadas = transforma_vendas_nf_para_arrays_simples(vendas);

    let vendas_formatadas = formata_vendas_nao_finalizadas(vendas_simplificadas);

    zayDataTable__vendasNaoFinalizadas = new ZayDataTable(
        'vendas_nao_finalizadas',
        tabela_lista_de_vendas_nao_finalizadas,
        {'Nome': 'nome', 'CPF': 'cpf', 'Data': 'data_registro', 'Qtde itens': 'qtde_itens', 'Valor total': 'valor_total', 'Desconto': 'desconto', 'Valor com desconto': 'valor_com_desconto', 'Valor pago': 'valor_pago', 'Troco': 'troco'},
        'id',
        vendas_formatadas,
        [
            new AcaoRegistro(btn_ver_info_venda_nao_finalizada, exibir_informacoes_venda_nao_finalizada),
            new AcaoRegistro(btn_excluir_venda_nao_finalizada, excluir_venda_nao_finalizada)
        ],
        loader_acoes_lista_de_vendas_nao_finalizadas,
        100,
        'vendas_nao_finalizadas__thead__tr',
        'vendas_nao_finalizadas__thead__td',
        'vendas_nao_finalizadas__tbody__tr',
        'vendas_nao_finalizadas__tbody__td',
        'vendas_nao_finalizadas__mensagem_sem_registro',
        'vendas_nao_finalizadas__nav_paginacao',
        'vendas_nao_finalizadas__btn_voltar_e_avancar_pagincao',
        'vendas_nao_finalizadas__btn_nuero_da_pagina',
        'vendas_nao_finalizadas__btn_paginacao_selecionado',
        'vendas_nao_finalizadas__btn_paginacao_desativado'
    );

})
.catch( () => {
    loader_lista_de_vendas_nao_finalizadas.classList.remove("display-flex");
    abrir_mensagem_lateral_da_tela("Não foi possível buscar as vendas!");
} );

function atualiza_lista_de_vendas_nao_finalizadas()
{   

    zayDataTable__vendasNaoFinalizadas.limpa_lista();

    loader_lista_de_vendas_nao_finalizadas.classList.add("display-flex");


    fetch(`./back-end/buscaVendasNaoFinalizadas.php?ordem=${ordem_da_busca__vendas_nao_finalizadas}`)
    .then(resposta => resposta.ok ? resposta.json() : Promise.reject())
    .then( vendas => {
        
        loader_lista_de_vendas_nao_finalizadas.classList.remove("display-flex");

        let vendas_simplificadas = transforma_vendas_nf_para_arrays_simples(vendas);

        let vendas_formatadas = formata_vendas_nao_finalizadas(vendas_simplificadas)

        zayDataTable__vendasNaoFinalizadas.atualiza_registros(vendas_formatadas);

    })
    .catch(() => {
        loader_lista_de_vendas_nao_finalizadas.classList.remove("display-flex");
        abrir_mensagem_lateral_da_tela("Não foi possível buscar as vendas!");
    })
}

function formata_vendas_nao_finalizadas(vendas)
{
    let vendas_da_lista_formatadas = vendas.map((venda)=>{
        venda.data_registro = DateHelper.formataData(new Date(venda.data_registro.date));
        venda.nome = !venda.nome ? "Não informado" : venda.nome;
        venda.cpf = !venda.cpf ? "Não informado" : formata_cpf(venda.cpf);
        venda.valor_total = adiciona_virgula_e_duas_casas_para_numero(venda.valor_total);
        venda.valor_com_desconto = adiciona_virgula_e_duas_casas_para_numero(venda.valor_com_desconto);
        venda.desconto = adiciona_virgula_e_duas_casas_para_numero(venda.desconto);
        venda.valor_pago = adiciona_virgula_e_duas_casas_para_numero(venda.valor_pago);
        venda.troco = adiciona_virgula_e_duas_casas_para_numero(venda.troco);

        return venda;
    });

    return vendas_da_lista_formatadas;
}

function transforma_vendas_nf_para_arrays_simples(array_vendas)
{
    function VendaParaSerEscrita(id, nome, cpf, data_registro, qtde_itens, valor_total, desconto, valor_com_desconto, valor_pago, troco){
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.data_registro = data_registro;
        this.qtde_itens = qtde_itens;
        this.valor_total = valor_total; 
        this.desconto = desconto;
        this.valor_com_desconto = valor_com_desconto, 
        this.valor_pago = valor_pago;
        this.troco = troco
    }

    let array_pronto = [];

    array_vendas.forEach((registro)=>{

        let venda = new VendaParaSerEscrita(
            registro.id,
            registro.cliente ? registro.cliente.nome : null,
            registro.cliente ? registro.cliente.cpf : null,
            registro.data_registro,
            registro.qtde_itens,
            registro.total,
            registro.desconto,
            registro.total_com_desconto,
            registro.valor_pago,
            registro.troco
        );

        array_pronto.push(venda);

    });

    return array_pronto;
}