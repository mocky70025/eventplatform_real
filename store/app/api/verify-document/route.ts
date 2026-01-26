import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI correctly
const apiKey = process.env.OPENAIAPI || process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey: apiKey }) : null;

export async function POST(req: Request) {
    try {
        if (!openai) {
            console.error("OpenAI API key is missing. Checked OPENAIAPI and OPENAI_API_KEY.");
            return NextResponse.json({ error: "AIサービスの初期化に失敗しました" }, { status: 500 });
        }

        const { image, type } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "画像データが必要です" }, { status: 400 });
        }

        // Clean base64 string
        const base64Image = image.startsWith('data:image')
            ? image.split(',')[1]
            : image;

        // Determine prompts based on document type
        const systemPrompt = "あなたは日本の公的書類を読み取るAIアシスタントです。提供された画像から必要な情報をJSON形式で抽出してください。";
        let userPrompt = "";

        if (type === 'businessLicense') {
            userPrompt = "この画像は「飲食店営業許可証」のはずです。1. 書類の種類が飲食店営業許可証かどうか判定してください。2. 有効期限を探してください。JSON形式で { \"isBusinessLicense\": boolean, \"expiryDate\": \"YYYY-MM-DD\" } を返してください。有効期限が読み取れない場合はnullにしてください。";
        } else {
            userPrompt = "この画像は「車検証」または「保険証券」のはずです。書類の種類を特定し、有効期限があれば抽出してください。JSON形式で { \"documentType\": string, \"expiryDate\": \"YYYY-MM-DD\" } を返してください。";
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: userPrompt },
                        {
                            type: "image_url",
                            image_url: {
                                "url": `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ],
                },
            ],
            response_format: { type: "json_object" },
            max_tokens: 300,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("AIからの応答が空でした");

        const result = JSON.parse(content);
        console.log("AI Analysis Result:", result);

        // Standardize output
        let extractedData = {
            documentType: "",
            expiryDate: "",
            verified: false
        };

        if (type === 'businessLicense') {
            extractedData.documentType = result.isBusinessLicense ? "飲食店営業許可証" : "不明な書類";
            extractedData.expiryDate = result.expiryDate;
            extractedData.verified = result.isBusinessLicense;
        } else {
            extractedData.documentType = result.documentType || "不明";
            extractedData.expiryDate = result.expiryDate;
            extractedData.verified = !!result.documentType;
        }

        if (!extractedData.verified) {
            return NextResponse.json({
                success: false,
                message: "指定された書類として認識できませんでした。画像を確認してください。",
                confidence: 0.1
            });
        }

        return NextResponse.json({
            success: true,
            extractedData,
            message: "AIチェック完了"
        });

    } catch (error: any) {
        console.error("AI verify error:", error);
        return NextResponse.json({ error: "AIチェック中にエラーが発生しました: " + error.message }, { status: 500 });
    }
}
