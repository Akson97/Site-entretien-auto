const SYNC_KEY = 'louis-prep-sync-v1';

module.exports = async (req, res) => {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    res.status(500).json({ error: 'KV not configured' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${url}/get/${SYNC_KEY}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = await r.json();
      res.status(200).json({ data: payload.result ? JSON.parse(payload.result) : null });
      return;
    }

    if (req.method === 'POST') {
      const body = JSON.stringify(req.body || {});
      await fetch(`${url}/set/${SYNC_KEY}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    res.status(500).json({ error: 'sync failed' });
  }
};
