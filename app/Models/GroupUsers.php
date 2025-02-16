<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupUsers extends Model
{
    use HasFactory;

    protected $table = 'group_users';

    protected $fillable = [
        'group_id',
        'user_id',
    ];
}
