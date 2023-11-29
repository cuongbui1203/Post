<?php

namespace Database\Seeders;

use App\Enums\TypeEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class type extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table("type")->insert(['id'=>TypeEnum::Goods,'name'=> 'Hàng hoá']);
        DB::table("type")->insert(['id'=>TypeEnum::Document,'name'=> 'Tài liệu']);
        DB::table("type")->insert(['id'=>TypeEnum::TransactionPoint,'name'=> 'Điểm giao dịch']);
        DB::table("type")->insert(['id'=>TypeEnum::TransportPoint,'name'=> 'Điểm trung chuyển']);
        DB::table("type")->insert(['id'=>TypeEnum::RegisteredOffice,'name'=> 'Trụ sở công ty']);
        DB::table("type")->insert(['id'=>TypeEnum::Ward,'name'=> 'Ward']);
        DB::table("type")->insert(['id'=>TypeEnum::District,'name'=> 'District']);
        DB::table("type")->insert(['id'=>TypeEnum::Province,'name'=> 'Province']);

    }
}
