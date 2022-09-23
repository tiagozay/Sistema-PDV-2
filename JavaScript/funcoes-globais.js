function $(string_busca){
    return document.querySelector(string_busca);
}

//Inputs maiúsculos
let inputs_maiusculos = document.querySelectorAll(".input_maiusculo");
inputs_maiusculos.forEach( input => input.addEventListener("input", (event)=>{  
    input_maiusculo(event.target);
}));

//Inputs minúsculos
let inputs_minusculos = document.querySelectorAll(".input_minusculo");
inputs_minusculos.forEach( input => input.addEventListener("input", (event)=>{
    input_minusculo(event.target);
}));

//Inputs sem espaços vazios
let inputs_sem_espacos_vazios =  document.querySelectorAll(".input_sem_espaco");
inputs_sem_espacos_vazios.forEach( input => input.addEventListener("input", (event)=>{
    input_sem_espacos_vazios(event.target);
}));

//Inputs que tenham somente numeros
let inputs_so_com_numeros = document.querySelectorAll(".input_somente_com_numeros");
inputs_so_com_numeros.forEach( input => input.addEventListener("input", (event)=>{
    input_somente_com_numeros(event.target);
}));

//Inputs para cpf
let inputs_cpf = document.querySelectorAll(".input_cpf");
inputs_cpf.forEach( input => {

    input.addEventListener("input", (event) => {
        let input = event.target;

        input_sem_espacos_vazios(input);

        let valor_sem_mascara = remove_mascara_cpf(input.value);
        input_somente_com_numeros(input, valor_sem_mascara);

        input.setAttribute("maxlength", 14);
    });

    input.addEventListener("keypress", (event) => {
        let input = event.target;

        input_sem_espacos_vazios(input);

        let valor_digitado = input.value;

        if(valor_digitado.length == 3 || valor_digitado.length == 7){
            input.value += ".";
        }else if(valor_digitado.length == 11){
            input.value += "-";
        }

    });
});

function input_maiusculo(elemento)
{
    let posicao_inicial = elemento.selectionStart;
    let posicao_final = elemento.selectionEnd;
    elemento.value = elemento.value.toUpperCase();
    elemento.selectionStart = posicao_inicial;
    elemento.selectionEnd = posicao_final;
}

function input_minusculo(elemento)
{
    let posicao_inicial = elemento.selectionStart;
    let posicao_final = elemento.selectionEnd;
    elemento.value = elemento.value.toLowerCase();
    elemento.selectionStart = posicao_inicial;
    elemento.selectionEnd = posicao_final;
}

function input_somente_com_numeros(elemento, valor)
{
    if(!verifica_se_valor_tem_somente_numeros(valor)){
        elemento.value = elemento.value.substring(0, elemento.value.length -1);
    }
}

function input_sem_espacos_vazios(elemento)
{
    elemento.value = elemento.value.replace(/\s/g, '');
}

//Outras funções
function formata_cpf(string_cpf)
{
    if(!string_cpf){
        return;
    }
    string_cpf = string_cpf.trim();
    let digitos1 = string_cpf.substr(0, 3);
    let digitos2 = string_cpf.substr(3, 3);
    let digitos3 = string_cpf.substr(6, 3);
    let verificadores = string_cpf.substr(9, 2);

    return digitos1+"."+digitos2+"."+digitos3+"-"+verificadores;
}

function remove_mascara_cpf(cpf)
{
    if(!cpf){
        return;
    }
    cpf = cpf.split('');

    let cpf_sem_mascara = cpf.filter((caractere)=>{
        if(caractere != '.' && caractere != '-'){
            return caractere;
        }
    });

    return cpf_sem_mascara.join('');

}

function verifica_se_valor_tem_somente_numeros(valor)
{
    if(!valor){
        return;
    }

    valor = valor.split("");
    
    let string = valor.find((caractere)=>{
        return isNaN(Number(caractere));
    });

    if(!string){
        return true;
    }

    return false;
}

function valida_cpf(strCPF){
    var Soma;
    var Resto;

    Soma = 0;

    for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

    Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
        return true;
}

function formata_data(string_data)
{
    let somente_data = string_data.split(" ")[0];

    somente_data = somente_data.split("-");

    somente_data.reverse();

    somente_data = somente_data.join("-");

    string_data = `${somente_data} ${string_data.split(" ")[1]}`;

    string_data = string_data.replace('-', '/');
    string_data = string_data.replace('-', '/');
    return string_data.substr(0, string_data.length -3);
}

function formata_data_sem_horario(string_data)
{
    let somente_data = string_data.split(" ")[0];

    somente_data = somente_data.split("-");

    somente_data.reverse();

    somente_data = somente_data.join("-");

    string_data = somente_data;

    string_data = string_data.replace('-', '/');
    string_data = string_data.replace('-', '/');
    return string_data;
}

function adiciona_virgula_e_duas_casas_para_numero(numero)
{
    numero = Number(numero).toFixed(2);

    numero = numero.replace('.', ',');

    return numero;

}

//Faz a conversão de dados vindo do usuário para o javaScript, remove as vírgulas e caractéres especias, converte, e retorna false se o valor passado é inválido
function converte_valor_monetario_para_numero(string)
{
    string = String(string);
    if(string == null){
        return false;
    }

    var string_sem_virgula = string.replace(',', '.');

    var string_com_varios_pontos_sem_cifrao = string_sem_virgula.replace(/[A-Z$]/g,'');

    var string_com_apenas_um_ponto = deixa_string_com_apenas_um_ponto(string_com_varios_pontos_sem_cifrao);

    var numero =  Number(string_com_apenas_um_ponto);
    
    if(isNaN(numero)){
        return false;
    }

    return numero;
}

function deixa_string_com_apenas_um_ponto(string)
{
    var array_caracteres = string.split('');
    var quantidade_de_pontos = 0;
    //Percorre o array de caracteres e conta a quantidade de pontos econtrados
    array_caracteres.forEach(function(caractere){
        if(caractere == '.'){
            quantidade_de_pontos++;
        }
    });
    //Remove elementos que são pontos do array deixando somente um, normalmente o ultimo
    for(let i = 0; i < quantidade_de_pontos-1; i++){
        var posicao_do_ponto = array_caracteres.indexOf('.');
        array_caracteres.splice(posicao_do_ponto, 1);
    }
    //Retorna o array com os elementos juntos
    return array_caracteres.join('');
}


function remove_virgula_e_transforma_para_numero(string)
{   
    string = String(string);

    string = string.replace(',', '.');

    return Number(string);
}



function desabilita_e_adiciona_loader_nos_elementos(array_elementos)
{
    array_elementos.forEach((elemento)=>{
        elemento.classList.add("cursor-loader");
        elemento.setAttribute("disabled", true);
    });
}

function habilita_e_remove_loader_dos_elementos(array_elementos)
{
    array_elementos.forEach((elemento)=>{
        elemento.classList.remove("cursor-loader");
        elemento.removeAttribute("disabled", true);
    });
}

function cria_elemento_dom(nome_elemento, id, conteudo = "", ...classes)
{
    let elemento = document.createElement(nome_elemento);
    elemento.id = id;
    elemento.textContent = conteudo;

    if(classes.length > 0){
        elemento.classList.add(classes);
    }
   

    return elemento;
}