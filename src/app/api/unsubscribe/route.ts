import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const n8nWebhookUrl = process.env.N8N_UNSUBSCRIBE_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.error('N8N_UNSUBSCRIBE_WEBHOOK_URL is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Forward the unsubscribe request to n8n
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      console.error(`Failed to submit unsubscribe to n8n (status: ${response.status})`);
      // Return 200 anyway so the user sees a success screen, or maybe an error?
      // Usually, it's best to show success to not confuse the user, but we'll return 500 for strictness.
      return NextResponse.json(
        { error: 'Failed to process unsubscribe request with backend provider' },
        { status: response.status === 404 ? 404 : 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Unsubscribe API Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
