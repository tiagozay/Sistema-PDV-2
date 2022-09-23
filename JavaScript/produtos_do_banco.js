//Array que tem os mesmos dados do banco, é atualizado constantemente assíncrinamente
var banco_ficticio = [];
    

function preenche_banco_ficticio(array_produtos)
{
    banco_ficticio = array_produtos;
}

atualiza_array_de_produtos_do_banco__async();
function atualiza_array_de_produtos_do_banco__async()
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./back-end/buscaProdutos.php");    
    xhr.send();
    xhr.onload = function(){
        try{
            let produtos = JSON.parse(xhr.responseText);
            preenche_banco_ficticio(produtos)
        }catch{}

    }
}

// atualiza_array_de_produtos_do_banco__sync();
function atualiza_array_de_produtos_do_banco__sync()
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./back-end/buscaProdutos.php", false);    
    xhr.send();
    banco_ficticio = JSON.parse(xhr.responseText);
}


// setInterval(atualiza_array_de_produtos_do_banco, 15000);

function busca_todos_produtos()
{
    return banco_ficticio;
}

function busca_produto_no_banco_pelo_id(id)
{       
    let produto_encontrado = banco_ficticio.find((produto)=>{
        return produto.id == id;
    });

    return produto_encontrado;
}

function busca_um_produto_no_banco_pelo_codigo(codigo)
{
    let produto_encontrado = banco_ficticio.find((produto)=>{
        return produto.codigo == codigo;
    });

    return produto_encontrado;
}

function busca_produtos_no_banco_pelo_codigo(codigo)
{   
    let produtos_encontrados = banco_ficticio.filter((produto)=>{
        let reg = new RegExp(codigo);
        return reg.test(produto.codigo);
    })
    
    return produtos_encontrados;
}


function busca_produtos_no_banco_pela_descricao(descricao)
{
    let produtos_encontrados = banco_ficticio.filter((produto)=>{
        let reg = new RegExp(descricao, 'i');
        return reg.test(produto.descricao);
    }); 

    return produtos_encontrados;
}
