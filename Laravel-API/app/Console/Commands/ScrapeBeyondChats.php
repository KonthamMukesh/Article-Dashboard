<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;
use Carbon\Carbon;

class ScrapeBeyondChats extends Command
{
    protected $signature = 'scrape:beyondchats';
    protected $description = 'Scrape and store exactly the 5 oldest blog articles from BeyondChats';

    public function handle()
    {
        $client = new Client([
            'timeout' => 30,
            'verify' => false,
            'headers' => ['User-Agent' => 'Mozilla/5.0 (compatible; ScraperBot/1.0)'],
        ]);

        $baseUrl = 'https://beyondchats.com';
        $candidates = []; // Will store ['url' => ..., 'published_at' => Carbon]

        // Start from page 20 and go backward to find pages with content
        for ($page = 20; $page >= 1; $page--) {
            $url = $page === 1 ? "{$baseUrl}/blogs" : "{$baseUrl}/blogs/page/{$page}";

            try {
                $response = $client->get($url);
                $html = $response->getBody()->getContents();
            } catch (RequestException $e) {
                continue;
            }

            $crawler = new Crawler($html);

            // Extract each post on the listing page
            $hasPosts = false;
            $crawler->filter('article')->each(function (Crawler $node) use (&$candidates, $baseUrl, &$hasPosts) {
                try {
                    $link = $node->filter('h2 a, h3 a, a')->first()->link()->getUri();
                    if (!str_starts_with($link, $baseUrl)) {
                        $link = $baseUrl . $link;
                    }

                    $dateAttr = $node->filter('time')->attr('datetime') ?? null;
                    $publishedAt = $dateAttr ? Carbon::parse($dateAttr) : null;

                    $candidates[] = [
                        'url' => $link,
                        'published_at' => $publishedAt,
                    ];

                    $hasPosts = true;
                } catch (\Exception $e) {
                    // Skip malformed post
                }
            });

            if ($hasPosts) {
                $this->info("Collected posts from page {$page}");
            }

            if (count($candidates) >= 20) { // Enough to safely get 5 oldest
                break;
            }
        }

        if (empty($candidates)) {
            $this->error('No articles found.');
            return;
        }

        // Sort by published_at ascending (oldest first), remove duplicates by URL
        usort($candidates, fn($a, $b) => $a['published_at'] <=> $b['published_at'] ?? $b['published_at']);

        $uniqueOldest = [];
        $seenUrls = [];
        foreach ($candidates as $cand) {
            if (!in_array($cand['url'], $seenUrls)) {
                $uniqueOldest[] = $cand;
                $seenUrls[] = $cand['url'];
            }
            if (count($uniqueOldest) >= 5) break;
        }

        $this->info('Selected 5 oldest articles to scrape fully.');

        foreach ($uniqueOldest as $item) {
            $url = $item['url'];

            if (Article::where('source_url', $url)->exists()) {
                $this->warn("Already exists: {$url}");
                continue;
            }

            try {
                $html = $client->get($url)->getBody()->getContents();
            } catch (\Exception $e) {
                $this->error("Failed to fetch article: {$url}");
                continue;
            }

            $crawler = new Crawler($html);

            $title = $crawler->filter('h1')->count() ? trim($crawler->filter('h1')->first()->text()) : 'Untitled';

            $contentNode = $crawler->filter('article, .post-content, .entry-content')->count() ? $crawler->filter('article, .post-content, .entry-content')->first() : null;
            $content = $contentNode ? trim(preg_replace('/\s+/', ' ', $contentNode->text())) : '';

            $publishedAt = $item['published_at'];

            Article::create([
                'title'        => $title,
                'content'      => $content,
                'source_url'   => $url,
                'published_at' => $publishedAt,
            ]);

            $this->info("Saved: {$title} ({$publishedAt?->format('Y-m-d')})");
        }

        $this->info('✅ Successfully scraped and stored the 5 oldest articles!');
    }
}