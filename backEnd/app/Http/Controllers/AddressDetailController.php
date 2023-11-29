<?php

namespace App\Http\Controllers;

use App\Enums\TypeEnum;
use App\Models\Address;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressDetailController extends Controller
{
    private \Illuminate\Database\Connection $conn;
    public function __construct()
    {
        $this->conn = DB::connection("sqlite_vn_map");
        // $this->conn = DB::connection("mysql_vn_map");
    }
    public function test()
    {
        try{
            $address = $this->getAddress(2);
            return response()->json(["res"=>$address]);
        }catch (Exception $e){
            return response()->json(["error"=>$e->getMessage()]);
        }
    }
    public function getName(int $id, int $type)
    {
        $table = "";
        switch ($type) {
        case 1:
            $table = "provinces";
            break;
        case 2:
            $table = "districts";
            break;
        case 3:
            $table = "wards";
            break;
        default:
            throw new Exception("unknown type");
        }
        // return $table;
        try{
            $address = $this->conn
                ->table($table)
                ->where("$table.code", $id)
                ->select(DB::raw("$table.name"))
                ->get();
            return $address[0]->name;
        }catch (Exception $e){
            return "unknown";
        }
    }

    public function getCode(string $id, int $type)
    {
        $res = '';
        switch ($type) {
        case TypeEnum::Province:
            $res = $this->conn
                ->table(DB::raw("wards w"))
                ->join(DB::raw("districts d"), "d.code", "=", "w.district_code")
                ->join(DB::raw("provinces p"), "p.code", "=", "d.province_code")
                ->where(DB::raw("w.code"), "=", $id)
                ->select(DB::raw("p.code"))
                ->first();
            
            break;
        case TypeEnum::District:
            $res = $this->conn
                ->table(DB::raw("wards w"))
                ->join(DB::raw("districts d"), "d.code", "=", "w.district_code")
                ->where(DB::raw("w.code"), "=", $id)
                ->select(DB::raw("d.code"))
                ->first();
            
            break;
        case TypeEnum::Ward:
            return $id;
            // break;
        default:
            throw new Exception("unknown type");
        }
        return $res->code;
    }

    public function getAddress($id)
    {
        $add = Address::where("id", $id)->first();
        // return $add;
        if(!$add) {
            throw new Exception("Khong tim thay Address record co id: ".$id, 1);
        }
        $res = $this->conn
            ->table(DB::raw("wards w"))
            ->join(DB::raw("districts d"), "d.code", "=", "w.district_code")
            ->join(DB::raw("provinces p"), "d.province_code", "=", "p.code")
            ->select(
                DB::raw("p.full_name as provinceName"),
                DB::raw("d.full_name as districtName"),
                DB::raw("w.full_name as wardName"),
                DB::raw('p.code as provinceCode'),
                DB::raw('d.code as districtCode'),
                DB::raw('w.code as wardCode')
            )
            ->where(DB::raw("w.code"), $add->address_id)
            ->first();
        if(!$res) {
            throw new Exception("loi truy van cho address co id: ".$id, 1);
        }
        $res = (object)array(
          'province'=> $res->provinceName,
          'provinceCode'=>$res->provinceCode,
          'districtCode'=>$res->districtCode,
          'wardCode'=>$res->wardCode,
          'district'=> $res->districtName,
          'ward'=> $res->wardName,
          'address'=> $add->address
        );
          return $res;
    }

    public function getAllProvinces()
    {
        try{
            $res = $this->conn->table(DB::raw("provinces p"))
                ->select(DB::raw("code as id"), DB::raw('full_name as name'))
                ->get();
            return $this->sendResponse($res, 'get all provinces success');
        }catch(Exception $e){
            return $this->sendError("cannot get provinces", $e->getMessage());
        }
    }
    public function getAllDistricts()
    {
        if(!isset($_GET['id'])) {
            return $this->sendError([], 'k cos code province');
        }
        $id = $_GET['id'];
        try{
            $res = $this->conn->table(DB::raw("districts d"))
                ->where(DB::raw("d.province_code"), $id)
                ->select(DB::raw("code as id"),  DB::raw('full_name as name'))
                ->get();
            return $this->sendResponse($res, 'get all provinces success');
        }catch(Exception $e){
            return $this->sendError("cannot get provinces", $e->getMessage());
        }
    }
    public function getAllWards()
    {
        if(!isset($_GET['id'])) {
            return $this->sendError([], 'k cos code district');
        }
        $id = $_GET['id'];
        try{
            $res = $this->conn->table(DB::raw("wards w"))
                ->where(DB::raw("w.district_code"), $id)
                ->select(DB::raw("code as id"),  DB::raw('full_name as name'))
                ->get();
            return $this->sendResponse($res, 'get all provinces success');
        }catch(Exception $e){
            return $this->sendError("cannot get provinces", $e->getMessage());
        }
    }
}