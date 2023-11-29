<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends BaseModel
{
    use HasFactory;
    // DB::con
    protected $table = "address_details";
    public $timestamps = false;
    protected $fillable = [
    "address_id",
    "address",
    ];
    
    public function workPlate()
    {
        return $this->hasOne(WorkPlate::class, "address_id", "id");
    }

}
