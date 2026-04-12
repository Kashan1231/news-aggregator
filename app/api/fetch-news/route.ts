import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
const supabaseAdmin = getSupabaseAdmin()
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

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
    const text_response = await res.text()
    const data = JSON.parse(text_response)
    if (Array.isArray(data) && typeof data[0] === 'number') return data
    if (Array.isArray(data) && Array.isArray(data[0])) return data[0]
    return null
  } catch(e) {
    return null
  }
}

export async function GET() {
  try {
    // Step 1: NewsAPI + Guardian dono se fetch karo
    const [res1, res2, res3] = await Promise.all([
      fetch(`https://newsapi.org/v2/top-headlines?language=en&country=us&pageSize=10&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`),
      fetch(`https://newsapi.org/v2/top-headlines?language=en&country=gb&pageSize=10&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`),
      fetch(`https://content.guardianapis.com/search?show-fields=thumbnail,trailText&page-size=20&api-key=${process.env.GUARDIAN_API_KEY}`)
    ])

    const [d1, d2, d3] = await Promise.all([res1.json(), res2.json(), res3.json()])

    // NewsAPI articles
    const newsApiArticles = [...(d1.articles || []), ...(d2.articles || [])]
      .filter((a: any) => a.title && a.description)
      .map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image_url: a.urlToImage,
        source: a.source?.name,
        published_at: a.publishedAt,
      }))

    // Guardian articles
    const guardianArticles = (d3.response?.results || [])
      .filter((a: any) => a.webTitle && a.fields?.trailText)
      .map((a: any) => ({
        title: a.webTitle,
        description: a.fields?.trailText,
        url: a.webUrl,
        image_url: a.fields?.thumbnail,
        source: 'The Guardian',
        published_at: a.webPublicationDate,
      }))

    const allArticles = [...newsApiArticles, ...guardianArticles]

    if (!allArticles.length) {
      return NextResponse.json({ error: 'No articles found' }, { status: 400 })
    }

    // Step 2: Analyze + Embedding
    const analyzedArticles = await Promise.all(
      allArticles.slice(0, 15).map(async (article: any) => {

        const analysis = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'user',
            content: `Analyze this news article and respond in JSON only, no extra text:
            Title: ${article.title}
            Description: ${article.description}
            
            Return exactly this format:
            {
              "category": "one of: technology/sports/politics/business/health/entertainment/science",
              "sentiment": "one of: positive/negative/neutral",
              "bias_score": "one of: low/medium/high",
              "bias_reason": "one short sentence"
            }`
          }],
        })

        let aiResult = { category: 'general', sentiment: 'neutral', bias_score: 'low', bias_reason: 'None' }
        try {
          const content = analysis.choices[0].message.content || '{}'
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) aiResult = JSON.parse(jsonMatch[0])
        } catch (e) {}

        let embedding = null
        try {
          embedding = await getEmbedding(`${article.title} ${article.description}`)
        } catch (e) {}

        return {
          ...article,
          category: aiResult.category,
          sentiment: aiResult.sentiment,
          bias_score: aiResult.bias_score,
          bias_reason: aiResult.bias_reason,
          embedding
        }
      })
    )

    // Step 3: Supabase mein save karo
    const { error } = await supabaseAdmin
      .from('articles')
      .upsert(analyzedArticles, { onConflict: 'url' })

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `${analyzedArticles.length} articles fetched and saved!`
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}