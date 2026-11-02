/* Mrs. Olivera's 5th Grade SBAC Math Practice
   Add and Subtract with Equivalent Fractions (FIAB) — three sets of 15.
   Scores stay on this device (localStorage), like her NBT review, and each
   finished set also goes to Mrs. Olivera's Corner (Google Sheets, sheet.js)
   so her teacher screen shows the whole class on any device. */
(function () {
  'use strict';

  const READ_RATE = 0.82;
  // Only a scramble of her PIN is written here; the sheet checks the real PIN before it gives class scores
  const PIN_HASH = '318447e5';
  const PLACES_KEY = 'oliveraFracFiab_places_v2'; // each student's unfinished sets on this device, by name
  const SCORES_KEY = 'oliveraFracFiab_scores_v1';
  const SET_NAMES = { W: 'Warm Up', R: 'Review', TA: 'Test A', TB: 'Test B' };
  // Takes per level and the set each take uses (Marcos 11/2: "2 takes at each of Warm Up and
  // Review, then 1 of each Test A and Test B"). Take 2 has new numbers and new answers.
  const TAKES = { W: ['W', 'W2'], R: ['R', 'R2'], TA: ['TA'], TB: ['TB'] };
  const levelOf = set => Object.keys(TAKES).find(l => TAKES[l].includes(set)) || set;
  const takeNo = set => TAKES[levelOf(set)].indexOf(set) + 1;
  const setLabel = set => `${SET_NAMES[levelOf(set)]}${takeNo(set) > 1 ? ' · take 2' : ''}`;

  const SETS = window.SETS;
  const SKILL_NAMES = window.SKILL_NAMES;
  const $ = sel => document.querySelector(sel);

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private window: nothing is kept */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* same */ }
    }
  };

  /* ------------------------------------------------------------ math markup */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function splitToken(inner) {
    const m = inner.match(/^(?:(\d+) )?([^/ ]+)\/([^/ ]+)$/);
    return m ? { whole: m[1] || '', num: m[2], den: m[3] } : null;
  }
  const opHTML = s => esc(s).replace(/×/g, '<span class="op">×</span>').replace(/\+/g, '<span class="op">+</span>');

  function fracHTML(inner) {
    const t = splitToken(inner);
    if (!t) return esc(inner);
    const f = `<span class="fr"><span class="fn">${opHTML(t.num)}</span><span class="fd">${opHTML(t.den)}</span></span>`;
    return t.whole ? `<span class="mx"><span class="mw">${t.whole}</span>${f}</span>` : f;
  }
  function mathHTML(str) {
    return String(str).split(/(\{[^}]+\})/).map(part =>
      part.startsWith('{') && part.endsWith('}')
        ? fracHTML(part.slice(1, -1))
        : esc(part).replace(/□/g, '<span class="box-sym" aria-label="box"></span>')
    ).join('');
  }
  const linesHTML = str => String(str).split('\n').map(l => `<div class="line">${mathHTML(l)}</div>`).join('');

  /* ------------------------------------------------------------ speech text */
  const ORD = ['', 'first', 'half', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
    'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const TENS_ORD = ['', '', 'twentieth', 'thirtieth', 'fortieth', 'fiftieth', 'sixtieth', 'seventieth', 'eightieth', 'ninetieth'];

  function denName(d) {
    if (d < 20) return ORD[d];
    if (d === 100) return 'hundredth';
    if (d < 100) {
      const t = Math.floor(d / 10), o = d % 10;
      return o ? `${TENS[t]}-${o === 2 ? 'second' : ORD[o]}` : TENS_ORD[t];
    }
    return null;
  }
  const opWords = s => s.replace(/×/g, ' times ').replace(/\+/g, ' plus ');

  function fracWords(inner) {
    const t = splitToken(inner);
    if (!t) return inner;
    const plain = /^\d+$/.test(t.num) && /^\d+$/.test(t.den);
    const name = plain ? denName(Number(t.den)) : null;
    let f;
    if (name) f = `${t.num} ${t.num === '1' ? name : (name === 'half' ? 'halves' : name + 's')}`;
    else f = `${opWords(t.num)}, over ${opWords(t.den)},`;
    return t.whole ? `${t.whole} and ${f}` : f;
  }
  /* ------------------------------------------------------------ what is shown = what is said
     A spoken box is built from word spans. Each span shows a word, a whole fraction or a sign,
     and carries what the voice says for it (data-say: "3 fourths", "plus"). The box's spoken
     text is put together from its spans in order (spokenOf), so the span at the voice's
     charIndex is the word being said and lights up (lightAt): the same for the device's
     voice and for the Kokoro recordings, which report each word's charIndex too. */
  const SIGN_SAY = { '+': 'plus', '−': 'minus', '=': 'equals', '×': 'times', '□': 'box', '🔊': 'the speaker button' };
  const wordSpan = (show, say, stop) => `<span class="w" data-say="${esc(say)}"${stop ? ' data-stop' : ''}>${show}</span>`;
  // stop: the piece ends a sentence when read aloud (a pause), as each part, line and bubble did before
  function sayHTML(str, stop = true) {
    const pieces = [];   // [show, say]; say null = a space
    String(str).split(/(\{[^}]+\})/).forEach(part => {
      if (!part) return;
      if (part.startsWith('{') && part.endsWith('}')) { pieces.push([fracHTML(part.slice(1, -1)), fracWords(part.slice(1, -1))]); return; }
      part.split(/(\s+)/).forEach(chunk => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) { pieces.push([chunk, null]); return; }
        const last = pieces[pieces.length - 1];
        if (/^[.,;:?!)]+$/.test(chunk) && last && last[1] !== null) { last[0] += esc(chunk); last[1] += chunk; return; }   // "{3/4}." stays one word
        if (chunk === '□') pieces.push(['<span class="box-sym" aria-label="box"></span>', 'box']);
        else pieces.push([esc(chunk), SIGN_SAY[chunk] || chunk]);
      });
    });
    let lastSaid = -1;
    pieces.forEach((pc, i) => { if (pc[1] !== null) lastSaid = i; });
    return pieces.map((pc, i) => (pc[1] === null ? pc[0] : wordSpan(pc[0], pc[1], stop && i === lastSaid))).join('');
  }
  const linesSayHTML = str => String(str).split('\n').map(l => `<div class="line">${sayHTML(l)}</div>`).join('');

  // The words a box says, in order, and where each span's words start in that text
  function spokenOf(box) {
    let text = '';
    const marks = [];
    box.querySelectorAll('.w').forEach(w => {
      const say = (w.dataset.say || '').trim();
      if (!say) return;
      if (text) text += ' ';
      marks.push([text.length, w]);
      text += say;
      if (w.hasAttribute('data-stop') && !/[.?!:]$/.test(text)) text = `${text.replace(/,$/, '')}.`;
    });
    return { text, marks };
  }

  // Light the span being said: the last one starting at or before the voice's charIndex
  let litWord = null;
  function lightAt(marks, at) {
    let hit = null;
    for (const [start, w] of marks) { if (start <= at) hit = w; else break; }
    if (hit === litWord) return;
    if (litWord) litWord.classList.remove('hl');
    litWord = hit;
    if (hit) hit.classList.add('hl');
  }
  function unlight() {
    if (litWord) litWord.classList.remove('hl');
    litWord = null;
  }

  /* ------------------------------------------------------------ read aloud */
  let readingEl = null;
  function pickVoice() {
    const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return vs.find(v => v.default && /^en/i.test(v.lang)) || vs.find(v => /^en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
  }
  let speaking = null;   // the reading now playing; marked when something stops it
  function stopReading() {
    if (speaking) speaking.stopped = true;
    unlight();
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { /* no speech on this device */ }
    if (readingEl) readingEl.classList.remove('reading');
    readingEl = null;
  }
  // onHeard runs only if the reading plays to the end (not stopped by another 🔊 or by leaving the page).
  // Returns false when this computer cannot read aloud.
  function readAloud(text, el, onHeard, marks) {
    stopReading();
    if (!window.speechSynthesis) return false;
    const u = new SpeechSynthesisUtterance(text);
    speaking = u;
    if (marks) u.onboundary = e => { if (speaking === u) lightAt(marks, e.charIndex); };
    u.rate = READ_RATE;
    const v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-US'; }
    if (el) { el.classList.add('reading'); readingEl = el; }
    u.onend = u.onerror = e => {
      if (el) el.classList.remove('reading');
      if (readingEl === el) readingEl = null;
      if (speaking === u) { speaking = null; unlight(); }
      if (onHeard && e.type === 'end' && !u.stopped) onHeard();
    };
    speechSynthesis.speak(u);
    return true;
  }
  // Several lines, one after another, 900 ms apart, each its own short reading (Chrome can cut
  // off one long reading partway). onHeard runs after the last line ends, unless it was stopped.
  function readLines(lines, el, onHeard) {   // lines: [{ text, marks }]
    stopReading();
    if (!window.speechSynthesis) return false;
    const run = { stopped: false };
    speaking = run;
    if (el) { el.classList.add('reading'); readingEl = el; }
    const done = ok => {
      if (speaking === run) { speaking = null; unlight(); }
      if (el) el.classList.remove('reading');
      if (readingEl === el) readingEl = null;
      if (ok && !run.stopped && onHeard) onHeard();
    };
    const say = i => {
      if (run.stopped) return;
      const u = new SpeechSynthesisUtterance(lines[i].text);
      if (lines[i].marks) u.onboundary = e => { if (!run.stopped) lightAt(lines[i].marks, e.charIndex); };
      u.rate = READ_RATE;
      const v = pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-US'; }
      u.onend = () => {
        if (run.stopped) done(false);
        else if (i + 1 < lines.length) setTimeout(() => say(i + 1), 900);
        else done(true);
      };
      u.onerror = () => done(false);
      speechSynthesis.speak(u);
    };
    say(0);
    return run;
  }
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};

  // 🔊 buttons read the words in their own box, or in the box data-box points at
  const sayBtn = (label, box) => `<button type="button" class="say"${box ? ` data-box="${box}"` : ''} aria-label="${esc(label || 'Read aloud')}">🔊</button>`;
  document.addEventListener('click', e => {
    const b = e.target.closest('.say');
    if (!b) return;
    e.stopPropagation();
    e.preventDefault();
    const box = b.dataset.box ? document.querySelector(b.dataset.box) : b.closest('[data-read-box]');
    if (!box) return;
    const { text, marks } = spokenOf(box);
    readAloud(text, box, null, marks);
  }, true);

  /* ------------------------------------------------------------ pictures */
  function barsSVG({ den, shaded }) {
    const w = 72, h = 168, gap = 20, ch = h / den;
    const W = shaded.length * w + (shaded.length - 1) * gap + 4;
    let s = '';
    shaded.forEach((k, b) => {
      const x = 2 + b * (w + gap);
      for (let i = 0; i < den; i++) {
        s += `<rect x="${x}" y="${(2 + i * ch).toFixed(2)}" width="${w}" height="${ch.toFixed(2)}" class="cell${i >= den - k ? ' on' : ''}"/>`;
      }
    });
    return `<div class="model-wrap"><svg class="model" viewBox="0 0 ${W} ${h + 4}" width="${W}" height="${h + 4}" role="img" aria-label="Bar model">${s}</svg></div>`;
  }
  function gridsSVG(list) {
    const cell = 46;
    const figs = list.map(g => {
      const W = g.cols * cell + 4, H = g.rows * cell + 4;
      let s = '';
      for (let c = 0; c < g.cols; c++) {
        for (let r = 0; r < g.rows; r++) {
          const on = c * g.rows + r < g.shaded;
          s += `<rect x="${2 + c * cell}" y="${2 + r * cell}" width="${cell}" height="${cell}" class="cell${on ? ' on' : ''}"/>`;
        }
      }
      return `<figure class="grid-fig"><figcaption>${esc(g.label)}</figcaption><svg class="model" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(g.label)}">${s}</svg></figure>`;
    }).join('');
    return `<div class="model-wrap grids">${figs}</div>`;
  }
  function nlineSVG({ den, at, label }) {
    const W = 460, x0 = 40, x1 = 420, y = 56;
    const step = (x1 - x0) / den;
    let s = `<line x1="8" y1="${y}" x2="${W - 8}" y2="${y}" class="axis"/>`;
    s += `<path d="M8 ${y} l12 -7 v14 z" class="arrow"/><path d="M${W - 8} ${y} l-12 -7 v14 z" class="arrow"/>`;
    for (let i = 0; i <= den; i++) {
      const x = x0 + i * step;
      s += `<line x1="${x.toFixed(2)}" y1="${y - 10}" x2="${x.toFixed(2)}" y2="${y + 10}" class="tick"/>`;
    }
    s += `<text x="${x0}" y="${y + 36}" class="nl-num">0</text><text x="${x1}" y="${y + 36}" class="nl-num">1</text>`;
    const px = x0 + at * step;
    s += `<circle cx="${px.toFixed(2)}" cy="${y}" r="7" class="pt"/><text x="${px.toFixed(2)}" y="${y - 20}" class="nl-pt">${esc(label)}</text>`;
    return `<div class="model-wrap"><svg class="model nline" viewBox="0 0 ${W} 100" width="${W}" height="100" role="img" aria-label="Number line from 0 to 1">${s}</svg></div>`;
  }

  /* ------------------------------------------------------------ item pieces */
  function partHTML(p) {
    if (p.p) return `<p class="stem-p">${sayHTML(p.p)}</p>`;
    if (p.eq) return `<div class="stem-eq">${sayHTML(p.eq)}</div>`;
    if (p.bullets) return `<ul class="stem-list">${p.bullets.map(b => `<li>${sayHTML(b)}</li>`).join('')}</ul>`;
    if (p.steps) return `<div class="stem-steps">${p.steps.map(st => `<div>${sayHTML(st)}</div>`).join('')}</div>`;
    if (p.bubbles) {
      return `<div class="bubbles">${p.bubbles.map(([n, t]) =>
        `<div class="bubble"><div class="bubble-body"><b>${wordSpan(`${esc(n)}:`, `${n} says:`)}</b> ${sayHTML(t)}</div><span class="puff p1"></span><span class="puff p2"></span></div>`).join('')}</div>`;
    }
    if (p.bars) return barsSVG(p.bars);
    if (p.grids) return gridsSVG(p.grids);
    if (p.nline) return nlineSVG(p.nline);
    return '';
  }
  // the question box: every part, then the question it asks
  const stemHTML = it => `${it.parts.map(partHTML).join('')}${it.ask ? `<p class="ask">${sayHTML(it.ask)}</p>` : ''}`;
  const reminderHTML = it => `${sayBtn('Read the reminder')}<span class="reminder-text"><span aria-hidden="true">💡</span> <b>${wordSpan('Reminder:', 'Reminder:')}</b> ${sayHTML(it.hint)}</span>`;

  // the feedback box for one answer: right, a wrong choice, a typed answer that matches a trap, or another wrong answer
  function whyOf(it, ok, picked) {
    if (ok) return '';
    if (it.type === 'mc') return it.choices[picked].why || '';
    const trap = (it.traps || []).find(t => sameValue(parseFrac(String(picked)), parseFrac(t.v)));
    return trap ? trap.why : '';
  }
  function feedbackHTML(it, ok, picked) {
    const why = whyOf(it, ok, picked);
    // a <div>, not a <p>: the choice lines are <div>s, and a <div> inside a <p> splits the paragraph
    const answerLine = ok ? '' : (it.type === 'mc'
      ? `<div class="fb-answer">${sayHTML('The correct answer is', false)} <b>${'ABCD'[it.answer]}</b>: <div class="ans-inline">${linesSayHTML(it.choices[it.answer].t)}</div></div>`
      : `<div class="fb-answer">${sayHTML(`The answer is {${it.key}}`, false)} ${sayHTML('(or any fraction equal to it).')}</div>`);
    return `
      <div class="fb-head"><span>${ok ? '✅' : '❌'} ${sayHTML(ok ? 'Correct!' : 'Not quite.')}</span>${sayBtn('Read the feedback')}</div>
      ${why ? `<p class="fb-why">${sayHTML(why)}</p>` : ''}
      ${answerLine}
      <div class="fb-explain"><b>${sayHTML('How to solve it:', false)}</b> ${sayHTML(it.explain)}</div>`;
  }

  // a one-line summary for the results list and the answer key
  function itemSummary(it) {
    const eqs = it.parts.filter(p => p.eq).map(p => p.eq);
    const ps = it.parts.filter(p => p.p).map(p => p.p);
    if (it.type === 'entry') return eqs.length ? `${ps[0]} ${eqs[0]}` : ps.length > 1 ? `${ps[0]} ${ps[ps.length - 1]}` : ps[0] || '';
    if (it.ask && eqs.length) return `${it.ask} (${eqs.join('; ')})`;
    if (it.ask && ps.length) return `${ps[0]} ${it.ask}`;
    return it.ask || ps[0] || '';
  }
  const keyText = it => it.type === 'mc' ? it.choices[it.answer].t : `{${it.key}}`;

  /* ------------------------------------------------------------ fractions */
  const parseFrac = s => { const [n, d] = String(s).split('/').map(Number); return [n, d]; };
  const sameValue = (a, b) => a[0] * b[1] === b[0] * a[1];

  /* ------------------------------------------------------------ screens */
  function show(id) {
    stopReading();
    document.querySelectorAll('.screen').forEach(s => { s.hidden = s.id !== id; });
    document.body.dataset.screen = id;
    window.scrollTo(0, 0);
  }

  let state = null;     // { name, set, idx, results: { id: { ok, picked } }, started }
  let selected = null;  // chosen choice index on an MC item
  let locked = false;   // true once the item is checked

  function setBanner() {
    const b = $('#set-banner');
    b.textContent = setLabel(state.set);
    b.className = `set-pill set-${levelOf(state.set)}`;
  }

  /* ------------------------------------------------------------ saved places
     A student's unfinished set is kept under their own name, so two students on one
     Chromebook never erase each other, and it goes to her sheet after every answer,
     so it follows them to any device and she sees it in progress. */
  let chooseName = '';     // the student on the choice page: first and last name, as her sheet keeps it
  let chooseFirst = '';    // their first name, to say hi
  let choosePlaces = {};   // set → their unfinished state
  let chooseDone = {};     // level → { best, tries } of their finished takes (opens the next level)
  let looking = false;     // checking her sheet for this student's work
  // Levels go in order: each one opens when the one before it is finished (Marcos 11/2)
  const ORDER = Object.keys(SET_NAMES);
  const isOpen = set => ORDER.indexOf(set) === 0 || ORDER[ORDER.indexOf(set) - 1] in chooseDone || Boolean(choosePlaces[set]);
  const normName = n => String(n || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const placeKey = (name, set) => `${normName(name)}|${set}`;
  const allPlaces = () => store.get(PLACES_KEY, {});
  const savePlace = st => store.set(PLACES_KEY, { ...allPlaces(), [placeKey(st.name, st.set)]: st });
  function dropPlace(name, set) {
    const rest = { ...allPlaces() };
    delete rest[placeKey(name, set)];
    store.set(PLACES_KEY, rest);
  }
  const unfinished = st => Boolean(st && SETS[st.set] && st.saveId && st.idx > 0 && st.idx < SETS[st.set].length);

  function localPlaces(name) {
    const out = {};
    Object.values(allPlaces()).forEach(st => {
      if (normName(st.name) !== normName(name) || !unfinished(st)) return;
      const l = levelOf(st.set);
      if (!out[l] || (st.updated || 0) > (out[l].updated || 0)) out[l] = st;
    });
    return out;
  }

  // a row from her sheet back into a place this page can keep going from
  function placeFromSheet(p) {
    if (!SETS[p.set]) return null;
    let answers;
    try { answers = JSON.parse(p.answers || '{}'); } catch (e) { return null; }
    const idx = Number(p.answered) || 0;
    const results = {};
    SETS[p.set].slice(0, idx).forEach(it => { const a = answers[it.id]; if (a) results[it.id] = { ok: Boolean(a[0]), picked: a[1] }; });
    const st = { name: p.name, set: p.set, idx, results, started: Date.parse(p.startedAt) || Date.now(),
      saveId: p.saveId, updated: Date.parse(p.updatedAt) || 0 };
    return unfinished(st) && Object.keys(results).length === idx ? st : null;
  }

  // what goes to her sheet: the attempt so far, or finished
  function attemptRecord(st, finished) {
    const items = SETS[st.set];
    const done = items.slice(0, st.idx);
    const right = done.filter(it => (st.results[it.id] || {}).ok).length;
    const pct = finished ? Math.round((right / items.length) * 100) : (st.idx ? Math.round((right / st.idx) * 100) : 0);
    const answers = {};
    done.forEach(it => { const r = st.results[it.id]; if (r) answers[it.id] = [r.ok ? 1 : 0, r.picked]; });
    return {
      saveId: st.saveId, name: st.name, set: st.set, pts: right, tot: items.length, pct,
      grade: finished ? gradeFor(pct).l : '',
      missed: done.filter(it => !(st.results[it.id] || {}).ok).map(it => it.id).join(', '),
      finishedAt: finished ? new Date().toISOString() : '',
      status: finished ? 'Finished' : 'In progress', answered: st.idx,
      answers: JSON.stringify(answers), startedAt: new Date(st.started).toISOString()
    };
  }

  // The moment the last question is checked, the set counts: kept on this device and sent
  // to her sheet, even if the page closes before "See My Score"
  function recordFinish(st) {
    const rec = attemptRecord(st, true);
    const now = new Date();
    const scores = store.get(SCORES_KEY, []);
    scores.push({
      name: st.name, set: st.set, pts: rec.pts, tot: rec.tot, pct: rec.pct, grade: rec.grade,
      date: `${now.toLocaleDateString()} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      missed: rec.missed ? rec.missed.split(', ') : []
    });
    store.set(SCORES_KEY, scores);
    dropPlace(st.name, st.set);
    OliveraSheet.queue(rec);
    OliveraSheet.flush();
  }

  // finished takes on this device, per level: best score and how many (her sheet adds the other devices)
  function localDone(name) {
    const out = {};
    store.get(SCORES_KEY, []).forEach(sc => {
      if (normName(sc.name) !== normName(name) || !SETS[sc.set]) return;
      const d = out[levelOf(sc.set)] || (out[levelOf(sc.set)] = { best: 0, tries: 0 });
      d.best = Math.max(d.best, sc.pct);
      d.tries += 1;
    });
    return out;
  }

  // A level with a saved place keeps going there. Otherwise the next take: take 1, then take 2
  // with new numbers. Past the last take (and to start over mid-set) needs Mrs. Olivera's PIN
  // (Marcos 11/2: "require a pin for a restart").
  function startSet(level) {
    if (!isOpen(level)) return;
    if (choosePlaces[level]) { beginSet(choosePlaces[level].set); return; }
    const takes = TAKES[level];
    const tries = (chooseDone[level] || {}).tries || 0;
    if (tries >= takes.length && !askPin(`let ${chooseName} take ${SET_NAMES[level]} again`)) return;
    beginSet(takes[tries % takes.length]);
  }

  function startOver(level) {
    const old = choosePlaces[level];
    if (!old || !askPin(`let ${chooseName} start ${setLabel(old.set)} over`)) return;
    dropPlace(old.name, old.set);
    OliveraSheet.queue({ saveId: old.saveId, status: 'Restarted' });
    OliveraSheet.flush();
    delete choosePlaces[level];
    beginSet(old.set);
  }

  function beginSet(set) {
    const place = choosePlaces[levelOf(set)];
    state = place && place.set === set ? { ...place, name: chooseName || place.name }
      : { name: chooseName, set, idx: 0, results: {}, started: Date.now(), saveId: OliveraSheet.newSaveId() };
    renderItem();
  }

  function renderItem() {
    const items = SETS[state.set];
    if (state.idx >= items.length) { showResults(); return; }
    const it = items[state.idx];
    selected = null;
    locked = false;
    setBanner();
    $('#q-count').textContent = `Question ${state.idx + 1} of ${items.length}`;
    $('#progress-fill').style.width = `${(state.idx / items.length) * 100}%`;

    let answerArea;
    if (it.type === 'mc') {
      answerArea = `<div class="choices" role="radiogroup" aria-label="Answer choices">${it.choices.map((ch, i) =>
        `<div class="choice" role="radio" aria-checked="false" tabindex="0" data-i="${i}" data-read-box>
           <span class="letter">${'ABCD'[i]}</span>
           <span class="choice-body">${linesSayHTML(ch.t)}</span>
           ${sayBtn(`Read choice ${'ABCD'[i]}`)}
         </div>`).join('')}</div>`;
    } else {
      answerArea = `<div class="entry">
          <div class="entry-label">Type your answer as a fraction.</div>
          <div class="frac-in">
            <input id="ans-n" type="text" inputmode="numeric" autocomplete="off" maxlength="4" aria-label="Top number (numerator)">
            <div class="frac-bar"></div>
            <input id="ans-d" type="text" inputmode="numeric" autocomplete="off" maxlength="4" aria-label="Bottom number (denominator)">
          </div>
        </div>`;
    }

    // Warm Up: a 💡 Reminder that is open and reads itself (the MM2 Warm-Up pattern), with its own 🔊
    const remind = levelOf(state.set) === 'W' && it.hint;
    const reminder = remind
      ? `<div class="reminder" data-read-box>${reminderHTML(it)}</div>`
      : '';

    $('#item').innerHTML = `
      <div class="item-head"><span class="item-num">${state.idx + 1}</span>${sayBtn('Read the question', '#item .stem')}</div>
      <div class="stem" data-read-box>${stemHTML(it)}</div>
      ${reminder}
      ${answerArea}
      <div id="feedback" class="feedback" hidden></div>
      <button type="button" id="check-btn" class="btn" disabled>Check Answer</button>`;

    if (remind) {
      const shown = it;
      setTimeout(() => {
        const btn = document.querySelector('#item .reminder .say');
        if (btn && state && SETS[state.set][state.idx] === shown && !locked) btn.click();
      }, 400);
    }

    if (it.type === 'mc') {
      document.querySelectorAll('.choice').forEach(el => {
        const pick = () => {
          if (locked) return;
          selected = Number(el.dataset.i);
          document.querySelectorAll('.choice').forEach(c => {
            const on = c === el;
            c.classList.toggle('picked', on);
            c.setAttribute('aria-checked', String(on));
          });
          $('#check-btn').disabled = false;
        };
        el.addEventListener('click', pick);
        el.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pick(); } });
      });
    } else {
      const n = $('#ans-n'), d = $('#ans-d');
      const update = () => {
        [n, d].forEach(inp => { inp.value = inp.value.replace(/\D/g, ''); });
        $('#check-btn').disabled = !(n.value && d.value && Number(d.value) > 0);
      };
      n.addEventListener('input', update);
      d.addEventListener('input', update);
      n.addEventListener('keydown', e => { if (e.key === 'Enter' || (e.key === '/' && n.value)) { e.preventDefault(); d.focus(); } });
      d.addEventListener('keydown', e => { if (e.key === 'Enter' && !$('#check-btn').disabled) checkAnswer(); });
    }
    $('#check-btn').addEventListener('click', () => (locked ? nextItem() : checkAnswer()));
    show('quiz');
  }

  function checkAnswer() {
    const it = SETS[state.set][state.idx];
    let ok, picked;
    if (it.type === 'mc') {
      if (selected == null) return;
      ok = selected === it.answer;
      picked = selected;
    } else {
      const n = Number($('#ans-n').value), d = Number($('#ans-d').value);
      if (!$('#ans-n').value || !(d > 0)) return;
      ok = sameValue([n, d], parseFrac(it.key));
      picked = `${n}/${d}`;
    }
    locked = true;
    state.results[it.id] = { ok, picked };
    state.idx += 1; // saved one ahead, so coming back never asks this item again
    state.updated = Date.now();
    if (state.idx >= SETS[state.set].length) recordFinish(state);
    else {
      savePlace(state);
      OliveraSheet.queue(attemptRecord(state, false));
      OliveraSheet.flush();
    }
    showFeedback(it, ok, picked);
  }

  function showFeedback(it, ok, picked) {
    if (it.type === 'mc') {
      document.querySelectorAll('.choice').forEach(c => {
        const i = Number(c.dataset.i);
        c.classList.add('locked');
        c.setAttribute('aria-disabled', 'true');
        if (i === it.answer) c.classList.add('is-right');
        else if (i === picked) c.classList.add('is-wrong');
      });
    } else {
      $('#ans-n').disabled = true;
      $('#ans-d').disabled = true;
    }
    const fb = $('#feedback');
    fb.className = `feedback ${ok ? 'ok' : 'no'}`;
    fb.setAttribute('data-read-box', '');
    fb.innerHTML = feedbackHTML(it, ok, picked);
    fb.hidden = false;

    const last = state.idx >= SETS[state.set].length;
    const btn = $('#check-btn');
    btn.textContent = last ? 'See My Score' : 'Next Question →';
    btn.disabled = false;
    $('#progress-fill').style.width = `${(state.idx / SETS[state.set].length) * 100}%`;
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function nextItem() {
    renderItem();
  }

  /* ------------------------------------------------------------ results */
  function gradeFor(pct) {
    if (pct >= 97) return { l: 'A+', c: 'g-a', m: 'Outstanding! Perfect mastery.' };
    if (pct >= 93) return { l: 'A', c: 'g-a', m: 'Excellent work!' };
    if (pct >= 90) return { l: 'A-', c: 'g-a', m: 'Great job! Very strong understanding.' };
    if (pct >= 87) return { l: 'B+', c: 'g-b', m: 'Very good effort!' };
    if (pct >= 83) return { l: 'B', c: 'g-b', m: 'Good job! You’re getting the hang of it.' };
    if (pct >= 80) return { l: 'B-', c: 'g-b', m: 'Solid work, keep it up!' };
    if (pct >= 70) return { l: 'C', c: 'g-c', m: 'Fair job. A little more review will help.' };
    if (pct >= 60) return { l: 'D', c: 'g-d', m: 'Almost there. Try again!' };
    return { l: 'F', c: 'g-d', m: 'Keep practicing. You can do this!' };
  }

  function pickedHTML(it, picked) {
    if (picked == null) return '—';
    return it.type === 'mc' ? linesHTML(it.choices[picked].t) : mathHTML(`{${picked}}`);
  }

  // "See My Score": the set was already saved the moment its last question was checked
  function showResults() {
    const items = SETS[state.set];
    const pts = items.filter(it => state.results[it.id] && state.results[it.id].ok).length;
    const pct = Math.round((pts / items.length) * 100);
    const g = gradeFor(pct);

    $('#r-name').textContent = `${state.name} · ${setLabel(state.set)}`;
    $('#r-pts').textContent = `${pts}/${items.length}`;
    $('#r-pct').textContent = `${pct}%`;
    const gr = $('#r-grade');
    gr.textContent = g.l;
    gr.className = `stat ${g.c}`;
    $('#r-msg').textContent = g.m;
    $('#reward').hidden = pct < 80;
    $('#reward-msg').textContent = pct >= 90 ? 'Excellent Mastery!' : 'Solid Achievement!';

    // skill by skill
    const bySkill = {};
    items.forEach((it, i) => {
      const s = bySkill[it.skill] || (bySkill[it.skill] = { right: 0, total: 0, missed: [] });
      s.total += 1;
      if ((state.results[it.id] || {}).ok) s.right += 1;
      else s.missed.push({ it, n: i + 1 });
    });
    $('#skill-table').innerHTML = Object.keys(bySkill).map(k => {
      const s = bySkill[k];
      const cls = s.right === s.total ? 'all' : (s.right === 0 ? 'none' : 'some');
      return `<tr class="${cls}"><td>${esc(SKILL_NAMES[k])}</td><td>${s.right} of ${s.total}</td></tr>`;
    }).join('');

    const missed = Object.keys(bySkill).filter(k => bySkill[k].missed.length);
    $('#missed').innerHTML = missed.length ? `<h3 class="missed-title">Questions to look at again</h3>` + missed.map(k =>
      `<div class="miss-group"><h4>${esc(SKILL_NAMES[k])}</h4>${bySkill[k].missed.map(({ it, n }) => `
        <div class="miss">
          <div class="miss-q"><b>Question ${n}:</b> ${mathHTML(itemSummary(it))}</div>
          <div class="miss-row"><span class="miss-label you">You answered</span><span>${pickedHTML(it, (state.results[it.id] || {}).picked)}</span></div>
          <div class="miss-row"><span class="miss-label key">Answer</span><span>${it.type === 'mc' ? linesHTML(keyText(it)) : mathHTML(keyText(it))}</span></div>
        </div>`).join('')}</div>`).join('')
      : `<p class="all-right">You got every question right! 🎉</p>`;

    $('#progress-fill').style.width = '100%';
    show('results');
    sendToTeacher(state.saveId);
    if (pct >= 80 && window.confetti) {
      window.confetti(pct >= 90 ? { particleCount: 150, spread: 70, origin: { y: 0.6 } } : { particleCount: 50, spread: 45, origin: { y: 0.7 }, scalar: 0.8 });
    }
    state = null;
  }

  function sendToTeacher(saveId) {
    const note = $('#r-sent');
    note.hidden = !OliveraSheet.connected;
    if (note.hidden) return;
    note.dataset.saveId = saveId;
    note.className = 'sent-note';
    note.textContent = 'Sending your score to Mrs. Olivera…';
    // A pass already under way (say, from page load) picks this save up too
    OliveraSheet.flush()
      .then(() => {
        if (note.dataset.saveId !== saveId) return;
        const sent = !OliveraSheet.isPending(saveId);
        note.className = `sent-note ${sent ? 'sent-ok' : 'sent-wait'}`;
        note.textContent = sent ? '✅ Mrs. Olivera has your score.'
          : 'Your score is saved on this computer. It will go to Mrs. Olivera the next time this page opens.';
      });
  }

  /* ------------------------------------------------------------ teacher: class scores */
  let teacherPin = null;
  let classList = [];
  let heatSet = 'W';

  const rowTime = r => Date.parse(r.updatedAt || r.finishedAt || r.savedAt) || 0;

  // One entry per student (names matched without case or extra spaces). Per level: every
  // finished take (first, latest, best), "now" = a take still in progress (unless they
  // finished it later), and how many times she let them start over.
  function groupStudents(rows) {
    const students = {};
    rows.forEach(r => {
      const key = normName(r.name);
      if (!key || !SETS[r.set]) return;
      const st = students[key] || (students[key] = { name: '', sets: {} });
      // rows come oldest first, so the newest spelling wins; "maya" shows as "Maya"
      st.name = String(r.name).trim().replace(/\s+/g, ' ').replace(/(^|\s)(\S)/g, (m, sp, c) => sp + c.toUpperCase());
      const lvl = levelOf(r.set);
      const cell = st.sets[lvl] || (st.sets[lvl] = { takes: [], first: null, best: null, latest: null, now: null });
      if (r.status === 'In progress') {
        if (!cell.now || rowTime(r) > rowTime(cell.now)) cell.now = r;
        return;
      }
      if (r.status === 'Restarted') { cell.restarts = (cell.restarts || 0) + 1; return; } // started over, with her PIN
      if (r.status !== 'Finished') return;
      cell.takes.push(r);
      if (!cell.best || r.pct > cell.best.pct) cell.best = r;
      if (!cell.first || rowTime(r) < rowTime(cell.first)) cell.first = r;
      if (!cell.latest || rowTime(r) >= rowTime(cell.latest)) cell.latest = r;
    });
    Object.keys(students).forEach(k => {
      const st = students[k];
      Object.keys(st.sets).forEach(s => {
        const c = st.sets[s];
        if (c.now && c.latest && rowTime(c.latest) >= rowTime(c.now)) c.now = null;
        if (!c.latest && !c.now) delete st.sets[s];
      });
      if (!Object.keys(st.sets).length) delete students[k];
    });
    return Object.values(students).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }

  function ago(iso) {
    const mins = Math.round((Date.now() - (Date.parse(iso) || 0)) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    if (mins < 24 * 60) return `${Math.round(mins / 60)} hr ago`;
    return new Date(iso).toLocaleDateString();
  }

  function classHTML(rows, list) {
    const sets = Object.keys(SET_NAMES);
    const finished = rows.filter(r => SETS[r.set] && r.status === 'Finished');
    const working = list.flatMap(st => sets.filter(s => st.sets[s] && st.sets[s].now).map(s => ({ name: st.name, set: s, r: st.sets[s].now })))
      .sort((a, b) => rowTime(b.r) - rowTime(a.r));
    // a save that waited offline arrives late, so take the newest finish time, not the last row
    const times = finished.map(r => Date.parse(r.finishedAt || r.savedAt)).filter(n => !isNaN(n));
    const last = new Date(Math.max(...times));
    const lastText = times.length ? ` · last finished ${last.toLocaleDateString()} at ${last.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : '';

    // one take: its score; two or more: 1st take → latest take, so growth shows
    const pctHTML = r => `<span class="${gradeFor(r.pct).c}">${r.pct}%</span>`;
    const cellHTML = c => {
      if (!c) return '<span class="t-none">—</span>';
      const n = c.takes.length;
      const done = !n ? ''
        : n === 1 ? `<b>${pctHTML(c.first)}</b><span>1 take</span>`
        : `<b>${pctHTML(c.first)} → ${pctHTML(c.latest)}</b><span>${n} takes · best ${c.best.pct}%</span>`;
      const now = c.now ? `<span class="t-now">▶ ${c.now.answered} of ${c.now.tot || 15} done${takeNo(c.now.set) > 1 ? ' (take 2)' : ''}</span>` : '';
      const again = c.restarts ? `<span class="t-restart">↺ ${c.restarts} ${c.restarts === 1 ? 'restart' : 'restarts'}</span>` : '';
      return done + now + again;
    };
    const table = `<div class="t-wrap"><table class="t-table"><thead><tr><th>Student</th>${sets.map(s => `<th>${SET_NAMES[s]}</th>`).join('')}</tr></thead>
      <tbody>${list.map(st => `<tr><td>${esc(st.name)}</td>${sets.map(s => `<td>${cellHTML(st.sets[s])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

    const workingHTML = working.length ? `<h3 class="t-sub">In progress <span>(saved after every answer · press Refresh to update)</span></h3>
      <ul class="t-working">${working.map(w => `<li><b>${esc(w.name)}</b> · ${setLabel(w.r.set)} · ${w.r.answered} of ${w.r.tot || 15} done · ${w.r.pts} right
        <span class="t-ago">${ago(w.r.updatedAt)}</span></li>`).join('')}</ul>` : '';

    return `<p class="t-sum">${list.length} ${list.length === 1 ? 'student' : 'students'} · ${finished.length} finished ${finished.length === 1 ? 'set' : 'sets'} · ${working.length} in progress${lastText}</p>
      ${workingHTML}
      <h3 class="t-sub">Scores <span>(1st take → latest take · ▶ = working on it now)</span></h3>
      ${table}
      <h3 class="t-sub">Question heat map</h3>
      <div class="t-modes" role="group" aria-label="Which take">
        <button type="button" class="key-tab" data-mode="first">1st take</button>
        <button type="button" class="key-tab" data-mode="latest">Latest take</button>
      </div>
      <div class="key-tabs t-tabs">${sets.map(s => `<button type="button" class="key-tab" data-heat="${s}">${SET_NAMES[s]}</button>`).join('')}</div>
      <div id="t-heat"></div>`;
  }

  const heatClass = pct => (pct >= 80 ? 'h-hi' : pct >= 60 ? 'h-mid' : pct >= 40 ? 'h-low' : 'h-bad');

  // One row per student, one column per question. Take 2 asks the same kind of question in each
  // spot with new numbers, so a column is one skill whichever take a student had.
  let heatMode = 'latest';
  const slotOf = id => Number(String(id).slice(-2));
  function heatHTML(level) {
    const base = SETS[level];  // take 1: the example question shown for each spot
    const done = classList.filter(st => st.sets[level] && st.sets[level].takes.length).map(st => {
      const r = heatMode === 'first' ? st.sets[level].first : st.sets[level].latest;
      return { name: st.name, r, pct: r.pct, missed: new Set(String(r.missed).split(',').map(x => x.trim()).filter(Boolean).map(slotOf)) };
    });
    if (!done.length) return `<p class="t-msg">No one has finished ${SET_NAMES[level]} yet.</p>`;

    const stats = base.map((it, i) => {
      const right = done.filter(d => !d.missed.has(i + 1)).length;
      return { it, i, right, pct: Math.round((right / done.length) * 100) };
    });
    const heads = base.map((it, i) => `<th scope="col">${i + 1}</th>`).join('');
    const body = done.map(d => `<tr><th scope="row">${esc(d.name)}${takeNo(d.r.set) > 1 ? ' <span class="t-take">take 2</span>' : ''}</th>${base.map((it, i) => (d.missed.has(i + 1)
      ? `<td class="h-miss" title="${esc(d.name)} · question ${i + 1}: missed">✗</td>`
      : `<td class="h-ok" title="${esc(d.name)} · question ${i + 1}: right">✓</td>`)).join('')}<td class="h-score ${gradeFor(d.pct).c}">${d.pct}%</td></tr>`).join('');
    const foot = `<tr><th scope="row">% right</th>${stats.map(s => `<td class="${heatClass(s.pct)}">${s.pct}</td>`).join('')}<td></td></tr>`;

    // Most right first for the top 3, fewest right first for the bottom 3; ties go to the earlier question
    const top = stats.slice().sort((a, b) => b.right - a.right || a.i - b.i).slice(0, 3);
    const bottom = stats.slice().sort((a, b) => a.right - b.right || a.i - b.i).slice(0, 3);
    const rankHTML = list => `<ol class="t-rank">${list.map(s => `<li><div class="t-rank-head"><b>Question ${s.i + 1}</b>
      <span class="t-pill ${heatClass(s.pct)}">${s.right} of ${done.length} right · ${s.pct}%</span></div>
      <div class="t-q"><i>${esc(SKILL_NAMES[s.it.skill])}:</i> ${mathHTML(itemSummary(s.it))}</div></li>`).join('')}</ol>`;
    const twoTakes = TAKES[level].length > 1;

    return `<p class="t-legend">Showing each student's <b>${heatMode === 'first' ? '1st take' : 'latest take'}</b> · <span class="h-ok">✓</span> right · <span class="h-miss">✗</span> missed · bottom row = % of the ${done.length} ${done.length === 1 ? 'student' : 'students'} who got that question right</p>
      <div class="t-wrap"><table class="t-heat"><thead><tr><th scope="col">Student</th>${heads}<th scope="col">Score</th></tr></thead>
      <tbody>${body}</tbody><tfoot>${foot}</tfoot></table></div>
      <div class="t-rank-grid">
        <div class="t-rank-box"><h4>⭐ Top 3 questions <span>most students right</span></h4>${rankHTML(top)}</div>
        <div class="t-rank-box"><h4>🔁 Bottom 3 questions <span>reteach these first</span></h4>${rankHTML(bottom)}</div>
      </div>
      ${twoTakes ? '<p class="t-note">Take 2 asks the same kind of question in each spot with new numbers. The example questions shown are from take 1.</p>' : ''}`;
  }

  function showHeat(set) {
    heatSet = set;
    document.querySelectorAll('[data-heat]').forEach(t => t.classList.toggle('on', t.dataset.heat === set));
    document.querySelectorAll('[data-mode]').forEach(t => t.classList.toggle('on', t.dataset.mode === heatMode));
    $('#t-heat').innerHTML = heatHTML(set);
  }

  async function showTeacher() {
    show('teacher');
    const body = $('#t-body');
    if (!OliveraSheet.connected) {
      body.innerHTML = `<p class="t-msg">Class scores are not connected to the Google Sheet yet.</p>`;
      return;
    }
    body.innerHTML = `<p class="t-msg">Loading class scores…</p>`;
    try {
      const r = await OliveraSheet.loadScores(teacherPin);
      if (!r.ok) {
        body.innerHTML = `<p class="t-msg t-err">${r.error === 'Wrong PIN' ? 'The score sheet did not accept that PIN.' : `The score sheet answered: ${esc(r.error)}`}</p>`;
        return;
      }
      classList = groupStudents(r.rows);
      if (!classList.length) {
        body.innerHTML = `<p class="t-msg">No finished sets yet. Scores show up here as soon as students finish a set.</p>`;
        return;
      }
      body.innerHTML = classHTML(r.rows, classList);
      // stay on the set she was looking at; otherwise the first set anyone has finished
      const hasFinished = s => classList.some(st => st.sets[s] && st.sets[s].takes.length);
      if (!hasFinished(heatSet)) heatSet = Object.keys(SET_NAMES).find(hasFinished) || heatSet;
      showHeat(heatSet);
    } catch (e) {
      body.innerHTML = `<p class="t-msg t-err">Couldn't reach the score sheet. Check the internet, then press Refresh.</p>`;
    }
  }

  /* ------------------------------------------------------------ home */
  // Page 1: welcome. The name box always starts empty, so nobody starts as the last student.
  function renderHome() {
    $('#student-name').value = '';
    $('#student-last').value = '';
    $('#name-hint').hidden = true;
    chooseName = '';
    chooseFirst = '';
    choosePlaces = {};
    chooseDone = {};
    lookupSeq += 1;
    show('home');
  }

  /* Page 2: directions. Opening directions follow Marcos's standard: their own 🔊, and
     "I'm ready" stays locked until they are heard to the end. Once a student has heard
     them on this computer, they stay open there (the 🔊 is still there). */
  const HEARD_KEY = 'oliveraFracFiab_heard_v1';
  const DIRECTIONS = [
    'Go in order. First the Warm Up. Then the Review. Then Test A. Then Test B.',
    'Each one opens when you finish the one before it.',
    'You get 2 takes of the Warm Up and the Review. Take 2 has new numbers. You get 1 take of each test.',
    'For each question, pick an answer or type a fraction. Then press Check Answer.',
    'Read why your answer is right or wrong. Then press Next.',
    'Press 🔊 to hear a question or an answer read to you.',
    'Your work saves after every question. You can stop and keep going later, on any computer.'
  ];
  const DIR_DONE = "When you are done listening, press I'm ready.";
  const setReady = open => {
    $('#dir-go').setAttribute('aria-disabled', String(!open));
    if (open) $('#dir-note').hidden = true;
  };

  function renderDirections(name) {
    chooseName = name;
    $('#dir-steps').innerHTML = DIRECTIONS.map(d => `<li>${sayHTML(d)}</li>`).join('');
    setReady(Boolean(store.get(HEARD_KEY, {})[normName(name)]));
    $('#dir-note').hidden = true;
    show('directions');
  }

  function hearDirections() {
    // each step is its own line, and its words light up as they are said
    const lines = [{ text: 'Directions.' }, ...[...document.querySelectorAll('#dir-steps li')].map(spokenOf), { text: DIR_DONE }];
    const heard = () => {
      store.set(HEARD_KEY, { ...store.get(HEARD_KEY, {}), [normName(chooseName)]: true });
      setReady(true);
    };
    const run = readLines(lines, $('#dir-head'), heard);
    if (run === false) {
      // this computer cannot read aloud: give time to read, then open
      $('#dir-note').textContent = "This computer can't read aloud. Read the directions, then press I'm ready.";
      $('#dir-note').hidden = false;
      setTimeout(() => { if (document.body.dataset.screen === 'directions') setReady(true); }, 15000);
      return;
    }
    // if the voice hangs (no end ever comes), don't leave the student stuck: open well after
    // the reading should have finished, as long as it wasn't stopped or restarted
    const chars = lines.map(l => l.text).join(' ').length;
    setTimeout(() => {
      if (!run.stopped && speaking === run && document.body.dataset.screen === 'directions') {
        setReady(true);
        $('#dir-note').textContent = "If you couldn't hear it, read the directions above.";
        $('#dir-note').hidden = false;
      }
    }, chars * 90 + lines.length * 900 + 15000);
  }

  // Page 3: hello + where to start, with this student's saved place and finished sets
  // (this device first, then her sheet, so it all follows them to any Chromebook)
  let lookupSeq = 0;
  function renderChoose(name) {
    chooseName = name;
    $('#hello').textContent = `Hi, ${chooseFirst || name.split(' ')[0]}!`;
    choosePlaces = localPlaces(name);
    chooseDone = localDone(name);
    looking = OliveraSheet.connected;
    drawChoose();
    show('choose');
    if (!looking) return;
    const seq = ++lookupSeq;
    OliveraSheet.loadPlaces(name).then(r => {
      if (seq !== lookupSeq || !r || !r.ok) return;
      r.places.map(placeFromSheet).filter(Boolean).forEach(st => {
        const here = choosePlaces[levelOf(st.set)];
        if (!here || st.idx > here.idx) choosePlaces[levelOf(st.set)] = st;  // whichever got further
      });
      // finished takes per set → per level (an older script sent just a best score)
      const fromSheet = {};
      Object.entries(r.finished || {}).forEach(([set, v]) => {
        if (!SETS[set]) return;
        const d = typeof v === 'number' ? { best: v, tries: 1 } : v;
        const agg = fromSheet[levelOf(set)] || (fromSheet[levelOf(set)] = { best: 0, tries: 0 });
        agg.best = Math.max(agg.best, Number(d.best) || 0);
        agg.tries += Number(d.tries) || 0;
      });
      Object.entries(fromSheet).forEach(([l, d]) => {
        const here = chooseDone[l] || { best: 0, tries: 0 };
        chooseDone[l] = { best: Math.max(here.best, d.best), tries: Math.max(here.tries, d.tries) };
      });
    }).catch(() => { /* offline: this device's work only */ }).finally(() => {
      if (seq !== lookupSeq) return;
      looking = false;
      drawChoose();
    });
  }

  function drawChoose() {
    $('#looking').hidden = !looking;
    document.querySelectorAll('#choose .set-btn').forEach(b => {
      const set = b.dataset.set;
      const open = isOpen(set);
      b.disabled = looking || !open;
      b.classList.toggle('locked', !open);
      const prev = ORDER[ORDER.indexOf(set) - 1];
      const place = choosePlaces[set], done = chooseDone[set];
      const text = place ? `▶ Keep going${takeNo(place.set) > 1 ? ' (take 2)' : ''}: question ${place.idx + 1}`
        : !open ? `🔒 Finish ${SET_NAMES[prev]} first`
        : !done ? ''
        : done.tries < TAKES[set].length ? `✓ Take 1: ${done.best}% · take 2 is open`
        : `✓ Done · best ${done.best}%`;
      let badge = b.querySelector('.place-badge');
      if (text && !badge) {
        badge = document.createElement('b');
        badge.className = 'place-badge';
        b.appendChild(badge);
      }
      if (text) badge.textContent = text;
      else if (badge) badge.remove();
    });
    const top = Object.values(choosePlaces).sort((x, y) => (y.updated || 0) - (x.updated || 0))[0];
    $('#resume').hidden = !top;
    document.querySelectorAll('#resume button').forEach(btn => { btn.disabled = looking; });
    if (top) {
      $('#resume-text').textContent = `You started ${setLabel(top.set)}. You are on question ${top.idx + 1} of ${SETS[top.set].length}.`;
      $('#resume').dataset.set = levelOf(top.set);
    }
  }

  function openScores() {
    const scores = store.get(SCORES_KEY, []).slice().reverse();
    $('#score-list').innerHTML = scores.length ? scores.map(s => {
      const badge = s.grade.startsWith('A') ? 'badge-A' : s.grade.startsWith('B') ? 'badge-B' : s.grade.startsWith('C') ? 'badge-C' : 'badge-D';
      return `<div class="score-item"><div class="score-details"><span class="score-name">${esc(s.name)} · ${SETS[s.set] ? setLabel(s.set) : esc(s.set)}</span>
        <span class="score-date">${esc(s.date)}</span><span class="score-pts">${s.pts} / ${s.tot} points</span></div>
        <div class="score-badge ${badge}">${s.pct}% | ${esc(s.grade)}</div></div>`;
    }).join('') : `<div class="empty-scores">No scores saved yet. Finish a set to see your score here!</div>`;
    $('#score-modal').hidden = false;
  }

  function pinHash(pin) {
    let h = 0x811c9dc5;
    for (const ch of `olivera-fiab:${pin}`) { h ^= ch.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16);
  }

  // The PIN she typed when it is right, otherwise null
  function askPin(what) {
    const typed = window.prompt(`Teacher PIN to ${what}:`);
    if (typed === null) return null;
    const pin = typed.trim();
    if (pinHash(pin) === PIN_HASH) return pin;
    window.alert('Incorrect PIN.');
    return null;
  }

  // The whole question as students see it, every choice (the right one in green, each wrong one with the mistake it shows)
  function keyItemHTML(it, i) {
    const answer = it.type === 'mc'
      ? `<div class="kq-choices">${it.choices.map((ch, c) => `<div class="kq-choice${c === it.answer ? ' right' : ''}">
          <span class="letter">${'ABCD'[c]}</span>
          <div class="kq-body">${linesHTML(ch.t)}${c === it.answer
            ? '<div class="kq-note ok">✓ Correct answer</div>'
            : (ch.why ? `<div class="kq-note"><b>Why it's wrong:</b> ${mathHTML(ch.why)}</div>` : '')}</div>
        </div>`).join('')}</div>`
      : `<div class="kq-entry"><span class="kq-entry-label">Answer</span> ${mathHTML(keyText(it))} <span class="key-note">(any equal fraction counts)</span></div>
        ${(it.traps || []).map(t => `<div class="kq-note"><b>Common wrong answer</b> ${mathHTML(`{${t.v}}`)}: ${mathHTML(t.why)}</div>`).join('')}`;
    return `<article class="kq">
      <header class="kq-head"><span class="item-num">${i + 1}</span><span class="kq-skill">${esc(SKILL_NAMES[it.skill])}</span>
        <span class="kq-type">${it.type === 'mc' ? 'Multiple choice' : 'Type-in fraction'}</span></header>
      <div class="stem">${it.parts.map(partHTML).join('')}${it.ask ? `<p class="ask">${mathHTML(it.ask)}</p>` : ''}</div>
      ${it.hint ? `<div class="kq-reminder"><span aria-hidden="true">💡</span> <b>Reminder students hear:</b> ${mathHTML(it.hint)}</div>` : ''}
      ${answer}
      <div class="kq-explain"><b>How to solve it:</b> ${mathHTML(it.explain)}</div>
    </article>`;
  }

  function renderKey(set) {
    document.querySelectorAll('.key-tab').forEach(t => t.classList.toggle('on', t.dataset.set === set));
    $('#key-body').innerHTML = SETS[set].map(keyItemHTML).join('');
  }

  /* ------------------------------------------------------------ wiring */
  document.querySelectorAll('.set-btn').forEach(b => b.addEventListener('click', () => startSet(b.dataset.set)));
  // First and last name (Marcos 11/2). A missing one gets a note that is read to them right away.
  const NAME_HINTS = { both: 'Type your first and last name.', first: 'Type your first name.', last: 'Type your last name.' };
  function nameHint(which) {
    const box = $('#name-hint');
    $('#name-hint-words').innerHTML = sayHTML(NAME_HINTS[which]);
    box.hidden = false;
    const { text, marks } = spokenOf(box);
    readAloud(text, box, null, marks);
  }
  const typed = id => $(id).value.trim().replace(/\s+/g, ' ');
  ['#student-name', '#student-last'].forEach(id => $(id).addEventListener('input', () => { $('#name-hint').hidden = true; }));
  const goDirections = () => {
    const first = typed('#student-name'), last = typed('#student-last');
    if (!first || !last) {
      nameHint(!first && !last ? 'both' : !first ? 'first' : 'last');
      $(!first ? '#student-name' : '#student-last').focus();
      return;
    }
    chooseFirst = first;
    renderDirections(`${first} ${last}`.slice(0, 30).trim());   // her sheet keeps 30 letters of a name: the same 30 find their saved work
  };
  $('#start-btn').addEventListener('click', goDirections);
  $('#student-name').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (typed('#student-last')) goDirections(); else $('#student-last').focus();
  });
  $('#student-last').addEventListener('keydown', e => { if (e.key === 'Enter') goDirections(); });
  $('#dir-say').addEventListener('click', hearDirections);
  $('#dir-go').addEventListener('click', () => {
    if ($('#dir-go').getAttribute('aria-disabled') === 'true') {
      $('#dir-note').textContent = 'Tap 🔊 to hear the directions first.';
      $('#dir-note').hidden = false;
      return;
    }
    renderChoose(chooseName);
  });
  $('#dir-back').addEventListener('click', e => { e.preventDefault(); renderHome(); });
  $('#change-name').addEventListener('click', e => { e.preventDefault(); renderHome(); });
  $('#resume-go').addEventListener('click', () => startSet($('#resume').dataset.set));
  $('#resume-new').addEventListener('click', () => startOver($('#resume').dataset.set));
  // Exit goes back to the welcome page, so the next student never lands on this one's page
  $('#exit-btn').addEventListener('click', () => { state = null; renderHome(); });
  $('#home-btn').addEventListener('click', () => (chooseName ? renderChoose(chooseName) : renderHome()));
  $('#scores-btn').addEventListener('click', openScores);
  $('#close-scores').addEventListener('click', () => { $('#score-modal').hidden = true; });
  $('#score-modal').addEventListener('click', e => { if (e.target.id === 'score-modal') $('#score-modal').hidden = true; });
  $('#clear-scores').addEventListener('click', () => {
    if (!askPin('clear all saved scores')) return;
    store.remove(SCORES_KEY);
    openScores();
  });
  $('#teacher-link').addEventListener('click', e => {
    e.preventDefault();
    const pin = askPin('open teacher access');
    if (!pin) return;
    teacherPin = pin;
    showTeacher();
  });
  $('#t-refresh').addEventListener('click', showTeacher);
  $('#t-body').addEventListener('click', e => {
    const t = e.target.closest('[data-heat]');
    if (t) showHeat(t.dataset.heat);
    const m = e.target.closest('[data-mode]');
    if (m) { heatMode = m.dataset.mode; showHeat(heatSet); }
  });
  $('#t-key').addEventListener('click', () => { renderKey('W'); show('key'); });
  $('#t-home').addEventListener('click', () => { teacherPin = null; renderHome(); });
  document.querySelectorAll('.key-tab').forEach(t => t.addEventListener('click', () => renderKey(t.dataset.set)));
  $('#key-print').addEventListener('click', () => window.print());
  $('#key-home').addEventListener('click', () => show('teacher'));
  // Page read-alouds hold no student's name, so every line can have a Kokoro recording
  // the cover's one line, said word for word as it is shown, each word lighting up (Marcos 11/2: the cover "too busy")
  const homeLeadHTML = () => sayHTML('Type your first and last name. Then press Start.');
  $('#home-lead-words').innerHTML = homeLeadHTML();
  const CHOOSE_SAY = 'Go in order. Start with the Warm Up. Then do the Review. Then Test A, then Test B. They are just like the real test. Each one opens when you finish the one before it. You get 2 takes of the Warm Up and the Review, and 1 take of each test.';
  const resumeSay = (set, n) => `You started ${setLabel(set)}. You are on question ${n} of ${SETS[set].length}. Press Keep going.`;
  $('#home-say').addEventListener('click', () => {
    const { text, marks } = spokenOf($('#home-lead'));
    readAloud(text, $('#home-lead'), null, marks);
  });
  $('#choose-say').addEventListener('click', () => {
    const top = $('#resume').hidden ? null : Object.values(choosePlaces).find(st => levelOf(st.set) === $('#resume').dataset.set);
    readAloud(top ? `${CHOOSE_SAY} ${resumeSay(top.set, top.idx + 1)}` : CHOOSE_SAY, $('#choose-say'));
  });

  // Every line this site can say, built by the same code that draws the screens: the list the
  // Kokoro recordings are made from, and what the tests check has a recording
  window.__oliveraSpeech = {
    lines() {
      const out = new Set();
      const box = document.createElement('div');
      const add = html => { box.innerHTML = html; const t = spokenOf(box).text; if (t) out.add(t); };
      Object.keys(SETS).forEach(set => SETS[set].forEach(it => {
        add(stemHTML(it));
        if (it.type === 'mc') it.choices.forEach(ch => add(linesSayHTML(ch.t)));
        if (it.hint) add(reminderHTML(it));
        const answers = it.type === 'mc'
          ? it.choices.map((c, i) => [i === it.answer, i])
          : [[true, it.key], ...(it.traps || []).map(t => [false, t.v]), [false, '1/999']];
        answers.forEach(([ok, picked]) => add(feedbackHTML(it, ok, picked)));
        if (it === SETS[set][0]) for (let n = 2; n <= SETS[set].length; n++) out.add(`${CHOOSE_SAY} ${resumeSay(set, n)}`);
      }));
      DIRECTIONS.forEach(d => add(sayHTML(d)));
      add(homeLeadHTML());
      Object.values(NAME_HINTS).forEach(t => add(sayHTML(t)));
      ['Directions.', DIR_DONE, CHOOSE_SAY].forEach(t => out.add(t));
      return [...out];
    }
  };

  window.addEventListener('pagehide', stopReading);
  // Anything a lost connection left in this device's outbox goes now, or when the internet comes back
  window.addEventListener('online', () => OliveraSheet.flush());
  store.remove('oliveraFracFiab_progress_v1'); // the old one-place-per-device save
  renderHome();
  OliveraSheet.flush();
})();
