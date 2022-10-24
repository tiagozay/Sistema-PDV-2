function paga_todos_produtos_ficha()
{
    let confirmacao = confirm("Marcar todos produtos pendentes como pago?");
    if(!confirmacao) return;

    const loader = document.querySelector("#loader_pagar_tudo_ficha");

    loader.classList.remove("display-none");

    fetch(
        './back-end/pagarTodosProdutosFicha.php', 
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id=${id_ficha}`
        }
    )
    .then(reposta => reposta.ok ? reposta.json() : Promise.reject())
    .then(ficha => {

        loader.classList.add("display-none");

        preenche_informacoes_da_ficha(ficha);

        let produtos_ficha = formata_produtos_da_ficha_para_serem_escritos(ficha['produtos']);

        zayDataTable__produtosFicha.atualiza_registros(produtos_ficha);

        sublinha_produtos_devolvidos_e_pagos();

        abrir_mensagem_lateral_da_tela("Produtos pagos com sucesso!");

    } )
    .catch(() => {
        loader.classList.add("display-none");
        abrir_mensagem_lateral_da_tela("Não foi possível pagar os produtos!");
    })

}