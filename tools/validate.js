#!/usr/bin/env node
/* Recomputes every key in data/sets.js with exact fractions.
   Usage: node tools/validate.js   (exit 1 on any problem) */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'data', 'sets.js'), 'utf8'), ctx);
const SETS = ctx.window.SETS;
const SKILLS = ctx.window.SKILL_NAMES;

const problems = [];
const bad = (id, msg) => problems.push(`${id}: ${msg}`);

// ---------- exact fractions ----------
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const fr = (n, d) => { if (d === 0) throw new Error('zero denominator'); const g = gcd(n, d) * (d < 0 ? -1 : 1); return [n / g, d / g]; };
const add = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const sub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const eq = (a, b) => a[0] * b[1] === b[0] * a[1];
const show = a => `${a[0]}/${a[1]}`;

// integer expression inside a fraction part: digits joined by × and +
function intExpr(s) {
  if (!/^[0-9×+]+$/.test(s)) throw new Error(`bad fraction part "${s}"`);
  return s.split('+').map(t => t.split('×').reduce((p, x) => p * Number(x), 1)).reduce((p, x) => p + x, 0);
}
function tokenValue(inner) {
  const m = inner.match(/^(?:(\d+) )?([^/ ]+)\/([^/ ]+)$/);
  if (!m) throw new Error(`bad token {${inner}}`);
  const f = fr(intExpr(m[2]), intExpr(m[3]));
  return m[1] ? add(fr(Number(m[1]), 1), f) : f;
}
// one segment: terms joined by + and −
function segValue(seg) {
  const toks = seg.trim().match(/\{[^}]+\}|\d+|[+−-]/g);
  if (!toks) throw new Error(`empty segment "${seg}"`);
  let total = fr(0, 1), sign = 1;
  for (const t of toks) {
    if (t === '+') sign = 1;
    else if (t === '−' || t === '-') sign = -1;
    else {
      const v = t[0] === '{' ? tokenValue(t.slice(1, -1)) : fr(Number(t), 1);
      total = sign > 0 ? add(total, v) : sub(total, v);
    }
  }
  return total;
}
// "a = b = c" (a leading "=" is allowed)
const chain = s => s.replace(/\n/g, ' ').replace(/^\s*=/, '').split('=').map(segValue);
const val = s => segValue(s);
const parseKey = s => { const [n, d] = s.split('/').map(Number); return fr(n, d); };

// every {…} in every string must parse
function scanTokens(id, s) {
  if (typeof s !== 'string') return;
  for (const m of s.matchAll(/\{([^}]*)\}/g)) {
    try { tokenValue(m[1]); } catch (e) { bad(id, e.message); }
  }
  if ((s.match(/\{/g) || []).length !== (s.match(/\}/g) || []).length) bad(id, `unbalanced braces in "${s}"`);
}
function walk(id, x) {
  if (typeof x === 'string') scanTokens(id, x);
  else if (Array.isArray(x)) x.forEach(y => walk(id, y));
  else if (x && typeof x === 'object') Object.keys(x).filter(k => k !== 'check').forEach(k => walk(id, x[k]));
}

// ---------- checks ----------
const skillOrders = {};
const positions = {};
const ids = new Set();

for (const [setName, items] of Object.entries(SETS)) {
  if (items.length !== 15) bad(setName, `has ${items.length} items, expected 15`);
  skillOrders[setName] = items.map(i => `${i.skill}:${i.type}`).join(',');
  positions[setName] = [];

  items.forEach((it, idx) => {
    const id = it.id;
    try {
      if (ids.has(id)) bad(id, 'duplicate id');
      ids.add(id);
      // a take-2 set (W2, R2) puts a dash between its name and the number: W2-05
      const wantId = `${setName}${/\d$/.test(setName) ? '-' : ''}${String(idx + 1).padStart(2, '0')}`;
      if (id !== wantId) bad(id, `id out of order at position ${idx + 1}`);
      if (!SKILLS[it.skill]) bad(id, `unknown skill ${it.skill}`);
      if (!it.explain) bad(id, 'no explanation');
      walk(id, it);
      const c = it.check || {};

      // Warm Up reminders: one on every Warm Up question, none anywhere else, never the answer
      const warmUp = setName === 'W' || setName === 'W2';
      if (warmUp && !it.hint) bad(id, 'Warm Up question with no reminder');
      if (!warmUp && it.hint) bad(id, 'reminder outside the Warm Up');
      if (it.hint) {
        const answers = [];
        if (it.type === 'entry') answers.push(parseKey(it.key));
        if (c.target) answers.push(val(c.target));
        (c.boxes || []).forEach(b => answers.push(val(b)));
        (it.hint.match(/\{[^}]+\}/g) || []).forEach(tok => {
          if (answers.some(a => eq(a, tokenValue(tok.slice(1, -1))))) bad(id, `reminder gives the answer ${tok}`);
        });
        if (it.type === 'mc' && !/[{}]/.test(it.choices[it.answer].t) && it.hint.toLowerCase().includes(it.choices[it.answer].t.toLowerCase())) {
          bad(id, `reminder names the answer "${it.choices[it.answer].t}"`);
        }
      }

      if (it.type === 'mc') {
        if (it.choices.length !== 4) bad(id, `${it.choices.length} choices`);
        const noWhy = it.choices.map((ch, i) => (ch.why ? -1 : i)).filter(i => i >= 0);
        if (noWhy.length !== 1 || noWhy[0] !== it.answer) bad(id, `the one choice without "why" must be the answer (got ${noWhy})`);
        if (/\b(first|second|third|last) (choice|option|answer)\b|\bchoice [A-D]\b|\boption [A-D]\b/i.test(JSON.stringify(it))) bad(id, 'names a choice by position');
        positions[setName].push('ABCD'[it.answer]);

        if (it.skill === 'steps') {
          const target = val(c.target);
          it.choices.forEach((ch, i) => {
            const segs = chain(ch.t);
            if (i === it.answer) {
              segs.forEach((s, k) => { if (!eq(s, target)) bad(id, `correct choice segment ${k + 1} = ${show(s)}, target ${show(target)}`); });
            } else {
              if (eq(segs[segs.length - 1], target)) bad(id, `distractor ${i + 1} ends on the right answer`);
              if (segs.length >= 2 && !eq(segs[segs.length - 1], segs[segs.length - 2])) bad(id, `distractor ${i + 1}: last two segments differ (${show(segs[segs.length - 2])} vs ${show(segs[segs.length - 1])})`);
            }
          });
          // the stem must show the same sum as check.target
          if (!it.parts[0].p.includes(c.target)) bad(id, `stem does not show ${c.target}`);
        }

        if (it.skill === 'expr') {
          const target = val(c.target);
          it.choices.forEach((ch, i) => {
            const v = val(ch.t);
            if (i === it.answer && !eq(v, target)) bad(id, `answer expression = ${show(v)}, target ${show(target)}`);
            if (i !== it.answer && eq(v, target)) bad(id, `distractor ${i + 1} also equals the target`);
          });
          const [a, b] = c.target.split(' + ');
          if (!it.parts[0].p.includes(a) || !it.parts[0].p.includes(b)) bad(id, 'story numbers do not match check.target');
        }

        if (it.skill === 'error') {
          const steps = it.parts.find(p => p.steps).steps;
          const [f1, f2] = c.fracs.map(val);
          const truth = [
            c.common % f1[1] === 0 && c.common % f2[1] === 0,
            eq(val(c.s2[0]), val(c.s2[1])),
            eq(val(c.s3[0]), val(c.s3[1])),
            eq(val(c.s4[0]), val(c.s4[1]))
          ];
          const first = truth.indexOf(false);
          if (first !== it.answer) bad(id, `first false step is ${first + 1}, key says ${it.answer + 1}`);
          if (!steps[0].includes(` ${c.common}.`)) bad(id, 'step 1 text does not match check.common');
          if (!steps[1].includes(`${c.s2[0]} = ${c.s2[1]}`)) bad(id, 'step 2 text does not match check');
          if (!steps[2].includes(`${c.s3[0]} = ${c.s3[1]}`)) bad(id, 'step 3 text does not match check');
          if (!steps[3].includes(`${c.s4[0]} = ${c.s4[1]}`)) bad(id, 'step 4 text does not match check');
        }

        if (it.skill === 'inverse') {
          const eqs = it.parts.filter(p => p.eq).map(p => p.eq.replace(/^Equation [AB]:\s*/, ''));
          eqs.forEach((e, k) => {
            const [lhs, rhs] = e.replace('□', c.boxes[k]).split('=');
            if (!eq(val(lhs), val(rhs))) bad(id, `box ${c.boxes[k]} does not complete equation ${'AB'[k]}`);
          });
          const same = eq(val(c.boxes[0]), val(c.boxes[1]));
          const bubble = it.parts.find(p => p.bubbles).bubbles.find(b => b[0] === it.choices[it.answer].t);
          const says = bubble ? bubble[1] : '';
          if (same && !/same number/.test(says)) bad(id, 'boxes match but the keyed student does not say "same number"');
          if (!same && !/different number/.test(says)) bad(id, 'boxes differ but the keyed student does not say "different number"');
          const names = it.parts.find(p => p.bubbles).bubbles.map(b => b[0]).join();
          if (names !== it.choices.map(ch => ch.t).join()) bad(id, 'choices are not the bubble names in order');
        }
      }

      if (it.type === 'entry') {
        const key = parseKey(it.key);
        if (!eq(key, val(c.expr))) bad(id, `key ${it.key} but ${c.expr} = ${show(val(c.expr))}`);
        (it.traps || []).forEach(t => {
          const tv = parseKey(t.v);
          if (eq(tv, key)) bad(id, `trap ${t.v} equals the key`);
        });
        const eqPart = it.parts.find(p => p.eq);
        if (eqPart && eqPart.eq !== c.expr) bad(id, `shown "${eqPart.eq}" but check.expr "${c.expr}"`);
        const bars = it.parts.find(p => p.bars);
        if (bars) {
          const shaded = bars.bars.shaded.reduce((s, x) => s + x, 0);
          if (!eq(fr(shaded, bars.bars.den), val(c.left))) bad(id, `bar model shows ${shaded}/${bars.bars.den}, story says ${c.left} left`);
          if (!it.parts[0].p.includes(c.left)) bad(id, 'story does not show the amount left');
          if (bars.bars.shaded.some(x => x > bars.bars.den)) bad(id, 'a bar has more shaded parts than parts');
        }
        const grids = it.parts.find(p => p.grids);
        if (grids) {
          const sum = grids.grids.reduce((s, g) => add(s, fr(g.shaded, g.rows * g.cols)), fr(0, 1));
          if (!eq(sum, key)) bad(id, `grids add to ${show(sum)}, key ${it.key}`);
          const terms = c.expr.split(' + ');
          grids.grids.forEach((g, k) => { if (terms[k] !== `{${g.shaded}/${g.rows * g.cols}}`) bad(id, `check.expr term ${k + 1} does not match ${g.label}`); });
        }
        const nl = it.parts.find(p => p.nline);
        if (nl) {
          const first = c.expr.split(' + ')[0];
          if (first !== `{${nl.nline.at}/${nl.nline.den}}`) bad(id, `point A is ${nl.nline.at}/${nl.nline.den} but check.expr starts ${first}`);
          const second = c.expr.split(' + ')[1];
          if (!it.parts.some(p => p.p && p.p.includes(second))) bad(id, `story does not show ${second}`);
        }
      }
    } catch (e) {
      bad(id, `crashed: ${e.message}`);
    }
  });
}

// Take 2 of a level (W2, R2): new numbers and new answers for every question, the right
// choice at a different letter, and never a Test A / Test B question (Marcos's MM2 rule:
// "I don't want kids passing just because they remember the answers")
const answerOf = it => {
  const c = it.check || {};
  if (it.type === 'entry') return show(parseKey(it.key));
  if (c.boxes) return c.boxes.map(b => show(val(b))).join(' & ');
  if (c.target) return show(val(c.target));
  return it.choices[it.answer].t;                       // "Step 3"
};
const askedOf = it => { const c = it.check || {}; return c.target || c.expr || (c.fracs && c.fracs.join(' + ')) || (c.boxes && it.parts.map(p => p.eq || '').join(' ')); };
const testAsks = new Set([...(SETS.TA || []), ...(SETS.TB || [])].map(askedOf));
Object.keys(SETS).filter(k => /\d$/.test(k)).forEach(take2 => {
  const base = SETS[take2.replace(/\d$/, '')];
  if (!base) { bad(take2, 'no first take to compare with'); return; }
  SETS[take2].forEach((it, i) => {
    const first = base[i];
    try {
      if (askedOf(it) === askedOf(first)) bad(it.id, `asks the same thing as ${first.id}`);
      if (answerOf(it) === answerOf(first)) bad(it.id, `same answer as ${first.id} (${answerOf(it)})`);
      if (it.type === 'mc' && it.answer === first.answer) bad(it.id, `right choice is ${'ABCD'[it.answer]} again, like ${first.id}`);
      if (testAsks.has(askedOf(it))) bad(it.id, 'repeats a Test A / Test B question');
    } catch (e) { bad(it.id, `take-2 check crashed: ${e.message}`); }
  });
});

const orders = Object.values(skillOrders);
if (new Set(orders).size !== 1) bad('sets', 'the three sets do not follow the same slot order');

// Slide Mode (data/slides.js): worked examples only. Every step recomputed, the picture matches
// its numbers, and never the numbers of a question students are scored on (his standard 10/30:
// "never the questions").
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'data', 'slides.js'), 'utf8'), ctx);
const SLIDES = ctx.window.SLIDES || [];
if (!SLIDES.length) bad('slides', 'no slides');
const fracsOf = s => [...new Set([...String(s).matchAll(/\{([^}]+)\}/g)].map(m => show(tokenValue(m[1]))))].sort().join(' ');
const scoredNumbers = new Map();
Object.values(SETS).flat().forEach(it => { const a = askedOf(it); if (a) scoredNumbers.set(fracsOf(a), it.id); });
const scoredText = new Map();
Object.values(SETS).flat().forEach(it => it.parts.forEach(p => [p.p, p.eq, ...(p.steps || [])].filter(Boolean).forEach(t => scoredText.set(t, it.id))));
SLIDES.forEach((sl, i) => {
  const id = `slide ${i + 1}`;
  const c = sl.check || {};
  walk(id, sl);
  if (!SKILLS[sl.skill]) bad(id, `unknown skill "${sl.skill}"`);
  if (!sl.title || !sl.steps || !sl.steps.length || !sl.answer) bad(id, 'needs a title, steps and an answer');
  try {
    if (!eq(val(c.asked), val(c.is))) bad(id, `${c.asked} is not ${c.is}`);
    if (!sl.answer.includes(c.is)) bad(id, `the answer does not show ${c.is}`);
    (c.eqs || []).forEach(e => {
      const segs = chain(e);
      if (segs.some(s => !eq(s, segs[0]))) bad(id, `not true: ${e}`);
      if (!sl.steps.some(st => st.includes(e))) bad(id, `"${e}" is not in its steps`);
    });
    (c.wrong || []).forEach(e => {
      const segs = chain(e);
      if (segs.every(s => eq(s, segs[0]))) bad(id, `the mistake it shows is not a mistake: ${e}`);
      if (!JSON.stringify(sl.problem).includes(e.split(' = ')[1])) bad(id, `the mistake ${e} is not in the problem`);
    });
    sl.problem.forEach(p => {
      if (p.bars && !eq(fr(p.bars.shaded.reduce((a, b) => a + b, 0), p.bars.den), val(c.model))) bad(id, `the bars show ${p.bars.shaded.join('+')} of ${p.bars.den}, not ${c.model}`);
      if (p.grids) p.grids.forEach(g => { if (!fracsOf(c.asked).split(' ').includes(show(fr(g.shaded, g.rows * g.cols)))) bad(id, `${g.label} is not in ${c.asked}`); });
      if (p.nline && !eq(fr(p.nline.at, p.nline.den), val(c.point))) bad(id, `point ${p.nline.label} is at ${p.nline.at}/${p.nline.den}, not ${c.point}`);
    });
  } catch (e) { bad(id, `slide check crashed: ${e.message}`); }
  const same = scoredNumbers.get(fracsOf(c.asked));
  if (same) bad(id, `same numbers as ${same}, a question students are scored on`);
  sl.problem.forEach(p => [p.p, p.eq, ...(p.steps || [])].filter(Boolean).forEach(t => {
    if (scoredText.has(t) && t.length > 12) bad(id, `"${t}" is word for word from ${scoredText.get(t)}`);
  }));
});

console.log('Answer letters by set:');
for (const [s, p] of Object.entries(positions)) {
  const count = 'ABCD'.split('').map(l => `${l}${p.filter(x => x === l).length}`).join(' ');
  console.log(`  ${s}: ${p.join(' ')}   (${count})`);
}
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.forEach(p => console.log('  ✗ ' + p));
  process.exit(1);
}
console.log(`\nOK — ${ids.size} items, every key recomputed; ${SLIDES.length} slides, every step recomputed, none on a scored question.`);
