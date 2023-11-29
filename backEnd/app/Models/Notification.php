<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends BaseModel
{
    use HasFactory,HasUuids;
    protected $primaryKey = 'id';
    protected $keyType = "string";
    public $incrementing = false;
    protected $table = "notification_magic_post";

    public function bienNhan()
    {
        return $this->hasOne(BienNhan::class, "id", "bien_nhan_id");
    }
    public function from()
    {
        return $this->hasOne(WorkPlate::class, "id", 'from_id');
    }
    public function to()
    {
        return $this->hasOne(WorkPlate::class, 'id', 'to_id');
    }
    protected $fillable = [
        "bien_nhan_id",
        "from_id",
        "to_id",
        'status_id',
        "description",
        // 'created_at'
    ];
    
}
