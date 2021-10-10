<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoundDetailsCommon extends Model
{
    use HasFactory;
    protected $fillable = [
        'round_id',
        'killed_user'
    ];
}
