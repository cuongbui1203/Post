<?php

use App\Enums\ActionEnum;
use App\Http\Controllers\AddressDetailController;
use App\Http\Controllers\api\BienNhanController;
use App\Http\Controllers\api\NotificationController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\WorkPlateController;
use App\Http\Controllers\api\ThongKeController;
use App\Http\Controllers\api\QLTaiKhoan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware(['auth:sanctum','timezone'])->group(
    function () {
        Route::get('/logout', [UserController::class,'logout'])
            ->name('User logout');
        Route::get('/me', [UserController::class,'me'])
            ->name('Get info you Account');
        Route::patch('/change', [UserController::class,'changePass'])
            ->name('change password');
        Route::put('/update', [UserController::class,'update'])->name('update user information');
        Route::put('/updateRole', [UserController::class,'updateRole'])->name('update role user information');
        
        Route::get('/getInfo', [UserController::class,'getUserInfo'])->name('get info by uuid');
        Route::delete('/user', [UserController::class,'destroy'])->name('remove user');
        Route::get("/work", [WorkPlateController::class,"detail"])
            ->name("get information of work plate");
        Route::get("/works", [WorkPlateController::class,"getAllWP"])
            ->name("get all wp");
        Route::post("/work", [WorkPlateController::class,"create"])
            ->name("create new workPlate");
        Route::delete('/work', [WorkPlateController::class,'destroy'])
            ->name('delete workPlate');
        Route::post('/work/update', [WorkPlateController::class,'update'])
            ->name('update work Plate');
        

        Route::post('/bien_nhan', [BienNhanController::class,'store'])
            ->name('create new BienNhan');
        Route::get('/bien_nhan', [BienNhanController::class,'show'])
            ->name('show one BienNhan');
        Route::delete('/bien_nhan', [BienNhanController::class,'destroy'])
            ->name('delete one bien nhan');
        Route::get('/bien_nhan/ship', [BienNhanController::class,'shipped'])
            ->name('ship hang');
        Route::get('/bien_nhan/return', [NotificationController::class,'createReturnNotification'])
            ->name('create return Notification');
        Route::post('/notification', [NotificationController::class,'createNotification'])
            ->name('create new notification');
        Route::get('/notification/{id}', [NotificationController::class,'show'])
            ->name('show notification');
        Route::get('/bien_nhan/transport', [NotificationController::class,'toTheTransportPoint'])
            ->name('to the transport point');
        Route::post('/bien_nhan/transport', [NotificationController::class, 'leaveTransportPoint'])
            ->name('Leave the transport point');

        Route::post('/bien_nhan/complete', [NotificationController::class,'completeBienNhan']);

        Route::get('/thongKe', [ThongKeController::class,'thongKe']);
        Route::get('/thongKe/today', [ThongKeController::class, 'totalBNToday']);
        Route::get('/thongKe/bienNhan/create', [ThongKeController::class,'getBienNhanCreated']);
        Route::get('/thongKe/test', [ThongKeController::class,'ThongKeQL']);

        Route::get('/quanLy/users', [QLTaiKhoan::class,'getAll']);
        Route::get('/quanLy/workPlates', [QLTaiKhoan::class,'getAllWorkPlate']);
    }
);
Route::get('/address/provinces', [AddressDetailController::class,'getAllProvinces'])
        ->name('get all province');
Route::get('/address/districts', [AddressDetailController::class,'getAllDistricts'])
        ->name('get all district');
Route::get('/address/wards', [AddressDetailController::class,'getAllWards'])
        ->name('get all wards');
Route::get('/work/search', [WorkPlateController::class,'search'])
->name('search work Plate');

Route::post('/login', [UserController::class,'login']);
Route::post('/register', [UserController::class,'register']);
Route::get('/docx/template', [BienNhanController::class,'template']);
Route::get(
    '/test', function () {
        return response()->json(ActionEnum::getValues());
    }
);
