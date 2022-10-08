class CadastrarClienteService
{

    constructor()
    {
        this._dialog = document.querySelector("#dialog_modal_cadastrar_cliente");
        this._btnFecharDialog = document.querySelector("#dialog-modal-cadastrar-cliente__btnFechar");
        this._btnCancelar = document.querySelector("#btn_form_cadastrar_cliente_cancelar");
        this._formulario = document.querySelector("#form_cadastrar_cliente");
        this._loader = document.querySelector("#div_loader_cadastrar_cliente");

        this._cliente;
    }


    abrirCadastro()
    {
        return new Promise( (resolve, reject) => {
            this._abrirModalCadastrarCliente();

            this._formulario.onsubmit = (event) => {
                event.preventDefault();

                let nome = this._formulario.nome.value.trim();
                let cpf = this._formulario.cpf.value.trim();
        
                if(!this._validaDados(nome, cpf)){
                    return;
                }

                this._remove_mensagem_erro_form_cadastrar_cliente();

                //Antes de remover a máscara, verifica se tem cpf, pois se não tiver e passar para a função, ela retorna undefined, aí salva como undefined no banco.
                cpf = cpf.length > 0 ? remove_mascara_cpf(cpf) : cpf;

                this._cadastraCliente(nome, cpf)
                    .then(id => {
                        this._fecharModalCadastrarCliente();
                        resolve({id, nome, cpf});
                    })
                    .catch( () => {
                        reject();
                    })

            }

            this._btnCancelar.onclick = () => {
                this._fecharModalCadastrarCliente();
                reject();
            }

            this._btnFecharDialog.onclick = () => {
                this._fecharModalCadastrarCliente();
                reject();
            }

        } )
    }
    
    _cadastraCliente(nome, cpf)
    {
        this._loader.classList.remove("display-none");

        return fetch(
            './back-end/cadastraCliente.php', 
            {   
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: 'POST',
                body: `nome=${nome}&cpf=${cpf}`
            }
        )
        .then( resposta => {
            this._loader.classList.add("display-none");

            if(resposta.ok){
                abrir_mensagem_lateral_da_tela("Cliente cadastrado com sucesso!");
                return resposta.json();
            } 

            return Promise.reject();
        })
        .catch(() => {
            abrir_mensagem_lateral_da_tela("Não foi possível cadastrar cliente!");
            return Promise.reject();
        })
    }

    _validaDados(nome, cpf)
    {
        cpf = cpf.length > 0 ? remove_mascara_cpf(cpf) : cpf;
        
        if(nome.length == 0){
            this._abre_mensagem_erro_form_cadastrar_cliente("Campo nome é obrigatório!");
            return false;
        }

        if(cpf.length > 0){
            if(!valida_cpf(cpf)){
                this._abre_mensagem_erro_form_cadastrar_cliente("Cpf inválido!");
                return false;
            }
        }

        return true;
    }
        
    _abrirModalCadastrarCliente()
    {   
        this._dialog.showModal();
    }

    _fecharModalCadastrarCliente()
    {
        this._dialog.close();
        this._limpaFormulario();
        this._remove_mensagem_erro_form_cadastrar_cliente();
    }

    _limpaFormulario()
    {
        this._formulario.nome.value = "";
        this._formulario.cpf.value = "";
    }

    _abre_mensagem_erro_form_cadastrar_cliente(mensagem)
    {
        let p_mensagem = document.querySelector("#erro_formulario_cadastro_cliente");
        p_mensagem.classList.remove("display-none");
        p_mensagem.textContent = mensagem;
    }
    _remove_mensagem_erro_form_cadastrar_cliente()
    {
        let p_mensagem = document.querySelector("#erro_formulario_cadastro_cliente");
        p_mensagem.classList.add("display-none");
        p_mensagem.textContent = "";
    }


}