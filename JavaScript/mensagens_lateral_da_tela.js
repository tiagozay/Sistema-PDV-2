let mensagens = document.querySelectorAll("#mensagem_lateral_da_tela");

var time_out_iniciar_fade_out;
var time_out_remover_elemento;

function abrir_mensagem_lateral_da_tela(mensagem)
{
    let mensagem_lateral = document.querySelector("#mensagem_lateral_da_tela");
    let p_mensagem = mensagem_lateral.querySelector("#mensagem_lateral__mensagem");
    p_mensagem.textContent = mensagem;

    //Limpa os intervalos que servem para esconder a mensagem_lateral, pois caso ela seja chamada uma vez seguida da outra sem dar o tempo dos timeOuts, dava bug.
    clearTimeout(time_out_iniciar_fade_out);
    clearTimeout(time_out_remover_elemento);

    mensagem_lateral.classList.remove("display-flex");
    mensagem_lateral.classList.remove("fade-out-1000");

    setTimeout(()=>{
        mensagem_lateral.classList.add("display-flex");
    }, 100)

    time_out_iniciar_fade_out = setTimeout(()=>{
        mensagem_lateral.classList.add("fade-out-1000");
        time_out_remover_elemento = setTimeout(()=>{
            mensagem_lateral.classList.remove("display-flex");
            mensagem_lateral.classList.remove("fade-out-1000");
        }, 1000);
    }, 2500);
}


function fechar_mensagem_lateral_de_tela()
{
    mensagens.forEach((mensagem)=>{
        mensagem.classList.remove("display-flex");
    })
}