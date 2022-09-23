function excluir_produto_ficha(event)
{
    let id_produto = event.target.dataset.id;

    let confirmacao = confirm("Remover produto da ficha?");
    if(!confirmacao) return;

    zayDataTable__produtosFicha.ativa_loader_de_um_registro(id_produto);

    zay_request(
        'POST', 
        './back-end/excluirProdutoDaFicha.php',
        {id_produto: id_produto, id_ficha: id_ficha},
        resposta => {
            
            zayDataTable__produtosFicha.desativa_loader_de_um_registro(id_produto);

            try{
                resposta = JSON.parse(resposta);
            }catch{
                abrir_mensagem_lateral_da_tela("Não foi possível remover produto!");
                return;
            }

            if(resposta.sucesso){

                preenche_informacoes_da_ficha(resposta['ficha']);
    
                zayDataTable__produtosFicha.remove_registro(id_produto);


                zayDataTable__fichas.atualiza_registro(formata_ficha_para_ser_escrita(resposta.ficha));
    
            }else{
                abrir_mensagem_lateral_da_tela("Não foi possível excluír produto!");
            }
           
        },
        () => {

            zayDataTable__produtosFicha.desativa_loader_de_um_registro(id_produto);
            abrir_mensagem_lateral_da_tela("Não foi possível excluír produto!");

        }
    )
}