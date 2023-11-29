<?php

namespace Database\Seeders;

use App\Enums\TypeEnum;
use App\Enums\UserRole;
use App\Http\Controllers\AddressDetailController;
use App\Models\Address;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\WorkPlate;
use Illuminate\Database\Seeder;

class data extends Seeder
{
    private function createAddress($id, $address)
    {
        return Address::create(
            [
            "address_id"=> $id,
            "address"=> $address
            ]
        );
    }

    private function createWorkPlate($name, $address_id,$address,$cap,$type)
    {
        $add = new AddressDetailController();
        $code  = '';
        switch($cap){
        case TypeEnum::Province:
            $code = $add->getCode($address_id, TypeEnum::Province);
            break;
        case TypeEnum::District:
            $code = $add->getCode($address_id, TypeEnum::District);
            break;
        case TypeEnum::Ward:
            $code = $add->getCode($address_id, TypeEnum::Ward);
        }
        return WorkPlate::create(
            [
            "name"=> $name,
            "address_id" => $this->createAddress($address_id, $address)->id,
            "type_id"=> $type,
            "cap"=> $cap,
            "vung"=> $add->getCode($address_id, TypeEnum::Province)
            ]
        );
    }
    // private function createUser($role,$type,$address_id,$address,$cap){

    // }
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $workPlate = $this->createWorkPlate(
            'tru so cong ty',
            '00034',
            'so 1, thanh cong',
            TypeEnum::Province,
            TypeEnum::RegisteredOffice
        );
        $user = User::create(
            [
            'name' => "Giam doc",
            'email' => "admin@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 1')->id,
            ]
        );
        $user->assignRole(UserRole::Boss);
        UserDetail::create(
            [
                'user_id'=> $user->uuid,
                'work_plate_id'=> $workPlate->id,
            ]
        );

        
        // diem giao dich tai dich vong hau
        $workPlate = $this->createWorkPlate(
            'diem giao dich tai dich vong hau hn', 
            '00167', 
            'So 1, Phường Dịch Vọng Hậu', 
            TypeEnum::Ward, 
            TypeEnum::TransactionPoint
        );
        $user = User::create(
            [
            'name' => "quan ly diem giao dich dich vong hau",
            'email' => "manageDvh@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Manager);
        UserDetail::create(
            [
                'user_id'=> $user->uuid,
                'work_plate_id'=> $workPlate->id,
            ]
        );
        $user = User::create(
            [
            'name' => "Giao dich vien diem giao dich dich vong hau",
            'email' => "staffDvh@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Employee);
        UserDetail::create(
            [
                'user_id'=> $user->uuid,
                'work_plate_id'=> $workPlate->id,
            ]
        );
        $user = User::create(
            [
            'name' => "Shipper giao dich dich vong hau",
            'email' => "shipperDvh@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Shipper);
        UserDetail::create(
            [
                'user_id'=> $user->uuid,
                'work_plate_id'=> $workPlate->id,
            ]
        );
        //==============================================//

        // diem chung chuyen dvh
        $workPlate = $this->createWorkPlate(
            'diem chung chuyen Khu vuc Dịch Vọng Hậu hn', 
            '00167', 
            'So 14, Phường Dịch Vọng Hậu', 
            TypeEnum::Ward, 
            TypeEnum::TransportPoint
        );   
        $user = User::create(
            [
            'name' => "quan ly diem chung chuyen dich vong hau",
            'email' => "managetpDvh@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Manager);
        UserDetail::create(
            [
                'user_id'=> $user->uuid,
                'work_plate_id'=> $workPlate->id,
            ]
        );
        $user = User::create(
            [
            'name' => "Nhan vien diem chung chuyen dich vong hau",
            'email' => "stafftpDvh@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Employee);
        UserDetail::create(
            [
                'user_id'=> $user->uuid,
                'work_plate_id'=> $workPlate->id,
            ]
        );     
        //==============================================//

        // diem chung chuyen tai cau giay
        $workPlate = $this->createWorkPlate(
            'diem chung chuyen Khu vuc Cau Giay hn', 
            '00167', 
            'So 14, Phường Dịch Vọng Hậu', 
            TypeEnum::District, 
            TypeEnum::TransportPoint
        );   
        $user = User::create(
            [
            'name' => "quan ly diem chung chuyen Cau Giay",
            'email' => "managetpcg@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Manager);
        UserDetail::create(
            [
                'user_id'=> $user->uuid,
                'work_plate_id'=> $workPlate->id,
            ]
        );
        $user = User::create(
            [
            'name' => "Nhan vien diem chung chuyen Cau Giay",
            'email' => "stafftpcg@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Employee);
        UserDetail::create(
            [
                'user_id'=> $user->uuid,
                'work_plate_id'=> $workPlate->id,
            ]
        ); 
        //===========================//
        // diem chung chuyen tai Ha Noi
        $workPlate = $this->createWorkPlate(
            'diem chung chuyen Khu vuc Ha Noi', 
            '00167', 
            'So 14, Phường Dịch Vọng Hậu', 
            TypeEnum::Province, 
            TypeEnum::TransportPoint
        );   
        $user = User::create(
            [
            'name' => "quan ly diem chung chuyen Ha Noi",
            'email' => "managetphn@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Manager);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        );
        $user = User::create(
            [
            'name' => "Nhan vien diem chung chuyen Ha Noi",
            'email' => "stafftphn@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('00167', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Employee);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        ); 
        //===========================//

        // diem chung chuyen tai Bac Ninh
        $workPlate = $this->createWorkPlate(
            'diem chung chuyen Khu vuc Bac Ninh', 
            '09178', 
            'So 14, Phường Tiền An', 
            TypeEnum::Province, 
            TypeEnum::TransportPoint
        );   
        $user = User::create(
            [
            'name' => "quan ly diem chung chuyen Bac Ninh",
            'email' => "managetpbn@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('09178', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Manager);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        );
        $user = User::create(
            [
            'name' => "Nhan vien diem chung chuyen Bac Ninh",
            'email' => "stafftpbn@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('09178', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Employee);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        ); 
        //===========================//

        //diem chung chuyen tai TP Bac Ninh
        $workPlate = $this->createWorkPlate(
            'diem chung chuyen Khu vuc TP Bac Ninh', 
            '09178', 
            'So 14, Phường Tiền An', 
            TypeEnum::District, 
            TypeEnum::TransportPoint
        );   
        $user = User::create(
            [
            'name' => "quan ly diem chung chuyen TP Bac Ninh",
            'email' => "managetpta@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('09178', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Manager);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        );
        $user = User::create(
            [
            'name' => "Nhan vien diem chung chuyen TP Bac Ninh",
            'email' => "stafftpta@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('09178', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Employee);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        ); 
        //===========================//

        //diem chung chuyen tai Dai phuc
        $workPlate = $this->createWorkPlate(
            'diem chung chuyen Khu vuc Dai phuc', 
            '09181', 
            'So 24, Phường Dai phuc', 
            TypeEnum::Ward, 
            TypeEnum::TransportPoint
        );   
        $user = User::create(
            [
            'name' => "quan ly diem chung chuyen Dai phuc",
            'email' => "managetpdp@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('09178', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Manager);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        );
        $user = User::create(
            [
            'name' => "Nhan vien diem chung chuyen Dai phuc",
            'email' => "stafftpdp@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('09178', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Employee);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        ); 
        //===========================//

        //diem giao dich tai Dai phuc
        $workPlate = $this->createWorkPlate(
            'diem giao dich Khu vuc Dai phuc', 
            '09181', 
            'So 1,Phường Dai phuc', 
            TypeEnum::Ward, 
            TypeEnum::TransactionPoint
        );   
        $user = User::create(
            [
            'name' => "quan ly diem giao dich Dai phuc",
            'email' => "managegddp@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('09178', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Manager);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        );
        $user = User::create(
            [
            'name' => "Nhan vien diem giao dich Dai phuc",
            'email' => "staffgddp@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('09178', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Employee);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        ); 
        $user = User::create(
            [
            'name' => "Shipper diem giao dich Dai phuc",
            'email' => "shippergddp@magicpost.com",
            'password' => '$2y$10$gubG0C3nlG0d2Sk9c1Gmw.OfdIx0gNIiZSSKYhPsM1QDZ5WRROjD.', // 123456
            'phone'=> '0123456789',
            'address_id'=>$this->createAddress('09178', 'so 400')->id,
            ]
        );
        $user->assignRole(UserRole::Shipper);
        UserDetail::create(
            [
            'user_id'=> $user->uuid,
            'work_plate_id'=> $workPlate->id,
            ]
        ); 
        //===========================//

        
    }
}
