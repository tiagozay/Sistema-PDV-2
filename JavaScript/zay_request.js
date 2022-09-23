function zay_request(metodo, caminho, dados, callback_onload, callback_onerror)
{
    
    let string_com_dados = "";

    let xhr = new XMLHttpRequest();

    if(metodo == "POST"){

        for(campo in dados){
            string_com_dados += `${campo}=${dados[campo]}&`;
        }

        xhr.open(metodo, caminho);

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.send(string_com_dados);

    }else if(metodo == "GET"){

        for(campo in dados){
            string_com_dados += `${campo}=${dados[campo]}&`;
        }

        xhr.open(metodo, caminho+"?"+string_com_dados);

        xhr.send(string_com_dados);

    }

    xhr.onload = () => {
        callback_onload(xhr.responseText);
    }

    xhr.onerror = () => {
        callback_onerror(xhr.responseText);
    }
}