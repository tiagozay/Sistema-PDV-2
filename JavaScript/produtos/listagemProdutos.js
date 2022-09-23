// ==================LISTA DE PRODUTOS===================================LISTA DE PRODUTOS =======
let tabela_de_produtos = document.querySelector("#produtos__tabela_lista_de_produtos");
let tabela_produtos__produto__btns_acoes = document.querySelectorAll(".produtos__tabela_lista_de_produtos__campo-acoes__btn");
let form_buscar_produto = document.querySelector("#produtos__divFiltrosListaProdutos__form");
let produtos__campo_codigo_busca = document.querySelector("#produtos__input-codigo");
let produtos__campo_descricao_busca = document.querySelector("#produtos__divFiltrosListaProdutos__input-descricao");
let produtos__select_ordem = document.querySelector("#produtos__divFiltrosListaProdutos__input-ordem");
let btn_atualizar_lista_produtos = document.querySelector("#btn_atualizar_lista_produtos");
let btn_excluir_todos_produtos = document.querySelector("#btn_excluir_todos_produtos");
let btn_limpar_busca = document.querySelector("#btn_limpar_busca");

let loader_lista_de_produtos = document.querySelector("#loader_lista_de_produtos");

//Recebe os eventos de cada input de busca, para quando um for preenchido, o outro fique vazio e se o campo ficar vazio, atualizará a tela
produtos__campo_codigo_busca.addEventListener("input", ()=> {
    produtos__campo_descricao_busca.value = "";
    produtos__campo_descricao_busca.classList.remove("borda-destaque");
    if(produtos__campo_codigo_busca.value.length == 0){

        //Verificação para não atualizar lista desnescessáriamente quando a busca não tiver sido enviada
        if(indicador_de_busca){
            atualiza_lista_de_produtos_sem_nova_requisicao();
            indicador_de_busca = false;
        }

        produtos__campo_codigo_busca.classList.remove("borda-destaque");
        btn_limpar_busca.classList.remove("display-flex");
    }else{
        event.target.classList.add("borda-destaque");
        btn_limpar_busca.classList.add("display-flex");
    }

    if(produtos__campo_codigo_busca.value.trim().length == 13){
        recebe_envio_do_form_de_buscar_produto();
    }

});
produtos__campo_descricao_busca.addEventListener("input", ()=> {
    produtos__campo_codigo_busca.value = "";
    produtos__campo_codigo_busca.classList.remove("borda-destaque");
    if(produtos__campo_descricao_busca.value.length == 0){

        //Verificação para não atualizar lista desnescessáriamente quando a busca não tiver sido enviada
        if(indicador_de_busca){
            atualiza_lista_de_produtos_sem_nova_requisicao();
            indicador_de_busca = false;
        }

        produtos__campo_descricao_busca.classList.remove("borda-destaque");
        btn_limpar_busca.classList.remove("display-flex");
    }else{
        event.target.classList.add("borda-destaque");
        btn_limpar_busca.classList.add("display-flex");
    }

});
produtos__select_ordem.addEventListener("change", ()=> recebe_seleca_da_ordem_e_reordena_lista());

form_buscar_produto.addEventListener("submit", (event) => recebe_envio_do_form_de_buscar_produto(event));

let zayDataTable__produtos;

let btn_aumentar_estoque_produto = document.createElement("button");
btn_aumentar_estoque_produto.classList.add(
    'material-icons',
    'produtos__tabela_lista_de_produtos__campo-acoes__btn',
    'produtos__tabela_lista_de_produtos__campo-acoes__btn-aumentar_quantidade'
);
btn_aumentar_estoque_produto.textContent = 'add';
// abrirModal__aumentarQuantidadeEstoque()


let btn_editar_produto = document.createElement("button");
btn_editar_produto.classList.add(
    'material-icons',
    'produtos__tabela_lista_de_produtos__campo-acoes__btn',
    'produtos__tabela_lista_de_produtos__campo-acoes__btn-editar'
);
btn_editar_produto.textContent = 'edit';
//abrirModal__editarProduto();


let btn_excluir_produto = document.createElement("button");
btn_excluir_produto.classList.add(
    'material-icons',
    'produtos__tabela_lista_de_produtos__campo-acoes__btn',
    'produtos__tabela_lista_de_produtos__campo-acoes__btn-excluir'
);
btn_excluir_produto.textContent = 'delete';
//excluir_produto_cadastrado();


let loader_acoes_lista_de_produtos = document.createElement("div");
loader_acoes_lista_de_produtos.classList.add('loader');
loader_acoes_lista_de_produtos.id = 'loader_acoes_lista_de_produtos';


//ordem_alfabetica, ordem_alfabetica_dec, mais_recente, mais_antigo
let ordenacao_da_lista = 'mais_antigo';

//Booleano para indicar se o resultado exibido é uma busca ou não
let indicador_de_busca = false;

class ProdutoParaSerEscrito
{
    constructor(id, codigo, descricao, vl_unitario, un, qtde_disponivel){
        this.id = id;
        this.codigo = codigo;
        this.descricao = descricao, 
        this.vl_unitario = adiciona_virgula_e_duas_casas_para_numero(vl_unitario),
        this.un = un,
        this.qtde_disponivel = qtde_disponivel 
    }

}

inicia_lista_de_produtos();

function inicia_lista_de_produtos()
{   
    produtos__campo_codigo_busca.value = "";
    produtos__campo_descricao_busca.value = "";

    produtos__campo_codigo_busca.classList.remove("borda-destaque");
    produtos__campo_descricao_busca.classList.remove("borda-destaque");

    btn_limpar_busca.classList.remove("display-flex");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "./back-end/buscaProdutos.php");
    xhr.send();
    loader_lista_de_produtos.classList.add("display-flex");
    desabilita_e_adiciona_loader_nos_elementos([
        produtos__campo_codigo_busca,
        produtos__campo_descricao_busca, 
        produtos__select_ordem,
        btn_atualizar_lista_produtos,
        btn_excluir_todos_produtos
    ]);

    xhr.onload = ()=>{
        
        habilita_e_remove_loader_dos_elementos([
            produtos__campo_codigo_busca,
            produtos__campo_descricao_busca, 
            produtos__select_ordem,
            btn_atualizar_lista_produtos,
            btn_excluir_todos_produtos
        ]);

        loader_lista_de_produtos.classList.remove("display-flex");
        
        let produtos = [];

        try{
            produtos = JSON.parse(xhr.responseText);
        }catch{    
            abrir_mensagem_lateral_da_tela("Não foi possível buscar produtos");

            return;
        }

        preenche_banco_ficticio(produtos);

        produtos__select_ordem.value = ordenacao_da_lista;

        produtos = ordenador_de_produtos[ordenacao_da_lista](produtos);

        produtos = formata_produtos(produtos);

        zayDataTable__produtos = new ZayDataTable(
            'produtos',
            tabela_de_produtos,
            {'Código': 'codigo', 'Descrição': 'descricao','Vl unitário': 'vl_unitario','UN': 'un','Qtde disponível': 'qtde_disponivel'},
            'id',
            produtos,
            [
                new AcaoRegistro(btn_aumentar_estoque_produto, abrirModal__aumentarQuantidadeEstoque),
                new AcaoRegistro(btn_editar_produto, abrirModal__editarProduto),
                new AcaoRegistro(btn_excluir_produto, excluir_produto_cadastrado),
            ],
            loader_acoes_lista_de_produtos,
            100,
            'produtos__tabela_lista_de_produtos__trCabecalho',
            'produtos__tabela_lista_de_produtos__trCabecalho__td',
            'produtos__tabela_lista_de_produtos__trProduto',
            'produtos__tabela_lista_de_produtos__trProduto__td',
            'produtos__tabela_lista_de_produtos__mensagem_nenhum_registro_encontrado',
            'lista_de_produtos__nav_paginacao',
            'lista_de_produtos__btn_voltar_e_avancar_pagincao',
            'lista_de_produtos__btn_numero_da_pagina',
            'lista_de_produtos__btn_paginacao_selecionado',
            'vendas__btn_paginacao_desativado',
        );
        
        escreve_quantidade_de_produtos_exibidos_e_total();
        escreve_quantidade_de_unidades_de_produtos();
        
    }

    xhr.onerror = () => {
        habilita_e_remove_loader_dos_elementos([
            produtos__campo_codigo_busca,
            produtos__campo_descricao_busca, 
            produtos__select_ordem,
            btn_atualizar_lista_produtos,
            btn_excluir_todos_produtos
        ]);

        loader_lista_de_produtos.classList.remove("display-flex");

        abrir_mensagem_lateral_da_tela("Não foi possível buscar produtos");

    }
    
}

function formata_produtos(produtos)
{   
    return produtos.map((produto)=>{
        return formata_produto(produto);
    })
}

function formata_produto(produto)
{
    return new ProdutoParaSerEscrito(
        produto.id,
        produto.codigo,
        produto.descricao,
        produto.vl_unitario,
        produto.un,
        produto.qtde_disponivel
    )
}   

function atualiza_lista_de_produtos()
{
    if(!zayDataTable__produtos){
        return;
    }

    produtos__campo_codigo_busca.value = "";
    produtos__campo_descricao_busca.value = "";

    produtos__campo_codigo_busca.classList.remove("borda-destaque");
    produtos__campo_descricao_busca.classList.remove("borda-destaque");

    btn_limpar_busca.classList.remove("display-flex");

    zayDataTable__produtos.limpa_lista();

    loader_lista_de_produtos.classList.add("display-flex");

    desabilita_e_adiciona_loader_nos_elementos([
        produtos__campo_codigo_busca,
        produtos__campo_descricao_busca, 
        produtos__select_ordem,
        btn_atualizar_lista_produtos,
        btn_excluir_todos_produtos
    ]);

    zay_request(
        'GET',
        './back-end/buscaProdutos.php',
        {},
        function(resposta){
            habilita_e_remove_loader_dos_elementos([
                produtos__campo_codigo_busca,
                produtos__campo_descricao_busca, 
                produtos__select_ordem,
                btn_atualizar_lista_produtos,
                btn_excluir_todos_produtos
            ]);

            loader_lista_de_produtos.classList.remove("display-flex");

            let produtos = [];

            try{
                produtos = JSON.parse(resposta);
            }catch{
                
                abrir_mensagem_lateral_da_tela("Não foi possível atualizar lista de produtos!");
                
                //Caso não consiga buscar novos produtos do back-end, reescreve lista com produtos antigos(desatualizados)
                let produtos_antigos = busca_todos_produtos();

                reescreve_produtos_na_lista(produtos_antigos);

                return;
            }
    
            preenche_banco_ficticio(produtos);

            reescreve_produtos_na_lista(produtos);

            escreve_quantidade_de_produtos_exibidos_e_total();
            escreve_quantidade_de_unidades_de_produtos();

        },
        function(){
            habilita_e_remove_loader_dos_elementos([
                produtos__campo_codigo_busca,
                produtos__campo_descricao_busca, 
                produtos__select_ordem,
                btn_atualizar_lista_produtos,
                btn_excluir_todos_produtos
            ]);

            loader_lista_de_produtos.classList.remove("display-flex");

            abrir_mensagem_lateral_da_tela("Não foi possível atualizar lista de produtos!");

            
            //Caso não consiga buscar novos produtos do back-end, reescreve lista com produtos antigos(desatualizados)
            let produtos_antigos = busca_todos_produtos();

            reescreve_produtos_na_lista(produtos_antigos);

        }
    );
}

function reescreve_produtos_na_lista(produtos)
{

    produtos = ordenador_de_produtos[ordenacao_da_lista](produtos);

    zayDataTable__produtos.atualiza_registros(produtos);

    escreve_quantidade_de_produtos_exibidos_e_total();
    escreve_quantidade_de_unidades_de_produtos();
}

function atualiza_lista_de_produtos_sem_nova_requisicao()
{
    let produtos = busca_todos_produtos();

    reescreve_produtos_na_lista(produtos);

}

function escreve_quantidade_de_produtos_exibidos_e_total()
{
    let quantidade_de_resultados = document.querySelector("#quantidade_de_resultados");
    let quantidade_total_de_registros = document.querySelector("#quantidade_total_de_registros");

    quantidade_de_resultados.textContent = zayDataTable__produtos.dados.length;
    quantidade_total_de_registros.textContent = busca_todos_produtos().length;

}

function escreve_quantidade_de_unidades_de_produtos()
{
    let quantidade_de_unidades_de_produtos_resultado = document.querySelector("#quantidade_de_unidades_de_produtos_resultado");
    let quantidade_de_unidades_de_produtos_total =document.querySelector("#quantidade_de_unidades_de_produtos_total");

    let quantidade_resultado = zayDataTable__produtos.dados.reduce((acumulador, produto)=>{
        return Number(produto.qtde_disponivel) + acumulador;
    }, 0);

    let todos_produtos = busca_todos_produtos();
    let quantidade_total = todos_produtos.reduce((acumulador, produto)=>{
        return Number(produto.qtde_disponivel) + acumulador;
    }, 0);

    quantidade_de_unidades_de_produtos_resultado.textContent = quantidade_resultado;
    quantidade_de_unidades_de_produtos_total.textContent = quantidade_total;


}

function recebe_envio_do_form_de_buscar_produto(event)
{
    if(event){
        event.preventDefault();
    }
 
    let codigo_digitado = form_buscar_produto.codigo.value.trim();
    let descricao_digitada = form_buscar_produto.descricao.value.trim();

    if(codigo_digitado.length == 0 && descricao_digitada.length == 0){
        return;
    }

    let produtos_encontrados = [];

    if(codigo_digitado.length == 0) {
        produtos_encontrados = busca_produtos_no_banco_pela_descricao(descricao_digitada);
    }else if(descricao_digitada.length == 0){
        produtos_encontrados = busca_produtos_no_banco_pelo_codigo(codigo_digitado);
    }

    indicador_de_busca = true;
    
    reescreve_produtos_na_lista(produtos_encontrados);

}

//Este é um objeto que armazena as funções para cada ordem, organizando assim faz com que não tenha um monte de if e else, e conseguimos reaproveitar código. Para chamar uma função dela basta: seletor_para_qual_ordem_escrever[funcao]();
const ordenador_de_produtos = {
    ordem_alfabetica: function(produtos){
        //Pega todas as descrições dos produtos
        let array_descricoes = produtos.map((produto)=>{
            return produto.descricao;
        });

        //Ordena as descrições
        let descricoes_ordenadas = array_descricoes.sort();

        let produtos_ordenados = [];

        //Este loop percorrerá por todas as descrições(já ordenadas), dentro dele começa um outro que passará pelo array produtos que recebo como parametro, que fará a verificação se a descrição do produto é igual a descrição atual(do loop de cima), se for, cairá em um outro if que verifica se o produto com essa descrição já foi adicionado no array produtos_ordenados, se ainda não, o produto será adicionado, se já foi, continuará o loop até encontrar um produto com essa descrição que ainda não esteja na lista. Essa verificação (se o produto já foi adicionado no array produtos_ordenados) é nescessária pois sem ela ocorreria o segunite problema: Suponhamos que temos 2 produtos com a mesma descrição FIO ELÉTRICO, mas cada um tem um código e id diferente, se não tivesse essa verificação o produto fio elétrico seria adicionado as duas vezes com o mesmo código e o mesmo id, esse código e id seriam os da primeira ocorrência desse produto no array produtos. Então se tivermos 5 produtos com a mesma descrição, mas com os outros dados diferentes, na hora de preencher o array, os 5 ficariam com os mesmos dados, todos com as informações(id, codigo, tamanho, etc), da primeira ocorrência.
        for(let c = 0; c <= descricoes_ordenadas.length; c++){
            for(let i = 0; i < produtos.length; i++){
                if(produtos[i].descricao == descricoes_ordenadas[c]){
                    if(!produtos_ordenados.includes(produtos[i])){
                        produtos_ordenados.push(produtos[i]);
                    }                  
                }
            }
        }

        return produtos_ordenados;
    },
    ordem_alfabetica_dec: function(produtos){
        //Pega todas as descrições dos produtos da lista
        let array_descricoes = produtos.map((produto)=>{
            return produto.descricao;
        });

        //Ordena as descrições
        let descricoes_ordenadas = array_descricoes.sort();

        let produtos_ordenados = [];


        //Este loop percorrerá por todas as descrições(já ordenadas), dentro dele começa um outro que passará pelo array produtos que recebo como parametro, que fará a verificação se a descrição do produto é igual a descrição atual(do loop de cima), se for, cairá em um outro if que verifica se o produto com essa descrição já foi adicionado no array produtos_ordenados, se ainda não, o produto será adicionado, se já foi, continuará o loop até encontrar um produto com essa descrição que ainda não esteja na lista. Essa verificação (se o produto já foi adicionado no array produtos_ordenados) é nescessária pois sem ela ocorreria o segunite problema: Suponhamos que temos 2 produtos com a mesma descrição FIO ELÉTRICO, mas cada um tem um código e id diferente, se não tivesse essa verificação o produto fio elétrico seria adicionado as duas vezes com o mesmo código e o mesmo id, esse código e id seriam os da primeira ocorrência desse produto no array produtos. Então se tivermos 5 produtos com a mesma descrição, mas com os outros dados diferentes, na hora de preencher o array, os 5 ficariam com os mesmos dados, todos com as informações(id, codigo, tamanho, etc), da primeira ocorrência.
        for(let c = 0; c <= descricoes_ordenadas.length; c++){
            for(let i = 0; i < produtos.length; i++){
                if(produtos[i].descricao == descricoes_ordenadas[c]){
                    if(!produtos_ordenados.includes(produtos[i])){
                        produtos_ordenados.push(produtos[i]);
                    }                  
                }
            }
        }

        return produtos_ordenados.reverse();
    },
    mais_antigo: function(produtos){
        //Esta opção de ordem oredenará do primeiro registro includio na base(mais antigo) para o o ultimo(mais recente). Usa o id, já que ele cresce de acordo com o cadastro de produtos, o mais recente fica com o id maior

        //Pega os ids de todos produtos
        let array_ids = produtos.map((produto)=>{
            return Number(produto.id);
        });

        //Ordenda os ids, de forma crescente.
        let ids_ordenados = array_ids.sort((a, b)=>{
            return a - b;
        });

        //Abastece o array produtos_ordenados_pelo_id buscando o produto no array de produtos. É possível fazer isso já que o id é unico para cada produto, então essa função sempre vai retornar apenas 1 objeto, coisa que não acontece na descrição, pois vários produtos podem ter a mesma.
        let produtos_ordenados_pelo_id = ids_ordenados.map((id)=>{
            return produtos.find((produto)=>{
                return produto.id == id;
            });
        });

        return produtos_ordenados_pelo_id;
    },
    mais_recente: function(produtos){
        //Esta opção de ordem oredenará do ultimo registro(mais recente) para o primeiro includio na base(mais antigo). Usa o id, já que ele cresce de acordo com o cadastro de produtos, o mais recente fica com o id maior

        //Pega os ids de todos produtos
        let array_ids = produtos.map((produto)=>{
            return Number(produto.id);
        });

        //Ordenda os ids, de forma decrescente.
        let ids_ordenados = array_ids.sort((a, b)=>{
            return b - a;
        });

        //Abastece o array produtos_ordenados_pelo_id buscando o produto no array de produtos. É possível fazer isso já que o id é unico para cada produto, então essa função sempre vai retornar apenas 1 objeto, coisa que não acontece na descrição, pois vários produtos podem ter a mesma.
        let produtos_ordenados_pelo_id = ids_ordenados.map((id)=>{
            return produtos.find((produto)=>{
                return produto.id == id;
            });
        });

        return produtos_ordenados_pelo_id;
    }
}

function recebe_seleca_da_ordem_e_reordena_lista()
{
    let valor = event.target.value;

    ordenacao_da_lista = valor;

    reescreve_produtos_na_lista(zayDataTable__produtos.dados);
}

function limpar_busca()
{
    produtos__campo_codigo_busca.value = "";
    produtos__campo_descricao_busca.value = "";

    atualiza_lista_de_produtos_sem_nova_requisicao();

    produtos__campo_codigo_busca.classList.remove("borda-destaque");
    produtos__campo_descricao_busca.classList.remove("borda-destaque");

    btn_limpar_busca.classList.remove("display-flex");

    indicador_de_busca = false;
}