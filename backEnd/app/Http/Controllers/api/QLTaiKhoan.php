<?php

namespace App\Http\Controllers\api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WorkPlate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QLTaiKhoan extends Controller
{
    /**
     * gateway get user
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll(Request $request)
    {
        /**
         * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        /**
         * @var \App\Models\WorkPlate $wo4
         */
        $workPlate = $user->detail->workPlate;
        // return $this->getAllUser($request);
        // $res = User::join(DB::raw('user_details u'), 'u.user_id', 'uuid')
        //     ->where('u.work_plate_id', $workPlate->id)->select('*')->get();
        // return $this->sendResponse($res, '');
        switch($user->getRoleNames()->first()){
        case UserRole::Boss:
            return $this->getAllUser();
        case UserRole::Manager:
            return $this->getAllUserInWorkPlate();
        default:
            return $this->sendError("don't have permission");
        }
    }

    private function getAllUser()
    {
        // $res = User::get();
        // foreach($res as $e){
        //     $e->getRoleNames();
        // }
        $workPlates = WorkPlate::select(
            [
            DB::raw('id'),
            DB::raw('name')
            ]
        )->get();
        $users = [];
        foreach($workPlates as $e){
            $u = User::join(DB::raw('user_details u'), 'u.user_id', 'uuid')
                ->where('u.work_plate_id', $e->id)->select(
                    [
                    'uuid',
                    'name',
                    ]
                )->get();
            foreach($u as $u1){
                // $u1->getRoleNames()->first();
                $u1['roleName'] = $u1->getRoleNames()->first();
                unset($u1->roles);
            }
            array_push($users, $u);
        }
        $res = (object)[
            'workPlate'=>$workPlates,
            'users'=>$users
        ];
        return $this->sendResponse($res, '');
    }

    private function getAllUserInWorkPlate()
    {
         /**
         * @var \App\Models\User $user 
        **/
        $user = Auth::user();
        /**
         * @var \App\Models\WorkPlate $workPlate
         */
        $workPlate = $user->detail->workPlate;

        $res = User::join(DB::raw('user_details u'), 'u.user_id', 'uuid')
            ->where('u.work_plate_id', $workPlate->id)->select('*')->get();
            
        foreach($res as $e){
            $e->getRoleNames();
        }
        return $this->sendResponse($res, '');
    }

    public function getAllWorkPlate(Request $request)
    {
        /**
         * @var \App\Models\User $user 
        **/
        $user = Auth::user();

        if(!$user->hasRole(UserRole::Boss)) { 
            return $this->sendError("don't have permission");
        }

        $res = WorkPlate::select('id', 'name', 'type_id')->get();
        foreach($res as $e){
            $e['typeName'] = $e->type->name;
            unset($e->type);
            unset($e->type_id);
        }
        return $this->sendResponse($res, '');
    }
}
