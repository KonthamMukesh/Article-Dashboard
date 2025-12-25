<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
    'title',
    'content',
    'source_url',
    'published_at',
    'is_ai_generated',
    'parent_article_id',
    'references',
];

protected $casts = [
    'published_at' => 'datetime',
    'is_ai_generated' => 'boolean',
    'references' => 'array',
];

}