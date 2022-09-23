function excluir_venda(event)
{
    let id = event.target.dataset.id;

    let confirmacao = confirm("Deseja cancelar esta venda?");
    if(!confirmacao){
        return;
    }

    zayDataTable.ativa_loader_de_um_registro(id);

    zay_request(
        'POST',
        './back-end/excluirVenda.php',
        {id},
        function(resposta){

            zayDataTable.desativa_loader_de_um_registro(id);

            console.log(resposta);
            
            try{
                resposta = JSON.parse(resposta);
            }catch{
                abrir_mensagem_lateral_da_tela("Não foi possível cancelar venda!");
                return;
            }

            if(resposta.sucesso){
                zayDataTable.remove_registro(id);
                abrir_mensagem_lateral_da_tela("Venda cancelada com sucesso!");
                atualiza_array_de_produtos_do_banco__async();
            }
       
        },
        function(){
            zayDataTable.desativa_loader_de_um_registro(id);
            abrir_mensagem_lateral_da_tela("Não foi possível cancelar venda!");
        }

    )

}