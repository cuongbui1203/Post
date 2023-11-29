<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Action extends Model
{
    use HasFactory;   
    public $timestamps = false;
    public $incrementing=false;
    protected $fillable = [
        'bien_nhan_id',
        'action_id'
    ];

}
