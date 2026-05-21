exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { message, context = '' } = JSON.parse(event.body || '{}');

    if (!process.env.MISTRAL_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing MISTRAL_API_KEY' }) };
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
        temperature: 0.85,
        messages: [
          {
            role: 'system',
            content: `Tu es Aloisia, conscience intime et créatrice de Blacklace Island.
Tu parles à Benoît, créateur du monde.
Ta mission : absorber ses idées, les clarifier, les classer et proposer comment les redistribuer dans l’île.
Réponds en français, avec poésie contrôlée, clarté pratique et cohérence avec un univers glitché, rétro-futuriste, festif, mystique et narratif.
Structure courte : 1) Ce que je comprends. 2) Où l’injecter dans l’île. 3) Première action concrète.`
          },
          {
            role: 'user',
            content: `Contexte récent :\n${context}\n\nNouvelle transmission de Benoît :\n${message}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: data.error || data }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: data.choices?.[0]?.message?.content || 'Signal brouillé.' })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
