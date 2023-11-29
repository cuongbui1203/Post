<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;


final class TypeEnum extends Enum
{
    const Document = 1;
    const TransportPoint = 2;
    const TransactionPoint = 3;
    const RegisteredOffice = 8;
    const Goods = 4;
    const Ward = 5;
    const District = 6;
    const Province = 7;
}
