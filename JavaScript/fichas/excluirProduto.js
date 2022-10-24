function excluir_produto_ficha(event)
{
    let id_produto = event.target.dataset.id;

    let confirmacao = confirm("Remover produto da ficha?");
    if(!confirmacao) return;

    zayDataTable__produtosFicha.ativa_loader_de_um_registro(id_produto);

    fetch(
        './back-end/excluirProdutoDaFicha.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id_produto=${id_produto}&id_ficha=${id_ficha}`
        }
    )
    // .then( resposta => resposta.text() )
    // .then( resposta  => console.log(resposta) )
    .then(resposta => resposta.ok ? resposta.json() : Promise.reject())
    .then( ficha => {

        abrir_mensagem_lateral_da_tela("Produto excluído com sucesso!");

        zayDataTable__produtosFicha.desativa_loader_de_um_registro(id_produto);

        preenche_informacoes_da_ficha(ficha);

        zayDataTable__produtosFicha.remove_registro(id_produto);

        zayDataTable__fichas.atualiza_registro(formata_ficha_para_ser_escrita(ficha));

    } )
    .catch( () => {
        zayDataTable__produtosFicha.desativa_loader_de_um_registro(id_produto);
        abrir_mensagem_lateral_da_tela("Não foi possível remover produto!");
    } );
}