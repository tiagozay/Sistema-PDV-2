// ==================FORMULÁRIO DE CADASTRAR===================================FORMULÁRIO DE CADASTRAR =======
let form_cadastrar_produto = document.querySelector("#dialog-modal-cadastrar-produto__form");
let btn_enviar_cadastro_do_produto = document.querySelector("#dialog-modal-cadastrar-produto__form__btnCadastrar");
let loader_cadastrar_produto = document.querySelector("#dialog-modal-cadastrar-produto__divLoaderCadastro");
let mensagem_produto_cadastrado_com_sucesso = document.querySelector("#mensagem_produto_cadastrado");

form_cadastrar_produto.addEventListener("submit", cadastrar_produto);

function cadastrar_produto(event)
{
    event.preventDefault();

    let codigo = form_cadastrar_produto.codigo.value.trim();
    let descricao = form_cadastrar_produto.descricao.value.trim();
    let un = form_cadastrar_produto.un.value;
    let vl_unitario = transforma_valor_monetario_para_numero(form_cadastrar_produto.vl_unitario.value);
    let qtde = Number(form_cadastrar_produto.qtde.value);

    if(codigo == "" || descricao == "" || un == "" || vl_unitario == "" || qtde == ""){
        abre_erro_form_cadastrar_produto("Campos não preenchidos!");
        return;
    };

    if(busca_um_produto_no_banco_pelo_codigo(codigo)){
        abre_erro_form_cadastrar_produto("Produto já foi cadastrado!");
        return;
    };

    loader_cadastrar_produto.classList.add("display-flex");
    desabilita_e_adiciona_loader_nos_elementos([btn_enviar_cadastro_do_produto]);

    fetch(
        './back-end/cadastraProduto.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `codigo=${codigo}&descricao=${descricao}&un=${un}&vl_unitario=${vl_unitario}&qtde=${qtde}`
        }
    )
    .then( resposta => {
        if(resposta.ok){
            sucesso_requisicao_cadastrar_produto() 
        }else{
            erro_requisicao_cadastrar_produto();
        }
    })
    .catch(erro_requisicao_cadastrar_produto)
}   

function sucesso_requisicao_cadastrar_produto()
{
    loader_cadastrar_produto.classList.remove("display-flex");
    habilita_e_remove_loader_dos_elementos([btn_enviar_cadastro_do_produto]);
   
    abrir_mensagem_lateral_da_tela("Produto cadastrado com sucesso!");
    limpa_formulario_de_cadastro_de_produto();
    fecha_erro_form_cadastrar_produto();
    fecharModal();
    atualiza_lista_de_produtos();   
    atualiza_array_de_produtos_do_banco__async();
  
}

function erro_requisicao_cadastrar_produto()
{
    loader_cadastrar_produto.classList.remove("display-flex");
    abrir_mensagem_lateral_da_tela("Erro ao cadastrar produto!");
    limpa_formulario_de_cadastro_de_produto();
    fecha_erro_form_cadastrar_produto();
    fecharModal();
    atualiza_array_de_produtos_do_banco__async();
}

function abrirModal__cadastrarProduto()
{
    var dialog = document.querySelector("#dialog-modal-cadastrar-produto");
    fecha_erro_form_cadastrar_produto();
    dialog.setAttribute("open", true);
    dialog.dataset.nome = "cadastrar_produto";
    abrirModal();
}

function fecha_modal_cadastrar_produto()
{
    if(verifica_se_algum_campo_foi_preenchido_no_form_de_cadastro()){
        let confirmacao = confirm("Descartar informações?");
        if(confirmacao){
            limpa_formulario_de_cadastro_de_produto();
            fecharModal();
        }
    }else{
        limpa_formulario_de_cadastro_de_produto();
        fecharModal();
    }   
  
}

function verifica_se_algum_campo_foi_preenchido_no_form_de_cadastro()
{
    let indicador = false;

    let campos_form = [
        form_cadastrar_produto.codigo,
        form_cadastrar_produto.descricao,
        form_cadastrar_produto.vl_unitario,
        form_cadastrar_produto.qtde
    ];
    
    campos_form.forEach((campo)=>{
        if(campo.value.trim().length > 0){
            indicador = true;
        }
    });

    return indicador;

}

function abre_erro_form_cadastrar_produto(mensagem)
{
    let erro = document.querySelector("#dialog-modal-cadastrar-produto__form__erro");
    let p_mensagem = erro.querySelector("#dialog-modal-cadastrar-produto__erro__div_mensagem__mensagem");
    p_mensagem.textContent = mensagem;
    erro.classList.add("display-flex");
}

function fecha_erro_form_cadastrar_produto()
{
    let erro = document.querySelector("#dialog-modal-cadastrar-produto__form__erro");
    erro.classList.remove("display-flex");
    let p_mensagem = erro.querySelector("#dialog-modal-cadastrar-produto__erro__div_mensagem__mensagem");
    p_mensagem.textContent = "";
}

function limpa_formulario_de_cadastro_de_produto()
{
    form_cadastrar_produto.codigo.value = "";
    form_cadastrar_produto.descricao.value = "";
    form_cadastrar_produto.un.value = "";
    form_cadastrar_produto.vl_unitario.value = 'R$ 0,00';
    form_cadastrar_produto.qtde.value = "";
}

//Faz a conversão de dados vindo do usuário para o javaScript, remove as vírgulas, caractéres, converte, e retorna false se o valor passado é inválido
function transforma_valor_monetario_para_numero(string)
{
    string = String(string);
    let string_sem_virgula = string.replace(',', '.');
    let string_com_varios_pontos_sem_cifrao = string_sem_virgula.replace(/[A-Z$]/g,'');
    let string_com_apenas_um_ponto = deixa_string_com_apenas_um_ponto(string_com_varios_pontos_sem_cifrao);
    let numero =  Number(string_com_apenas_um_ponto);
    if(isNaN(numero)){
        return false;
    }
    return numero;
}

function pega_tr_produto(id)
{
    return document.querySelector(`#produto-${id}`);
}