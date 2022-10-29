<?php
    namespace PDV\Domain\Helper;

    use DateTime;

    abstract class DataHelper
    {

        public static function dataAtual(): DateTime
        {
            $timezone = new \DateTimeZone('America/Sao_Paulo');
            $agora = new DateTime('now', $timezone);

            return $agora;
        }

    }

?>