<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    use HasFactory;
    protected $table = "user_details";
    // public $timestamps = false;
    protected $primaryKey='user_id';
    public $incrementing=false;
    protected $keyType='string';
    public function workPlate()
    {
        return $this->belongsTo(WorkPlate::class, "work_plate_id", "id");
    }
    public function user()
    {
        return $this->belongsTo(User::class, "uuid", "user_id");
    }
    // public function role()
    // {
    //     return $this->belongsTo(Role::class, "role_id", "id");
    // }
    protected $fillable = [
    "user_id",
      'work_plate_id',
    ];
    
}
