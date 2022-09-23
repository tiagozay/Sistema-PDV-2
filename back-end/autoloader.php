<?php
    spl_autoload_register(function($caminho){
        $caminho = str_replace('PDV', 'src', $caminho);
        $caminho = str_replace('\\', '/', $caminho);
        $caminho .= '.php';

        if(file_exists($caminho)){
            require_once $caminho;
        }
    });
?>