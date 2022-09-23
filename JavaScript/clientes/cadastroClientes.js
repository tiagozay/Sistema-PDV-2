// Cadastro de clientes
let dialog_modal_cadastro_cliente = document.querySelector("#dialog_modal_cadastrar_cliente");
let form_cadastrar_cliente = document.querySelector("#form_cadastrar_cliente");
let campo_cadastrar_nome_cliente = form_cadastrar_cliente.nome;
let campo_cadastrar_cpf_cliente = form_cadastrar_cliente.cpf;
let loader_cadastrar_cliente = document.querySelector("#div_loader_cadastrar_cliente");

form_cadastrar_cliente.addEventListener("submit", cadastra_cliente);

function abrir_modal_cadastrar_cliente()
{
    dialog_modal_cadastro_cliente.showModal();
    campo_cadastrar_nome_cliente.value = "";
    campo_cadastrar_cpf_cliente.value = "";
}

function fecha_modal_cadastrar_cliente()
{
    dialog_modal_cadastro_cliente.close();
}

function cadastra_cliente(event)
{
    event.preventDefault();

    let nome = form_cadastrar_cliente.nome.value.trim();
    let cpf = form_cadastrar_cliente.cpf.value.trim();

    cpf = cpf.length > 0 ? remove_mascara_cpf(cpf) : cpf;

    if(nome.length == 0){
        abre_mensagem_erro_form_cadastrar_cliente("Campo nome é obrigatório!");
        return;
    }

    if(cpf.length > 0){
        if(!valida_cpf(cpf)){
            abre_mensagem_erro_form_cadastrar_cliente("Cpf inválido!");
            return;
        }
    }

    remove_mensagem_erro_form_cadastrar_cliente();

    loader_cadastrar_cliente.classList.remove("display-none");



    fetch(
        './back-end/cadastraCliente.php', 
        {   
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'POST',
            body: `nome=${nome}&cpf=${cpf}`
        }
    )
    .then( resposta => resposta.ok ? Promise.resolve() : Promise.reject() )
    .then( () => {

        loader_cadastrar_cliente.classList.add("display-none");

        fecha_modal_cadastrar_cliente();
        abrir_mensagem_lateral_da_tela("Cliente cadastrado com sucesso!");
        atualiza_lista_de_clientes();
        
    })
    .catch( () => {
        loader_cadastrar_cliente.classList.add("display-none");
        abre_mensagem_erro_form_cadastrar_cliente("Erro ao cadastrar cliente!");
    } )

}

function abre_mensagem_erro_form_cadastrar_cliente(mensagem)
{
    let p_mensagem = document.querySelector("#erro_formulario_cadastro_cliente");
    p_mensagem.classList.remove("display-none");
    p_mensagem.textContent = mensagem;
}
function remove_mensagem_erro_form_cadastrar_cliente()
{
    let p_mensagem = document.querySelector("#erro_formulario_cadastro_cliente");
    p_mensagem.classList.add("display-none");
    p_mensagem.textContent = "";
}