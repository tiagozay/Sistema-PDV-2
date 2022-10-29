<?php
    namespace PDV\Domain\Helper;

    use Doctrine\ORM\EntityManager;
    use Doctrine\ORM\ORMSetup;

    require_once __DIR__ . "/../../../vendor/autoload.php";
    require_once __DIR__ . "/../../Infraestrutura/Persistencia/credenciais-banco.php";

    class EntityManagerCreator
    {
        public static function create(): EntityManager
        {
            $config = ORMSetup::createAttributeMetadataConfiguration(
                [__DIR__."/../../"],
                true, 
            );

            $conn = array(
                'driver' => 'pdo_mysql',
                'host' => HOST,
                'dbname' => DB_NAME,
                'user' => USER,
                'password' => PASSWORD,
            );
            
            return EntityManager::create($conn, $config);
        }
    }
?>