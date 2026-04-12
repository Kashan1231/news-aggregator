import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
const supabaseAdmin = getSupabaseAdmin()

async function getEmbedding(text: string): Promise<number[] | null> {
  try {
    const res = await fetch(
      'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    )
    const data = await res.json()
    if (Array.isArray(data) && typeof data[0] === 'number') return data
    if (Array.isArray(data) && Array.isArray(data[0])) return data[0]
    return null
  } catch (e) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ articles: [] })
    }

    const embedding = await getEmbedding(query)

    if (embedding) {
      const { data, error } = await supabaseAdmin.rpc('search_articles', {
        query_embedding: embedding,
        match_count: 5
      })

      if (!error && data && data.length > 0) {
        const filtered = data.filter((a: any) => a.similarity > 0.20)
        return NextResponse.json({
          articles: filtered.length > 0 ? filtered : data.slice(0, 3),
          type: 'semantic'
        })
      }
    }

    // Fallback — simple text search
    const { data: textData, error: textError } = await supabaseAdmin
      .from('articles')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(10)

    if (textError) throw textError
    return NextResponse.json({ articles: textData, type: 'text' })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}