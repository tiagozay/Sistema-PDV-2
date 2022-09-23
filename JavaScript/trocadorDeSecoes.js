var botoes_trocar_de_secao = document.querySelectorAll(".btn-secoes");
botoes_trocar_de_secao.forEach(function(botao){
    botao.addEventListener('click', mudar_secao);
});

function mudar_secao(event){
    var id_secao_a_ser_exibida = event.target.dataset.secao;
    var secao_a_ser_exibida = document.querySelector(`#${id_secao_a_ser_exibida}`);
    mudar_cor_de_todos_botoes_para_original();
    ecultar_todas_secoes();
    event.target.classList.add("cor-btn-selecionado");
    secao_a_ser_exibida.classList.add("display-flex");
}
function ecultar_todas_secoes(){
    var secoes = document.querySelectorAll(".secao");
    secoes.forEach(function(secao){
        secao.classList.remove("display-flex");
    })
}
function mudar_cor_de_todos_botoes_para_original(){
    var botoes = document.querySelectorAll(".btn-secoes");
    botoes.forEach(function(botao){
        botao.classList.remove("cor-btn-selecionado");
    })
}