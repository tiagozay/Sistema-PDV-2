


// ==================FORMULÁRIO DE EDITAR===================================FORMULÁRIO DE EDITAR=======
let loader_salvar_edicao_produto = document.querySelector("#dialog-modal-editar-produto__divLoaderSalvando");
let form_editar_produto = document.querySelector("#dialog-modal-editar-produto__form");
let btn_salvar_alteracoes_produto = document.querySelector("#dialog-modal-editar-produto__form__btnSalvar");
let btn_cancelar_alteracoes_produto = document.querySelector("#dialog-modal-editar-produto__form__btnCancelar");

let produto_para_ser_editado = [];
let produto_editado = {};

form_editar_produto.addEventListener("submit", salvar_alteracoes_do_produto);

function salvar_alteracoes_do_produto(event)
{
    event.preventDefault();
    
    let id = form_editar_produto.id.value;  
    let codigo = form_editar_produto.codigo.value.trim();
    let descricao = form_editar_produto.descricao.value.trim();
    let un = form_editar_produto.un.value.trim();
    let vl_unitario = transforma_valor_monetario_para_numero(form_editar_produto.vl_unitario.value);
    let qtde_disponivel = form_editar_produto.qtde_disponivel.value;

    produto_editado = {
        id,
        codigo, 
        descricao, 
        un, 
        vl_unitario,
        qtde_disponivel
    };

    if(codigo == "" || descricao == "" || un == "" || qtde_disponivel == ""){
        abre_erro_form_editar_produto("Informações não preenchidas!");
        return;
    };

    desabilita_e_adiciona_loader_nos_elementos([btn_salvar_alteracoes_produto, btn_cancelar_alteracoes_produto]);
    loader_salvar_edicao_produto.classList.add("display-flex");

    fetch(
        './back-end/editaProduto.php',
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `id=${produto_editado.id}&codigo=${produto_editado.codigo}&descricao=${produto_editado.descricao}&un=${produto_editado.un}&vl_unitario=${produto_editado.vl_unitario}&qtde_disponivel=${produto_editado.qtde_disponivel}`
        }
    )
    .then( resposta => {
        if(resposta.ok){
            sucesso_requisicao_editar_produto();
        }else{
            erro_requisicao_editar_produto();
        }
    })
    .catch(erro_requisicao_editar_produto);
}

function sucesso_requisicao_editar_produto()
{
    loader_salvar_edicao_produto.classList.remove("display-flex");
    habilita_e_remove_loader_dos_elementos([btn_salvar_alteracoes_produto, btn_cancelar_alteracoes_produto]);

    abrir_mensagem_lateral_da_tela("Produto alterado com sucesso!");
    limpa_formulario_editar_produto();
    fecha_erro_form_editar_produto();
    fecharModal();
    atualiza_tr_produto(produto_para_ser_editado.id);
    atualiza_array_de_produtos_do_banco__async();

    //Time out para dar tempo de atualizar o banco ficticio antes de escrever as quantidades e unidades
    setTimeout(()=>{
        escreve_quantidade_de_produtos_exibidos_e_total();
        escreve_quantidade_de_unidades_de_produtos();
    }, 1000);
     
}

function erro_requisicao_editar_produto()
{
    loader_salvar_edicao_produto.classList.remove("display-flex");
    habilita_e_remove_loader_dos_elementos([btn_salvar_alteracoes_produto, btn_cancelar_alteracoes_produto]);
    abrir_mensagem_lateral_da_tela("Erro ao editar produto!");
    limpa_formulario_editar_produto();
    fecha_erro_form_editar_produto();
    atualiza_array_de_produtos_do_banco__async();
    fecharModal();
}

function atualiza_tr_produto(id)
{
    zayDataTable__produtos.ativa_loader_de_um_registro(id);

    fetch(`./back-end/buscaUmProduto.php?id=${id}`)
    .then(resposta => {
        zayDataTable__produtos.desativa_loader_de_um_registro(id);
        if(resposta.ok){
            resposta.json()
            .then( produto =>  zayDataTable__produtos.atualiza_registro(formata_produto(produto)) )
        }else{
            abrir_mensagem_lateral_da_tela("Erro ao atualizar produto!");    
        }
    })
    .catch(() => {
        zayDataTable__produtos.desativa_loader_de_um_registro(id);
        abrir_mensagem_lateral_da_tela("Erro ao atualizar produto!");  
    });
}

function abrirModal__editarProduto(event)
{
    let id_produto = event.target.dataset.id;

    var dialog = document.querySelector("#dialog-modal-editar-produto");
    fecha_erro_form_cadastrar_produto();
    dialog.setAttribute("open", true);
    dialog.dataset.nome = "editar_produto";
    abrirModal();

    produto_para_ser_editado = busca_produto_no_banco_pelo_id(id_produto);

    let form = document.querySelector("#dialog-modal-editar-produto__form");

    btn_salvar_alteracoes_produto.classList.add("btn-cinza");
    btn_salvar_alteracoes_produto.setAttribute("disabled", true);

    form.id.value = produto_para_ser_editado.id;
    form.codigo.value = produto_para_ser_editado.codigo;
    form.descricao.value = produto_para_ser_editado.descricao;
    form.un.value = produto_para_ser_editado.un;
    form.vl_unitario.value = Number(produto_para_ser_editado.vl_unitario).toFixed(2);
    form.qtde_disponivel.value = produto_para_ser_editado.qtde_disponivel;

    let inputs = form.querySelectorAll(".input");

    
    //Verifica se algum dado mudou, se mudou, ativa o btn de salvar, se não mudou ou voltou para o original, habilita.
    inputs.forEach((input)=>{
        input.oninput = ()=>{
            ativa_ou_desativa_btn_de_salvar_alteracoes_produto();
        }
    });

    //Aqui adiciono o evento keyup somente no input de valor unitário, já que o evento input não pode ser usado pois a máscara de dinheiro já esta utilizando
    form_editar_produto.vl_unitario.onkeyup = ()=>{
        ativa_ou_desativa_btn_de_salvar_alteracoes_produto();
    }
}

function ativa_ou_desativa_btn_de_salvar_alteracoes_produto()
{
    let indicador_dados_alterados = verifica_se_houve_alguma_alteracao_no_produto_ao_editar();

    if(indicador_dados_alterados){
        btn_salvar_alteracoes_produto.classList.remove("btn-cinza");
        btn_salvar_alteracoes_produto.removeAttribute("disabled");
        return;
    }
    
    btn_salvar_alteracoes_produto.classList.add("btn-cinza");
    btn_salvar_alteracoes_produto.setAttribute("disabled", true);
}

function fecha_modal_editar_produto()
{
    if(verifica_se_houve_alguma_alteracao_no_produto_ao_editar()){
        let confirmacao = confirm("Descartar alterações?");
        if(confirmacao){
            fecharModal();
            limpa_formulario_editar_produto();
            fecha_erro_form_editar_produto();
        };
    }else{
        fecharModal();
        limpa_formulario_editar_produto();
        fecha_erro_form_editar_produto();
    }


}

function verifica_se_houve_alguma_alteracao_no_produto_ao_editar()
{
    //Nessa função eu fiz utilizando um monte de if porque o valor unitário antes de verificar precisa ser convertido, aí não ficaria legal fazer com o for como era antes

    if(produto_para_ser_editado.codigo != form_editar_produto.codigo.value.trim()){
        return true;
    }else if(produto_para_ser_editado.descricao != form_editar_produto.descricao.value.trim()){
        return true;
    }else if(produto_para_ser_editado.un != form_editar_produto.un.value.trim()){
        return true;
    }else if(produto_para_ser_editado.vl_unitario != transforma_valor_monetario_para_numero(form_editar_produto.vl_unitario.value)){
        return true;
    }else if(produto_para_ser_editado.qtde_disponivel != form_editar_produto.qtde_disponivel.value.trim()){
        return true;
    }

    return false;
}

function abre_erro_form_editar_produto(mensagem)
{   
    let erro = document.querySelector("#dialog-modal-editar-produto__form__erro");
    erro.classList.add("display-flex");

    let p_mensagem = erro.querySelector("#dialog-modal-editar-produto__erro__div_mensagem__mensagem");

    p_mensagem.textContent = mensagem;
}

function fecha_erro_form_editar_produto()
{
    let erro = document.querySelector("#dialog-modal-editar-produto__form__erro");
    erro.classList.remove("display-flex");
    let p_mensagem = erro.querySelector("#dialog-modal-editar-produto__erro__div_mensagem__mensagem");
    p_mensagem.textContent = "";
}

function limpa_formulario_editar_produto()
{
    let form = document.querySelector("#dialog-modal-editar-produto__form");

    form.codigo.value = "";
    form.descricao.value = "";
    form.un.value = "";
    form.vl_unitario.value = "";
    form.qtde_disponivel.value = "";
}
