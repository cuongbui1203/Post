<?php

namespace Database\Seeders;

use App\Enums\UserPermission;
use App\Enums\UserRole;
use DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role as RoleUser;
use Illuminate\Database\Seeder;

class role extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $boss = RoleUser::create(['name' => UserRole::Boss]);
        $manager = RoleUser::create(['name' => UserRole::Manager]);
        $employee = RoleUser::create(['name' => UserRole::Employee]);
        $shipper = RoleUser::create(['name' => UserRole::Shipper]);
        $guest = RoleUser::create(['name'=> UserRole::Guest]);
        foreach(UserPermission::getValues() as $value) {
            Permission::create(['name'=>$value]);
        }
        $boss->givePermissionTo(
            UserPermission::QuanLyDiemGiaoDichVaTapKet,
            UserPermission::QuanLyTKManager,
            UserPermission::ThongKe
        );
        $manager->givePermissionTo(
            UserPermission::TaoTKNV,
            UserPermission::ThongKe
        );
        $employee->givePermissionTo(
            UserPermission::NhanHang, 
            UserPermission::XacNhanDon, 
            UserPermission::TaoDon
        );
    }
}
