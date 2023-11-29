<?php

namespace App\Http\Controllers\api;
use App\Enums\StatusEnum;
use App\Enums\TypeEnum;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\BienNhan;
use App\Models\Notification;
use App\Models\WorkPlate;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
class ThongKeController extends Controller
{
    private function generateDateRange(Carbon $start_date, Carbon $end_date)
    {
        $dates = [];
    
        for($date = $start_date->copy(); $date->lte($end_date); $date->addDay()) {
            $dates[] = $date->format('Y-m-d');
        }
    
        return $dates;
    }
    /**
     * gateway cho cac yeu cau thong ke
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse | void
     */
    public function thongKe(Request $request)
    {
         /**
        * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        /**
         * @var \App\Models\WorkPlate $workPlate
         */
        $workPlate = $user->detail->workPlate;
        
        switch ($user->getRoleNames()->first()){
        case UserRole::Employee:
            if($workPlate->type->id === TypeEnum::TransactionPoint) {
                return $this->ThongKeHangGDV($request);
            }else{
                return $this->sendError("don't have permission");
            }

        case UserRole::Manager:
            if($workPlate->type->id === TypeEnum::TransportPoint) {
                return $this->ThongKeQL2($request);
            } else {
                return $this->ThongKeQL($request);

            }
        case UserRole::Boss:
            // return $this->sendError("don't have permission");
            return $this->ThongKeBoss($request);
        }
    }

    private function ThongKeTheoNgay(array $dates)
    {
        $res = [];
        foreach($dates as $d){
            $res[$d] = [];
            $date = new Carbon($d);
            $query = DB::table(DB::raw('notification_magic_post n'))
            // ->join(DB::raw('bien_nhan bn'), 'n.bien_nhan_id', 'bn.id');
                ->join(DB::raw('work_plate w'), 'w.id', 'n.from_id')
                ->whereDate(DB::raw('n.updated_at'), '=', $date)
                ->where('w.type_id', TypeEnum::TransportPoint);
                // ->whereDate(DB::raw('n.updated_at'), '<=', $end)
                // ->groupBy(DB::raw("DATE_FORMAT(n.updated_at,'%Y-%m-%d')"));

            // ->where('n.from_id', $idWorkPlate) /// hang di
            $query->where(
                function ($query) {
                    $query->where(DB::raw('n.status_id'), StatusEnum::ToTheTransportPoint)
                        ->orWhere(DB::raw('n.status_id'), StatusEnum::Done)
                        ->orWhere(DB::raw('n.status_id'), StatusEnum::ToTheTransactionPoint);
                }
            );
            $query2 =DB::table(DB::raw('notification_magic_post n'))
            // ->join(DB::raw('bien_nhan bn'), 'n.bien_nhan_id', 'bn.id');
                ->join(DB::raw('work_plate w'), 'w.id', 'n.to_id')
                ->whereDate(DB::raw('n.updated_at'), '=', $date)
                ->where('w.type_id', TypeEnum::TransportPoint)
                // ->whereDate(DB::raw('n.updated_at'), '<=', $end)
                // ->where('n.to_id', $idWorkPlate) 
                ->where(
                    function ($query) {
                        $query->where(DB::raw('n.status_id'), StatusEnum::Done);
                    }
                );
            array_push(
                $res[$d], [
                'hangGui'=>$query->select(DB::raw('count(*) as hangGui'))->first()->hangGui,
                'hangNhan'=>$query2->select(DB::raw('count(*) as hangNhan'))->first()->hangNhan,
                ]
            );
        }
        return $res;
    }

    private function ThongKeBoss(Request $request)
    {
        $validator = validator(
            $request->all(), [
            'timeStart'=>"required|date",
            'timeEnd'=>'required|date',
            'type' =>['required',Rule::in('all', 'transport', 'transaction', 'none')]
            ]
        );

        if($validator->fails()) {
            return $this->sendError("Validator Error", $validator->errors());
        }
        /**
        * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        // $idWorkPlate = $user->detail->work_plate_id;
        $start = Carbon::parse($request->timeStart);
        $end = Carbon::parse($request->timeEnd);
        $dates = $this->generateDateRange($start, $end);
        // return $this->sendResponse($dates, '');
        // hang di
        if($request->type === 'none') {
            $res = $this->ThongKeTheoNgay($dates);
        }
        else{
            // $res = 
            $res = $this->ThongKeTheoWP($start, $end, $request->type);
        }
        // array_push($res, $this->ThongKeTheoWP($request->type));
        
        return $this->sendResponse($res, 'oc');
    }

    private function ThongKeTheoWP(Carbon $dateStart,Carbon $dateEnd,string $type)
    {
        $res = [];
        $listWP = WorkPlate::select("id", 'name')
            ->where('type_id', "!=", TypeEnum::RegisteredOffice);
        if($type != 'all') {
            $listWP=$listWP->where('type_id', $type == 'transport' ? TypeEnum::TransportPoint:TypeEnum::TransactionPoint);
        }
        $listWP=$listWP->get();
        
        $res['labels'] = $listWP;
        $res['data'] = [];
        foreach($listWP as $e){
            $res['data'][$e->id] = [];
            $query = DB::table(DB::raw('notification_magic_post n'))
                ->whereDate(DB::raw('n.updated_at'), '>=', $dateStart)
                ->whereDate(DB::raw('n.updated_at'), '<=', $dateEnd)
                ->where('from_id', $e->id);

            $query->where(
                function ($query) {
                    $query->where(DB::raw('n.status_id'), StatusEnum::ToTheTransportPoint)
                        ->orWhere(DB::raw('n.status_id'), StatusEnum::Done)
                        ->orWhere(DB::raw('n.status_id'), StatusEnum::ToTheTransactionPoint);
                }
            );
            $query2 =DB::table(DB::raw('notification_magic_post n'))
                ->whereDate(DB::raw('n.updated_at'), '>=', $dateStart)
                ->whereDate(DB::raw('n.updated_at'), '<=', $dateEnd)
                ->where('to_id', $e->id)
                ->where(
                    function ($query) {
                        $query->where(DB::raw('n.status_id'), StatusEnum::Done);
                    }
                ); 
            array_push(
                $res['data'][$e->id], [
                'hangGui'=>$query->select(DB::raw('count(*) as hangGui'))->first()->hangGui,
                'hangNhan'=>$query2->select(DB::raw('count(*) as hangNhan'))->first()->hangNhan,
                ]
            );
        }

        return $res;
    }

    private function GetTotalDonNhan(string $idWorkPlate,Carbon $time,string $type = 'day')
    {
        // $tem = Carbon::parse($time);
        $res = Notification::where('from_id', '=', $idWorkPlate);
        switch($type){
        case 'year':
            $res = $res->whereYear('created_at', $time->year);
            break;
        case 'month':
            $res = $res->whereMonth('created_at', $time->month)
                ->whereYear('created_at', $time->year);
            break;
        case 'day':
        default:
            $res = $res->whereDate('created_at', $time->toDateString());
            break;
        }
        $res = $res->select(DB::raw('count(*) as total'))->first();
        return $res->total;
    }

    /**
     * Lay thong tin Bien Nhan theo tung trang thai va thoi gian
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function DonNhan(Request $request)
    {
        $validator = validator(
            $request->all(), [
            'time'=>'date',
            'groupBy'=>[Rule::in('day', 'month', 'year'),'required'],
            'statusId'=>['numeric',Rule::in(StatusEnum::getValues())],
            ]
        );

        if($validator->fails()) {
            return $this->sendError("Validator Error", $validator->errors());
        }

        /**
        * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        $idWorkPlate = $user->detail->work_plate_id;
        $time = Carbon::parse($request->time);
        $total = $this->GetTotalDonNhan($idWorkPlate, $time, $request->groupBy);

        $query = Notification::query();
        if(isset($request->statusId)) {
            $query->where('status_id', $request->statusId);
        }

        return $this->sendResponse(
            [
            'total'=>$total,
            ], 
            'thanh cong'
        );
    }
    /**
     * Thống kê các hàng
     *  chuyển thành công,          Done
     *  chuyển không thành công     Fail
     *  trả lại điểm giao dịch      Return
     *  Thong ke theo ngai tao
     *  có sắp xếp theo ngày tháng năm nếu cần
     * 
     *  của giao dịch viên
     * 
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ThongKeHangGDV(Request $request)
    {
        $validator = validator(
            $request->all(), [
            'timeStart'=>"required|date",
            'timeEnd'=>'required|date',
            ]
        );

        if($validator->fails()) {
            return $this->sendError("Validator Error", $validator->errors());
        }
         /**
        * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        $idWorkPlate = $user->detail->work_plate_id;
        $start = Carbon::parse($request->timeStart);
        $end = Carbon::parse($request->timeEnd);

        // $query = Notification::query();
        $query = DB::table(DB::raw('notification_magic_post n'))
        // ->join(DB::raw('bien_nhan bn'), 'n.bien_nhan_id', 'bn.id');
            ->where('from_id', $idWorkPlate)
            ->where(
                function ($query) {
                    $query->where(DB::raw('n.status_id'), StatusEnum::Done)
                        ->orWhere(DB::raw('n.status_id'), StatusEnum::Fail)
                        ->orWhere(DB::raw('n.status_id'), StatusEnum::Return);
                }
            )
        ->whereDate(DB::raw('n.updated_at'), '>=', $start)
        ->whereDate(DB::raw('n.updated_at'), '<=', $end);
        $res = $query->orderBy(DB::raw('n.status_id'))
            ->select(
                [
                DB::raw('n.status_id as status'),
                DB::raw('n.id '),
                // DB::raw($request->groupBy.'(n.updated_at) as time'),
                DB::raw('n.updated_at as time'),
                ]
            )->get();
        $res = $this->ThongKeTheoStatus($res);
        return $this->sendResponse($res, "thong ke thanh cong");
    }

    /**
     * thống kê các hàng đến và Nhaan
     * dùng cho quản lý
     * diem giao dich
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ThongKeQL(Request $request)
    {
        $validator = validator(
            $request->all(), [
            'timeStart'=>"required|date",
            'timeEnd'=>'required|date',
            ]
        );

        if($validator->fails()) {
            return $this->sendError("Validator Error", $validator->errors());
        }
        /**
        * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        $idWorkPlate = $user->detail->work_plate_id;
        $start = Carbon::parse($request->timeStart);
        $end = Carbon::parse($request->timeEnd);
        $dates = $this->generateDateRange($start, $end);
        // return $this->sendResponse($dates, '');
        // hang di
        $res = [];
        foreach($dates as $d){
            $res[$d] = [];
            $date = new Carbon($d);
            $query = DB::table(DB::raw('notification_magic_post n'))
            // ->join(DB::raw('bien_nhan bn'), 'n.bien_nhan_id', 'bn.id');
                ->whereDate(DB::raw('n.updated_at'), '=', $date);
                // ->whereDate(DB::raw('n.updated_at'), '<=', $end)
                // ->groupBy(DB::raw("DATE_FORMAT(n.updated_at,'%Y-%m-%d')"));

            $query->where('n.from_id', $idWorkPlate) /// hang di
                ->where(
                    function ($query) {
                        $query->where(DB::raw('n.status_id'), StatusEnum::Create);
                            // ->orWhere(DB::raw('n.status_id'), StatusEnum::Done)
                            // ->orWhere(DB::raw('n.status_id'), StatusEnum::ToTheTransactionPoint);
                    }
                );
            $query2 = DB::table(DB::raw('notification_magic_post n'))/// hang den
            // ->join(DB::raw('bien_nhan bn'), 'n.bien_nhan_id', 'bn.id');
                ->whereDate(DB::raw('n.updated_at'), '=', $date)
                // ->whereDate(DB::raw('n.updated_at'), '<=', $end)
                ->where('n.to_id', $idWorkPlate) 
                ->where(
                    function ($query) {
                        $query->where(DB::raw('n.status_id'), StatusEnum::Done);
                    }
                );
            array_push(
                $res[$d], [
                'hangGui'=>$query->select(DB::raw('count(*) as hangGui'))->first()->hangGui,
                'hangNhan'=>$query2->select(DB::raw('count(*) as hangNhan'))->first()->hangNhan,
                ]
            );
        }
        
        return $this->sendResponse($res, 'oc');
    }

    /**
     * thống kê các hàng Gui và đi
     * dùng cho quản lý
     * diem chung chuyen
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ThongKeQL2(Request $request)
    {
        $validator = validator(
            $request->all(), [
            'timeStart'=>"required|date",
            'timeEnd'=>'required|date',
            ]
        );

        if($validator->fails()) {
            return $this->sendError("Validator Error", $validator->errors());
        }
        /**
        * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        $idWorkPlate = $user->detail->work_plate_id;
        $start = Carbon::parse($request->timeStart);
        $end = Carbon::parse($request->timeEnd);
        $dates = $this->generateDateRange($start, $end);
        // return $this->sendResponse($dates, '');
        // hang di
        $res = [];
        foreach($dates as $d){
            $res[$d] = [];
            $date = new Carbon($d);
            $query = DB::table(DB::raw('notification_magic_post n'))
            // ->join(DB::raw('bien_nhan bn'), 'n.bien_nhan_id', 'bn.id');
                ->whereDate(DB::raw('n.updated_at'), '=', $date);
                // ->whereDate(DB::raw('n.updated_at'), '<=', $end)
                // ->groupBy(DB::raw("DATE_FORMAT(n.updated_at,'%Y-%m-%d')"));

            $query->where('n.from_id', $idWorkPlate) /// hang di
                ->where(
                    function ($query) {
                        $query->where(DB::raw('n.status_id'), StatusEnum::ToTheTransportPoint)
                            ->orWhere(DB::raw('n.status_id'), StatusEnum::Done)
                            ->orWhere(DB::raw('n.status_id'), StatusEnum::ToTheTransactionPoint);
                    }
                );
            $query2 = DB::table(DB::raw('notification_magic_post n'))/// hang den
            // ->join(DB::raw('bien_nhan bn'), 'n.bien_nhan_id', 'bn.id');
                ->whereDate(DB::raw('n.updated_at'), '=', $date)
                // ->whereDate(DB::raw('n.updated_at'), '<=', $end)
                ->where('n.to_id', $idWorkPlate) 
                ->where(
                    function ($query) {
                        $query->where(DB::raw('n.status_id'), StatusEnum::Done);
                    }
                );
            array_push(
                $res[$d], [
                'hangDi'=>$query->select(DB::raw('count(*) as hangDi'))->first()->hangDi,
                'hangDen'=>$query2->select(DB::raw('count(*) as hangDen'))->first()->hangDen,
                ]
            );
        }
        // $res = [
        //     $query->select(
        //         [
        //         DB::raw('count(*) as hangDi'),
        //         DB::raw("(DATE_FORMAT(n.updated_at,'%Y-%m-%d')) as ngay")
        //         ]
        //     )->get(),
        //     $query2->select(DB::raw('count(*) as hangDen'))->first(),
        // ];
        
        return $this->sendResponse($res, 'oc');
    }
    public function totalBNToday(Request $request)
    {
        $validator = validator(
            $request->all(), [
            'time'=>"required|date",
            ]
        );

        if($validator->fails()) {
            return $this->sendError("Validator Error", $validator->errors());
        }
         /**
        * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        $idWorkPlate = $user->detail->work_plate_id;
        $time = Carbon::parse($request->time)->toDateString();

        $query = BienNhan::query();
        $res = $query->join(DB::raw('notification_magic_post n'), 'bien_nhan_id', 'bien_nhan.id')
            ->where("n.status_id", StatusEnum::Create)
            ->where('n.from_id', $idWorkPlate)
            ->whereDate('ngay_gui', '=', $time)
            // ->groupBy('n.bien_nhan_id')
            // ->select('*')
            ->select(DB::raw('count(*) as total'))
            ->first()->total;
        return $this->sendResponse($res, 'thanh cong');
    }

    private function ThongKeTheoStatus(\Illuminate\Support\Collection $data)
    {
        $res = [
            StatusEnum::Done=>0,
            StatusEnum::Fail=>0,
            StatusEnum::Return=>0
        ];
        foreach($data as $v){
            $s = intval($v->status);
            $res[$s]++;
        }
        return $res;
    }
    private function ThongKeTheoTime(\Illuminate\Support\Collection $data)
    {
        $res = [];
        foreach($data as $e){
            $s = intval($e->status);
            $time = Carbon::parse($e->time);
            $y = $time->format("Y");
            $m = $time->format("m");
            $d = $time->format('d');
            if(!array_key_exists($y, $res)) {
                $res[$y] = [];
            }
            if(!array_key_exists($m, $res[$y])) {
                $res[$y][$m] = [];
            }
            if(!array_key_exists($d, $res[$y][$m])) {
                $res[$y][$m][$d] = [
                    StatusEnum::Done=>0,
                    StatusEnum::Fail=>0,
                    StatusEnum::Return=>0
                ];
            }
            $res[$y][$m][$d][$s]++;
            
        }
        return $res;
    }
}
