//Editar cliente
let dialog_modal_editar_cliente = document.querySelector("#dialog_modal_editar_cliente");

let form_editar_cliente = document.querySelector("#form_editar_cliente");
let campo_editar_nome_cliente = form_editar_cliente.nome;
let campo_editar_cpf_cliente = form_editar_cliente.cpf;
let btn_salvar_alteracoes_cliente = form_editar_cliente.querySelector("#btn_form_editar_cliente");

let loader_editar_cliente = document.querySelector("#div_loader_editar_cliente");

let cliente_para_ser_editado = {};

form_editar_cliente.addEventListener("submit", salva_alteracoes_cliente);

campo_editar_nome_cliente.addEventListener("input", function(){
    if(verifica_se_dados_do_cliente_foram_modificados()){
        btn_salvar_alteracoes_cliente.classList.remove("btn_editar_cliente_desativado");
        btn_salvar_alteracoes_cliente.removeAttribute("disabled");
    }else{
        btn_salvar_alteracoes_cliente.classList.add("btn_editar_cliente_desativado");
        btn_salvar_alteracoes_cliente.setAttribute("disabled", true);
    }
});

campo_editar_cpf_cliente.addEventListener("input", function(){
    if(verifica_se_dados_do_cliente_foram_modificados()){
        btn_salvar_alteracoes_cliente.classList.remove("btn_editar_cliente_desativado");
        btn_salvar_alteracoes_cliente.removeAttribute("disabled");
    }else{
        btn_salvar_alteracoes_cliente.classList.add("btn_editar_cliente_desativado");
        btn_salvar_alteracoes_cliente.setAttribute("disabled", true);
    }
});

function salva_alteracoes_cliente(event)
{
    event.preventDefault();

    let nome = campo_editar_nome_cliente.value.trim();
    let cpf = campo_editar_cpf_cliente.value.trim();

    cpf = cpf.length > 0 ? remove_mascara_cpf(cpf) : cpf;

    if(nome.length == 0){
        abre_mensagem_erro_form_editar_cliente("Campo nome é obrigatório!");
        return;
    }

    if(cpf.length > 0){
        if(!valida_cpf(cpf)){
            abre_mensagem_erro_form_editar_cliente("Cpf inválido!");
            return;
        }
    }

    remove_mensagem_erro_form_editar_cliente();

    loader_editar_cliente.classList.remove("display-none");

    zay_request(
        'POST', 
        './back-end/editaCliente.php',
        {
            id: cliente_para_ser_editado.id,
            nome: nome, 
            cpf: cpf
        },
        function(resposta){
            loader_editar_cliente.classList.add("display-none");

            try{    
                resposta = JSON.parse(resposta);
            }catch{
                fecha_modal_editar_cliente();
                abrir_mensagem_lateral_da_tela("Não foi possível editar cliente!");
                return;
            }

            if(resposta.sucesso){
                fecha_modal_editar_cliente();
                abrir_mensagem_lateral_da_tela("Cliente editado com sucesso!");
                atualiza_cliente(cliente_para_ser_editado.id);
            }
            
        },
        function(){
            loader_editar_cliente.classList.add("display-none");
            fecha_modal_editar_cliente();
            abrir_mensagem_lateral_da_tela("Não foi possível editar cliente! Verifique sua conexão.");
            return;
        }
    )
}

function abre_mensagem_erro_form_editar_cliente(mensagem)
{
    let p_mensagem = document.querySelector("#erro_formulario_editar_cliente");
    p_mensagem.classList.remove("display-none");
    p_mensagem.textContent = mensagem;
}

function remove_mensagem_erro_form_editar_cliente()
{
    let p_mensagem = document.querySelector("#erro_formulario_editar_cliente");
    p_mensagem.classList.add("display-none");
    p_mensagem.textContent = "";
}

function abrir_modal_editar_cliente(event)
{
    dialog_modal_editar_cliente.showModal();

    let id = event.target.dataset.id;

    cliente_para_ser_editado = zayDataTable__clientes.busca_registro_no_array_de_dados_pelo_id(id);

    campo_editar_nome_cliente.value = cliente_para_ser_editado.nome == "Não informado" ? "" : cliente_para_ser_editado.nome;
    campo_editar_cpf_cliente.value = cliente_para_ser_editado.cpf == "Não informado" ? "" : cliente_para_ser_editado.cpf;

}

function verifica_se_dados_do_cliente_foram_modificados()
{
    //Aqui é feita a conversão, pois quando no objeto original algum dados está "Não informado", no input ele é preenchido como um espaço vazio, então nessa verificação eu tenho que fazer com espaço vazio ao inves de "Não informado"
    let nome_original = cliente_para_ser_editado.nome == 'Não informado' ? '' : cliente_para_ser_editado.nome;
    let cpf_original = cliente_para_ser_editado.cpf == 'Não informado' ? '' : cliente_para_ser_editado.cpf;

    if(campo_editar_nome_cliente.value != nome_original || campo_editar_cpf_cliente.value != cpf_original ){
        return true;
    }

    return false;
}

function fecha_modal_editar_cliente()
{
    dialog_modal_editar_cliente.close();
}