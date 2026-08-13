import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId, botId, message } = await req.json();

    if (!userId || !botId || !message) {
      return NextResponse.json({ error: 'Chybí povinné údaje.' }, { status: 400 });
    }

    // 1. Zkontrolujeme stav kreditů uživatele
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Uživatel nenalezen.' }, { status: 404 });
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Nemáš dostatek kreditů pro zprávu.' }, 
        { status: 402 }
      );
    }

    // 2. Načteme AI bota a jeho nastavení (system_prompt)
    const { data: bot, error: botError } = await supabase
      .from('profiles')
      .select('system_prompt, full_name')
      .eq('id', botId)
      .single();

    if (botError || !bot) {
      return NextResponse.json({ error: 'AI profil nenalezen.' }, { status: 404 });
    }

    // 3. Načteme historii konverzace (posledních 6 zpráv pro paměť bota)
    const { data: history } = await supabase
      .from('messages')
      .select('sender_id, content')
      .or(`and(sender_id.${userId},receiver_id.${botId}),and(sender_id.${botId},receiver_id.${userId})`)
      .order('created_at', { ascending: false })
      .limit(6);

    // Sestavíme konverzaci pro OpenAI API
    const formattedHistory = (history || []).reverse().map((msg) => ({
      role: msg.sender_id === userId ? ('user' as const) : ('assistant' as const),
      content: msg.content,
    }));

    // 4. Zavoláme OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: bot.system_prompt || 'Jsi přátelský AI společník na seznamce.' },
        ...formattedHistory,
        { role: 'user', content: message },
      ],
    });

    const aiReply = completion.choices[0]?.message?.content || 'Promiň, zrovna mě nic nenapadá.';

    // 5. Uložíme zprávu od uživatele i odpověď AI do databáze
    await supabase.from('messages').insert([
      { sender_id: userId, receiver_id: botId, content: message },
      { sender_id: botId, receiver_id: userId, content: aiReply },
    ]);

    // 6. Odečteme 1 kredit uživateli
    const newCredits = user.credits - 1;
    await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    return NextResponse.json({
      reply: aiReply,
      remainingCredits: newCredits,
    });

  } catch (error: any) {
    console.error('API Chat Error:', error);
    return NextResponse.json({ error: 'Chyba serveru při generování odpovědi.' }, { status: 500 });
  }
}

