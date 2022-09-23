<?php
    require 'credenciais-banco.php';

    namespace PDV\Infraestrutura\Persistencia;

    class ConnectionCreator
    {
        public static function CreateConnection(): \PDO
        {
            return new \PDO("mysql:host=$host;dbname=$db_name", "$user", "$password");
        }
    }


?>