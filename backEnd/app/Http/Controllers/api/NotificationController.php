<?php

namespace App\Http\Controllers\api;

use App\Enums\StatusEnum;
use App\Enums\TypeEnum;
use App\Http\Controllers\AddressDetailController;
use App\Http\Controllers\Controller;
use App\Models\BienNhan;
use App\Models\Notification;
use App\Models\WorkPlate;
use App\Rules\CheckIdBienNhan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public static function createNoti($bien_nhan_id,$from_id,$to_id,$description,$statusId)
    {
        $notification = new Notification();
        $notification->bien_nhan_id = $bien_nhan_id;
        $notification->from_id = $from_id;
        $notification->to_id = $to_id;
        $notification->description = $description;
        $notification->status_id = $statusId;
        $notification->save();
    }
    public function createNotification(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            "idBienNhan"=> ['required', Rule::exists(BienNhan::class, 'id')],
            'idWorkPlateFrom'=>[
            'required',
            Rule::exists(WorkPlate::class, 'id')
            ],
            'idWorkPlateTo'=> [
            'required',
            Rule::exists(WorkPlate::class, 'id')
            ],
            'idStatus'=>[
            'required',
            'numeric',
            Rule::in(
                [
                StatusEnum::ToTheTransactionPoint, 
                StatusEnum::ToTheTransportPoint
                ]
            )
            ],
            'description'=>'required'
            ]
        );
        if ($validator->fails()) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $notification = new Notification();
        $notification->bien_nhan_id = $request->idBienNhan;
        $notification->from_id = $request->idWorkPlateFrom;
        $notification->to_id = $request->idWorkPlateTo;
        $notification->description = $request->description;
        $notification->status_id = StatusEnum::ToTheTransportPoint;
        $notification->save();
        return $this->sendResponse($notification, 'thanh cong');
    }

    public function show($id)
    {
        
        $notification = Notification::where('id', '=', $id)->first();
        $notification->from;
        $notification->to;
        
        if(!$notification) {
            return $this->sendError('k tim thay notification cos id: '. $id);
        }
        return $this->sendResponse($notification, 'ok');
    }

    /**
     * hàm được gọi khi nhan viên xác nhận hàng đến
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toTheTransportPoint(Request $request)
    {
        $validator = \Validator::make(
            $request->all(), [
            'listIdBienNhan'=> ['required',new CheckIdBienNhan],
            ]
        );
        /**
             * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        if($validator->fails()) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $listId = json_decode($request->listIdBienNhan);
        // return $this->sendError('', $listId);
        $res = [];
        foreach($listId as $e){
            $bienNhan = BienNhan::where('id', '=', $e)->first();
            if(!$bienNhan) {
                return $this->sendError('k tim thay bien nhan co id: '.$e);
            }
            $statusIdBn = StatusEnum::AtTransportPoint;
            if($bienNhan->status_id == StatusEnum::Return) {
                $statusIdBn=StatusEnum::Return;
            }else{
                if($user->detail->workPlate->type->id == TypeEnum::TransactionPoint) {
                    $statusIdBn = StatusEnum::AtTransactionPoint;
                } else { $statusIdBn = StatusEnum::AtTransportPoint;
                }
            }
            $detail = $bienNhan->detail;
            $bienNhan->status_id = $statusIdBn;
            $detail->transport_id = $user->detail->workPlate->id;
            $detail->description = "Den ".$user->detail->workPlate->type->name.' '.$user->detail->workPlate->name;
            $statusId = StatusEnum::Done;
            if($bienNhan->histories->last()->status_id === StatusEnum::Create|| $bienNhan->histories->last()->status_id === StatusEnum::Return) {
                $statusId = $bienNhan->histories->last()->status_id;
            } 
            $bienNhan->histories->last()->status_id = $statusId;      
            $bienNhan->histories->last()->save();
            $detail->save();
            $bienNhan->save();
            array_push($res, $bienNhan);
        }
        return $this->sendResponse($res, 'thanh cong');
    }
    private function routing(BienNhan $bienNhan) 
    {
        $idAddressHT = $bienNhan->detail->transport->address->address_id;   // vị trí hiện tại
        $addressHTType = $bienNhan->detail->transport->type->id;            // dang ở khu vực nào 
        $vungHt = $bienNhan->detail->transport->vung;                       //vùng hiện tại
        $capHt = $bienNhan->detail->transport->cap;                         //cap hiện tại
        $idAddressN = $bienNhan->addressNgNhan->address_id;                 //address người nhận
        if($bienNhan->status_id == StatusEnum::Return) {
            $idAddressN = $bienNhan->addressNgGui->address_id;                 //address người nhận
        }

        // return [$idAddressHT, $vungHt, $capHt, $idAddressN, $status,$addressHTType];
        $add = new AddressDetailController();
        
        $ress = (object)array(
        'success'=>false,
        'type'=>"", // ship, transport,''
        'payload'=>"" // '' | idWorkPlate
        );

        if($idAddressHT == $idAddressN 
            && $capHt == TypeEnum::Ward 
            && $addressHTType == TypeEnum::TransactionPoint
        ) {
            // $bienNhan->statusDetail->status_id = StatusEnum::Shipping;
            // $bienNhan->statusDetail->transport_id = '';
            $ress->success = true;
            $ress->type = 'ship';
            return $ress;
        }

        // $vungHt
        if($addressHTType == TypeEnum::TransactionPoint) {
            $res = WorkPlate::where(
                'vung', 
                '=', 
                $vungHt
            )->where('cap', '=', TypeEnum::Ward)
                ->where('type_id', '=', TypeEnum::TransportPoint)
                ->first();
                $ress->success = true;
                $ress->type = 'transport';
                $ress->payload = $res->id;
                return $ress;
        }
        if($capHt == TypeEnum::Ward) {
            $res = WorkPlate::where(
                'vung', 
                '=', 
                $vungHt
            )->where('cap', '=', TypeEnum::District)
                ->where('type_id', '=', TypeEnum::TransportPoint)
                ->first();
                $ress->success = true;
                $ress->type = 'transport';
                $ress->payload = $res->id;
                return $ress;
        }
        
        if($capHt == TypeEnum::District) {
            $vungNn = $add->getCode($idAddressN, TypeEnum::Province);
            if($vungNn == $vungHt) {
                $res = WorkPlate::where('vung', '=', $vungNn)
                    ->where('cap', '=', TypeEnum::Ward)
                    ->where('type_id', '=', TypeEnum::TransportPoint)
                    ->first();
            }else{
                $res = WorkPlate::where('vung', '=', $vungHt)
                    ->where('cap', '=', TypeEnum::Province)
                    ->where('type_id', '=', TypeEnum::TransportPoint)
                    ->first();
            }
            $ress->success = true;
            $ress->type = 'transport';
            $ress->payload = $res->id;
            return $ress;
        }

        if($capHt == TypeEnum::Province) {
            $vungNn = $add->getCode($idAddressN, TypeEnum::Province);

            if($vungHt == $vungNn) {
                $res = WorkPlate::where('vung', '=', $vungNn)
                    ->where('cap', '=', TypeEnum::District)
                    ->where('type_id', '=', TypeEnum::TransportPoint)
                    ->first();
            }else{
                $res = WorkPlate::where('vung', '=', $vungNn)
                    ->where('cap', '=', TypeEnum::Province)
                    ->where('type_id', '=', TypeEnum::TransportPoint)
                    ->first();
            }
            $ress->success = true;
            $ress->type = 'transport';
            $ress->payload = $res->id;
            return $ress;
        }
        return $ress;
    }

    /**
     * Rời khỏi điểm hiện tại để đến 1 điểm khác
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function leaveTransportPoint(Request $request)
    {
        $validator = \Validator::make(
            $request->all(), [
            'listIdBienNhan'=>['required',new CheckIdBienNhan],
            ]
        );
        if($validator->fails()) {
            return $this->sendError('validator Error', $validator->errors());
        }

        $res = [];
        $listIdBienNhan = json_decode($request->listIdBienNhan);
        // return $this->sendResponse($listIdBienNhan, "");
        $add = new AddressDetailController();
        
        /**
             * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        $idWorkPlateHt = $user->detail->work_plate_id;
        foreach($listIdBienNhan as $idBienNhan){
            $bienNhan = BienNhan::where('id', '=', $idBienNhan)->first();
            if(!$bienNhan) {
                return $this->sendError('k the lay bien nhan co id: '.$idBienNhan);
            }
            $code = $this->routing($bienNhan);
            if(!$code->success) {
                $this->sendError("routing Error");
            }
            if($code->type === 'ship') { 
                BienNhan::where('id', $idBienNhan)->update(['status_id'=>StatusEnum::Shipping]);
                $bienNhan = BienNhan::where('id', $idBienNhan)
                    ->select(
                        [
                        'id',
                        DB::raw('ten_ng_nhan as tenNgNhan'),
                        DB::raw('sdt_ng_nhan as sdtNgNhan'),
                        DB::raw('id_address_ng_nhan as addressNgNhan')]
                    )
                    ->first();
                $bienNhan->addressNgNhan = $add->getAddress($bienNhan->addressNgNhan);
                // $bienNhan->type;
                
                Notification::create(
                    [
                    "bien_nhan_id" => $idBienNhan,
                    "from_id" =>$user->detail->workPlate->id,
                    "to_id" => $user->detail->workPlate->id,
                    'status_id' => StatusEnum::Shipping,
                    "description" => "Đang ship",
                    ]
                );
                array_push(
                    $res, [
                    'bienNhan'=>$bienNhan,
                    'to'=>(object)['name'=>'ship']
                    ]
                );
                // return $this->sendResponse((object)['name'=>'ship'], 'dua cho shipper');
            }else{
                $workPlate = WorkPlate::where("id", $code->payload)
                ->select("name", DB::raw("address_id as address"), DB::raw("type_id as type"))
                ->first();
                if (!$workPlate) {
                    return $this->sendError("k the lay du lieu work plate co id ". $code->payload);
                }
                $workPlate['address'] = $add->getAddress($workPlate['address']);
                $workPlate['type'] = DB::table('type')->where('id', $workPlate['type'])->first();
            
                $bienNhan = BienNhan::where('id', $idBienNhan)
                    ->select(
                        [
                        'id',
                        DB::raw('ten_ng_nhan as tenNgNhan'),
                        DB::raw('sdt_ng_nhan as sdtNgNhan'),
                        DB::raw('id_address_ng_nhan as addressNgNhan')]
                    )
                    ->first();

                $bienNhan->addressNgNhan = $add->getAddress($bienNhan->addressNgNhan);
                $statusId = $workPlate->type->id ===TypeEnum::TransportPoint ? StatusEnum::ToTheTransportPoint : StatusEnum::ToTheTransactionPoint;
                // $bienNhan->type;
                // $noti = $bienNhan->histories->last();
                // return $this->sendResponse($noti->status_id !== StatusEnum::Return, 'q');
                if($bienNhan->histories->last()->status_id != StatusEnum::Create
                    && $bienNhan->histories->last()->status_id != StatusEnum::Return
                ) {
                    $bienNhan->histories->last()->status_id = StatusEnum::Done;
                }
                $bienNhan->histories->last()->save();
                $bienNhan->detail->transport_id =  $idWorkPlateHt;
                Notification::create(
                    [
                    "bien_nhan_id" => $idBienNhan,
                    "from_id" =>$user->detail->workPlate->id,
                    "to_id" => $code->payload,
                    'status_id' => $statusId,
                    "description" => "Được chuyển tới ".$workPlate->type->name.' '.$workPlate->name,
                    ]
                );
                array_push(
                    $res, [
                    'bienNhan'=>$bienNhan,
                    'to'=>$workPlate
                    ]
                );
            }
        }
        return $this->sendResponse($res, "ok");
    }
    public function createReturnNotification(Request $request)
    {
        $validator = \Validator::make(
            $request->all(),
            [
            "idBienNhan"=> ["required",Rule::exists("bien_nhan", "id")],
            ]
        );
        if($validator->fails()) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $add = new AddressDetailController();
        
        $bienNhan = BienNhan::where('id', '=', $request->idBienNhan)->first();
        $bienNhan->status_id = StatusEnum::Return;
        // $notification = $bienNhan->notifications->last();
        // $notification->status_id = StatusEnum::Done;
        // $notification->save();
        /**
             * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        $idWorkPlateHt = $user->detail->work_plate_id;
        if(!$bienNhan) {
            return $this->sendError('k the lay bien nhan co id: '.$request->idBienNhan);
        }
        $code = $this->routing($bienNhan);
        if(!$code->success) {
            $this->sendError("routing Error");
        }
        if($code->type === 'ship') { 
            BienNhan::where('id', $request->idBienNhan)->update(['status_id'=>StatusEnum::Shipping]);
            $bienNhan = BienNhan::where('id', $request->idBienNhan)
                ->select(
                    [
                    'id',
                    DB::raw('ten_ng_nhan as tenNgNhan'),
                    DB::raw('sdt_ng_nhan as sdtNgNhan'),
                    DB::raw('id_address_ng_nhan as addressNgNhan')]
                )
                ->first();
            $bienNhan->addressNgNhan = $add->getAddress($bienNhan->addressNgNhan);
            // $bienNhan->type;
            
            Notification::create(
                [
                "bien_nhan_id" => $request->idBienNhan,
                "from_id" =>$user->detail->workPlate->id,
                "to_id" => $user->detail->workPlate->id,
                'status_id' => StatusEnum::Shipping,
                "description" => "Đang ship",
                ]
            );
           
            // return $this->sendResponse((object)['name'=>'ship'], 'dua cho shipper');
        }else{
            $workPlate = WorkPlate::where("id", $code->payload)
            ->select("name", DB::raw("address_id as address"), DB::raw("type_id as type"))
            ->first();
            if (!$workPlate) {
                return $this->sendError("k the lay du lieu work plate co id ". $code->payload);
            }
            $add = new AddressDetailController();
            $workPlate['address'] = $add->getAddress($workPlate['address']);
            $workPlate['type'] = DB::table('type')->where('id', $workPlate['type'])->first();
        
            $bienNhan = BienNhan::where('id', $request->idBienNhan)
                ->select(
                    [
                    'id',
                    DB::raw('ten_ng_nhan as tenNgNhan'),
                    DB::raw('sdt_ng_nhan as sdtNgNhan'),
                    DB::raw('id_address_ng_nhan as addressNgNhan')]
                )
                ->first();

            $bienNhan->addressNgNhan = $add->getAddress($bienNhan->addressNgNhan);
            // $statusId = $workPlate->type->id ===TypeEnum::TransportPoint ? StatusEnum::ToTheTransportPoint : StatusEnum::ToTheTransactionPoint;
            // $bienNhan->type;
            // if($bienNhan->histories->last()->status_id != StatusEnum::Create) {
            //     $bienNhan->histories->last()->status_id = StatusEnum::Done;
            // }
            // $bienNhan->histories->last()->save();
            $bienNhan->detail->transport_id =  $idWorkPlateHt;
            Notification::create(
                [
                "bien_nhan_id" => $request->idBienNhan,
                "from_id" =>$user->detail->workPlate->id,
                "to_id" => $code->payload,
                'status_id' => StatusEnum::Return,
                "description" => "Trả lại ".$workPlate->type->name.' '.$workPlate->name,
                ]
            );
        }
        return $this->sendResponse($bienNhan, 'thanh cong');
    }

    /**
     * nhan vien diem giao dich xac nhan hoan thanh hoac that bai cho bien Nhan
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function completeBienNhan(Request $request)
    {
        $validator = \Validator::make(
            $request->all(),
            [
                "idBienNhan"=> ["required",Rule::exists("bien_nhan", "id")],
                'status'=>['required',
                    Rule::in(StatusEnum::Fail, StatusEnum::Complete),
                    'numeric'
                ]
            ]
        );

        if($validator->fails()) {
            return $this->sendError('validator Error', $validator->errors());
        }
        /**
         * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        $workPlate = $user->detail->workPlate;
        $bienNhan = BienNhan::where('id', '=', $request->idBienNhan)->first();
        $bienNhan->status_id = $request->status;
        $noti = $bienNhan->histories->last();
        $noti->status_id = $noti->status_id === StatusEnum::Shipping ? StatusEnum::Fail:$noti->status_id;
        $noti->save();
        $bienNhan->save();
        Notification::create(
            [
            "bien_nhan_id" => $request->idBienNhan,
            "from_id" =>$workPlate->id,
            "to_id" => $workPlate->id,
            'status_id' => StatusEnum::Fail,
            "description" => 'Giao Hàng thất bại',
            ]
        );
        return $this->sendResponse($bienNhan, 'Thanh cong');
    }
}