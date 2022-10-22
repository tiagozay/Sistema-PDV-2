let dialog_ficha = $("#fichas__dialogFicha");
let div_loader_buscando_ficha = $("#div_loader_buscando_ficha");

let fichas__dialogFicha__divProdutos = $("#fichas__dialogFicha__divProdutos");
let dialog_ficha__tabelaProdutos = $("#fichas__dialogFicha__produtos");

let dialog_ficha__nomeCliente = $("#ficha__nomeCliente");
let dialog_ficha__cpfCliente = $("#ficha__cpfCliente");

let dialog_ficha__campoQtdeItens = $("#fichas__dialogFicha__infoFicha__input_qtdeItens");
let dialog_ficha__campoVlTotal = $("#fichas__dialogFicha__infoFicha__input_vlTotal");
let dialog_ficha__campoVlPago = $("#fichas__dialogFicha__infoFicha__input_valorPago");

let btn_devolver_produto_ficha = cria_elemento_dom("button", 'btn_devolver_produto_ficha', 'devolver');

let btn_pagar_produto_ficha = cria_elemento_dom("button", 'btn_pagar_produto_ficha', 'pagar');

let btn_excluir_produto_ficha = cria_elemento_dom("button", 'btn_excluir_produto_ficha', 'excluir');


let zayDataTable__produtosFicha;

var id_ficha;

var ficha;

function abrir_modal_ficha(event)
{
    id_ficha = event.target.dataset.id;
    
    limpa_dialog_ficha();

    dialog_ficha.showModal();

    div_loader_buscando_ficha.classList.remove("display-none");

    fetch(`./back-end/buscaFichaComProdutos.php?id=${id_ficha}`)
    .then(resposta => resposta.ok ? resposta.json() : Promise.reject())
    .then( ficha => {

        div_loader_buscando_ficha.classList.add("display-none");

        fichas__dialogFicha__divProdutos.classList.remove("display-none");

        preenche_informacoes_da_ficha(ficha);

        let produtos_ficha = formata_produtos_da_ficha_para_serem_escritos(ficha['produtos']);

        zayDataTable__produtosFicha = new ZayDataTable(
            'produtos_ficha',
            dialog_ficha__tabelaProdutos,
            {
                "Data": 'data_registro',
                "Código": 'codigo',
                "Descrição": 'descricao',
                "UN": 'un',
                'Valor': 'vl_unitario',
                'Qtde': 'qtde',
                'Total': 'vl_total',
                'Estado': 'estado',
            },
            'id',
            produtos_ficha,
            [
                new AcaoRegistro(btn_devolver_produto_ficha, devolver_produto_ficha),
                new AcaoRegistro(btn_pagar_produto_ficha, pagar_produto_ficha),
                new AcaoRegistro(btn_excluir_produto_ficha, excluir_produto_ficha),

            ],
            loader_acoes_lista_de_fichas,
            100,
            'produtos_ficha__tr_thead',
            'produtos_ficha__td_thead',
            'produtos_ficha__tr_tbody',
            'produtos_ficha__td_tbody',
            'produtos_ficha__msgSemRegistros',
            'produtos_ficha__navPaginacao',
            'produtos_ficha__btnVoltarEAvancarPag',
            'produtos_ficha__numeroPagina',
            'produtos_ficha__pagSelecionada',
            'produtos_ficha__paginaDesativada',
        );

        sublinha_produtos_devolvidos_e_pagos();

    })
    .catch(() => {

        div_loader_buscando_ficha.classList.add("display-none");

        fichas__dialogFicha__divProdutos.classList.remove("display-none");

        fecha_dialog_ficha();
        abrir_mensagem_lateral_da_tela("Não foi possível obter informações da ficha!");
    });
}

function limpa_dialog_ficha()
{
    dialog_ficha__nomeCliente.innerHTML = "";
    dialog_ficha__cpfCliente.innerHTML = "";

    fichas__dialogFicha__divProdutos.classList.add("display-none");

    dialog_ficha__tabelaProdutos.innerHTML = "";

    dialog_ficha__campoQtdeItens.value = "";
    dialog_ficha__campoVlTotal.value = "";
    dialog_ficha__campoVlPago.value = "R$ 0,00";
}
function fecha_dialog_ficha()
{
    dialog_ficha.close();
}

function preenche_informacoes_da_ficha(ficha)
{
    dialog_ficha__nomeCliente.textContent = ficha.cliente.nome;
    dialog_ficha__cpfCliente.textContent = !ficha.cliente.cpf ? "Cpf não informado" : formata_cpf(ficha.cliente.cpf);

    dialog_ficha__campoQtdeItens.value = ficha.qtde_itens;
    dialog_ficha__campoVlTotal.value = "R$ "+adiciona_virgula_e_duas_casas_para_numero(ficha.total);
    dialog_ficha__campoVlPago.value = "R$ "+adiciona_virgula_e_duas_casas_para_numero(ficha.valor_pago);

}

class ProdutoDaFichaParaSerEscrito
{
    constructor(id, data_registro, codigo, descricao, un, vl_unitario, qtde, vl_total, estado)
    {
        this.id = id;
        this.data_registro = formata_data_sem_horario(data_registro);
        this.codigo = codigo;
        this.descricao = descricao;
        this.un = un;
        this.vl_unitario = adiciona_virgula_e_duas_casas_para_numero(vl_unitario);
        this.qtde = qtde;
        this.vl_total =  adiciona_virgula_e_duas_casas_para_numero(vl_total);
        this.estado = estado;

    }
}

function formata_produtos_da_ficha_para_serem_escritos(array_produtos)
{
    return array_produtos.map( produto => formata_produto_da_ficha_para_ser_escrito(produto) );
}

function formata_produto_da_ficha_para_ser_escrito(produto)
{
    return new ProdutoDaFichaParaSerEscrito(
        produto.id,
        DateHelper.formataData(new Date(produto.data_registro.date)),
        produto.codigo,
        produto.descricao,
        produto.un,
        produto.vl_unitario,
        produto.qtde,
        produto.vl_total,
        produto.estado,
    );
}

function sublinha_produtos_devolvidos_e_pagos()
{
    let trs = document.querySelectorAll(".produtos_ficha__tr_tbody");

    trs = [...trs];

    let trs_devolvidas = trs.filter( tr => {
        let estado = tr.querySelector(".produtos_ficha-estado").textContent; 
        return estado == 'Devolvido' || estado == 'Pago';
    });

    trs_devolvidas.forEach( tr => {

        let tds = tr.querySelectorAll("td");

        tds.forEach( td => {

            let classesTd = [...td.classList];

            if(classesTd.includes('produtos_ficha-estado')) return;

            td.classList.add("produtos_ficha__tr_tbody__produtoDevolvido");
        } )

        desabilita_btn_de_devolver_produto(tr);
        desabilita_btn_de_pagar_produto(tr);

    });

}

function desabilita_btn_de_devolver_produto(tr)
{
    let btn_devolver = tr.querySelector("#btn_devolver_produto_ficha");

    btn_devolver.setAttribute('disabled', true);

    btn_devolver.classList.add("btnAcaoProdutoFichaDesabilitado");
}

function desabilita_btn_de_pagar_produto(tr)
{
    let btn_devolver = tr.querySelector("#btn_pagar_produto_ficha");

    btn_devolver.setAttribute('disabled', true);

    btn_devolver.classList.add("btnAcaoProdutoFichaDesabilitado");
}
