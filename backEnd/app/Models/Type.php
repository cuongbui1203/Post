<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type extends BaseModel
{
    use HasFactory;
    protected $table = "type";
    public $timestamps = false;
    
}