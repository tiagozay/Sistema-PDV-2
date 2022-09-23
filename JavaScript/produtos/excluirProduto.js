function excluir_produto_cadastrado(event)
{
    let id = event.target.dataset.id;

    let confirmacao = confirm("Excluir produto permanentemente?");
    if(confirmacao){
        zayDataTable__produtos.ativa_loader_de_um_registro(id);
        zay_request(
            'POST', 
            './back-end/excluirProduto.php',
            {id},
            function(resposta){
                try{
                    resposta = JSON.parse(resposta);
                }catch{
                    //Erro ao excluir produto
                    zayDataTable__produtos.desativa_loader_de_um_registro(id);
                    abrir_mensagem_lateral_da_tela("Erro ao excluír produto!");
                }
               
                if(resposta.sucesso == true){
                    abrir_mensagem_lateral_da_tela("Produto excluído com sucesso!");
    
                    zayDataTable__produtos.remove_registro(id);

                    atualiza_array_de_produtos_do_banco__async();
                    //Time out para dar tempo de atualizar o banco ficticio antes de escrever as quantidades e unidades
                    setTimeout(()=>{
                        escreve_quantidade_de_produtos_exibidos_e_total();
                        escreve_quantidade_de_unidades_de_produtos();
                    }, 1500);
                }else{
                    //Erro ao excluir produto
                    abrir_mensagem_lateral_da_tela("Erro ao excluír produto!");
                }
            },
            function(){
                //Erro ao excluir produto
                zayDataTable__produtos.desativa_loader_de_um_registro(id);
                abrir_mensagem_lateral_da_tela("Erro ao excluír produto!");
            }
        );
    }
  
}
