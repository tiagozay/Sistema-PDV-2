<?php
// bin/doctrine

use Doctrine\ORM\Tools\Console\ConsoleRunner;
use Doctrine\ORM\Tools\Console\EntityManagerProvider\SingleManagerProvider;
use PDV\Domain\Helper\EntityManagerCreator;

require_once __DIR__ . '/../vendor/autoload.php';

ConsoleRunner::run(
    new SingleManagerProvider(EntityManagerCreator::create())
);