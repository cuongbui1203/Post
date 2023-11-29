<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BienNhan extends BaseModel
{
    use HasFactory,HasUuids;
    protected $table = "bien_nhan";

    public function addressNgGui()
    {
        return $this->hasOne(Address::class, 'id', 'id_address_ng_gui');
    }
    public function addressNgNhan()
    {
        return $this->hasOne(Address::class, 'id', 'id_address_ng_nhan');
    }
    public function type()
    {
        return $this->hasOne(Type::class, 'id', 'type_id');
    }
    public function status()
    {
        return $this->hasOne(Status::class, 'id', 'status_id');
    }
    public function histories()
    {
        return $this->hasMany(Notification::class, 'bien_nhan_id', 'id');
    }
    public function actions()
    {
        return $this->hasMany(Action::class, 'bien_nhan_id', 'id'); 
    }
    public function detail()
    {
        return $this->hasOne(BienNhanDetail::class, 'id', 'id');
    }
    protected $fillable = [
      "id_ng_gui",
      "ten_ng_gui",
      "ten_ng_nhan",
      "sdt_ng_gui",
      "sdt_ng_nhan",
      "id_address_ng_gui",
      "id_address_ng_nhan",
      "type_id",
      "status_id",
      'action',
      "nd",
      "mass",
      "note",
      "ngay_nhan",
      "ngay_gui",
      "cod"
    ];

}
