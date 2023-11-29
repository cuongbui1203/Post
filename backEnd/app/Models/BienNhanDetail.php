<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BienNhanDetail extends BaseModel
{
    use HasFactory;
    protected $table = 'bn_detail';
    public $incrementing=false;
    protected $keyType='string';
    public function status()
    {
        return $this->hasOne(Status::class, 'id', 'status_id');
    }

    public function transport()
    {
        return $this->hasOne(WorkPlate::class, 'id', 'transport_id');
    }
    protected $fillable = [
        // 'status_id',
        'id',
        'transport_id',
        'description',
    ];
}
