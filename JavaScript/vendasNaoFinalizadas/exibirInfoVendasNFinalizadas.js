function exibir_informacoes_venda_nao_finalizada(event)
{
    let id = event.target.dataset.id;

    let dialog  = document.querySelector("#dialog-modal-informacoes_venda");

    dialog.setAttribute("open", true);
    dialog.dataset.nome = 'informacoes_venda';

    abrirModal();

    let corpo_informacoes = document.querySelector("#modal-informacoes_venda__corpo");

    let loader = document.querySelector("#loader_informacoes_venda");

    let $campo__nome_cliente = document.querySelector("#modal-informacoes_venda__nome-cliente__valor");
    let $campo__cpf_cliente = document.querySelector("#modal-informacoes_venda__cpf-cliente__valor");
    let $campo__data = document.querySelector("#modal-informacoes_venda__data__valor");

    let tbody_lista_de_produtos = document.querySelector("#modal-informacoes_venda__informacoes__produtos__tabela__tbody");

    let $campo__qtde_itens = document.querySelector("#modal-informacoes_venda__corpo__informacoes-finais_qtde_itens");
    let $campo__valor_total = document.querySelector("#modal-informacoes_venda__corpo__informacoes-finais_valor_total");
    let $campo__desconto = document.querySelector("#modal-informacoes_venda__corpo__informacoes-finais_desconto");
    let $campo__valor_com_desconto = document.querySelector("#modal-informacoes_venda__corpo__informacoes-finais__divInput__valor_com_desconto");
    let $campo__valor_pago = document.querySelector("#modal-informacoes_venda__corpo__informacoes-finais__divInput__valor_pago");
    let $campo__troco = document.querySelector("#modal-informacoes_venda__corpo__informacoes-finais__divInput__troco");

    tbody_lista_de_produtos.innerHTML = ""; 
    

    let venda = {};

    corpo_informacoes.classList.add("display-none");
    loader.classList.remove("display-none");

    zay_request(
        'POST',
        './back-end/buscaVendaNaoFinalizadaComProdutos.php',
        {id},
        function(resposta){
            loader.classList.add("display-none");
            corpo_informacoes.classList.remove("display-none");
          
            try{
                resposta = JSON.parse(resposta);
            }catch{
                fecha_modal_informacoes_venda();
                abrir_mensagem_lateral_da_tela("Não foi possível buscar as informações!");
                return;
            }
            
            venda = resposta;
            
            console.log(venda);

            $campo__nome_cliente.textContent = venda.cliente.nome == null ? "Não informado" : venda.cliente.nome;
            $campo__cpf_cliente.textContent = venda.cliente.cpf == null ? "Não informado" : formata_cpf (venda.cliente.cpf);
            $campo__data.textContent = formata_data(venda.data_registro);

            venda.produtos.forEach((produto)=>{
                tbody_lista_de_produtos.innerHTML += 
                `
                    <tr id="modal-informacoes_venda__informacoes__produtos__tabela__tbody__trProduto">
                        <td>${produto.codigo}</td>
                        <td>${produto.descricao}</td>
                        <td>${produto.un}</td>
                        <td>${produto.qtde}</td>
                        <td>${adiciona_virgula_e_duas_casas_para_numero(produto.vl_unitario)}</td>
                        <td>${adiciona_virgula_e_duas_casas_para_numero(produto.vl_total)}</td>
                    </tr>
                `
            });

            $campo__qtde_itens.textContent = venda.qtde_itens;
            $campo__valor_total.textContent = "R$ "+adiciona_virgula_e_duas_casas_para_numero(venda.total);
            $campo__desconto.textContent = "R$ "+adiciona_virgula_e_duas_casas_para_numero(venda.desconto);
            $campo__valor_com_desconto.textContent = "R$ "+adiciona_virgula_e_duas_casas_para_numero(venda.total_com_desconto);
            $campo__valor_pago.textContent = "R$ "+adiciona_virgula_e_duas_casas_para_numero(venda.valor_pago);
            $campo__troco.textContent = "R$ "+adiciona_virgula_e_duas_casas_para_numero(venda.troco);

        },
        function(){
            loader.classList.add("display-none");
            corpo_informacoes.classList.remove("display-none");
            fecha_modal_informacoes_venda();
            abrir_mensagem_lateral_da_tela("Não foi possível buscar as informações!");
        }
    );
}

