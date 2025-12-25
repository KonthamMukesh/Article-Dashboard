<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAiFieldsToArticlesTable extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->boolean('is_ai_generated')->default(false);
            $table->unsignedBigInteger('parent_article_id')->nullable();
            $table->json('references')->nullable();

            $table->foreign('parent_article_id')
                  ->references('id')
                  ->on('articles')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['parent_article_id']);
            $table->dropColumn([
                'is_ai_generated',
                'parent_article_id',
                'references'
            ]);
        });
    }
}
