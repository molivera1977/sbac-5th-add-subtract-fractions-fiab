/* Mrs. Olivera's Corner — sends each student's work to her Google Sheet as they go
   and reads it back: for her teacher screen, and so a student can keep going on any device.
   Every answer updates one row per attempt ("In progress", how many answered); the last
   answer makes it "Finished". Updates wait in an outbox on this device until the sheet
   says it has them. A lost send is checked, then sent again; the sheet only moves a row
   forward, so a late or repeated send never undoes newer work. */
(function () {
  'use strict';

  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwtfxLt-jeeoN0pODJdBLRqSDUKDb4h_z3w3LlFtCE_H9zlAs9yNjFWFIp7UXdRjFC3fA/exec';
  const SITE = 'g5-fractions-fiab';
  const OUTBOX_KEY = 'oliveraFracFiab_outbox_v2';
  const PAUSES = [1500, 3000, 4500];

  const read = () => {
    try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]'); } catch (e) { return []; }
  };
  const write = list => {
    try { localStorage.setItem(OUTBOX_KEY, JSON.stringify(list)); } catch (e) { /* private window: nothing is kept */ }
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  try { localStorage.removeItem('oliveraFracFiab_outbox_v1'); } catch (e) { /* the old outbox held finished sets only */ }

  // text/plain body: a simple request, so the browser sends it with no preflight
  async function post(body, ms = 20000) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ms);
    try {
      const res = await fetch(SHEET_URL, { method: 'POST', body: JSON.stringify({ site: SITE, ...body }), signal: ctl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  // Did the sheet get (at least) this update?
  function landed(rec, c) {
    if (!c || !c.ok) return false;
    if (rec.status === 'Restarted') return !c.saved || c.status !== 'In progress';
    if (!c.saved) return false;
    if (rec.status === 'Finished') return c.status === 'Finished';
    return c.status !== 'In progress' || c.answered >= rec.answered;
  }

  async function sendUntilSaved(rec) {
    for (let attempt = 0; ; attempt += 1) {
      try {
        const r = await post({ action: 'save', ...rec });
        if (r.ok && r.saved) return true;
      } catch (e) { /* lost or failed: check below, then send again */ }
      if (attempt === PAUSES.length) return false;
      await wait(PAUSES[attempt]);
      try {
        if (landed(rec, await post({ action: 'check', saveId: rec.saveId }))) return true;
      } catch (e) { /* send again */ }
    }
  }

  // One pass over the outbox, one send at a time. An update queued during the pass is
  // picked up too, and a send never removes a newer update of the same attempt.
  async function runFlush() {
    const tried = new Set();
    for (;;) {
      const next = read().find(r => !tried.has(`${r.saveId}:${r.rev}`));
      if (!next) return read().length;
      tried.add(`${next.saveId}:${next.rev}`);
      if (await sendUntilSaved(next)) write(read().filter(r => !(r.saveId === next.saveId && r.rev === next.rev)));
    }
  }

  let flushing = null;
  function flush() {
    if (!SHEET_URL) return Promise.resolve(read().length);
    if (!flushing) flushing = runFlush().finally(() => { flushing = null; });
    return flushing;
  }

  // The newest update of an attempt replaces any older one still waiting: it holds all of it
  let lastRev = 0;
  function queue(rec) {
    lastRev = Math.max(Date.now(), lastRev + 1);
    write([...read().filter(r => r.saveId !== rec.saveId), { ...rec, rev: lastRev }]);
  }

  const isPending = saveId => read().some(r => r.saveId === saveId);
  const newSaveId = () => `S-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  // A student's unfinished attempts in the sheet: { ok, places } — throws if it can't be reached
  function loadPlaces(name) {
    if (!SHEET_URL) return Promise.resolve({ ok: true, places: [] });
    return post({ action: 'resume', name }, 8000);
  }

  // { ok: true, rows } or { ok: false, error }; throws when the sheet can't be reached
  function loadScores(pin) {
    if (!SHEET_URL) return Promise.resolve({ ok: false, error: 'No sheet is connected yet' });
    return post({ action: 'scores', pin });
  }

  window.OliveraSheet = { connected: Boolean(SHEET_URL), queue, flush, isPending, newSaveId, loadPlaces, loadScores };
})();
