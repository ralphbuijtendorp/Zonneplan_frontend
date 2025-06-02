import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`http://localhost:12000/get_electricity_data?date=${date}`);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching electricity prices:', error);
    return NextResponse.json({ error: 'Failed to fetch electricity prices' }, { status: 500 });
  }
}
