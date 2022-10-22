function pagar_produto_ficha(event)
{
    let id_produto = event.target.dataset.id;

    let confirmacao = confirm("Marcar produto como pago?");
    if(!confirmacao) return;

    zayDataTable__produtosFicha.ativa_loader_de_um_registro(id_produto);

    fetch(
        './back-end/pagarProdutoDaFicha.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id_produto=${id_produto}&id_ficha=${id_ficha}`
        }
    )
    // .then( resposta => resposta.text())
    // .then( resposta => console.log(resposta) )
    .then(resposta => resposta.ok ? resposta.json() : Promise.reject())
    .then( ficha => {

        abrir_mensagem_lateral_da_tela("Produto pago com sucesso!");

        zayDataTable__produtosFicha.desativa_loader_de_um_registro(id_produto);

        preenche_informacoes_da_ficha(ficha);

        let produto_atualizado = ficha.produtos.find( produto => produto.id == id_produto );

        zayDataTable__produtosFicha.atualiza_registro(formata_produto_da_ficha_para_ser_escrito(produto_atualizado));

        sublinha_produtos_devolvidos_e_pagos();

        zayDataTable__fichas.atualiza_registro(formata_ficha_para_ser_escrita(ficha));

    } )
    .catch( () => {
        zayDataTable__produtosFicha.desativa_loader_de_um_registro(id_produto);
        abrir_mensagem_lateral_da_tela("Não foi possível pagar produto!");
    } );
}