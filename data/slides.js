/* Slide Mode: worked examples for Mrs. Olivera's desk or the board (Marcos 11/2: "Both, with new
   slides"). His standard (10/30): slides show only the teaching, never a question students are
   scored on. So these are NEW examples, one or two per skill, with numbers that are on no set;
   tools/validate.js checks that and recomputes every step.

   problem: drawn like a question (the same parts: p, eq, steps, bars, grids, nline).
   steps:   shown one at a time; the answer comes last.
   check:   asked = the math the slide works out, is = its value; eqs = equations that must be
            true and appear word for word in the steps; wrong = the mistake a slide shows on
            purpose (it must be false); model / point = what the picture shows. */

window.SLIDES = [

{ skill: 'inverse', title: 'Find the missing number',
  problem: [
    { p: 'Find the number that goes in the box.' },
    { eq: '□ + {3/8} = 1' }],
  steps: [
    'Adding and subtracting undo each other.',
    'So the box is 1 − {3/8}.',
    '1 whole is {8/8}. So {8/8} − {3/8} = {5/8}.',
    'Check it: {5/8} + {3/8} = {8/8} = 1.'],
  answer: 'The box is {5/8}.',
  check: { asked: '1 − {3/8}', is: '{5/8}', eqs: ['{8/8} − {3/8} = {5/8}', '{5/8} + {3/8} = {8/8} = 1'] } },

{ skill: 'steps', title: 'Add mixed numbers: the wholes, then the fractions',
  problem: [
    { p: 'Add.' },
    { eq: '{2 1/3} + {1 1/4}' }],
  steps: [
    'Add the whole numbers: 2 + 1 = 3.',
    'Find a common denominator for 3 and 4. 12 works, because 3 × 4 = 12.',
    '{1/3} = {1×4/3×4} = {4/12} and {1/4} = {1×3/4×3} = {3/12}.',
    'Add the fractions: {4/12} + {3/12} = {7/12}.',
    'Put them together: 3 + {7/12} = {3 7/12}.'],
  answer: '{2 1/3} + {1 1/4} = {3 7/12}',
  check: { asked: '{2 1/3} + {1 1/4}', is: '{3 7/12}',
    eqs: ['2 + 1 = 3', '{1/3} = {1×4/3×4} = {4/12}', '{1/4} = {1×3/4×3} = {3/12}', '{4/12} + {3/12} = {7/12}', '3 + {7/12} = {3 7/12}'] } },

{ skill: 'expr', title: 'Word problems: add or subtract?',
  problem: [
    { p: 'Kai walked {1 3/4} miles on Monday. He walked {2 1/8} miles on Tuesday.' },
    { p: 'How many miles did Kai walk in all?' }],
  steps: [
    '“In all” means put the two amounts together. Putting together means add.',
    'The expression is {1 3/4} + {2 1/8}.',
    'Watch out: “how many more” and “how much is left” mean subtract.',
    'Solve it: {1 3/4} = {1 6/8}. Then {1 6/8} + {2 1/8} = {3 7/8}.'],
  answer: 'Kai walked {3 7/8} miles in all.',
  check: { asked: '{1 3/4} + {2 1/8}', is: '{3 7/8}', eqs: ['{1 3/4} = {1 6/8}', '{1 6/8} + {2 1/8} = {3 7/8}'] } },

{ skill: 'error', title: 'Check each step for the mistake',
  problem: [
    { p: 'A student added {2/5} + {1/3}. Here are the steps.' },
    { steps: [
      'Step 1: A common denominator for 5 and 3 is 15.',
      'Step 2: {2/5} = {2/15}',
      'Step 3: {1/3} = {5/15}',
      'Step 4: {2/15} + {5/15} = {7/15}'] },
    { p: 'Which step has the first mistake?' }],
  steps: [
    'Check each step, one at a time.',
    'Step 1 is right. 15 is a multiple of 5 and of 3.',
    'Step 2 is wrong. The bottom was multiplied by 3, but the top was not.',
    'Fix it: {2/5} = {2×3/5×3} = {6/15}. Step 3 is right: {1/3} = {5/15}.',
    'Then {6/15} + {5/15} = {11/15}.'],
  answer: 'The first mistake is in Step 2. The right sum is {11/15}.',
  check: { asked: '{2/5} + {1/3}', is: '{11/15}', wrong: ['{2/5} = {2/15}'],
    eqs: ['{2/5} = {2×3/5×3} = {6/15}', '{1/3} = {5/15}', '{6/15} + {5/15} = {11/15}'] } },

{ skill: 'tenths', title: 'Add tenths and hundredths',
  problem: [
    { p: 'Add.' },
    { eq: '{3/10} + {25/100}' }],
  steps: [
    'Tenths and hundredths are different sizes. Make them the same size first.',
    'Change tenths to hundredths: multiply the top and the bottom by 10.',
    '{3/10} = {3×10/10×10} = {30/100}.',
    'Now add: {30/100} + {25/100} = {55/100}.'],
  answer: '{3/10} + {25/100} = {55/100}',
  check: { asked: '{3/10} + {25/100}', is: '{55/100}', eqs: ['{3/10} = {3×10/10×10} = {30/100}', '{30/100} + {25/100} = {55/100}'] } },

{ skill: 'tenths', title: 'Subtract tenths and hundredths',
  problem: [
    { p: 'Subtract.' },
    { eq: '{80/100} − {3/10}' }],
  steps: [
    'Make them the same size first: change tenths to hundredths.',
    '{3/10} = {3×10/10×10} = {30/100}.',
    'Now subtract: {80/100} − {30/100} = {50/100}.'],
  answer: '{80/100} − {3/10} = {50/100}',
  check: { asked: '{80/100} − {3/10}', is: '{50/100}', eqs: ['{3/10} = {3×10/10×10} = {30/100}', '{80/100} − {30/100} = {50/100}'] } },

{ skill: 'unlike', title: 'Add fractions with unlike denominators',
  problem: [
    { p: 'Add.' },
    { eq: '{1/4} + {1/6}' }],
  steps: [
    'The denominators are 4 and 6. They are not the same, so we can not add yet.',
    'Find a common denominator: 12 is a multiple of 4 and of 6.',
    '{1/4} = {1×3/4×3} = {3/12}.',
    '{1/6} = {1×2/6×2} = {2/12}.',
    'Now add the tops: {3/12} + {2/12} = {5/12}.'],
  answer: '{1/4} + {1/6} = {5/12}',
  check: { asked: '{1/4} + {1/6}', is: '{5/12}', eqs: ['{1/4} = {1×3/4×3} = {3/12}', '{1/6} = {1×2/6×2} = {2/12}', '{3/12} + {2/12} = {5/12}'] } },

{ skill: 'models', title: 'Read a bar model',
  problem: [
    { p: 'There were 2 whole pizzas at the start of a party. Each bar is 1 pizza cut into 8 equal slices. The model shows the pizza left at the end.' },
    { bars: { den: 8, shaded: [8, 3] } },
    { p: 'How much pizza was eaten?' }],
  steps: [
    'Read the model. 1 bar is full: 1 whole pizza. The other bar has 3 of 8 slices: {3/8}.',
    'So {1 3/8} pizzas are left.',
    'Eaten = start − left = 2 − {1 3/8}.',
    'Change to eighths: 2 = {16/8} and {1 3/8} = {11/8}.',
    '{16/8} − {11/8} = {5/8}.'],
  answer: '{5/8} of a pizza was eaten.',
  check: { model: '{1 3/8}', asked: '2 − {1 3/8}', is: '{5/8}', eqs: ['2 = {16/8}', '{1 3/8} = {11/8}', '{16/8} − {11/8} = {5/8}'] } },

{ skill: 'models', title: 'Read grids',
  problem: [
    { p: 'Each figure is 1 cup. Figure A shows the milk Maya used. Figure B shows the water she used.' },
    { grids: [{ label: 'Figure A', rows: 2, cols: 4, shaded: 3 }, { label: 'Figure B', rows: 2, cols: 2, shaded: 1 }] },
    { p: 'How many cups of liquid did Maya use in all?' }],
  steps: [
    'Figure A has 8 equal parts. 3 are shaded: {3/8}.',
    'Figure B has 4 equal parts. 1 is shaded: {1/4}.',
    'Make fourths into eighths: {1/4} = {1×2/4×2} = {2/8}.',
    'Add: {3/8} + {2/8} = {5/8}.'],
  answer: 'Maya used {5/8} cup of liquid in all.',
  check: { asked: '{3/8} + {1/4}', is: '{5/8}', eqs: ['{1/4} = {1×2/4×2} = {2/8}', '{3/8} + {2/8} = {5/8}'] } },

{ skill: 'models', title: 'Read a number line',
  problem: [
    { p: 'Point A shows how far Rosa ran in the morning, in miles.' },
    { nline: { den: 6, at: 1, label: 'A' } },
    { p: 'She ran {1/3} mile in the afternoon. How far did she run in all?' }],
  steps: [
    '0 to 1 is cut into 6 equal parts. Each part is {1/6}.',
    'Point A is 1 part from 0. So A is at {1/6}.',
    'Change {1/3} to sixths: {1/3} = {1×2/3×2} = {2/6}.',
    'Add: {1/6} + {2/6} = {3/6}.'],
  answer: 'Rosa ran {3/6} mile in all. That is the same as {1/2} mile.',
  check: { point: '{1/6}', asked: '{1/6} + {1/3}', is: '{3/6}', eqs: ['{1/3} = {1×2/3×2} = {2/6}', '{1/6} + {2/6} = {3/6}'] } }

];
