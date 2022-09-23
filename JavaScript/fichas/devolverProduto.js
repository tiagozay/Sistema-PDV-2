function devolver_produto_ficha(event)
{
    let id_produto = event.target.dataset.id;

    let confirmacao = confirm("Marcar produto como devolvido?");
    if(!confirmacao) return;

    zayDataTable__produtosFicha.ativa_loader_de_um_registro(id_produto);

    zay_request(
        'POST', 
        './back-end/devolverProdutoDaFicha.php',
        {id_produto: id_produto, id_ficha: id_ficha},
        resposta => {
            
            zayDataTable__produtosFicha.desativa_loader_de_um_registro(id_produto);

            try{
                resposta = JSON.parse(resposta);
            }catch{
                abrir_mensagem_lateral_da_tela("Não foi possível devolver produto!");
                return;
            }

            if(resposta.sucesso){

                preenche_informacoes_da_ficha(resposta.ficha);


                let produto_atualizado = resposta.ficha.produtos.find( produto => produto.id == id_produto );

                zayDataTable__produtosFicha.atualiza_registro(formata_produto_da_ficha_para_ser_escrito(produto_atualizado));
    
                sublinha_produtos_devolvidos_e_pagos();

                zayDataTable__fichas.atualiza_registro(formata_ficha_para_ser_escrita(resposta.ficha));

            }else{
                abrir_mensagem_lateral_da_tela("Não foi possível devolver produto!");
            }
           
        },
        () => {

            zayDataTable__produtosFicha.desativa_loader_de_um_registro(id_produto);
            abrir_mensagem_lateral_da_tela("Não foi possível devolver produto!");

        }
    )
}