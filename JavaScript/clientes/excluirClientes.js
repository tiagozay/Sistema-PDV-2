function excluir_cliente(event)
{
    let id = event.target.dataset.id;

    let confirmacao = confirm("Excluir cliente permanentemente?");

    if(!confirmacao) return;

    zayDataTable__clientes.ativa_loader_de_um_registro(id);

    zay_request(
        'POST',
        './back-end/excluirCliente.php',
        {id},
        function(resposta){

            zayDataTable__clientes.desativa_loader_de_um_registro(id);

            try{
                resposta = JSON.parse(resposta);
            }catch{
                abrir_mensagem_lateral_da_tela("Não foi possível excluir cliente!");
                return;
            }

            if(resposta.sucesso){
                zayDataTable__clientes.remove_registro(id);
                abrir_mensagem_lateral_da_tela("Cliente excluído com sucesso!");
            }else{
                if(resposta.mensagem == 'tem_ficha'){
                    abrir_mensagem_lateral_da_tela("Não foi possível excluir cliente!");
                    setTimeout( () => alert("Clientes que têm fichas não podem ser excluídos! Remova a ficha primeiro!"), 500);
                }
            }

        },
        function(){
            zayDataTable__clientes.desativa_loader_de_um_registro(id);
            abrir_mensagem_lateral_da_tela("Não foi possível excluir cliente!");
        }
    )
}