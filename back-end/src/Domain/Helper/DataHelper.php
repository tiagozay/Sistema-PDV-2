<?php
    namespace PDV\Domain\Helper;

    abstract class DataHelper
    {

        public static function dataAtual(): string
        {
            $timezone = new \DateTimeZone('America/Sao_Paulo');
            $agora = new \DateTime('now', $timezone);
            $data = $agora->format("Y-m-d H:i:s");

            return $data;
        }

    }

?>