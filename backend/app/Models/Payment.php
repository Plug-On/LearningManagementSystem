<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'amount',
        'transaction_uuid',
        'transaction_code',
        'product_code',
        'status',
    ];
}
