<?php

namespace App\Http\Controllers\api;

use App\Enums\StatusEnum;
use App\Enums\TypeEnum;
use App\Http\Controllers\AddressDetailController;
use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\BienNhan;
use App\Models\BienNhanDetail;
use App\Models\Notification;
use App\Models\WorkPlate;
use App\Rules\CheckAction;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class BienNhanController extends Controller
{
    public function show(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            "id"=> ["required", Rule::exists(BienNhan::class, 'id')]
            ]
        );
        if ($validator->fails()) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $id = $request->id;
        
        $res = BienNhan::where('id', $id)->first();
        
        if(!$res) {
            return $this->sendError("k tim thay bien nhan nao co id ".$id);
        }
        $add = new AddressDetailController();
        $res->addressNgGui->address = $add->getAddress($res->addressNgGui->id);
        $res->addressNgNhan->address = $add->getAddress($res->addressNgNhan->id);
        $res->histories;
        $wpc = new WorkPlateController();
        foreach($res->histories as $v){
            $v->from = $wpc->detailId($v->from_id);
        }
        $res->type;
        // $res->addressNgNhan;
        // $res->addressNgGui;
        // $res->notifications;
        return $this->sendResponse($res, "ok");
    }
    public function store(Request $request)
    {
        $validator = validator(
            $request->all(), [ 
                "idNgGui"=> ["number"],
                "tenNgGui"=>"required",
                "sdtNgGui"=> "required",
                "tenNgNhan"=> "required",
                "sdtNgNhan"=> "required",
                "idType"=> [
                    "required",
                    Rule::in(TypeEnum::Document, TypeEnum::Goods),
                    'numeric'
                ],
                "mass" => "required",
                // "note" =>"required",
                // "ngayGui"=>['required','date'],
                "idTransactionPoint"=>[
                    "required",
                    Rule::exists(WorkPlate::class, "id")
                ],
                "addressIdNgGui" => ["required",Rule::exists("sqlite_vn_map.wards", "code")],
                "addressNgGui" => "required",
                "addressIdNgNhan" => ["required",Rule::exists("sqlite_vn_map.wards", "code")],
                "addressNgNhan" => "required",
                "cod"=>"required|numeric|min:0",
                'action'=>['required',new CheckAction],
            ]
        );
        if ($validator->fails()) {
            return $this->sendError("Validator Error", $validator->errors());
        }
        // $res = BienNhan::create();
        $data = $request->all();
        $addNhan = Address::create(
            [
                "address_id" => $data["addressIdNgNhan"],
                "address"=> $data["addressNgNhan"],
            ]
        );
        $addNhan->save();
        // sdtNgGui
        $addGui = Address::create(
            [
                "address_id" => $data["addressIdNgGui"],
                "address"=>$data["addressNgGui"],
            ]
        );
        $addGui->save();
        
        $bienNhan = BienNhan::create(
            [
            // "idNgGui"=> /*$data["idNgGui"]*/-1,
                "ten_ng_gui"=> $data["tenNgGui"],
                "sdt_ng_gui"=> $data["sdtNgGui"],
                "type_id"=> $data["idType"], 
                "id_address_ng_gui"=>$addGui->id,
                "ten_ng_nhan"=>$data["tenNgNhan"],
                "sdt_ng_nhan"=>$data["sdtNgNhan"],
                "id_address_ng_nhan"=> $addNhan->id,
                "nd"=>$data["nd"],
                // "note"=>$data["note"],
                "mass"=>$data["mass"],
                "ngay_gui"=> Carbon::now()->format('Y-m-d H:i:s'),
                'status_id'=>StatusEnum::Create,
                'cod'=>$data['cod'],
                'action'=>$data['action'],
            ]
        );
        BienNhanDetail::create(
            [
            'id'=>$bienNhan->id,
            'transport_id'=>$request->idTransactionPoint
            ]
        );
        $bienNhan->save();
        
        $notification = new Notification();
        $notification->bien_nhan_id = $bienNhan->id;
        $notification->from_id = $request->idTransactionPoint;
        $notification->to_id = $request->idTransactionPoint;
        $notification->description = 'Tạo Biên Nhận';
        $notification->status_id = StatusEnum::Create;
        $notification->save();
        return $this->sendResponse($bienNhan, "thanh cong");
    }

    public function destroy()
    {
        if(!isset($_GET['id'])) {
            return $this->sendError('k cos id');
        }
        $id = $_GET['id'];
    
        $bn = BienNhan::find($id);
        if(!$bn) { 
            return $this->sendError('k tim thay ban ghi co id '.$id);
        }
        $bn->addressNgGui->delete();
        $bn->addressNgNhan->delete();
        // $bn->detail->delete();
        if($bn->delete()) {
            // if() {
            return $this->sendResponse([], 'thanh cong');
        } else {
            return $this->sendError('that bai');
        }
    }

    public function toTheTransportPoint(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            'idBienNhan'=> 'required',
            'idTransportPoint'=>'required'
            ]
        );
        if($validator->fails()) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $bienNhan = BienNhan::where('id', '=', $request->idBienNhan)->first();
        if(!$bienNhan) {
            return $this->sendError('k tim thay bien nhan co id: '.$request->idBienNhan);
        }
        $detail = BienNhanDetail::where('id', '=', $bienNhan->status_detail_id)->first();
        $detail->status_id = StatusEnum::AtTransportPoint;
        $detail->transport_id = $request->idTransportPoint;
        $detail->save();
        // $bienNhan->save();
        // $bienNhan = BienNhan::where('id', '=', $request->idBienNhan)->first();
        
        return $this->sendResponse($bienNhan, 'thanh cong');
    }
    private function routing(BienNhan $bienNhan)
    {
        $idAddressHT = $bienNhan->statusDetail->transport->address->address_id;
        $vungHt = $bienNhan->statusDetail->transport->vung;
        $capHt = $bienNhan->statusDetail->transport->cap;
        $idAddressN = $bienNhan->addressNgNhan->address_id;
        $status = $bienNhan->status_id;
        // return [$idAddressHT, $vungHt, $capHt, $idAddressN,$status];
        $add = new AddressDetailController();
        
        if($idAddressHT == $idAddressN && $capHt == TypeEnum::Ward) {
            // $bienNhan->statusDetail->status_id = StatusEnum::Shipping;
            // $bienNhan->statusDetail->transport_id = '';
            return "ship";
        }
        if($capHt == TypeEnum::Ward) {
            $res = WorkPlate::where(
                'vung', 
                '=', 
                $add->getCode($idAddressHT, TypeEnum::District)
            )
                ->first();
            return $res->id;
        }
        
        if($capHt == TypeEnum::District) {
            $codeNn = $add->getCode($idAddressN, TypeEnum::District);
            if($codeNn == $vungHt) {
                $res = WorkPlate::where('vung', '=', $idAddressN)->first();
            }else{
                $res = WorkPlate::where('vung', '=', $add->getCode($idAddressHT, TypeEnum::Province))->first();
            }
            return $res->id;
        }

        if($capHt == TypeEnum::Province) {
            if($vungHt == $add->getCode($idAddressN, TypeEnum::Province)) {
                $res = WorkPlate::where('vung', '=', $add->getCode($idAddressN, TypeEnum::District))->first();
            }else{
                $res = WorkPlate::where('vung', '=', $add->getCode($idAddressN, TypeEnum::Province))->first();
            }
            return $res->id;
        }

        $idVungNn = $add->getCode($idAddressHT, TypeEnum::District);
        

        return [$idAddressHT,$idAddressN, $vungHt,$idVungNn,$capHt];
    }

    public function leaveTransportPoint(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            'idBienNhan'=>'required'
            ]
        );
        if($validator->fails()) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $bienNhan = BienNhan::where('id', '=', $request->idBienNhan)->first();
        if(!$bienNhan) {
            return $this->sendError('k the lay bien nhan co id: '.$request->idBienNhan);
        }
        $code = $this->routing($bienNhan);
        $detail = BienNhanDetail::where('id', '=', $bienNhan->status_detail_id)->first();
        if($code == 'ship') {
            $detail->status_id = StatusEnum::Shipping;
            $detail->save();
            $res = (object)array(
                'bienNhan'=> $bienNhan->id,
                // 'nextTransportPoint'=> $code
            );
            return $this->sendResponse($res, "thanh cong");
        }
        $detail->status_id = StatusEnum::LeaveTransportPoint;
        $detail->save();
        $res = (object)array(
            'bienNhan'=> $bienNhan->id,
            'nextTransportPoint'=> $code
        );

        return $this->sendResponse($res, "thanh cong");
    }

    public function shipped(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            "idBienNhan"=> "required",
            ]
        );
        if ($validator->fails()) {
            return $this->sendError("validator Error", $validator->errors());
        }
        $bienNhan = BienNhan::where('id', '=', $request->idBienNhan)->first();
        if(!$bienNhan) {
            return $this->sendError('cannot get info bienNhan id: '. $request->idBienNhan);
        }
        $detail = BienNhanDetail::where('id', '=', $bienNhan->status_detail_id)->first();
        if(!$detail) {
            return $this->sendError('cannot get info bienNhan detail id'. $bienNhan->status_detail_id);
        }
        $detail->status_id = StatusEnum::Done;
        $detail->save();
        return $this->sendResponse($detail, 'Thanh cong');
    }
    public function template()
    {
        return response()->download(Storage::disk('public')->path('template1.docx'));
    }
}
