import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  try {
    const { userId, creditsAmount, priceInCzk } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Chybí ID uživatele.' }, { status: 400 });
    }

    // Vytvoření platební relace ve Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'czk',
            product_data: {
              name: `Aura Match - ${creditsAmount} kreditů`,
              description: 'Dobití kreditů pro AI chat a prémiové funkce',
            },
            unit_amount: priceInCzk * 100, // Stripe počítá částku v haléřích
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?success=true`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
      metadata: {
        userId,
        creditsAmount: creditsAmount.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření platby.' },
      { status: 500 }
    );
  }
}

