let select_ordem_lista_de_vendas = document.querySelector("#div_opcoes_lista_de_vendas__select-ordem");
let tabela_lista_de_vendas = document.querySelector("#vendas__tabela_lista_de_vendas");
let loader_lista_de_vendas = document.querySelector("#loader_lista_de_vendas");

let ordem_da_busca = 'mais_antiga';
select_ordem_lista_de_vendas.value = ordem_da_busca;

select_ordem_lista_de_vendas.addEventListener("change", ()=>{
    ordem_da_busca = select_ordem_lista_de_vendas.value;
    atualiza_lista_de_vendas();
});

busca_e_lista_vendas();


let btn_ver_info_venda = document.createElement('button');
btn_ver_info_venda.classList.add('material-icons');
btn_ver_info_venda.id = 'lista_de_vendas__btnVerInfo';
btn_ver_info_venda.textContent = 'info';

let btn_excluir_venda = document.createElement('button');
btn_excluir_venda.classList.add('material-icons');
btn_excluir_venda.id = 'lista_de_vendas__btnExcluir';
btn_excluir_venda.textContent = 'delete';

let loader_acoes_lista_de_vendas = document.createElement("div");
loader_acoes_lista_de_vendas.classList.add('loader');
loader_acoes_lista_de_vendas.id = 'loader_acoes_lista_de_vendas';

let zayDataTable;

function busca_e_lista_vendas(){
    loader_lista_de_vendas.classList.add("display-flex");

    fetch(`./back-end/buscaVendas.php?ordem=${ordem_da_busca}`)
    .then(resposta => resposta.ok ? resposta.json() : Promise.reject())
    .then( vendas => {

        loader_lista_de_vendas.classList.remove("display-flex");

        let vendas_simplificadas = transforma_vendas_para_arrays_simples(vendas);

        let vendas_formatadas = formata_vendas(vendas_simplificadas);

        zayDataTable = new ZayDataTable(
            'vendas',
            tabela_lista_de_vendas,
            {'Nome': 'nome', 'CPF': 'cpf', 'Data': 'data_registro', 'Qtde itens': 'qtde_itens', 'Valor total': 'valor_total', 'Desconto': 'desconto', 'Valor com desconto': 'valor_com_desconto', 'Valor pago': 'valor_pago', 'Troco': 'troco'},
            'id',
            vendas_formatadas,
            [
                new AcaoRegistro(btn_ver_info_venda, exibir_informacoes_venda),
                new AcaoRegistro(btn_excluir_venda, excluir_venda),
            ],
            loader_acoes_lista_de_vendas,
            100,
            'vendas__thead__tr',
            'vendas__thead__td',
            'vendas__tbody__tr',
            'vendas__tbody__td',
            'vendas__mensagem_sem_registro',
            'vendas__nav_paginacao',
            'vendas__btn_voltar_e_avancar_pagincao',
            'vendas__btn_nuero_da_pagina',
            'vendas__btn_paginacao_selecionado',
            'vendas__btn_paginacao_desativado'
        );


    } )
    .catch(() => {
        loader_lista_de_vendas.classList.remove("display-flex");
        abrir_mensagem_lateral_da_tela("Não foi possível buscar as vendas!");
    });
}

function atualiza_lista_de_vendas()
{   

    zayDataTable.limpa_lista();

    loader_lista_de_vendas.classList.add("display-flex");

    fetch(`./back-end/buscaVendas.php?ordem=${ordem_da_busca}`)
    .then(resposta => resposta.ok ? resposta.json() : Promise.reject())
    .then( vendas => {

        loader_lista_de_vendas.classList.remove("display-flex");

        let vendas_simplificadas = transforma_vendas_para_arrays_simples(vendas);

        let vendas_formatadas = formata_vendas(vendas_simplificadas)

        zayDataTable.atualiza_registros(vendas_formatadas);

    } )
    .catch(() => {
        loader_lista_de_vendas.classList.remove("display-flex");
        abrir_mensagem_lateral_da_tela("Não foi possível buscar as vendas!");
    });
}

function transforma_vendas_para_arrays_simples(array_vendas)
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

function formata_vendas(vendas)
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