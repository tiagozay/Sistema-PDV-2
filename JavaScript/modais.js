var fundo_modal = document.querySelector("#fundo-modal");
var dialogs = fundo_modal.querySelectorAll('dialog');

let modal_aberto = "";


//Quando uma dialog é aberta, dever ser setado um dataset nome com um valor que represente o nome dela, cada modal devee implementar sua própria função de fehcar, incluindo sua validação, perguntas, etc. Essa função começa com "fecha_modal_" e termina com o nome do determindado modal, com isso quando ocorrer o evento de clique fora dele ou apertar esc, eu gero a string com o nome da função, computo com eval() e chamo ela. Com isso, cada modal terá sua própria forma de fechar
document.addEventListener("keydown", function(event){
    if(event.keyCode == 27){
        if(!modal_aberto){
            return;
        }
        let funcao = "fecha_modal_"+modal_aberto;
        eval(funcao)();
    };
});

fundo_modal.addEventListener("click", verifica_onde_foi_clicado_e_fecha_modal);

function verifica_onde_foi_clicado_e_fecha_modal(event){
    var id_elemento_clicado = event.target.id;
    if(id_elemento_clicado == 'fundo-modal'){
        if(!modal_aberto){
            return;
        }
        let funcao = "fecha_modal_"+modal_aberto;
        eval(funcao)();
    }
}

function abrirModal(){
    fundo_modal.classList.add("display-flex");
    document.body.classList.add("sem-scroll");

    modal_aberto = document.querySelector("dialog[open=true]").dataset.nome;
}
function fecharModal(){
    dialogs.forEach(function(dialog){
        dialog.removeAttribute("open");
    })
    fundo_modal.classList.remove("display-flex");
    document.body.classList.remove("sem-scroll");
    modal_aberto = "";
}
