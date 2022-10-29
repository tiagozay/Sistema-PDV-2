
function excluir_venda_nao_finalizada()
{
    
    let id = event.target.dataset.id;

    let confirmacao = confirm("Deseja cancelar esta venda?");
    if(!confirmacao){
        return;
    }

    zayDataTable__vendasNaoFinalizadas.ativa_loader_de_um_registro(id);

    fetch(
        './back-end/excluirVendaNaoFinalizada.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id=${id}`
        }
    )
    .then( resposta => {

        zayDataTable__vendasNaoFinalizadas.desativa_loader_de_um_registro(id);

        if(resposta.ok){
            zayDataTable__vendasNaoFinalizadas.remove_registro(id);
            abrir_mensagem_lateral_da_tela("Venda excluída com sucesso!");
            atualiza_array_de_produtos_do_banco__async();
        }

    } )
    .catch( () => {
        zayDataTable__vendasNaoFinalizadas.desativa_loader_de_um_registro(id);
        abrir_mensagem_lateral_da_tela("Não foi possível excluir venda!");
    } );

}