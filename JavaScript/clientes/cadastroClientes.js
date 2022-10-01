function abrir_modal_cadastrar_cliente()
{
    const service = new CadastrarClienteService();
    service.abrirCadastro()
    .then( cliente => {
        atualiza_lista_de_clientes();
    } )
}
