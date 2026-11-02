// node tools/difficulty.js
// Sets run easiest to hardest on the cover: Warm Up (2 takes) → Review (2 takes) → Test A and Test B,
// the two tests on par with the real FIAB (Marcos 11/2: "always order them from easiest to
// hardest" … "make B and C an equal level of difficulty on par with the real test").
// The measure: for the 10 questions that need a common denominator, add up the
// common denominator each one needs, as written on the screen. Bigger = harder.
// On par = each test within 10% of the real total, and every question uses
// the same kind of common denominator as the real one (the two bottoms multiplied,
// a smaller shared one, or one bottom a multiple of the other). Exits 1 otherwise.
global.window = {};
require('../data/sets.js');
const SETS = window.SETS;

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a / gcd(a, b)) * b;
const fracs = s => [...s.matchAll(/\{(?:(\d+) )?(\d+)\/(\d+)\}/g)].map(m => Number(m[3]));
const SLOTS = [2, 3, 4, 5, 10, 11, 12, 13, 14, 15];

// the real test, from practice test sources/grade5_math_add_subtract_equiv_fractions_fiab_blueprint.md
const REAL = {
  2: '{1 7/8} + {2 1/3}', 3: '{10 1/2} + {3 2/5}', 4: '{2 1/7} + {1 2/3}', 5: '{3/10} + {4/15}',
  10: '{2 2/6} + {1 1/3}', 11: '{3/5} + {3/4}', 12: '{1 1/2} − {1 1/4}', 13: '{1 1/4} + {5/6}',
  14: '{2/4} + {2/6}', 15: '{1/6} + {1/3}'
};

const exprOf = it => {
  const c = it.check || {};
  return c.target || c.expr || (c.fracs && c.fracs.join(' + ')) || '';
};
const lcdOf = expr => fracs(expr).reduce(lcm, 1);
const kindOf = expr => {
  const [a, b] = fracs(expr);
  const L = lcm(a, b);
  return L === Math.max(a, b) ? 'multiple' : L < a * b ? 'smaller' : 'product';
};

const totals = {};
const rows = SLOTS.map(slot => {
  const row = { slot, REAL: lcdOf(REAL[slot]) };
  Object.keys(SETS).forEach(s => { row[s] = lcdOf(exprOf(SETS[s][slot - 1])); });
  return row;
});
['REAL', ...Object.keys(SETS)].forEach(k => { totals[k] = rows.reduce((sum, r) => sum + r[k], 0); });

console.log('question  ' + ['REAL', ...Object.keys(SETS)].map(k => k.padStart(5)).join(''));
rows.forEach(r => console.log(String(r.slot).padStart(8) + '  ' + ['REAL', ...Object.keys(SETS)].map(k => String(r[k]).padStart(5)).join('')));
console.log('   total  ' + ['REAL', ...Object.keys(SETS)].map(k => String(totals[k]).padStart(5)).join(''));

const problems = [];
// a level's take 2 stays at that level: within 20% of take 1, and the order still climbs
[['W2', 'W'], ['R2', 'R']].forEach(([two, one]) => {
  if (totals[two] == null) return;
  const off = Math.abs(totals[two] - totals[one]) / totals[one];
  if (off > 0.20) problems.push(`${two} (${totals[two]}) is ${Math.round(off * 100)}% away from ${one} (${totals[one]})`);
});
const warm = Math.max(totals.W, totals.W2 || 0);
const review = [totals.R, totals.R2].filter(v => v != null);
if (!(warm < Math.min(...review))) problems.push(`a Warm Up take (${warm}) is not easier than every Review take (${review.join(', ')})`);
// and question by question: no Warm Up question harder than the same Review question, no Review
// question harder than the same test question (Marcos 11/2 — totals alone hid four harder spots)
const levels = [['W', 'W2'], ['R', 'R2'], ['TA', 'TB']].map(l => l.filter(k => SETS[k]));
rows.forEach(r => {
  for (let i = 0; i + 1 < levels.length; i++) {
    const lower = Math.max(...levels[i].map(k => r[k]));
    const upper = Math.min(...levels[i + 1].map(k => r[k]));
    if (lower > upper) {
      problems.push(`question ${r.slot}: ${levels[i].join('/')} needs ${levels[i].map(k => r[k]).join('/')}ths, harder than ${levels[i + 1].join('/')} (${levels[i + 1].map(k => r[k]).join('/')})`);
    }
  }
});
// "Match it closer" (Marcos 11/2): each test question within 25% of the same real question
['TA', 'TB'].forEach(s => SLOTS.forEach(slot => {
  const real = lcdOf(REAL[slot]), got = lcdOf(exprOf(SETS[s][slot - 1]));
  if (got > real * 1.25 || got < real * 0.75) problems.push(`${s} question ${slot}: ${got}ths, the real test has ${real}ths (more than 25% apart)`);
}));
// Tenths and hundredths: the real test uses round hundredths (40/100, 70/100) on questions 6, 8, 9;
// the tests match it, and a lower level never uses hundredths like 85/100 where the level above is round
const REAL_TENTHS = { 6: '{3/10} + {40/100}', 7: '{2/100} + {5/10}', 8: '{70/100} − {5/10}', 9: '{80/100} − {3/10}' };
const loose = expr => [...expr.matchAll(/\{(\d+)\/100\}/g)].some(m => Number(m[1]) % 10 !== 0);
[6, 7, 8, 9].forEach(slot => {
  const realLoose = loose(REAL_TENTHS[slot]);
  ['TA', 'TB'].forEach(s => {
    if (loose(exprOf(SETS[s][slot - 1])) !== realLoose) problems.push(`${s} question ${slot}: ${exprOf(SETS[s][slot - 1])} — the real test ${realLoose ? 'has a ones digit here' : 'uses round hundredths here'}`);
  });
  for (let i = 0; i + 1 < levels.length; i++) {
    const lowerLoose = levels[i].filter(k => loose(exprOf(SETS[k][slot - 1])));
    const upperRound = levels[i + 1].some(k => !loose(exprOf(SETS[k][slot - 1])));
    if (lowerLoose.length && upperRound) problems.push(`question ${slot}: ${lowerLoose.map(k => `${k} ${exprOf(SETS[k][slot - 1])}`).join(', ')} is harder than the round hundredths in ${levels[i + 1].join('/')}`);
  }
});
['TA', 'TB'].forEach(s => {
  if (!(Math.max(...review) < totals[s])) problems.push(`a Review take (${Math.max(...review)}) is not easier than ${s} (${totals[s]})`);
  const off = Math.abs(totals[s] - totals.REAL) / totals.REAL;
  if (off > 0.10) problems.push(`${s} (${totals[s]}) is ${Math.round(off * 100)}% away from the real test (${totals.REAL})`);
  SLOTS.forEach(slot => {
    const want = kindOf(REAL[slot]), got = kindOf(exprOf(SETS[s][slot - 1]));
    if (want !== got) problems.push(`${s} question ${slot}: ${got} common denominator, the real test has ${want}`);
  });
});
if (problems.length) {
  console.log('\nNOT IN ORDER:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`\nOK — Warm Up ${totals.W} / ${totals.W2} < Review ${totals.R} / ${totals.R2} < Test A ${totals.TA} and Test B ${totals.TB}, both tests on par with the real test (${totals.REAL}), question by question`);
