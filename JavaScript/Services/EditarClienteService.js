class EditarClienteService
{

    constructor()
    {
        this._dialog = document.querySelector("#dialog_modal_editar_cliente");
        this._btnFecharDialog = document.querySelector("#dialog-modal-editar-cliente__btnFechar");
        this._btnCancelar = document.querySelector("#btn_form_editar_cliente_cancelar");
        this._btnSalvar = document.querySelector("#btn_form_editar_cliente");
        this._formulario = document.querySelector("#form_editar_cliente");
        this._loader = document.querySelector("#div_loader_editar_cliente");

        this._cliente_para_ser_editado;
    }


    abrirEdicao(cliente)
    {
        return new Promise( (resolve, reject) => {

            this._cliente_para_ser_editado = cliente;

            this._abrirModalEditarCliente();
            this._preencherFormularioCliente(this._cliente_para_ser_editado);
            this._adicionaVerificacaoParaHabilitarBtnDeSalvar();

            this._formulario.onsubmit = (event) => {

                event.preventDefault();

                let nome = this._formulario.nome.value.trim();
                let cpf = this._formulario.cpf.value.trim();
        
                if(!this._validaDados(nome, cpf)){
                    return;
                }

                this._remove_mensagem_erro_form_editar_cliente();

                //Antes de remover a máscara, verifica se tem cpf, pois se não tiver e passar para a função, ela retorna undefined, aí salva como undefined no banco.
                cpf = cpf.length > 0 ? remove_mascara_cpf(cpf) : cpf;

                this._salvaCliente(nome, cpf)
                    .then(() => {
                        this._fecharModalEditarCliente();
                        resolve();
                    })
                    .catch( () => {
                        reject();
                    })

            }

            this._btnCancelar.onclick = () => {
                this._fecharModalEditarCliente();
                reject();
            }

            this._btnFecharDialog.onclick = () => {
                this._fecharModalEditarCliente();
                reject();
            }

        } )
    }
    
    _salvaCliente(nome, cpf)
    {
        this._loader.classList.remove("display-none");

        return fetch(
            './back-end/editaCliente.php', 
            {   
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: 'POST',
                body: `id=${this._cliente_para_ser_editado.id}&nome=${nome}&cpf=${cpf}`
            }
        )
        .then( resposta => {
            this._loader.classList.add("display-none");

            if(resposta.ok){
                abrir_mensagem_lateral_da_tela("Cliente alterado com sucesso!");
                return Promise.resolve();
            } 

            return Promise.reject();
        })
        .catch(() => {
            abrir_mensagem_lateral_da_tela("Não foi possível editar cliente!");
            return Promise.reject();
        })
    }

    _validaDados(nome, cpf)
    {

        cpf = cpf.length > 0 ? remove_mascara_cpf(cpf) : cpf;
        
        if(nome.length == 0){
            this._abre_mensagem_erro_form_editar_cliente("Campo nome é obrigatório!");
            return false;
        }

        if(cpf.length > 0){
            if(!valida_cpf(cpf)){
                this._abre_mensagem_erro_form_editar_cliente("Cpf inválido!");
                return false;
            }
        }

        return true;
    }
        
    _abrirModalEditarCliente()
    {   
        this._dialog.showModal();
    }

    _preencherFormularioCliente(cliente)
    {
        this._formulario.nome.value = cliente.nome == "Não informado" ? "" : cliente.nome;
        this._formulario.cpf.value = cliente.cpf == "Não informado" ? "" : cliente.cpf;
    }

    _fecharModalEditarCliente()
    {
        this._dialog.close();
        this._limpaFormulario();
        this._remove_mensagem_erro_form_editar_cliente();
    }

    _limpaFormulario()
    {
        this._formulario.nome.value = "";
        this._formulario.cpf.value = "";
    }

    _abre_mensagem_erro_form_editar_cliente(mensagem)
    {
        let p_mensagem = document.querySelector("#erro_formulario_editar_cliente");
        p_mensagem.classList.remove("display-none");
        p_mensagem.textContent = mensagem;
    }
    _remove_mensagem_erro_form_editar_cliente()
    {
        let p_mensagem = document.querySelector("#erro_formulario_editar_cliente");
        p_mensagem.classList.add("display-none");
        p_mensagem.textContent = "";
    }

    _adicionaVerificacaoParaHabilitarBtnDeSalvar()
    {
        this._formulario.nome.addEventListener("input", () => {
            if(this._verifica_se_dados_do_cliente_foram_modificados()){
                this._btnSalvar.classList.remove("btn_editar_cliente_desativado");
                this._btnSalvar.removeAttribute("disabled");
            }else{
                this._btnSalvar.classList.add("btn_editar_cliente_desativado");
                this._btnSalvar.setAttribute("disabled", true);
            }
        });
        
        this._formulario.cpf.addEventListener("input", () => {
            if(this._verifica_se_dados_do_cliente_foram_modificados()){
                this._btnSalvar.classList.remove("btn_editar_cliente_desativado");
                this._btnSalvar.removeAttribute("disabled");
            }else{
                this._btnSalvar.classList.add("btn_editar_cliente_desativado");
                this._btnSalvar.setAttribute("disabled", true);
            }
        });
    }

    _verifica_se_dados_do_cliente_foram_modificados()
    {
        //Aqui é feita a conversão, pois quando no objeto original algum dados está "Não informado", no input ele é preenchido como um espaço vazio, então nessa verificação eu tenho que fazer com espaço vazio ao inves de "Não informado"
        let nome_original = this._cliente_para_ser_editado.nome == 'Não informado' ? '' : this._cliente_para_ser_editado.nome;
        let cpf_original = this._cliente_para_ser_editado.cpf == 'Não informado' ? '' : this._cliente_para_ser_editado.cpf;

        if(this._formulario.nome.value.trim() != nome_original || this._formulario.cpf.value.trim() != cpf_original ){
            return true;
        }

        return false;
    }



}