function excluir_cliente(event)
{
    let id = event.target.dataset.id;

    let confirmacao = confirm("Excluir cliente permanentemente?");

    if(!confirmacao) return;

    zayDataTable__clientes.ativa_loader_de_um_registro(id);

    fetch(
        './back-end/excluirCliente.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id=${id}`
        }
    )
    .then( resposta => {
        zayDataTable__clientes.desativa_loader_de_um_registro(id);
        if(resposta.ok){
            zayDataTable__clientes.remove_registro(id);
            abrir_mensagem_lateral_da_tela("Cliente excluído com sucesso!");
        }else{
            resposta.json()
            .then( msg => {
                if(msg == 'tem_ficha'){
                    abrir_mensagem_lateral_da_tela("Não foi possível excluir cliente!");
                    setTimeout( () => alert("Clientes que contêm fichas não podem ser excluídos! Remova a ficha primeiro!"), 500);
                }
            }  )
            .catch( () => {
                abrir_mensagem_lateral_da_tela("Não foi possível excluir cliente!");
            } )
        }
    } )
    .catch(() => {
        zayDataTable__clientes.desativa_loader_de_um_registro(id);
        abrir_mensagem_lateral_da_tela("Não foi possível excluir cliente!");
    });
}