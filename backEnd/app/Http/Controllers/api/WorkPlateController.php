<?php

namespace App\Http\Controllers\api;

use App\Enums\StatusEnum;
use App\Enums\TypeEnum;
use App\Http\Controllers\AddressDetailController;
use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\WorkPlate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class WorkPlateController extends Controller
{
   
    public function getAllWP(Request $request)
    {
        $add = new AddressDetailController();
        $wps = WorkPlate::select('id', 'name', DB::raw('address_id as address'))->get();
        $res = array();
        foreach($wps as $e){
            $e['address'] = $add->getAddress($e['address']);
            array_push(
                $res, 
                $e
            );
        }
        return $this->sendResponse($res, "ok");
    }

    public function detail(Request $request)
    {
        $validator = \Validator::make(
            $request->all(), [
            "id"=> ['required',Rule::exists(WorkPlate::class, 'id')],
            ]
        );
        if($validator->fails() ) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $id = $request->id;
        $res = WorkPlate::where("id", $id)
            ->select("name", DB::raw("address_id as address"), DB::raw("type_id as type"))
            ->first();
        if (!$res) {
            return $this->sendError("k the lay du lieu work plate co id ". $id);
        }
        $add = new AddressDetailController();
        $res['address'] = $add->getAddress($res['address']);
        $res['type'] = DB::table('type')->where('id', $res['type'])->first();
        $res['id'] = $id;
        if (!$res) {
            return $this->sendError([], "cannot find the workplace have id: ".$id);
        }
        return $this->sendResponse($res, "test");
    }
    public function detailId(string $request)
    {
        $id = $request;
        $res = WorkPlate::where("id", $id)
            ->select("name", DB::raw("address_id as address"), DB::raw("type_id as type"))
            ->first();
        if (!$res) {
            return $this->sendError("k the lay du lieu work plate co id ". $id);
        }
        $add = new AddressDetailController();
        $res['address'] = $add->getAddress($res['address']);
        $res['type'] = DB::table('type')->where('id', $res['type'])->first();
        $res['id'] = $id;
        if (!$res) {
            return null;
        }
        return $res;
    }


    public function update(Request $request)
    {
        $validator = \Validator::make(
            $request->all(), [
                "id"=> ['required',Rule::exists(WorkPlate::class, 'id')],
                'type_id'=>[Rule::in(TypeEnum::TransactionPoint, TypeEnum::TransportPoint)],
                'cap'=>[Rule::in(TypeEnum::District, TypeEnum::Ward, TypeEnum::Province)]
            ]
        );
        if($validator->fails() ) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $id = $request->id;
        $add_id = WorkPlate::where('id', $id)->first()->address_id;
        if(isset($request->address)) {
            Address::where('id', '=', $add_id)
                ->update(
                    [
                    'address'=> $request->address,
                    ]
                );
        }
        if(isset($request->address_id)) {
            Address::where('id', '=', $add_id)
                ->update(
                    [
                    'address_id'=> $request->address_id,
                    ]
                );
            
            WorkPlate::where('id', '=', $id)->update(
                [
                'vung'=> (new AddressDetailController())
                    ->getCode($request->address_id, TypeEnum::Province)
                ]
            );
        }
        $data = $request->only(['name','type_id','cap']);
        $res = WorkPlate::where('id', '=', $id)->update($data);
        return $this->sendResponse($res, 'ok');
    }

    public function destroy(Request $request)
    {
        $validator = \Validator::make(
            $request->all(), [
            "id"=> ['required',Rule::exists(WorkPlate::class, 'id')],
            ]
        );
        if($validator->fails() ) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $id = $request->id;
        $res = WorkPlate::destroy($id);
        if ($res) {
            return $this->sendResponse([], "thanh cong");
        } else {
            return $this->sendError('error');
        }
    }

    public function create(Request $request)
    {
        $validate = \Validator::make(
            $request->all(), [
                "name"=> "required",
                "addressId"=> ["required",Rule::exists("sqlite_vn_map.wards", "code")],

                "address"=> "required",
                "idType" => [
                    "required",
                    Rule::in(TypeEnum::TransactionPoint, TypeEnum::TransportPoint),

                ],
                'cap'=>[
                    'required',
                    Rule::in(TypeEnum::Ward, TypeEnum::District, TypeEnum::Province),
                ],
                // 'vung'=>'required|numeric',
            ]
        );
        if($validate->fails() ) {
            return $this->sendError("loi validate", $validate->errors());
        }
        $add = new AddressDetailController();
        $address = Address::create(
            [
            'address_id' => $request->addressId,
            'address' => $request->address,
            ]
        );
        $workPlate = WorkPlate::create(
            [
            "name"=> $request->name,
            'address_id'=> $address->id,
            "type_id"=> $request->idType,
            "vung"=> $add->getCode($request->addressId, TypeEnum::Province),
            'cap'=> $request->cap
            ]
        );
        return $this->sendResponse($workPlate, "thanh cong");
    }

    public function search(Request $request)
    {
        $add = new AddressDetailController();
        $validator = \Validator::make(
            $request->all(), [
            "vung"=> ["required",Rule::exists("sqlite_vn_map.provinces", "code")],
            "type"=>["required",Rule::in(TypeEnum::TransactionPoint, TypeEnum::TransportPoint)],
            ]
        );
        if($validator->fails()) {
            return $this->sendError("validator Error", $validator->errors());
        }
        $res = WorkPlate::where("vung", '=', $request->vung)
        ->where('type_id', '=', $request->type)
        ->get();
        if($res->count() > 0) {
            foreach( $res as $e ) {
                $e->{"address"} = $add->getAddress($e->address_id);

            }
        }
        return $this->sendResponse($res, 'thanh cong');
    }
    
}
