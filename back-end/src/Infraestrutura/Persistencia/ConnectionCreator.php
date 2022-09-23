<?php
    namespace PDV\Infraestrutura\Persistencia;

    require 'credenciais-banco.php';

    class ConnectionCreator
    {
        public static function CreateConnection(): \PDO
        {
            return new \PDO(
                "mysql:host=".HOST.";dbname=".DB_NAME,
                USER,
                PASSWORD
            );
        }
    }

?>