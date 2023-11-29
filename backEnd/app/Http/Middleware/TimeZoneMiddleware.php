<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TimeZoneMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $timezone = ($request->hasHeader('X-Timezone')) ? $request->header('X-Timezone') : config('app.timezone');
        date_default_timezone_set($timezone);
        return $next($request);
    }
}
