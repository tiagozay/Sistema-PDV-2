let tabela_lista_clientes = document.querySelector("#clientes__tabela");
let loader_lista_de_clientes = document.querySelector("#div_loader_lista_clientes");

// let clientes = [
//     {id: 20, nome: 'Tiago zay', cpf: '132.025.979-06'},
//     {id: 21, nome: 'Zeno zay', cpf: '754.802.049-04'},
//     {id: 21, nome: 'Natália luczynski da silva', cpf: '796.552.209-01'},
//     {id: 21, nome: 'Gracy priscila da costa margornar', cpf: '885.798.109-99'},
//     {id: 22, nome: 'Sueli zay', cpf: '037.765.559-71'},
//     {id: 20, nome: 'Tiago zay', cpf: '132.025.979-06'},
//     {id: 21, nome: 'Zeno zay', cpf: '754.802.049-04'},
//     {id: 21, nome: 'Natália luczynski da silva', cpf: '796.552.209-01'},
//     {id: 21, nome: 'Gracy priscila da costa margornar', cpf: '885.798.109-99'},
//     {id: 22, nome: 'Sueli zay', cpf: '037.765.559-71'},
//     {id: 20, nome: 'Tiago zay', cpf: '132.025.979-06'},
//     {id: 21, nome: 'Zeno zay', cpf: '754.802.049-04'},
//     {id: 21, nome: 'Natália luczynski da silva', cpf: '796.552.209-01'},
//     {id: 21, nome: 'Gracy priscila da costa margornar', cpf: '885.798.109-99'},
//     {id: 22, nome: 'Sueli zay', cpf: '037.765.559-71'},
//     {id: 20, nome: 'Tiago zay', cpf: '132.025.979-06'},
//     {id: 21, nome: 'Zeno zay', cpf: '754.802.049-04'},
//     {id: 21, nome: 'Natália luczynski da silva', cpf: '796.552.209-01'},
//     {id: 21, nome: 'Gracy priscila da costa margornar', cpf: '885.798.109-99'},
//     {id: 22, nome: 'Sueli zay', cpf: '037.765.559-71'},
// ];

let select_ordem_lista_de_clientes = document.querySelector("#clientes__divBuscarClientes__selectOrdem");

select_ordem_lista_de_clientes.addEventListener("change", selecionar_ordem_lista_clientes);

const inputBuscarClienteNome = document.querySelector("#clientes__divBuscarClientes__nome");
const inputBuscarClienteCpf = document.querySelector("#clientes__divBuscarClientes__cpf");

inputBuscarClienteNome.addEventListener("input", (event) => {
    inputBuscarClienteCpf.value = "";
    let clientes_filtrados = busca_clientes_por_nome(event.target.value);
    zayDataTable__clientes.atualiza_registros(clientes_filtrados);
});
inputBuscarClienteCpf.addEventListener("input", (event) => {
    inputBuscarClienteNome.value = "";
    let clientes_filtrados = busca_clientes_por_cpf(event.target.value);
    zayDataTable__clientes.atualiza_registros(clientes_filtrados);
});


let zayDataTable__clientes;

let ordem_lista_de_clientes = 'mais_antigo';

select_ordem_lista_de_clientes.value = ordem_lista_de_clientes;

let btn_editar_cliente = cria_elemento_dom('button', 'btn_editar_cliente', 'edit', 'material-icons');

let btn_excluir_cliente = cria_elemento_dom('button', 'btn_excluir_cliente', 'delete', 'material-icons');

let loader_acoes_lista_de_clientes = cria_elemento_dom('div', 'loader_acoes_lista_de_clientes', '', 'loader');

incializa_lista_clientes();

let clientes = {};

function incializa_lista_clientes()
{
    zay_request(
        'GET',
        './back-end/buscaClientesOrdenados.php',
        {ordem: ordem_lista_de_clientes},
        resposta => {

            try{
                resposta = JSON.parse(resposta);
            }catch{
                
            }

            clientes = resposta;  

            clientes = formata_clientes(clientes);
            
            zayDataTable__clientes = new ZayDataTable(
                'clientes',
                tabela_lista_clientes,
                {"Nome": 'nome', 'Cpf': 'cpf'},
                'id', 
                clientes,
                [
                    new AcaoRegistro(btn_excluir_cliente, excluir_cliente),
                    new AcaoRegistro(btn_editar_cliente, abrir_modal_editar_cliente),
                ],
                loader_acoes_lista_de_clientes,
                100,
                'listaClientes__thead__tr',
                'listaClientes__thead__td',
                'listaClientes__tbody__tr',
                'listaClientes__tbody__td',
                'listaClientes__mensagem_sem_registros',
                'listaClientes__navPaginacao',
                'listaClientes__btnVoltarEAvancarPagina',
                'listaClientes__numeroPagina',
                'listaClientes__btnSelecionado',
                'listaClientes__btnDesativado',
            );


        }
    )

}

function atualiza_lista_de_clientes()
{
    zayDataTable__clientes.limpa_lista();
    loader_lista_de_clientes.classList.remove("display-none");

    zay_request(
        'GET',
        './back-end/buscaClientesOrdenados.php',
        {ordem: ordem_lista_de_clientes},
        resposta => {

            loader_lista_de_clientes.classList.add("display-none");

            try{
                resposta = JSON.parse(resposta);
            }catch{
                
            }

            clientes = resposta;  

            clientes = formata_clientes(clientes);
            
            zayDataTable__clientes.atualiza_registros(clientes);

        }
    )
}

function selecionar_ordem_lista_clientes()
{
    ordem_lista_de_clientes = select_ordem_lista_de_clientes.value;
    atualiza_lista_de_clientes();

}


function atualiza_cliente(id)
{
    zayDataTable__clientes.ativa_loader_de_um_registro(id);

    zay_request(
        "POST",
        "./back-end/buscaUmCliente.php",
        {id},
        function(resposta){

            zayDataTable__clientes.desativa_loader_de_um_registro(id);

            try{
                resposta = JSON.parse(resposta);
            }catch{
                return;
            }

            let cliente = formata_cliente(resposta);

            zayDataTable__clientes.atualiza_registro(cliente);
        }
    )
}

function busca_clientes_por_nome(nome) {
    let reg = new RegExp(nome, 'i');
    return clientes.filter( (cliente) => reg.test(cliente.nome));
}

function busca_clientes_por_cpf(cpf) {
    cpf = remove_mascara_cpf(cpf);
    let reg = new RegExp(cpf, 'i');
    return clientes.filter( (cliente) => reg.test(
        cliente.cpf == "Não informado" ? '' : remove_mascara_cpf(cliente.cpf)
    ));
}

function formata_clientes(array_clientes)
{

    let clientes_formatados = array_clientes.map( cliente => formata_cliente(cliente) );

    return clientes_formatados;
 
}

function formata_cliente(cliente)
{
    class Cliente{
        constructor(id, nome, cpf){
            this.id = id;
            this.nome = nome;
            this.cpf = cpf;
        }
    }

    return new Cliente(
        cliente.id,
        cliente.nome ? cliente.nome : "Não informado",
        cliente.cpf ? formata_cpf(cliente.cpf) : "Não informado",
    );

}


// setTimeout( ()=>excluir_todos_clientes(), 1000);

//Função para desenvolvimento
function excluir_todos_clientes()
{    
    let evento = {target: {
        dataset: {
            id: 0
        }
    }}

    zayDataTable__clientes.dados.forEach(cliente => {

        evento.target.dataset.id = cliente.id;

        excluir_cliente(evento);

    })

}