<?php

namespace App\Http\Controllers\api;

use App\Enums\UserRole;
use App\Http\Controllers\AddressDetailController;
use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Role;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\WorkPlate;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{

    /**
     * register api
     *
     * @param  Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|confirmed|min:6',
            'phone'=> "required",
            "addressId"=> ["required",Rule::exists("sqlite_vn_map.wards", "code")],
            "address"=> "required",
            // 'dob'=>'date',
            // 'image' => 'image|mimes:jpg,png,jpeg,gif,svg'
            ]
        );
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 500);
        }
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        
        $input['role'] = UserRole::Guest;
        $add = Address::create(
            [
            'address_id'=> $input['addressId'],
            'address'=> $input['address'],
            ]
        );
        
        $add->save();
        
        try {
            /**
             *  @var \App\Models\User $user 
             */
            $user = User::create(
                [
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'phone'=> $input['phone'],
                'address_id'=>$add->id,
                // 'dob'=>$input['dob']
                // 'detail_id'=>$detail->id,
                ]
            );
            if(isset($input['dob'])) {
                User::where('uuid', $user->uuid)->update(['dob' => $input['dob']]);
            }
            $user->assignRole($input['role']);
            
            $success['name'] =  $user->name;

            return $this->sendResponse($success, "Register Account Successfully");
        } catch (Exception $e) {
            return $this->sendError("Register Fail", $e->getMessage(), 500);
        }
    } 

    public function registerStaff(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|confirmed|min:6',
            'phone'=> "required",
            "addressId"=> ["required",Rule::exists("sqlite_vn_map.wards", "code")],
            "address"=> "required",
            "role"=>[
                Rule::in(
                    UserRole::Boss, 
                    UserRole::Employee, 
                    UserRole::Guest, 
                    UserRole::Shipper, 
                    UserRole::Manager
                )
            ],
            "idWorkPlate"=>[Rule::exists(WorkPlate::class, "id"),'required'],
            'dob'=>'required|date',
            // 'image' => 'image|mimes:jpg,png,jpeg,gif,svg'
            ]
        );
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 500);
        }
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        
        $input['role'] = isset($input['role']) ? $input['role'] : UserRole::Guest;
        $add = Address::create(
            [
            'address_id'=> $input['addressId'],
            'address'=> $input['address'],
            ]
        );
        
        $add->save();
        
        try {
            /**
             *  @var \App\Models\User $user 
             */
            $user = User::create(
                [
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'phone'=> $input['phone'],
                'address_id'=>$add->id,
                // 'detail_id'=>$detail->id,
                ]
            );
            $user->assignRole($input['role']);
            UserDetail::create(
                [
                    'user_id'=> $user->uuid,
                    'work_plate_id'=> $input['idWorkPlate'],
                ]
            );
            $success['name'] =  $user->name;

            return $this->sendResponse($success, "Register Account Successfully");
        } catch (Exception $e) {
            return $this->sendError("Register Fail", $e->getMessage(), 500);
        }
    }

    /**
     * Summary of login
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            /**
              * @var \App\Models\User $user 
            **/
            $user = Auth::user();
            $success['token'] =  $user->createToken('MyApp', ['*'], Carbon::now('Asia/Phnom_Penh')->addDay())->plainTextToken;
            // $id = explode('|', $success['token'])[0];
            // $user->currentAccessToken();
            // $success['name'] =  $user->name;
        
            return $this->sendResponse($success, 'User login successfully.');
        } else {
            return $this->sendError('Unauthorize.', ['error' => 'Unauthorize']);
        }
    }

    /**
     *  logout
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function logout(Request $request)
    {
        // Get bearer token from the request
        $accessToken = $request->bearerToken();
        // Get access token from database
        $token = \Laravel\Sanctum\PersonalAccessToken::findToken($accessToken);

        // Revoke token
        if ($token == null) {
            return $this->sendError("Invalid Token", []);
        }
        $token->delete();
        // Auth::logout();
        return $this->sendResponse(['ok'], 'Logout success');
    }

    /**
     * Summary of update
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            'name' => 'required',
            'phone'=> "required",
            "addressId"=> "required",
            "address"=> "required",
            "idRole"=>[Rule::in(UserRole::Employee, UserRole::Guest, UserRole::Manager)],
            "idWorkPlate"=>[],
            'dob'=>'date',
            // 'image' => 'image|mimes:jpg,png,jpeg,gif,svg'
            'id'=>[Rule::exists('users', 'uuid')]
            ],
        );
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 500);
        }
        /**
         * @var \App\Models\User  
        */
        $user = Auth::user();
        $role = $user->getRoleNames()->first();
        if($role === UserRole::Boss) {
            $user = User::where('uuid', $request->id);    
        }
        $user->name = $request->name;
        $user->phone = $request->phone;
        // $user->dob = $request->dob;
        $user->address->address_id = $request->addressId;
        $user->address->address = $request->address;
        $user->detail->role_id = $request->idRole;
        $user->detail->work_plate_id = $request->idWorkPlate;
        $user->removeRole($role);
        $user->assignRole(UserRole::fromValue($request->idRole));
        $user->save();
        if(isset($request->dob)) {
            User::where('uuid', $user->uuid)->update(['dob' => $request->dob]);
        }

        return $this->sendResponse([], "thanh cong", 202);

    }
    /**
     * Summary of destroy
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            'id'=>['required',Rule::exists('users', 'uuid')]
            ],
        );
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 500);
        }
        $user = User::findOrFail($request->id);
        $user->delete();
        return $this->sendResponse($user, 'ok');
    }
    
    public function updateRole(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            // 'image' => 'image|mimes:jpg,png,jpeg,gif,svg'
            'id'=>['required',Rule::exists('users', 'uuid')]
            ],
        );
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 500);
        }
        $user = User::findOrFail($request->id);
        $idWorkPlate = $user->detail->work_plate_id;
        $manage = User::role(UserRole::Manager)
            ->join('user_details', 'user_id', 'uuid')
            ->where('work_plate_id', $idWorkPlate)
            ->first();
        $manage->removeRole(UserRole::Manager);
        $manage->assignRole(UserRole::Employee);
        $user->removeRole(UserRole::Employee);
        $user->assignRole(UserRole::Manager);
        return $this->sendResponse($user, 'ok');
    }

    public function me(Request $request)
    {
        try{  
            $user = Auth::user();
            $add = new AddressDetailController();
            $res = array();
            
            $res['user'] = (object)array(
              'uuid'=>$user->uuid,
              "name"=> $user->name,
              "email"=> $user->email,
              "dob"=> $user->dob,
              'phone'=> $user->phone,
              'address'=> $add->getAddress($user->address_id),
            //   'detail'=> $this->getDetail($user->detail_id), 
                'role'=> $user->roles[0],
                'detail'=>$user->detail,
                'workPlate'=>$user->detail->workPlate,
            );
            // $res['user2'] = $user; 
            // $res['address'] = $add->getAddress($user->idAddress);
            return $this->sendResponse($res, 'Lay thong tin tai khoan thanh cong');
        } catch (Exception $e) {
            return $this->sendError('Get info account error', $e->getMessage(), 500);
        }
    }
    public function getUserInfo(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            'id' => 'required|exists:users,uuid',
            // 'image' => 'image|mimes:jpg,png,jpeg,gif,svg'
            ]
        );
        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 500);
        }
        try{  
            $user = Auth::user();
            if($user->getRoleNames()->first() != UserRole::Boss) {
                return $this->sendError("don't have permission");
            }
            $add = new AddressDetailController();
            $res = array();
            $userRes = User::where('uuid', '=', $request->id)->first();
            $res['user'] = (object)array(
              'uuid'=>$userRes->uuid,
              "name"=> $userRes->name,
            //   "email"=> $userRes->email,
            //   "dob"=> $userRes->dob,
              'phone'=> $userRes->phone,
            //   'address'=> $add->getAddress($userRes->address_id),
            //   'detail'=> $this->getDetail($userRes->detail_id), 
                'role'=> $userRes->roles[0],
                // 'detail'=>$userRes->detail,
                'workPlate'=>$userRes->detail->workPlate,
            );
            // $res['user2'] = $user; 
            // $res['address'] = $add->getAddress($user->idAddress);
            return $this->sendResponse($res, 'Lay thong tin tai khoan thanh cong');
        } catch (Exception $e) {
            return $this->sendError('Get info account error', $e->getMessage(), 500);
        }
    }

    private function getDetail($id)
    {
        $detail = UserDetail::find($id)->first();
        if(!$detail) {
            return "null";
        }
        $res = array();
        // $role = Role::find($detail->role_id)->select('name', 'id')->first();
        // $res['role'] = $role->name;
        // $res['roleId'] = $role->id;
        $res['workPlate'] = $detail->work_plate_id;
        return (object)$res;
    }

    public function changePass(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
            'current_password'=> ['required'],
            'password'=>['required','confirmed'],
            ]
        );
        if ($validator->fails()) {
            return $this->sendError('validator Error', $validator->errors());
        }
        $user = Auth::user();
        if(Hash::check(bcrypt($request->old_password), $user->getAuthPassword())) {
            return $this->sendError("old password not correct");
        }
        $user->update(["password"=> bcrypt($request->password)]);
        return $this->sendResponse([], "thanh cong", 202);
    }
}
