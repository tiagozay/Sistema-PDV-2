function excluir_produto_cadastrado(event)
{
    let id = event.target.dataset.id;

    let confirmacao = confirm("Excluir produto permanentemente?");
    if(confirmacao){
        zayDataTable__produtos.ativa_loader_de_um_registro(id);

        fetch(
            './back-end/excluirProduto.php',
            {   
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: 'POST',
                body: `id=${id}`
            }
        )
        .then( resposta => {
            if(resposta.ok){
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
                zayDataTable__produtos.desativa_loader_de_um_registro(id);
            }
        } )
        .catch( () => {
            abrir_mensagem_lateral_da_tela("Erro ao excluír produto!");
            zayDataTable__produtos.desativa_loader_de_um_registro(id);
        })

    }
  
}
