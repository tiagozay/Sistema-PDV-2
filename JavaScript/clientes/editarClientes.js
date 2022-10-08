function abrir_modal_editar_cliente(event)
{
    let id = event.target.dataset.id;

    cliente_para_ser_editado = zayDataTable__clientes.busca_registro_no_array_de_dados_pelo_id(id);

    const service = new EditarClienteService();
    service.abrirEdicao(cliente_para_ser_editado)
        .then( () => {
            //Atualiza clinte na lista
            atualiza_cliente(id);
        } )
        .catch(() => {}); 
}
