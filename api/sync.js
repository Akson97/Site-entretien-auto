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
      if (!r.ok) {
        return res.status(500).json({ error: `Upstash GET failed: ${r.status}` });
      }
      const payload = await r.json();
      res.status(200).json({ data: payload.result ? JSON.parse(payload.result) : null });
      return;
    }

    if (req.method === 'POST') {
      const body = JSON.stringify(req.body || {});
      const setRes = await fetch(`${url}/set/${SYNC_KEY}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      if (!setRes.ok) {
        const errBody = await setRes.text().catch(() => '');
        return res.status(500).json({ error: `Upstash SET failed: ${setRes.status} ${errBody}` });
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    res.status(500).json({ error: `sync failed: ${e.message}` });
  }
};
