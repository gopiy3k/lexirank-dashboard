// app/api/lexi-rank-score/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

// Create server-side Supabase client (service role)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Define a type for our cache data structure
type CacheData = {
    scores: Score[];
    overallScore: number;
};

// Define a type for a single score object
interface Score {
    ai_engine: string;
    brand: string;
    lexi_rank_score: number;
}

// Simple in-memory cache (per server instance). TTL in ms.
const CACHE_TTL = 60 * 1000; // 1 minute
// FIX: Type the cache to hold our specific data structure or null.
let _cache: { ts: number; key: string; data: CacheData } | null = null;

function cacheKeyFor(q: URLSearchParams) {
  return JSON.stringify({
    s: q.get('start_date') || null,
    e: q.get('end_date') || null,
    weights: q.get('engine_weights') || null,
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams;

    // parse optional params
    const start_date = q.get('start_date'); // e.g. 2025-08-01T00:00:00Z
    const end_date = q.get('end_date');
    const weightsParam = q.get('engine_weights'); // JSON string like '{"ChatGPT":1.2}'

    const key = cacheKeyFor(q);
    if (_cache && _cache.key === key && Date.now() - _cache.ts < CACHE_TTL) {
      return NextResponse.json(_cache.data);
    }

    // prepare rpc params
    let engine_weights: { [key: string]: number } = {};
    if (weightsParam) {
      try {
        engine_weights = JSON.parse(weightsParam);
      } catch { // FIX: Removed unused 'err' variable.
        return NextResponse.json({ error: 'Invalid engine_weights JSON' }, { status: 400 });
      }
    }

    // Call the DB function. param names must match the SQL fn args
    const { data, error } = await supabase
      .rpc('get_lexi_rank_scores', {
        p_start_date: start_date ?? null,
        p_end_date: end_date ?? null,
        p_engine_weights: engine_weights,
      });

    if (error) {
      console.error('Supabase RPC error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // data is an array of rows { ai_engine, brand, lexi_rank_score }
    // FIX: Type the data coming from the RPC call.
    const rows: Score[] = Array.isArray(data) ? data : [];

    // normalize lexi_rank_score to number
    // FIX: Use the 'Score' type for the row parameter 'r'.
    const scores: Score[] = rows.map((r: Score) => ({
      ai_engine: r.ai_engine,
      brand: r.brand,
      lexi_rank_score: Number(r.lexi_rank_score) || 0,
    }));

    const overallScore =
      scores.length > 0 ? scores.reduce((s, r) => s + r.lexi_rank_score, 0) / scores.length : 0;

    const payload: CacheData = { scores, overallScore };

    // store in memory cache
    _cache = { ts: Date.now(), key, data: payload };

    return NextResponse.json(payload);
  } catch (err: unknown) { // FIX: Use 'unknown' instead of 'any' for better type safety in catch blocks.
    console.error('Unexpected error in lexi-rank API', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
