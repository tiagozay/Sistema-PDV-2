let loader_limpar_ficha = $("#loader_limpar_ficha");

function limpar_ficha()
{
    let confirmacao = confirm("Remover todas as informações da ficha?");
    if(!confirmacao) return;

    loader_limpar_ficha.classList.remove("display-none");

    fetch(
        './back-end/limparFicha.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id_ficha=${id_ficha}`
        }
    )
    .then(resposta => resposta.ok ? resposta.json() : Promise.reject())
    .then( ficha => {

        loader_limpar_ficha.classList.add("display-none");

        preenche_informacoes_da_ficha(ficha);

        zayDataTable__produtosFicha.limpa_lista();

        abrir_mensagem_lateral_da_tela("Ficha limpa com sucesso!");

    } )
    .catch( () => {
        loader_limpar_ficha.classList.add("display-none");
        abrir_mensagem_lateral_da_tela("Não foi possível limpar ficha!");
    } );
}