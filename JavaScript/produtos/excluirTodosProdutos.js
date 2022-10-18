
function excluir_todos_produtos()
{
    if(busca_todos_produtos().length == 0){
        alert("Ainda não há produtos cadastrados!");
        return;
    }

    let confirmacao1 = confirm("Esta ação removerá todo seu estoque permanentemente!");
    if(!confirmacao1){
        return;
    }

    let confirmacao2 = confirm("Deseja continuar?");
    if(!confirmacao2){
        return;
    }

    let icone_lixeira = btn_excluir_todos_produtos.querySelector("span");
    let loader = btn_excluir_todos_produtos.querySelector("#loader_excluir_todos_produtos");
    icone_lixeira.classList.add("display-none");
    loader.classList.remove("display-none");

    fetch('./back-end/excluirTodosProdutos.php')
    .then( resposta => {

        icone_lixeira.classList.remove("display-none");
        loader.classList.add("display-none");

        if(resposta.ok){
            abrir_mensagem_lateral_da_tela("Produtos excluídos com sucesso");
            atualiza_lista_de_produtos();
            atualiza_array_de_produtos_do_banco__async();
            //Time out para dar tempo de atualizar o banco ficticio antes de escrever as quantidades e unidades
            setTimeout(()=>{
                escreve_quantidade_de_produtos_exibidos_e_total();
                escreve_quantidade_de_unidades_de_produtos();
            }, 1000);
        }else{
            abrir_mensagem_lateral_da_tela("Não foi possível concluir!"); 
        }
    } )
    .catch(() => {
        icone_lixeira.classList.remove("display-none");
        loader.classList.add("display-none");
        abrir_mensagem_lateral_da_tela("Não foi possível concluir!");
    })
}