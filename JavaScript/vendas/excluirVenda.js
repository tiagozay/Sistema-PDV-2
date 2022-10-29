function excluir_venda(event)
{
    let id = event.target.dataset.id;

    let confirmacao = confirm("Deseja cancelar esta venda?");
    if(!confirmacao){
        return;
    }

    zayDataTable.ativa_loader_de_um_registro(id);

    fetch(
        './back-end/excluirVenda.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id=${id}`
        }
    )
    .then( resposta => {

        zayDataTable.desativa_loader_de_um_registro(id);

        if(resposta.ok){
            zayDataTable.remove_registro(id);
            abrir_mensagem_lateral_da_tela("Venda excluída com sucesso!");
            atualiza_array_de_produtos_do_banco__async();
        }

    } )
    .catch( () => {
        zayDataTable.desativa_loader_de_um_registro(id);
        abrir_mensagem_lateral_da_tela("Não foi possível excluir venda!");
    } );
}