import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openaiApiKey = process.env.OPENAI_API_KEY

if (!openaiApiKey) {
  console.warn('OPENAI_API_KEY is not set. Document validation will not work.')
}

const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null

type DocumentKey =
  | 'business_license'
  | 'vehicle_inspection'
  | 'automobile_inspection'
  | 'pl_insurance'
  | 'fire_equipment_layout'

type DocumentPayload = {
  key: DocumentKey
  name: string
  imageUrl: string | null
  uploaded: boolean
}

type DocumentValidationResult = {
  key: DocumentKey
  status: 'valid' | 'invalid' | 'unknown'
  expirationDate?: string | null
  reason?: string
  rawResponse?: string
}

const SYSTEM_PROMPT = (docName: string) => `あなたは${docName}を読み取る専門家です。画像から有効期限を読み取り、以下のルールに従ってJSON形式で回答してください。\n1. 有効期限が今日より後の日付であれば \"yes\"、今日より前であれば \"no\" を返してください。\n2. 有効期限が見つからない場合も \"no\" を返してください。\n3. 有効期限の日付は YYYY-MM-DD で返してください。\n4. 回答は JSON で {\\"isValid\\": true/false, \\"expirationDate\\": \"YYYY-MM-DD\" または null, \\"reason\\": \"説明\" } の形式でお願いします。`

async function verifyDocument(imageUrl: string, docName: string) {
  if (!openai) {
    throw new Error('OpenAI API is not configured')
  }

  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) {
    throw new Error('Failed to fetch image')
  }

  const imageBuffer = await imageResponse.arrayBuffer()
  const imageBase64 = Buffer.from(imageBuffer).toString('base64')
  const imageMimeType = imageResponse.headers.get('content-type') || 'image/jpeg'

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT(docName),
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `この${docName}の画像を確認し、有効期限を判断してください。今日は ${new Date()
              .toISOString()
              .split('T')[0]} です。`,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${imageMimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 500,
  })

  const responseContent = completion.choices[0]?.message?.content
  if (!responseContent) {
    throw new Error('No response from OpenAI')
  }

  let parsed
  try {
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0])
    } else {
      parsed = JSON.parse(responseContent)
    }
  } catch (error) {
    const isValid = responseContent.toLowerCase().includes('yes') || responseContent.includes('有効')
    return {
      isValid,
      expirationDate: null,
      reason: 'AIの応答を解析できませんでした。',
      rawResponse: responseContent,
    }
  }

  return {
    isValid: parsed.isValid === true,
    expirationDate: parsed.expirationDate || null,
    reason: parsed.reason || null,
    rawResponse: responseContent,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { documents } = await request.json()

    if (!Array.isArray(documents)) {
      return NextResponse.json(
        { error: 'documents array is required' },
        { status: 400 }
      )
    }

    const results: DocumentValidationResult[] = []

    if (!openai) {
      for (const doc of documents) {
        results.push({
          key: doc.key,
          status: 'unknown',
          reason: 'OpenAI APIキーが設定されていません。',
        })
      }
      return NextResponse.json({ statuses: results })
    }

    for (const doc of documents) {
      if (!doc.uploaded || !doc.imageUrl) {
        results.push({
          key: doc.key,
          status: 'unknown',
          reason: '画像がアップロードされていません。',
        })
        continue
      }

      try {
        const verification = await verifyDocument(doc.imageUrl, doc.name)
        results.push({
          key: doc.key,
          status: verification.isValid ? 'valid' : 'invalid',
          expirationDate: verification.expirationDate,
          reason:
            verification.reason || (verification.isValid ? '有効な書類です。' : '有効期限が切れている可能性があります。'),
          rawResponse: verification.rawResponse,
        })
      } catch (error: any) {
        console.error(`[documents/validate] ${doc.key} validation failed:`, error)
        results.push({
          key: doc.key,
          status: 'invalid',
          reason: 'AIによる解析に失敗しました。',
        })
      }
    }

    return NextResponse.json({ statuses: results })
  } catch (error) {
    console.error('[documents/validate] request failed:', error)
    return NextResponse.json(
      { error: 'Failed to validate documents', details: (error as Error).message },
      { status: 500 }
    )
  }
}
