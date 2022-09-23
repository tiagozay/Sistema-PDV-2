let loader_limpar_ficha = $("#loader_limpar_ficha");

function limpar_ficha()
{
    let confirmacao = confirm("Remover todas as informações da ficha?");
    if(!confirmacao) return;

    loader_limpar_ficha.classList.remove("display-none");

    zay_request(
        'POST',
        './back-end/limparFicha.php',
        {id_ficha: id_ficha},
        resposta => {

            loader_limpar_ficha.classList.add("display-none");


            try{
                resposta = JSON.parse(resposta);
            }catch{
                abrir_mensagem_lateral_da_tela("Não foi possível limpar ficha!");
                return;
            }

            if(resposta.sucesso){
                preenche_informacoes_da_ficha(resposta.ficha);

                zayDataTable__produtosFicha.limpa_lista();

                abrir_mensagem_lateral_da_tela("Ficha limpa com sucesso!");
            }else{
                abrir_mensagem_lateral_da_tela("Não foi possível limpar ficha!");
            }
        },
        () => {
            loader_limpar_ficha.classList.add("display-none");
            abrir_mensagem_lateral_da_tela("Não foi possível limpar ficha!");
        }
    );
}