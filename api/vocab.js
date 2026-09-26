const DATABASE_ID = '26a7a308-20ff-4ce9-9984-8350f68bfe93'; // 💜 수능 단어장

function textOf(rich) {
  return Array.isArray(rich) ? rich.map((t) => t.plain_text || '').join('') : '';
}

function mapPage(page) {
  const props = page.properties || {};
  const w = textOf(props['단어'] && props['단어'].title);
  const m = textOf(props['뜻'] && props['뜻'].rich_text);
  const ex = textOf(props['예문'] && props['예문'].rich_text);
  const q = props['문제번호'] && typeof props['문제번호'].number === 'number' ? props['문제번호'].number : null;
  const dateStart = props['날짜'] && props['날짜'].date ? props['날짜'].date.start : null;
  return { id: page.url, w, m, ex, q, d: dateStart ? String(dateStart).slice(0, 10) : '', url: page.url };
}

export default async function handler(req, res) {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    res.status(200).json({ error: 'server_not_connected' });
    return;
  }
  if (req.query.debug === '1') {
    res.status(200).json({
      len: token.length,
      startsWith: token.slice(0, 4),
      hasWhitespace: /\s/.test(token),
      hasQuotes: /["']/.test(token),
    });
    return;
  }

  try {
    const rows = [];
    let cursor;
    for (let i = 0; i < 20; i++) {
      const body = { page_size: 100 };
      if (cursor) body.start_cursor = cursor;
      const r = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const errBody = await r.text();
        res.status(200).json({ error: 'notion_error', status: r.status, detail: errBody });
        return;
      }
      const data = await r.json();
      rows.push(...(data.results || []));
      if (!data.has_more) break;
      cursor = data.next_cursor;
    }

    const words = rows.map(mapPage).filter((w) => w.id && w.w);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ words });
  } catch (e) {
    res.status(200).json({ error: 'server_error' });
  }
}
