<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class UserRole extends Enum
{
    const Guest = 'GUEST';
    const Employee = 'EMPLOYEE';
    const Manager = 'MANAGER';
    const Boss = 'BOSS';
    const Shipper = 'SHIPPER';
}
