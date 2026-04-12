import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('saved_articles')
      .select(`
        id,
        article_id,
        articles (*)
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ saved: data })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { user_id, article_id } = await request.json()

    if (!user_id || !article_id) {
      return NextResponse.json({ error: 'User ID and Article ID required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('saved_articles')
      .insert({ user_id, article_id })

    if (error) throw error
    return NextResponse.json({ success: true })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { user_id, article_id } = await request.json()

    const { error } = await supabaseAdmin
      .from('saved_articles')
      .delete()
      .eq('user_id', user_id)
      .eq('article_id', article_id)

    if (error) throw error
    return NextResponse.json({ success: true })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}