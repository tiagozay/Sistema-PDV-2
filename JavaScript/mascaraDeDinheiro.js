const args = {
    allowNegative: false,
    negativeSignAfter: false,
    prefix: 'R$ ',
    fixed: true,
    fractionDigits: 2,
    decimalSeparator: ',',
    thousandsSeparator: '.',
    cursor: 'move'
};

SimpleMaskMoney.setMask('#form-vender-produto-avulso__div-input-preco__input', args);
SimpleMaskMoney.setMask('#input-desconto-da-venda__valor', args);
SimpleMaskMoney.setMask('#input-valor-pago-da-venda__valor', args);
SimpleMaskMoney.setMask('#dialog-modal-cadastrar-produto__form__divCampo__input-vlUnitario', args);
SimpleMaskMoney.setMask('#dialog-modal-editar-produto__form__divCampo__input-vlUnitario', args);