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

// Define a type for a single score object returned from the database
interface Score {
    ai_engine: string;
    brand: string;
    lexi_rank_score: number;
}

// Define a type for the final payload, including the cache structure
interface Payload {
    scores: Score[];
    overallScore: number;
}

// Simple in-memory cache (per server instance). TTL in ms.
const CACHE_TTL = 60 * 1000; // 1 minute
let _cache: { ts: number; key: string; data: Payload } | null = null;

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
    const rows: unknown[] = Array.isArray(data) ? data : [];

    // FIX: Replaced '(r: any)' with a type-safe mapping function.
    const scores: Score[] = rows.map((r: unknown) => {
      // Assert 'r' as a generic object to safely access its properties.
      const row = r as Record<string, unknown>;
      return {
        ai_engine: String(row.ai_engine ?? ''),
        brand: String(row.brand ?? ''),
        lexi_rank_score: Number(row.lexi_rank_score) || 0,
      };
    });

    const overallScore =
      scores.length > 0 ? scores.reduce((s, r) => s + r.lexi_rank_score, 0) / scores.length : 0;

    const payload: Payload = { scores, overallScore };

    // store in memory cache
    _cache = { ts: Date.now(), key, data: payload };

    return NextResponse.json(payload);
  } catch (err) { // FIX: Use 'unknown' and then check the type if needed.
    console.error('Unexpected error in lexi-rank API', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
