function excluir_ficha(event)
{
    let id_ficha = event.target.dataset.id;

    let confirmacao = confirm("Excluir ficha permanentemente?");
    if(!confirmacao) return;

    zayDataTable__fichas.ativa_loader_de_um_registro(id_ficha);

    fetch(
        './back-end/excluirFicha.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id=${id_ficha}`
        }
    )
    .then( resposta => {
        
        zayDataTable__fichas.desativa_loader_de_um_registro(id_ficha);

        if(resposta.ok){
            abrir_mensagem_lateral_da_tela("Ficha excluída com sucesso!");
            zayDataTable__fichas.remove_registro(id_ficha);
        }else{
            abrir_mensagem_lateral_da_tela("Não foi possível excluir ficha!")
        }


    } )
    .catch( () => {

        zayDataTable__fichas.desativa_loader_de_um_registro(id_ficha);
        abrir_mensagem_lateral_da_tela("Não foi possível excluir ficha!");

    } );
}