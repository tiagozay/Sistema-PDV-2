class IdentificarClienteService
{
    constructor()
    {
        this._dialog;
        this._btn_fechar;
        this._dialog_informar_cliente__campo_nome;
        this._dialog_informar_cliente__campo_cpf;
        this._tabela;
        this._clientes;
        this._zayDataTable__clientes;
        this._btn_cadastrar_cliente;
        this._btn_nao_informar_cliente;
        this._btn_confirmar_cliente;

        this._cliente_selecionado;
    }

    identificarCliente() 
    {
        return new Promise( ( resolve, reject ) => {
            this._abrirModalIdentificarCliente();

            this._dialog.onclose = () => {
                this._cancela_selecao_cliente();
            
                this._tabela.innerHTML = "";
            
                this._dialog_informar_cliente__campo_nome.value = "";
                this._dialog_informar_cliente__campo_cpf.value = "";

            }

            this._btn_cadastrar_cliente.onclick = () => {
                const service = new CadastrarClienteService();
                service.abrirCadastro()
                    .then( cliente_recem_cadastrado => {
                        this._buscaClientes()
                            .then(clientes => {
                                this._atualizaListaESelecionaNovoCliente(clientes, cliente_recem_cadastrado.id);
                            });
                    })
            }

            this._btn_nao_informar_cliente.onclick = () => {
                reject();
                this._fecharModalIdentificarCliente();
            }

            this._btn_confirmar_cliente.onclick = () => {
                resolve(this._cliente_selecionado);
                this._fecharModalIdentificarCliente();
            };

            this._btn_fechar.onclick = () => {
                this._fecharModalIdentificarCliente();
            }



        } );
    }


    _abrirModalIdentificarCliente()
    {
        this._dialog = document.querySelector("#dialog-modal-identificar-cliente");
        this._btn_fechar = document.querySelector("#dialog-modal-identificar-cliente__btnFechar");
        const loader = document.querySelector("#dialog_modal_identificar_cliente__div_loader_buscar_clientes");
        this._tabela = this._dialog.querySelector("#dialog-modal-identificar-cliente__tabela");
        this._dialog_informar_cliente__campo_nome = this._dialog.querySelector("#dialog-modal-identificar-cliente_divFiltros__nome");
        this._dialog_informar_cliente__campo_cpf = this._dialog.querySelector("#dialog-modal-identificar-cliente_divFiltros__cpf");
        this._btn_cadastrar_cliente = document.querySelector("#btn_cliente_nao_cadastrado");
        this._btn_nao_informar_cliente = document.querySelector("#dialog-modal-identificar-cliente__btns__btnNaoInformar");
        this._btn_confirmar_cliente = document.querySelector("#dialog-modal-identificar-cliente__btns__btnConfirmar");

        this._dialog.showModal();

        const self = this;

        this._dialog_informar_cliente__campo_nome.oninput = function(event){
            self._busca_cliente_por_nome(event)
        };
        this._dialog_informar_cliente__campo_cpf.oninput = function(event){
            self._busca_cliente_por_cpf(event)
        };

        loader.classList.remove("display-none");

        this._buscaClientes()
        .then( clientes => {

            loader.classList.add("display-none");

            this._clientes = this._formata_clientes(clientes);

            this._zayDataTable__clientes = new ZayDataTable(
                'venda_clientes_identificar',
                this._tabela,
                {Nome: 'nome', Cpf: 'cpf'},
                'id',
                this._clientes,
                [],
                null,
                100,
                'dialog_modal_identificar_cliente__tabela__thead_tr',
                'dialog_modal_identificar_cliente__tabela__thead_td',
                'dialog_modal_identificar_cliente__tabela__tbody_tr',
                'dialog_modal_identificar_cliente__tabela__tbody_td',
                'dialog_modal_identificar_cliente__tabela__mensagemSemRegistros',
                'dialog_modal_identificar_cliente__tabela__navPaginacao',
                'dialog_modal_identificar_cliente__tabela__paginacao__btnVoltarEAvancar',
                'dialog_modal_identificar_cliente__tabela__paginacao__btnNumeroDaPagina',
                'dialog_modal_identificar_cliente__tabela__paginacao__btnPaginacaoSelecionado',
                'dialog_modal_identificar_cliente__tabela__paginacao__btnPaginacaoDesativado'
            );

            this._adiciona_evento_de_click_nos_clientes();

        })
        .catch( () => {
            loader.classList.add("display-none");
            abrir_mensagem_lateral_da_tela("Não foi possível buscar clientes!");
        });
    
    }

    _atualizaListaESelecionaNovoCliente(clientes, id_novo_cliente)
    {
        this._clientes = this._formata_clientes(clientes);
        this._atualiza_lista_clientes(this._clientes);
        const elemento_novo = this._buscaElementoPeloId(id_novo_cliente);
        this._seleciona_cliente(elemento_novo);
    }

    _fecharModalIdentificarCliente()
    {
        this._cancela_selecao_cliente();
        this._dialog.close();
    }

    _buscaClientes()
    {
        return fetch(`./back-end/buscaClientesOrdenados.php?ordem=ordem_alfabetica`)
        .then( resposta => resposta.json() )
    }

    _atualiza_lista_clientes(clientes)
    {
        this._zayDataTable__clientes.atualiza_registros(clientes);

        this._adiciona_evento_de_click_nos_clientes();
    }

    _busca_cliente_por_nome(event)
    {
        
        this._dialog_informar_cliente__campo_cpf.value = "";

        let nome_digitado = event.target.value.trim();

        let clientes_encontrados = this._clientes.filter( cliente =>{
            let reg = new RegExp(nome_digitado, 'i');
            return reg.test(cliente.nome);
        });

        this._atualiza_lista_clientes(clientes_encontrados);

        this._cancela_selecao_cliente();    
    }

    _busca_cliente_por_cpf(event)
    {
        this._dialog_informar_cliente__campo_nome.value = "";

        let cpf_digitado = event.target.value;

        cpf_digitado = remove_mascara_cpf(cpf_digitado);
        
        let clientes_encontrados = this._clientes.filter( cliente =>{
            let reg = new RegExp(cpf_digitado, 'i');
            return reg.test(remove_mascara_cpf(cliente.cpf));
        });

        this._atualiza_lista_clientes(clientes_encontrados);

        this._cancela_selecao_cliente(); 
    }

    _formata_clientes(array_clientes)
    {
        class Cliente{
            constructor(id, nome, cpf){
                this.id = id;
                this.nome = nome;
                this.cpf = cpf;
            }
        }

        let clientes_formatados = array_clientes.map( cliente => 
            new Cliente(
                cliente.id,
                cliente.nome ? cliente.nome : "Não informado",
                cliente.cpf ? formata_cpf(cliente.cpf) : "Não informado",
            )
        );

        return clientes_formatados;
    
    }

    _buscaElementoPeloId(id)
    {
        const trs = [...document.querySelectorAll('.dialog_modal_identificar_cliente__tabela__tbody_tr')];

        const elemento = trs.find( elemento => elemento.dataset.id == id );

        return elemento;
    }

    _adiciona_evento_de_click_nos_clientes()
    {

        let trs_clientes = this._tabela.querySelectorAll(".dialog_modal_identificar_cliente__tabela__tbody_tr");
        
        const self = this;

        trs_clientes.forEach( tr => tr.addEventListener("click", function(){
            self._seleciona_cliente(this);
        } ));

    }

    _seleciona_cliente(elemento_clicado)
    {
        this._cancela_selecao_cliente();

        elemento_clicado.classList.add("tr_cliente_selecionado");

        this._btn_confirmar_cliente.classList.remove("dialog-modal-identificar-cliente__btns__btnConfirmar-desabilitado");
        this._btn_confirmar_cliente.removeAttribute("disabled");

        const id_cliente = elemento_clicado.dataset.id;

        this._cliente_selecionado = this._clientes.find( cliente => {
            return cliente.id == id_cliente;
        });

    }

    _cancela_selecao_cliente()
    {
        let trs_clientes = this._tabela.querySelectorAll(".dialog_modal_identificar_cliente__tabela__tbody_tr");
        trs_clientes.forEach( tr => tr.classList.remove("tr_cliente_selecionado"));

        this._btn_confirmar_cliente.classList.add("dialog-modal-identificar-cliente__btns__btnConfirmar-desabilitado");
        this._btn_confirmar_cliente.setAttribute("disabled", true);

        this._cliente_selecionado = null;
    }

}