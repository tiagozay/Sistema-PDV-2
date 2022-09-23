jQuery(function() {   
    jQuery("#form-vender-produto-avulso__div-input-preco__input").maskMoney({
    prefix:'R$ ', 
    thousands:'.', 
    decimal:','
})

});

jQuery(function() {   
    jQuery("#input-desconto-da-venda__valor").maskMoney({
    prefix:'R$ ', 
    thousands:'.', 
    decimal:','
})

});

jQuery(function() {   
    jQuery("#input-valor-pago-da-venda__valor").maskMoney({
    prefix:'R$ ', 
    thousands:'.', 
    decimal:','
})

});


jQuery(function() {   
    jQuery("#dialog-modal-cadastrar-produto__form__divCampo__input-vlUnitario").maskMoney({
    prefix:'R$ ', 
    thousands:'.', 
    decimal:','
})

});

jQuery(function() {   
    jQuery("#dialog-modal-editar-produto__form__divCampo__input-vlUnitario").maskMoney({
    prefix:'R$ ', 
    thousands:'.', 
    decimal:','
})

});

// jQuery(function() {   
//     jQuery("#modal-informar-quantidade-de-produto__input-quantidade").maskMoney({
//     prefix:'R$ ', 
//     thousands:'.', 
//     decimal:','
// })

// });