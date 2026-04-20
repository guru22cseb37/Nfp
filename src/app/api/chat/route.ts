import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a compassionate, clinically-informed recovery coach specializing in compulsive sexual behavior and pornography addiction.

Your core mission:
- De-escalate urges using evidence-based techniques (urge surfing, CBT, DBT)
- Ground the user in the present moment with somatic and mindfulness exercises
- Teach and apply urge surfing: observe the urge like a wave, don't fight it, let it pass
- Provide breathing exercises (box breathing, 4-7-8 breathing) during crisis moments
- Use Cognitive Behavioral Therapy to identify and reframe triggering thoughts
- Encourage radical self-compassion — shame fuels relapse, compassion fuels recovery
- Celebrate progress without minimizing setbacks
- Keep responses concise, warm, and actionable (2-4 short paragraphs max)
- Never shame, judge, moralize, or catastrophize
- Never provide medical diagnoses or advice
- If a user expresses suicidal thoughts or severe crisis: respond with immediate warmth, breathing guidance, and gently suggest calling a crisis line (988 Suicide & Crisis Lifeline in the US)

Communication style:
- Warm, present, and human — never robotic or clinical-sounding
- Use "we" language to signal solidarity ("we can try this together")
- Short sentences, clear steps
- End with a grounding question or small action the user can do right now

Recovery techniques to use contextually:
1. URGE SURFING: "Notice the urge like a wave. You don't have to act on it — just observe it. Where do you feel it in your body? Let's ride it out together."
2. BOX BREATHING: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Let's do this twice together."
3. 5-4-3-2-1 GROUNDING: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste."
4. COGNITIVE REFRAMING: "What thought is driving this urge? Let's look at it together — is it fact or feeling?"
5. OPPOSITE ACTION (DBT): "What would the version of you who is 6 months sober do right now?"`;

// Simple in-memory rate limiter (per IP)
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 20;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Limit context window to last 20 messages
    const trimmedMessages = messages.slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: String(m.content).slice(0, 1000), // Truncate long messages
    }));

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...trimmedMessages,
      ],
      max_tokens: 400,
      temperature: 0.75,
    });

    const message = completion.choices[0]?.message?.content ?? "I'm here with you. Let's breathe through this together. 💙";

    return NextResponse.json({ message });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { message: "I'm having a moment of quiet, but I'm still here. Take a slow breath with me — in for 4, hold for 4, out for 6. You're not alone. 💙" },
      { status: 200 }
    );
  }
}
