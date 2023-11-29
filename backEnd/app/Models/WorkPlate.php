<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkPlate extends Model
{
    use HasFactory,HasUuids;
    protected $table = "work_plate";
    public $incrementing=false;
    protected $keyType='string';
    public function address()
    {
        return $this->belongsTo(Address::class, "address_id", "id");
    }

    public function type()
    {
        return $this->belongsTo(Type::class, "type_id", "id");
    }

    protected $fillable = [
      "name",
      "address_id",
      "type_id",
      "vung",
      'cap',
    ];
}
