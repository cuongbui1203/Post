<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;


/**
 * All Status in App
 */
final class StatusEnum extends Enum
{
    const WaitFDelivery = 1;//
    const RDelivery = 2;////
    const Done = 3;//
    const LeaveTransportPoint = 4;//
    const AtTransportPoint = 5;//
    const AtTransactionPoint = 13;//
    const LeaveTransactionPoint = 14;//
    const Shipping = 6;
    const ToTheTransportPoint = 7;//
    const ToTheTransactionPoint = 8;//
    const Return = 9;//
    const Create = 10;//
    const Complete = 11;//
    const Fail = 12;//
}
