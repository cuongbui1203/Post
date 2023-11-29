<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class UserPermission extends Enum
{
    // boss
    const QuanLyDiemGiaoDichVaTapKet = "QuanLyDiemGiaoDichVaTapKet";
    const QuanLyTKManager = "QuanLyTKManager";


    // manager
    const TaoTKNV = "TaoTKNV";
    
    // employee
    const NhanHang = "NhanHang";
    const TaoDon = "TaoDon";
    const XacNhanDon = "XacNhanDon";

    const ThongKe = "ThongKe";
    
    
}
