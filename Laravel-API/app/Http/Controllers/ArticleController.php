<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    // GET /articles or /api/articles
public function index(Request $request): JsonResponse
{
    $query = Article::query();

    if ($request->type === 'original') {
        $query->where('is_ai_generated', false);
    }

    if ($request->type === 'ai') {
        $query->where('is_ai_generated', true);
    }

    return response()->json(
        $query->orderBy('published_at', 'desc')->paginate(10)
    );
}


    // GET /articles/latest
    public function latest(): JsonResponse
    {
        $article = Article::orderBy('published_at', 'desc')->first();
        return response()->json($article);
    }

    // GET /articles/{id}
    public function show($id): JsonResponse
    {
        $article = Article::findOrFail($id);
        return response()->json($article);
    }

    // POST /articles
    public function store(Request $request): JsonResponse
    {
       $validated = $request->validate([
    'title' => 'required|string|max:255',
    'content' => 'required|string',
    'source_url' => 'nullable|url',
    'published_at' => 'nullable|date',
    'is_ai_generated' => 'boolean',
    'parent_article_id' => 'nullable|exists:articles,id',
    'references' => 'nullable|array',
]);

$article = Article::create($validated);

return response()->json($article, 201);
    }

    // PUT /articles/{id}
    public function update(Request $request, $id): JsonResponse
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'content'      => 'sometimes|required|string',
            'source_url'   => 'sometimes|required|url|unique:articles,source_url,' . $id,
            'published_at' => 'nullable|date',
        ]);

        $article->update($validated);

        return response()->json($article);
    }

    // DELETE /articles/{id}
    public function destroy($id): JsonResponse
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }
}