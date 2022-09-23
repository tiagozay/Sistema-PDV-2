function excluir_ficha(event)
{

    let id_ficha = event.target.dataset.id;

    let confirmacao = confirm("Excluir ficha permanentemente?");
    if(!confirmacao) return;

    zayDataTable__fichas.ativa_loader_de_um_registro(id_ficha);

    zay_request(
        'POST',
        './back-end/excluirFicha.php',
        {id: id_ficha},
        ( resposta ) => {

            zayDataTable__fichas.desativa_loader_de_um_registro(id_ficha);

            try{
                resposta = JSON.parse(resposta);
            }catch{
                abrir_mensagem_lateral_da_tela("Não foi possível excluir ficha!");
                return;
            }

            if(resposta.sucesso){
                abrir_mensagem_lateral_da_tela("Ficha excluída com sucesso!");
                zayDataTable__fichas.remove_registro(id_ficha);
            }


        },
        () => {
            zayDataTable__fichas.desativa_loader_de_um_registro(id_ficha);
            abrir_mensagem_lateral_da_tela("Não foi possível excluir ficha!");
      
        }
    )

}