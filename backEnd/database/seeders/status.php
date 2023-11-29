<?php

namespace Database\Seeders;

use App\Enums\StatusEnum;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class status extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::WaitFDelivery,
            'description'=> 'Đang chờ lấy hàng',
            'name'=> 'WaitForDelivery',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::RDelivery,
            'description'=> 'Đang vận chuyển',
            'name'=> 'AreDelivery'
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::Done,
            'description'=> 'Xác nhận hoàn thành 1 chặng hoặc 1 phần',
            'name'=>'Done'
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::AtTransportPoint,
            'description'=> 'Đến điểm trung chuyển',
            'name'=> 'AtTransportPoint'
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::LeaveTransportPoint,
            'description'=> 'Rời điểm trung chuyển',
            'name'=> 'LeaveTransportPoint',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::ToTheTransportPoint,
            'description'=> 'Chuyển cho điểm trung chuyển',
            'name'=> 'ToTheTransportPoint',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::ToTheTransactionPoint,
            'description'=> 'Chuyển cho điểm giao dịch',
            'name'=> 'ToTheTransactionPoint',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::Return,
            'description'=> 'Chuyển về cho người gửi',
            'name'=> 'Return',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::Create,
            'description'=> 'Tạo biên nhận',
            'name'=> 'CreateBN',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::Complete,
            'description'=> 'Hoàn thành',
            'name'=> 'Complete',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::Fail,
            'description'=> 'Thất bại',
            'name'=> 'Fail',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::AtTransactionPoint,
            'description'=> 'Ở điểm giao dịch',
            'name'=> 'AtTransactionPoint',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::LeaveTransactionPoint,
            'description'=> 'Rời điểm giao dịch',
            'name'=> 'LeaveTransactionPoint',
            ]
        );
        DB::table("status")->insert(
            [
            'id'=>StatusEnum::Shipping,
            'description'=> 'Shipping',
            'name'=> 'SHIPPING',
            ]
        );
    }
}
