var dialogConfirmacoes = document.querySelector("#modal-confirmacoes");
function abrirModalConfirmacao__removerProduto(){
    fecharModal();
    abrirModal();
    dialogConfirmacoes.setAttribute('open', true);
}