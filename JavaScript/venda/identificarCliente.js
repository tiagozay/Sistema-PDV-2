let btn_cliente_nao_cadastrado = document.querySelector("#btn_cliente_nao_cadastrado");

let modal_cliente_nao_cadastrado = document.querySelector("#dialog_modal_cadastrar_cliente_na_venda"); 
let modal_cliente_nao_cadastrado_form = document.querySelector("#form_cadastrar_cliente_na_venda");

let loader_cadastrar_cliente_na_venda = document.querySelector("#div_loader_cadastrar_cliente_na_venda");

function abrir_modal_cliente_nao_cadastrado() // Promise
{
    
    return new Promise( (resolve, reject) => {

        modal_cliente_nao_cadastrado_form.onsubmit = function(event){

            event.preventDefault();
    
            let nome = modal_cliente_nao_cadastrado_form.nome.value.trim();
            let cpf = modal_cliente_nao_cadastrado_form.cpf.value.trim();
        
            cpf = cpf.length > 0 ? remove_mascara_cpf(cpf) : cpf;
        
            if(nome.length == 0){
                abre_mensagem_erro_form_cadastrar_cliente_na_venda("Campo nome é obrigatório!");
                return;
            }
        
            if(cpf.length > 0){
                if(!valida_cpf(cpf)){
                    abre_mensagem_erro_form_cadastrar_cliente_na_venda("Cpf inválido!");
                    return;
                }
            }
        
            remove_mensagem_erro_form_cadastrar_cliente_na_venda();
    
            loader_cadastrar_cliente_na_venda.classList.remove("display-none");
    
            
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
                console.log("Deu boa!!");
                loader_cadastrar_cliente_na_venda.classList.add("display-none");

                resolve({id: resposta.id, nome: nome, cpf: cpf});
                abrir_mensagem_lateral_da_tela("Cliente cadastrado com sucesso!");
                fecha_modal_cadastrar_cliente_na_venda();
                
            })
            .catch( () => {
                console.log("Deu ruim!!");
                loader_cadastrar_cliente_na_venda.classList.add("display-none");

                reject();
                fecha_modal_cadastrar_cliente_na_venda();
                abrir_mensagem_lateral_da_tela("Erro ao cadastrar cliente!");
            } )

        }

        modal_cliente_nao_cadastrado.showModal();
    });

}

function abre_mensagem_erro_form_cadastrar_cliente_na_venda(mensagem)
{
    let p_mensagem = document.querySelector("#erro_formulario_cadastro_cliente_na_venda");
    p_mensagem.classList.remove("display-none");
    p_mensagem.textContent = mensagem;
}
function remove_mensagem_erro_form_cadastrar_cliente_na_venda()
{
    let p_mensagem = document.querySelector("#erro_formulario_cadastro_cliente_na_venda");
    p_mensagem.classList.add("display-none");
    p_mensagem.textContent = "";
}

function fecha_modal_cadastrar_cliente_na_venda()
{
    modal_cliente_nao_cadastrado.close();
}

function cliente_nao_cadastrado()
{
    fecha_modal_identificar_cliente();
}
