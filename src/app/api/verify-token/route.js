import { NextResponse } from 'next/server';

export async function POST(request) {
  const { token } = await request.json();

  // Verify the Turnstile token with Cloudflare
  const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: '1x0000000000000000000000000000000AA',
      response: token,
    }),
  });

  const verificationResult = await verificationResponse.json();

  if (verificationResult.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 400 });
  }
}
