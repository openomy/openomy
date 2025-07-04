import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ContactBodySchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  message: z.string().min(1, { message: 'Message cannot be empty' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = ContactBodySchema.safeParse(body);

    if (!result.success) {
      const formattedErrors = result.error.format();
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formattedErrors,
        },
        { status: 400 },
      );
    }

    const { email, message } = result.data;
    const [name] = email.split('@');
    const response = await fetch(`${process.env.API_BASE_URL}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to send notification', details: errorData },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: 'success' });
  } catch (error) {
    console.error('Error processing notification request:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.format() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
