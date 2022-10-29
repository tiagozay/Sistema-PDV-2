// ==================FORMULÁRIO DE AUMENTAR QUANTIDADE===================================FORMULÁRIO DE AUMENTAR QUANTIDADE=======
let loader_form_aumentar_quantidade = document.querySelector("#dialog-modal-aumentar-estoque-produto__divLoaderEnviando");
let form_aumetar_estoque_produto = document.querySelector("#dialog-modal-aumentar-estoque-produto__form");
let btn_aumentar_quantidade = document.querySelector("#dialog-modal-aumentar-estoque-produto__form__divCampo__btnAumentar");

let produto_que_recebera_aumento;


form_aumetar_estoque_produto.addEventListener("submit", aumenta_estoque_produto);

function aumenta_estoque_produto(event)
{
    event.preventDefault();
    
    let quantidade = event.target.quantidade.value.trim();

    if(!quantidade || quantidade < 1){
        alert("Quantidade inválida!");
        return;
    }

    desabilita_e_adiciona_loader_nos_elementos([btn_aumentar_quantidade]);
    loader_form_aumentar_quantidade.classList.add("display-flex");

    fetch(
        './back-end/aumentaEstoqueDeUmProduto.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id=${produto_que_recebera_aumento.id}&quantidade=${quantidade}`
        }
    )
    .then(resposta => {
        loader_form_aumentar_quantidade.classList.remove("display-flex");
        habilita_e_remove_loader_dos_elementos([btn_aumentar_quantidade]);

        if(resposta.ok){
            abrir_mensagem_lateral_da_tela("Produto alterado com sucesso!");
            form_aumetar_estoque_produto.quantidade.value = "";
            fecharModal();
            atualiza_tr_produto(produto_que_recebera_aumento.id)
            atualiza_array_de_produtos_do_banco__async();

            //Time out para dar tempo de atualizar o banco ficticio antes de escrever as quantidades e unidades
            setTimeout(()=>{
                escreve_quantidade_de_produtos_exibidos_e_total();
                escreve_quantidade_de_unidades_de_produtos();
            }, 1000);
        }else{
            abrir_mensagem_lateral_da_tela("Não foi possível aumentar quantidade!");
            form_aumetar_estoque_produto.quantidade.value = "";
            fecharModal();
            atualiza_array_de_produtos_do_banco__async();
        }
    })
    .catch(() => {
        loader_form_aumentar_quantidade.classList.remove("display-flex");
        habilita_e_remove_loader_dos_elementos([btn_aumentar_quantidade]);
        abrir_mensagem_lateral_da_tela("Não foi possível aumentar quantidade!");
        form_aumetar_estoque_produto.quantidade.value = "";
        atualiza_array_de_produtos_do_banco__async();
        fecharModal();
    });
}

function abrirModal__aumentarQuantidadeEstoque(event)
{
    let id_produto = event.target.dataset.id;
    let dialog = document.querySelector("#dialog-modal-aumentar-estoque-produto");
    fecha_erro_form_cadastrar_produto();
    dialog.setAttribute("open", true);
    dialog.dataset.nome = "aumentarEstoque_produto";
    abrirModal();

    produto_que_recebera_aumento = busca_produto_no_banco_pelo_id(id_produto);

    let info_produto = document.querySelector("#dialog-modal-aumentar-estoque-produto__form__infoProdutoParaAumentar");

    info_produto.textContent = `${produto_que_recebera_aumento.codigo} - ${produto_que_recebera_aumento.descricao}`;

}

function fecha_modal_aumentarEstoque_produto()
{
    fecharModal();
}