<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    protected $hidden = [
        'id',
        'updated_at',
        'created_at',
    ];

    protected $with = ['links'];

    public function links()
    {
        return $this->belongsToMany(Link::class)
            ->withPivot('url_address');
    }
}
