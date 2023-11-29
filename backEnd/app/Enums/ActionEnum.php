<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ActionEnum extends Enum
{
    /**
     * chuyen hoan ngay
     */
    const ReturnNow = 'RETURN_NOW';
    /**
     * chuyen hoan trc ngay
     */
    const ReturnBefore='RETURN_BEFORE';
    /**
     * chuyen hoan khi het han
     */
    const Return='RETURN';
    /**
     * goi dien cho ng gui/bc gui
     */
    const Call='CALL';
}
