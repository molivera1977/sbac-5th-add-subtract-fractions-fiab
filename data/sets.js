/* Grade 5 SBAC FIAB practice — Add and Subtract with Equivalent Fractions.
   A Warm Up and three sets on the 15-item skeleton of the real FIAB
   (practice test sources/grade5_math_add_subtract_equiv_fractions_fiab_blueprint.md).
   Every number here is new; the slots, item types and mistake patterns follow the test.
   Sets run easiest to hardest: Warm Up → Review → Test A and Test B, the two tests on par
   with the real FIAB; tools/difficulty.js checks that.

   Math markup: {3/4} is a fraction, {2 3/4} a mixed number, {11×5/4×5} a fraction
   whose top is 11×5 and bottom is 4×5. Choices name no positions (A, B, first …)
   because the order is fixed by the data, not by the reader.

   hint: Warm Up only. A 💡 Reminder that opens and reads itself when the question appears
   (the MM2 Warm-Up pattern). It never gives the answer; tools/validate.js checks that.

   check: what tools/validate.js recomputes. It is not shown to students. */

window.SKILL_NAMES = {
  inverse: 'Missing numbers: add and subtract',
  steps:   'Mixed numbers: pick the right steps',
  expr:    'Word problems: pick the expression',
  error:   'Find the mistake',
  tenths:  'Tenths and hundredths',
  unlike:  'Add fractions with unlike denominators',
  models:  'Models: bars, grids, number lines'
};

window.SETS = {

/* ======================================================================= WARM UP
   Same 15 slots, types and question wording as the sets; friendlier numbers:
   halves, thirds, fourths, sixths, small mixed numbers. Students start here. */
W: [
{ id: 'W01', skill: 'inverse', type: 'mc',
  hint: 'Adding and subtracting undo each other. Find the number that goes in each box. Then read what each student said.',
  parts: [
    { p: 'Four students make statements about the two equations shown.' },
    { eq: 'Equation A:  □ + {1/4} = 1' },
    { eq: 'Equation B:  1 − {1/4} = □' },
    { bubbles: [
      ['Mia', 'There is no number that correctly completes equation A.'],
      ['Noah', 'The same number correctly completes both equations.'],
      ['Olivia', 'Neither equation A nor equation B can be correctly completed by any number.'],
      ['Pedro', 'Equation A and equation B can be correctly completed using a different number for each.'] ] } ],
  ask: 'Which student made a correct statement?',
  choices: [
    { t: 'Mia', why: '{3/4} + {1/4} = 1, so a number does complete equation A.' },
    { t: 'Noah' },
    { t: 'Olivia', why: 'Both equations can be completed. {3/4} works in each one.' },
    { t: 'Pedro', why: 'The numbers are not different. {3/4} completes both equations.' } ],
  answer: 1,
  explain: 'One whole is {4/4}. Equation A: {3/4} + {1/4} = {4/4} = 1, so the box is {3/4}. Equation B: 1 − {1/4} = {3/4}, so the box is {3/4}. The same number completes both equations. That is what Noah said.',
  check: { boxes: ['{3/4}', '{3/4}'] } },

{ id: 'W02', skill: 'steps', type: 'mc',
  hint: 'First, change each mixed number to a fraction. Then find a common denominator. Multiply the top and the bottom by the same number.',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {1 1/2} + {1 1/3}?' } ],
  choices: [
    { t: '{3/2×3} + {4/3×2} = {3/6} + {4/6} = {7/6} = {1 1/6}',
      why: 'Only the denominators were multiplied. When you multiply the bottom of a fraction, multiply the top by the same number.' },
    { t: '{1/2×3} + {1/3×2} = {1/6} + {1/6} = {2/6} = {1/3}',
      why: 'The whole numbers were left out, and only the denominators were multiplied.' },
    { t: '{3×3/2×3} + {4×2/3×2} = {9/6} + {8/6} = {17/6} = {2 5/6}' },
    { t: '{3×3/2×3} + {4×3/3×2} = {9/6} + {12/6} = {21/6} = {3 3/6} = {3 1/2}',
      why: '{4/3} was multiplied by 3 on top but by 2 on the bottom. The top and bottom must be multiplied by the same number.' } ],
  answer: 2,
  explain: 'Change each mixed number to a fraction: {1 1/2} = {3/2} and {1 1/3} = {4/3}. A common denominator for 2 and 3 is 6. {3/2} = {9/6} (times 3 on top and bottom). {4/3} = {8/6} (times 2 on top and bottom). {9/6} + {8/6} = {17/6} = {2 5/6}.',
  check: { target: '{1 1/2} + {1 1/3}' } },

{ id: 'W03', skill: 'expr', type: 'mc',
  hint: 'Add the whole numbers. Then give both fractions the same denominator. Halves can be written as fourths.',
  parts: [ { p: 'Zoe read for {2 1/2} hours on Saturday. She also read for {1 1/4} hours on Sunday.' } ],
  ask: 'Which expression could be used to determine the amount of time, in hours, Zoe read altogether?',
  choices: [
    { t: '2 + 1 + {2/4} + {1/4}' },
    { t: '2 + 1 + {1/4} + {1/4}', why: '{1/2} is not equal to {1/4}. Only the denominator was changed.' },
    { t: '3 + {2/8}', why: 'The numerators 1 and 1 were added before the fractions were renamed. {1/2} = {2/4}.' },
    { t: '3 + {2/6}', why: 'The tops were added and the bottoms were added. Fractions need a common denominator before you add.' } ],
  answer: 0,
  explain: 'Add the whole numbers: 2 + 1. Rename {1/2} as fourths: {1/2} = {2/4}. So Zoe read 2 + 1 + {2/4} + {1/4} hours.',
  check: { target: '{2 1/2} + {1 1/4}' } },

{ id: 'W04', skill: 'steps', type: 'mc',
  hint: 'Look at each step. Was the top multiplied by the same number as the bottom? Were the whole numbers kept?',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {2 1/2} + {1 1/5}?' } ],
  choices: [
    { t: '{5×5/2×5} + {6×5/5×2} = {25/10} + {30/10} = {55/10} = {5 5/10} = {5 1/2}',
      why: '{6/5} was multiplied by 5 on top but by 2 on the bottom. To make tenths, multiply the top and bottom of {6/5} by 2.' },
    { t: '{5×5/2×5} + {6×2/5×2} = {25/10} + {12/10} = {37/10} = {3 7/10}' },
    { t: '{5/2×5} + {6/5×2} = {5/10} + {6/10} = {11/10} = {1 1/10}',
      why: 'Only the denominators were multiplied. The numerators must be multiplied by the same number.' },
    { t: '{1×5/2×5} + {1×2/5×2} = {5/10} + {2/10} = {7/10}',
      why: 'The whole numbers 2 and 1 were left out.' } ],
  answer: 1,
  explain: '{2 1/2} = {5/2} and {1 1/5} = {6/5}. A common denominator for 2 and 5 is 10. {5/2} = {25/10} and {6/5} = {12/10}. {25/10} + {12/10} = {37/10} = {3 7/10}.',
  check: { target: '{2 1/2} + {1 1/5}' } },

{ id: 'W05', skill: 'error', type: 'mc',
  hint: 'Check each step, one at a time. When the bottom is multiplied, the top must be multiplied by the same number.',
  parts: [
    { p: 'A student is adding the fractions {1/2} and {1/3}. The steps are shown.' },
    { steps: [
      'Step 1: A common denominator for 2 and 3 is 6.',
      'Step 2: {1/2} = {3/6}',
      'Step 3: {1/3} = {1/6}',
      'Step 4: {3/6} + {1/6} = {4/6}' ] } ],
  ask: 'In which step does the student first make an error?',
  choices: [
    { t: 'Step 1', why: '6 is a multiple of both 2 and 3, so 6 works as a common denominator.' },
    { t: 'Step 2', why: '1 × 3 = 3 and 2 × 3 = 6, so {1/2} = {3/6} is correct.' },
    { t: 'Step 3' },
    { t: 'Step 4', why: 'Step 4 adds correctly, but it uses a wrong number from an earlier step. Look for the first error.' } ],
  answer: 2,
  explain: 'To change thirds to sixths, multiply the top and bottom by 2. {1/3} = {2/6}, not {1/6}. The student changed only the denominator. Step 3 is the first error.',
  check: { fracs: ['{1/2}', '{1/3}'], common: 6, s2: ['{1/2}', '{3/6}'], s3: ['{1/3}', '{1/6}'], s4: ['{3/6} + {1/6}', '{4/6}'] } },

{ id: 'W06', skill: 'tenths', type: 'entry',
  hint: 'Tenths and hundredths are different sizes. Change the tenths to hundredths first. {1/10} is the same as {10/100}.',
  parts: [ { p: 'Enter the sum.' }, { eq: '{2/10} + {30/100}' } ],
  key: '50/100',
  traps: [
    { v: '32/100', why: '2 tenths is not 2 hundredths. Rename {2/10} as {20/100} first.' },
    { v: '32/110', why: 'Do not add the denominators. Rename {2/10} as {20/100}, then add the numerators.' } ],
  explain: '{2/10} = {20/100}. {20/100} + {30/100} = {50/100}.',
  check: { expr: '{2/10} + {30/100}' } },

{ id: 'W07', skill: 'tenths', type: 'entry',
  hint: 'Change the tenths to hundredths first. {1/10} is the same as {10/100}. Then add the tops.',
  parts: [ { p: 'Enter the sum.' }, { eq: '{5/100} + {4/10}' } ],
  key: '45/100',
  traps: [
    { v: '9/100', why: '4 tenths is not 4 hundredths. Rename {4/10} as {40/100} first.' },
    { v: '9/110', why: 'Do not add the denominators. Rename {4/10} as {40/100}, then add the numerators.' } ],
  explain: '{4/10} = {40/100}. {5/100} + {40/100} = {45/100}.',
  check: { expr: '{5/100} + {4/10}' } },

{ id: 'W08', skill: 'tenths', type: 'entry',
  hint: 'Change the tenths to hundredths first. {1/10} is the same as {10/100}. Then subtract the tops.',
  parts: [ { p: 'Enter the difference.' }, { eq: '{60/100} − {2/10}' } ],
  key: '40/100',
  traps: [
    { v: '58/100', why: '2 tenths is not 2 hundredths. Rename {2/10} as {20/100} first.' },
    { v: '58/90', why: 'Do not subtract the denominators. Rename {2/10} as {20/100}, then subtract the numerators.' } ],
  explain: '{2/10} = {20/100}. {60/100} − {20/100} = {40/100}.',
  check: { expr: '{60/100} − {2/10}' } },

{ id: 'W09', skill: 'tenths', type: 'entry',
  hint: 'Write both fractions as hundredths. Then subtract the tops. The bottom stays 100.',
  parts: [ { p: 'Enter the difference.' }, { eq: '{90/100} − {5/10}' } ],
  key: '40/100',
  traps: [
    { v: '85/100', why: '5 tenths is not 5 hundredths. Rename {5/10} as {50/100} first.' },
    { v: '85/90', why: 'Do not subtract the denominators. Rename {5/10} as {50/100}, then subtract the numerators.' } ],
  explain: '{5/10} = {50/100}. {90/100} − {50/100} = {40/100}.',
  check: { expr: '{90/100} − {5/10}' } },

{ id: 'W10', skill: 'expr', type: 'mc',
  hint: 'Add the whole numbers. Then look at the fractions. Can thirds be written as sixths?',
  parts: [ { p: 'Ella used {1 1/3} cups of flour to make bread. She also used {2 1/6} cups of flour to make cookies.' } ],
  ask: 'Which expression can be used to determine the amount of flour, in cups, Ella used altogether?',
  choices: [
    { t: '1 + 2 + {2/9}', why: 'The tops were added and the bottoms were added. Rename {1/3} as sixths first.' },
    { t: '3 + {2/6} + {1/6}' },
    { t: '3 + {1/6} + {1/6}', why: '{1/3} is not equal to {1/6}. {1/3} = {2/6}.' },
    { t: '1 + 2 + {3/6} + {1/6}', why: '{1/3} is not equal to {3/6}. {3/6} is one half. {1/3} = {2/6}.' } ],
  answer: 1,
  explain: 'Add the whole numbers: 1 + 2 = 3. Rename {1/3} as sixths: {1/3} = {2/6}. So Ella used 3 + {2/6} + {1/6} cups of flour.',
  check: { target: '{1 1/3} + {2 1/6}' } },

{ id: 'W11', skill: 'unlike', type: 'entry',
  hint: 'Write the halves as fourths. Then add the tops. An answer bigger than 1 is OK.',
  parts: [ { p: 'Enter the sum.' }, { eq: '{1/2} + {3/4}' } ],
  key: '5/4',
  traps: [
    { v: '4/6', why: 'The tops were added and the bottoms were added. Use a common denominator of 4.' },
    { v: '4/4', why: 'The numerators were added before the fractions were renamed. {1/2} = {2/4}.' } ],
  explain: 'A common denominator for 2 and 4 is 4. {1/2} = {2/4}. {2/4} + {3/4} = {5/4}. That is more than 1, and that is fine. {5/4} is the same as {1 1/4}.',
  check: { expr: '{1/2} + {3/4}' } },

{ id: 'W12', skill: 'models', type: 'entry',
  hint: 'Look at the model. Each bar is cut into fourths. Compare what they had with what was left.',
  parts: [
    { p: 'The soccer team had {2 1/2} jugs of water at the start of practice. They had {2 1/4} jugs of water left at the end of practice, as shown in the model.' },
    { bars: { den: 4, shaded: [4, 4, 1] } },
    { p: 'Enter the fraction of a jug of water the team drank during practice.' } ],
  key: '1/4',
  traps: [
    { v: '9/4', why: '{9/4} is {2 1/4}, the amount that was left. Subtract to find the amount the team drank.' },
    { v: '0/1', why: 'Rename {1/2} as fourths first: {1/2} = {2/4}. Then {2/4} − {1/4} = {1/4}.' } ],
  explain: '{2 1/2} = {2 2/4}. Subtract what was left: {2 2/4} − {2 1/4} = {1/4}. The team drank {1/4} of a jug.',
  check: { expr: '{2 1/2} − {2 1/4}', left: '{2 1/4}' } },

{ id: 'W13', skill: 'steps', type: 'mc',
  hint: 'First, change {1 1/2} to a fraction. Then find a common denominator for 2 and 6. Multiply the top and the bottom by the same number.',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {1 1/2} + {5/6}?' } ],
  choices: [
    { t: '= {1 1/2} + {5/6}\n= {1 1+5/2+6}\n= {1 6/8} = {1 3/4}',
      why: 'The tops were added and the bottoms were added. Fractions need a common denominator first.' },
    { t: '= {3×6/2×6} + {5×2/6×2}\n= {18/12} + {10/12}\n= {28/24} = {1 4/24} = {1 1/6}',
      why: 'The last step added the denominators. With the same denominator, add only the numerators: {18/12} + {10/12} = {28/12}.' },
    { t: '= {11/2} + {5/6}\n= {11×6/2×6} + {5×2/6×2}\n= {66/12} + {10/12}\n= {76/12} = {6 4/12} = {6 1/3}',
      why: '{1 1/2} is not {11/2}. One whole is {2/2}, so {1 1/2} = {3/2}.' },
    { t: '= {3×6/2×6} + {5×2/6×2}\n= {18/12} + {10/12}\n= {28/12} = {2 4/12} = {2 1/3}' } ],
  answer: 3,
  explain: '{1 1/2} = {3/2}. A common denominator for 2 and 6 is 12. {3/2} = {18/12} and {5/6} = {10/12}. {18/12} + {10/12} = {28/12} = {2 4/12} = {2 1/3}.',
  check: { target: '{1 1/2} + {5/6}' } },

{ id: 'W14', skill: 'models', type: 'entry',
  hint: 'Write a fraction for each figure. Shaded parts go on top. All the parts go on the bottom. Then find a common denominator.',
  parts: [
    { p: 'Luis is making lemonade.' },
    { bullets: [
      'Figure A and Figure B each represent one cup.',
      'The shaded part of Figure A shows the fraction of a cup of lemon juice Luis used.',
      'The shaded part of Figure B shows the fraction of a cup of water Luis used.' ] },
    { grids: [ { label: 'Figure A', rows: 2, cols: 2, shaded: 2 }, { label: 'Figure B', rows: 2, cols: 4, shaded: 2 } ] },
    { p: 'How many cups of liquid did Luis use altogether? Enter the fraction in the box.' } ],
  key: '3/4',
  traps: [
    { v: '4/12', why: 'The shaded parts were added and the total parts were added. Rename both fractions with a common denominator first.' } ],
  explain: 'Figure A shows {2/4}, which equals {1/2}. Figure B shows {2/8}, which equals {1/4}. {1/2} = {2/4}. {2/4} + {1/4} = {3/4}.',
  check: { expr: '{2/4} + {2/8}' } },

{ id: 'W15', skill: 'models', type: 'entry',
  hint: 'Count the jumps from 0 to point A. Each jump is one fourth. Then write {1/2} in fourths.',
  parts: [
    { p: 'The distance, in miles, Ben walked in the morning is plotted at point A on the number line.' },
    { nline: { den: 4, at: 1, label: 'A' } },
    { p: 'Ben walked {1/2} mile in the afternoon.' },
    { p: 'Enter the total distance, in miles, Ben walked in the morning and afternoon.' } ],
  key: '3/4',
  traps: [
    { v: '2/6', why: 'The tops were added and the bottoms were added. Rename {1/2} as fourths first: {1/2} = {2/4}.' },
    { v: '2/4', why: '{1/2} is not {1/4}. Rename {1/2} as {2/4}.' } ],
  explain: 'The number line from 0 to 1 is cut into 4 equal parts, so each part is {1/4}. Point A is at {1/4}. {1/2} = {2/4}. {1/4} + {2/4} = {3/4}.',
  check: { expr: '{1/4} + {1/2}' } }
],

/* ======================================================================= WARM UP · TAKE 2
   The second take of the Warm Up: the same 15 kinds of questions and reminders, new numbers,
   new answers, the right choice at a different letter. */
W2: [
{ id: 'W2-01', skill: 'inverse', type: 'mc',
  hint: 'Adding and subtracting undo each other. Find the number that goes in each box. Then read what each student said.',
  parts: [
    { p: 'Four students make statements about the two equations shown.' },
    { eq: 'Equation A:  □ + {2/3} = 1' },
    { eq: 'Equation B:  1 − {2/3} = □' },
    { bubbles: [
      ['Kai', 'Equation A and equation B can be correctly completed using a different number for each.'],
      ['Lena', 'There is no number that correctly completes equation A.'],
      ['Omar', 'Neither equation A nor equation B can be correctly completed by any number.'],
      ['Rita', 'The same number correctly completes both equations.'] ] } ],
  ask: 'Which student made a correct statement?',
  choices: [
    { t: 'Kai', why: 'The numbers are not different. {1/3} completes both equations.' },
    { t: 'Lena', why: '{1/3} + {2/3} = 1, so a number does complete equation A.' },
    { t: 'Omar', why: 'Both equations can be completed. {1/3} works in each one.' },
    { t: 'Rita' } ],
  answer: 3,
  explain: 'One whole is {3/3}. Equation A: {1/3} + {2/3} = {3/3} = 1, so the box is {1/3}. Equation B: 1 − {2/3} = {1/3}, so the box is {1/3}. The same number completes both equations. That is what Rita said.',
  check: { boxes: ['{1/3}', '{1/3}'] } },

{ id: 'W2-02', skill: 'steps', type: 'mc',
  hint: 'First, change each mixed number to a fraction. Then find a common denominator. Multiply the top and the bottom by the same number.',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {2 1/2} + {1 2/3}?' } ],
  choices: [
    { t: '{5×3/2×3} + {5×2/3×2} = {15/6} + {10/6} = {25/6} = {4 1/6}' },
    { t: '{5/2×3} + {5/3×2} = {5/6} + {5/6} = {10/6} = {1 4/6} = {1 2/3}',
      why: 'Only the denominators were multiplied. When you multiply the bottom of a fraction, multiply the top by the same number.' },
    { t: '{5×3/2×3} + {5×3/3×2} = {15/6} + {15/6} = {30/6} = 5',
      why: '{5/3} was multiplied by 3 on top but by 2 on the bottom. The top and bottom must be multiplied by the same number.' },
    { t: '{1/2×3} + {2/3×2} = {1/6} + {2/6} = {3/6} = {1/2}',
      why: 'The whole numbers were left out, and only the denominators were multiplied.' } ],
  answer: 0,
  explain: 'Change each mixed number to a fraction: {2 1/2} = {5/2} and {1 2/3} = {5/3}. A common denominator for 2 and 3 is 6. {5/2} = {15/6} (times 3 on top and bottom). {5/3} = {10/6} (times 2 on top and bottom). {15/6} + {10/6} = {25/6} = {4 1/6}.',
  check: { target: '{2 1/2} + {1 2/3}' } },

{ id: 'W2-03', skill: 'expr', type: 'mc',
  hint: 'Add the whole numbers. Then give both fractions the same denominator. Halves can be written as fourths.',
  parts: [ { p: 'Max practiced piano for {1 1/2} hours on Monday. He also practiced for {2 3/4} hours on Tuesday.' } ],
  ask: 'Which expression could be used to determine the amount of time, in hours, Max practiced altogether?',
  choices: [
    { t: '1 + 2 + {1/4} + {3/4}', why: '{1/2} is not equal to {1/4}. Only the denominator was changed.' },
    { t: '3 + {4/6}', why: 'The tops were added and the bottoms were added. Fractions need a common denominator before you add.' },
    { t: '1 + 2 + {2/4} + {3/4}' },
    { t: '3 + {4/8}', why: 'The numerators 1 and 3 were added before the fractions were renamed. {1/2} = {2/4}.' } ],
  answer: 2,
  explain: 'Add the whole numbers: 1 + 2. Rename {1/2} as fourths: {1/2} = {2/4}. So Max practiced 1 + 2 + {2/4} + {3/4} hours.',
  check: { target: '{1 1/2} + {2 3/4}' } },

{ id: 'W2-04', skill: 'steps', type: 'mc',
  hint: 'Look at each step. Was the top multiplied by the same number as the bottom? Were the whole numbers kept?',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {1 1/2} + {2 2/5}?' } ],
  choices: [
    { t: '{3/2×5} + {12/5×2} = {3/10} + {12/10} = {15/10} = {1 5/10} = {1 1/2}',
      why: 'Only the denominators were multiplied. The numerators must be multiplied by the same number.' },
    { t: '{1×5/2×5} + {2×2/5×2} = {5/10} + {4/10} = {9/10}',
      why: 'The whole numbers 1 and 2 were left out.' },
    { t: '{3×5/2×5} + {12×5/5×2} = {15/10} + {60/10} = {75/10} = {7 5/10} = {7 1/2}',
      why: '{12/5} was multiplied by 5 on top but by 2 on the bottom. To make tenths, multiply the top and bottom of {12/5} by 2.' },
    { t: '{3×5/2×5} + {12×2/5×2} = {15/10} + {24/10} = {39/10} = {3 9/10}' } ],
  answer: 3,
  explain: '{1 1/2} = {3/2} and {2 2/5} = {12/5}. A common denominator for 2 and 5 is 10. {3/2} = {15/10} and {12/5} = {24/10}. {15/10} + {24/10} = {39/10} = {3 9/10}.',
  check: { target: '{1 1/2} + {2 2/5}' } },

{ id: 'W2-05', skill: 'error', type: 'mc',
  hint: 'Check each step, one at a time. When two fractions have the same denominator, add only the numerators.',
  parts: [
    { p: 'A student is adding the fractions {1/2} and {2/3}. The steps are shown.' },
    { steps: [
      'Step 1: A common denominator for 2 and 3 is 6.',
      'Step 2: {1/2} = {3/6}',
      'Step 3: {2/3} = {4/6}',
      'Step 4: {3/6} + {4/6} = {7/12}' ] } ],
  ask: 'In which step does the student first make an error?',
  choices: [
    { t: 'Step 1', why: '6 is a multiple of both 2 and 3, so 6 works as a common denominator.' },
    { t: 'Step 2', why: '1 × 3 = 3 and 2 × 3 = 6, so {1/2} = {3/6} is correct.' },
    { t: 'Step 3', why: '2 × 2 = 4 and 3 × 2 = 6, so {2/3} = {4/6} is correct.' },
    { t: 'Step 4' } ],
  answer: 3,
  explain: 'Steps 1, 2 and 3 are correct. In Step 4 the student added the denominators. With the same denominator, add only the numerators: {3/6} + {4/6} = {7/6}. Step 4 is the first error.',
  check: { fracs: ['{1/2}', '{2/3}'], common: 6, s2: ['{1/2}', '{3/6}'], s3: ['{2/3}', '{4/6}'], s4: ['{3/6} + {4/6}', '{7/12}'] } },

{ id: 'W2-06', skill: 'tenths', type: 'entry',
  hint: 'Tenths and hundredths are different sizes. Change the tenths to hundredths first. {1/10} is the same as {10/100}.',
  parts: [ { p: 'Enter the sum.' }, { eq: '{4/10} + {20/100}' } ],
  key: '60/100',
  traps: [
    { v: '24/100', why: '4 tenths is not 4 hundredths. Rename {4/10} as {40/100} first.' },
    { v: '24/110', why: 'Do not add the denominators. Rename {4/10} as {40/100}, then add the numerators.' } ],
  explain: '{4/10} = {40/100}. {40/100} + {20/100} = {60/100}.',
  check: { expr: '{4/10} + {20/100}' } },

{ id: 'W2-07', skill: 'tenths', type: 'entry',
  hint: 'Change the tenths to hundredths first. {1/10} is the same as {10/100}. Then add the tops.',
  parts: [ { p: 'Enter the sum.' }, { eq: '{3/100} + {6/10}' } ],
  key: '63/100',
  traps: [
    { v: '9/100', why: '6 tenths is not 6 hundredths. Rename {6/10} as {60/100} first.' },
    { v: '9/110', why: 'Do not add the denominators. Rename {6/10} as {60/100}, then add the numerators.' } ],
  explain: '{6/10} = {60/100}. {3/100} + {60/100} = {63/100}.',
  check: { expr: '{3/100} + {6/10}' } },

{ id: 'W2-08', skill: 'tenths', type: 'entry',
  hint: 'Change the tenths to hundredths first. {1/10} is the same as {10/100}. Then subtract the tops.',
  parts: [ { p: 'Enter the difference.' }, { eq: '{70/100} − {4/10}' } ],
  key: '30/100',
  traps: [
    { v: '66/100', why: '4 tenths is not 4 hundredths. Rename {4/10} as {40/100} first.' },
    { v: '66/90', why: 'Do not subtract the denominators. Rename {4/10} as {40/100}, then subtract the numerators.' } ],
  explain: '{4/10} = {40/100}. {70/100} − {40/100} = {30/100}.',
  check: { expr: '{70/100} − {4/10}' } },

{ id: 'W2-09', skill: 'tenths', type: 'entry',
  hint: 'Write both fractions as hundredths. Then subtract the tops. The bottom stays 100.',
  parts: [ { p: 'Enter the difference.' }, { eq: '{60/100} − {4/10}' } ],
  key: '20/100',
  traps: [
    { v: '56/100', why: '4 tenths is not 4 hundredths. Rename {4/10} as {40/100} first.' },
    { v: '56/90', why: 'Do not subtract the denominators. Rename {4/10} as {40/100}, then subtract the numerators.' } ],
  explain: '{4/10} = {40/100}. {60/100} − {40/100} = {20/100}.',
  check: { expr: '{60/100} − {4/10}' } },

{ id: 'W2-10', skill: 'expr', type: 'mc',
  hint: 'Add the whole numbers. Then look at the fractions. Can halves be written as sixths?',
  parts: [ { p: 'Nora used {2 1/2} cups of milk to make soup. She also used {1 1/6} cups of milk to make muffins.' } ],
  ask: 'Which expression can be used to determine the amount of milk, in cups, Nora used altogether?',
  choices: [
    { t: '2 + 1 + {2/8}', why: 'The tops were added and the bottoms were added. Rename {1/2} as sixths first.' },
    { t: '3 + {1/6} + {1/6}', why: '{1/2} is not equal to {1/6}. {1/2} = {3/6}.' },
    { t: '3 + {3/6} + {1/6}' },
    { t: '2 + 1 + {2/6} + {1/6}', why: '{1/2} is not equal to {2/6}. {2/6} is one third. {1/2} = {3/6}.' } ],
  answer: 2,
  explain: 'Add the whole numbers: 2 + 1 = 3. Rename {1/2} as sixths: {1/2} = {3/6}. So Nora used 3 + {3/6} + {1/6} cups of milk.',
  check: { target: '{2 1/2} + {1 1/6}' } },

{ id: 'W2-11', skill: 'unlike', type: 'entry',
  hint: 'Write the thirds as sixths. Then add the tops. An answer bigger than 1 is OK.',
  parts: [ { p: 'Enter the sum.' }, { eq: '{2/3} + {5/6}' } ],
  key: '9/6',
  traps: [
    { v: '7/9', why: 'The tops were added and the bottoms were added. Use a common denominator of 6.' },
    { v: '7/6', why: 'The numerators were added before the fractions were renamed. {2/3} = {4/6}.' } ],
  explain: 'A common denominator for 3 and 6 is 6. {2/3} = {4/6}. {4/6} + {5/6} = {9/6}. That is more than 1, and that is fine. {9/6} is the same as {1 3/6}, or {1 1/2}.',
  check: { expr: '{2/3} + {5/6}' } },

{ id: 'W2-12', skill: 'models', type: 'entry',
  hint: 'Look at the model. Each bar is cut into fourths. Compare what they had with what was left.',
  parts: [
    { p: 'The art class had {2 3/4} bags of clay at the start of the week. They had {2 1/4} bags of clay left at the end of the week, as shown in the model.' },
    { bars: { den: 4, shaded: [4, 4, 1] } },
    { p: 'Enter the fraction of a bag of clay the class used during the week.' } ],
  key: '2/4',
  traps: [
    { v: '9/4', why: '{9/4} is {2 1/4}, the amount that was left. Subtract to find the amount the class used.' } ],
  explain: 'Subtract what was left: {2 3/4} − {2 1/4} = {2/4}. The class used {2/4}, or {1/2}, of a bag.',
  check: { expr: '{2 3/4} − {2 1/4}', left: '{2 1/4}' } },
{ id: 'W2-13', skill: 'steps', type: 'mc',
  hint: 'First, change {1 2/3} to a fraction. Then find a common denominator for 3 and 2. Multiply the top and the bottom by the same number.',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {1 2/3} + {1/2}?' } ],
  choices: [
    { t: '= {1 2/3} + {1/2}\n= {1 2+1/3+2}\n= {1 3/5}',
      why: 'The tops were added and the bottoms were added. Fractions need a common denominator first.' },
    { t: '= {5×2/3×2} + {1×3/2×3}\n= {10/6} + {3/6}\n= {13/6} = {2 1/6}' },
    { t: '= {5×2/3×2} + {1×3/2×3}\n= {10/6} + {3/6}\n= {13/12} = {1 1/12}',
      why: 'The last step added the denominators. With the same denominator, add only the numerators: {10/6} + {3/6} = {13/6}.' },
    { t: '= {12/3} + {1/2}\n= {12×2/3×2} + {1×3/2×3}\n= {24/6} + {3/6}\n= {27/6} = {4 3/6} = {4 1/2}',
      why: '{1 2/3} is not {12/3}. One whole is {3/3}, so {1 2/3} = {5/3}.' } ],
  answer: 1,
  explain: '{1 2/3} = {5/3}. A common denominator for 3 and 2 is 6. {5/3} = {10/6} and {1/2} = {3/6}. {10/6} + {3/6} = {13/6} = {2 1/6}.',
  check: { target: '{1 2/3} + {1/2}' } },

{ id: 'W2-14', skill: 'models', type: 'entry',
  hint: 'Write a fraction for each figure. Shaded parts go on top. All the parts go on the bottom. Then find a common denominator.',
  parts: [
    { p: 'Ana is making a fruit drink.' },
    { bullets: [
      'Figure A and Figure B each represent one cup.',
      'The shaded part of Figure A shows the fraction of a cup of orange juice Ana used.',
      'The shaded part of Figure B shows the fraction of a cup of water Ana used.' ] },
    { grids: [ { label: 'Figure A', rows: 2, cols: 2, shaded: 3 }, { label: 'Figure B', rows: 2, cols: 4, shaded: 1 } ] },
    { p: 'How many cups of liquid did Ana use altogether? Enter the fraction in the box.' } ],
  key: '7/8',
  traps: [
    { v: '4/12', why: 'The shaded parts were added and the total parts were added. Rename both fractions with a common denominator first.' } ],
  explain: 'Figure A shows {3/4}. Figure B shows {1/8}. A common denominator for 4 and 8 is 8: {3/4} = {6/8}. {6/8} + {1/8} = {7/8}.',
  check: { expr: '{3/4} + {1/8}' } },

{ id: 'W2-15', skill: 'models', type: 'entry',
  hint: 'Count the jumps from 0 to point A. Each jump is one sixth. Then write {1/2} in sixths.',
  parts: [
    { p: 'The distance, in miles, Lily biked in the morning is plotted at point A on the number line.' },
    { nline: { den: 6, at: 2, label: 'A' } },
    { p: 'Lily biked {1/2} mile in the afternoon.' },
    { p: 'Enter the total distance, in miles, Lily biked in the morning and afternoon.' } ],
  key: '5/6',
  traps: [
    { v: '3/8', why: 'The tops were added and the bottoms were added. Rename {1/2} as sixths first: {1/2} = {3/6}.' },
    { v: '3/6', why: '{1/2} is not {1/6}. Rename {1/2} as {3/6}.' } ],
  explain: 'The number line from 0 to 1 is cut into 6 equal parts, so each part is {1/6}. Point A is at {2/6}. {1/2} = {3/6}. {2/6} + {3/6} = {5/6}.',
  check: { expr: '{2/6} + {1/2}' } }
],

/* ======================================================================= REVIEW
   A step up from the Warm Up, still easier than the real test. */
R: [
{ id: 'R01', skill: 'inverse', type: 'mc',
  parts: [
    { p: 'Four students make statements about the two equations shown.' },
    { eq: 'Equation A:  □ + {5/8} = 1' },
    { eq: 'Equation B:  1 + {5/8} = □' },
    { bubbles: [
      ['Ava', 'The same number correctly completes both equations.'],
      ['Ben', 'There is no number that correctly completes equation B.'],
      ['Cruz', 'Equation A and equation B can be correctly completed using a different number for each.'],
      ['Dana', 'Neither equation A nor equation B can be correctly completed by any number.'] ] } ],
  ask: 'Which student made a correct statement?',
  choices: [
    { t: 'Ava', why: 'Equation A needs {3/8}, but equation B needs {1 5/8}. They are not the same number.' },
    { t: 'Ben', why: '1 + {5/8} = {1 5/8}, so a number does complete equation B.' },
    { t: 'Cruz' },
    { t: 'Dana', why: 'Both equations can be completed: equation A with {3/8} and equation B with {1 5/8}.' } ],
  answer: 2,
  explain: 'Equation A: {3/8} + {5/8} = {8/8} = 1, so the box is {3/8}. Equation B adds: 1 + {5/8} = {1 5/8}, so the box is {1 5/8}. Each equation can be completed, but with a different number. That is what Cruz said.',
  check: { boxes: ['{3/8}', '{1 5/8}'] } },

{ id: 'R02', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {1 2/3} + {2 3/4}?' } ],
  choices: [
    { t: '{5×4/3×4} + {11×3/4×3} = {20/12} + {33/12} = {53/12} = {4 5/12}' },
    { t: '{5/3×4} + {11/4×3} = {5/12} + {11/12} = {16/12} = {1 4/12} = {1 1/3}',
      why: 'Only the denominators were multiplied. When you multiply the bottom of a fraction, multiply the top by the same number.' },
    { t: '{5×4/3×4} + {11×4/4×3} = {20/12} + {44/12} = {64/12} = {5 4/12} = {5 1/3}',
      why: '{11/4} was multiplied by 4 on top but by 3 on the bottom. Multiply the top and bottom by the same number, 3.' },
    { t: '{2/3×4} + {3/4×3} = {2/12} + {3/12} = {5/12}',
      why: 'The whole numbers 1 and 2 were left out, and only the denominators were multiplied.' } ],
  answer: 0,
  explain: '{1 2/3} = {5/3} and {2 3/4} = {11/4}. A common denominator for 3 and 4 is 12. {5/3} = {20/12} and {11/4} = {33/12}. {20/12} + {33/12} = {53/12} = {4 5/12}.',
  check: { target: '{1 2/3} + {2 3/4}' } },

{ id: 'R03', skill: 'expr', type: 'mc',
  parts: [ { p: 'Andre walked {3 1/2} miles on Saturday. He also walked {2 1/3} miles on Sunday.' } ],
  ask: 'Which expression could be used to determine the distance, in miles, Andre walked altogether?',
  choices: [
    { t: '5 + {2/6}', why: 'The numerators 1 and 1 were added before the fractions were renamed. {1/2} = {3/6} and {1/3} = {2/6}.' },
    { t: '3 + 2 + {1/3} + {1/3}', why: '{1/2} is not equal to {1/3}. Only the denominator was changed.' },
    { t: '5 + {2/5}', why: 'The tops were added and the bottoms were added. Fractions need a common denominator before you add.' },
    { t: '3 + 2 + {3/6} + {2/6}' } ],
  answer: 3,
  explain: 'Add the whole numbers: 3 + 2. A common denominator for 2 and 3 is 6. {1/2} = {3/6} and {1/3} = {2/6}. So Andre walked 3 + 2 + {3/6} + {2/6} miles.',
  check: { target: '{3 1/2} + {2 1/3}' } },

{ id: 'R04', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {3 1/4} + {1 2/3}?' } ],
  choices: [
    { t: '{13/4×3} + {5/3×4} = {13/12} + {5/12} = {18/12} = {1 6/12} = {1 1/2}',
      why: 'Only the denominators were multiplied. The numerators must be multiplied by the same number.' },
    { t: '{1×3/4×3} + {2×4/3×4} = {3/12} + {8/12} = {11/12}',
      why: 'The whole numbers 3 and 1 were left out.' },
    { t: '{13×3/4×3} + {5×3/3×4} = {39/12} + {15/12} = {54/12} = {4 6/12} = {4 1/2}',
      why: '{5/3} was multiplied by 3 on top but by 4 on the bottom. To make twelfths, multiply the top and bottom of {5/3} by 4.' },
    { t: '{13×3/4×3} + {5×4/3×4} = {39/12} + {20/12} = {59/12} = {4 11/12}' } ],
  answer: 3,
  explain: '{3 1/4} = {13/4} and {1 2/3} = {5/3}. A common denominator for 4 and 3 is 12. {13/4} = {39/12} and {5/3} = {20/12}. {39/12} + {20/12} = {59/12} = {4 11/12}.',
  check: { target: '{3 1/4} + {1 2/3}' } },

{ id: 'R05', skill: 'error', type: 'mc',
  parts: [
    { p: 'A student is adding the fractions {1/4} and {5/6}. The steps are shown.' },
    { steps: [
      'Step 1: A common denominator for 4 and 6 is 12.',
      'Step 2: {1/4} = {2/12}',
      'Step 3: {5/6} = {10/12}',
      'Step 4: {2/12} + {10/12} = {12/12}' ] } ],
  ask: 'In which step does the student first make an error?',
  choices: [
    { t: 'Step 1', why: '12 is a multiple of both 4 and 6, so 12 works as a common denominator.' },
    { t: 'Step 2' },
    { t: 'Step 3', why: '5 × 2 = 10 and 6 × 2 = 12, so Step 3 is correct. Look for an earlier step.' },
    { t: 'Step 4', why: 'Step 4 adds correctly, but it uses a wrong number from an earlier step. Look for the first error.' } ],
  answer: 1,
  explain: 'To change fourths to twelfths, multiply the top and bottom by 3. {1/4} = {3/12}, not {2/12}. Step 2 is the first error.',
  check: { fracs: ['{1/4}', '{5/6}'], common: 12, s2: ['{1/4}', '{2/12}'], s3: ['{5/6}', '{10/12}'], s4: ['{2/12} + {10/12}', '{12/12}'] } },

{ id: 'R06', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{6/10} + {30/100}' } ],
  key: '90/100',
  traps: [
    { v: '36/100', why: '6 tenths is not 6 hundredths. Rename {6/10} as {60/100} first.' },
    { v: '36/110', why: 'Do not add the denominators. Rename {6/10} as {60/100}, then add the numerators.' } ],
  explain: '{6/10} = {60/100}. {60/100} + {30/100} = {90/100}.',
  check: { expr: '{6/10} + {30/100}' } },

{ id: 'R07', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{9/100} + {3/10}' } ],
  key: '39/100',
  traps: [
    { v: '12/100', why: '3 tenths is not 3 hundredths. Rename {3/10} as {30/100} first.' },
    { v: '12/110', why: 'Do not add the denominators. Rename {3/10} as {30/100}, then add the numerators.' } ],
  explain: '{3/10} = {30/100}. {9/100} + {30/100} = {39/100}.',
  check: { expr: '{9/100} + {3/10}' } },

{ id: 'R08', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the difference.' }, { eq: '{80/100} − {6/10}' } ],
  key: '20/100',
  traps: [
    { v: '74/100', why: '6 tenths is not 6 hundredths. Rename {6/10} as {60/100} first.' },
    { v: '74/90', why: 'Do not subtract the denominators. Rename {6/10} as {60/100}, then subtract the numerators.' } ],
  explain: '{6/10} = {60/100}. {80/100} − {60/100} = {20/100}.',
  check: { expr: '{80/100} − {6/10}' } },
{ id: 'R09', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the difference.' }, { eq: '{60/100} − {1/10}' } ],
  key: '50/100',
  traps: [
    { v: '59/100', why: '1 tenth is not 1 hundredth. Rename {1/10} as {10/100} first.' },
    { v: '59/90', why: 'Do not subtract the denominators. Rename {1/10} as {10/100}, then subtract the numerators.' } ],
  explain: '{1/10} = {10/100}. {60/100} − {10/100} = {50/100}.',
  check: { expr: '{60/100} − {1/10}' } },

{ id: 'R10', skill: 'expr', type: 'mc',
  parts: [ { p: 'Rosa picked {3 1/3} pounds of blueberries. She also picked {1 1/6} pounds of strawberries.' } ],
  ask: 'Which expression can be used to determine the weight of the berries, in pounds, Rosa picked altogether?',
  choices: [
    { t: '4 + {2/6} + {1/6}' },
    { t: '3 + 1 + {2/9}', why: 'The tops were added and the bottoms were added. Rename {1/3} as sixths first.' },
    { t: '4 + {1/6} + {1/6}', why: '{1/3} is not equal to {1/6}. {1/3} = {2/6}.' },
    { t: '3 + 1 + {3/6} + {1/6}', why: '{1/3} is not equal to {3/6}. {3/6} is one half. {1/3} = {2/6}.' } ],
  answer: 0,
  explain: 'Add the whole numbers: 3 + 1 = 4. Rename {1/3} as sixths: {1/3} = {2/6}. So Rosa picked 4 + {2/6} + {1/6} pounds of berries.',
  check: { target: '{3 1/3} + {1 1/6}' } },
{ id: 'R11', skill: 'unlike', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{4/5} + {1/2}' } ],
  key: '13/10',
  traps: [
    { v: '5/7', why: 'The tops were added and the bottoms were added. Use a common denominator of 10.' },
    { v: '5/10', why: 'The numerators were added before the fractions were renamed. {4/5} = {8/10} and {1/2} = {5/10}.' } ],
  explain: 'A common denominator for 5 and 2 is 10. {4/5} = {8/10} and {1/2} = {5/10}. {8/10} + {5/10} = {13/10}. That is more than 1, and that is fine. {13/10} is the same as {1 3/10}.',
  check: { expr: '{4/5} + {1/2}' } },

{ id: 'R12', skill: 'models', type: 'entry',
  parts: [
    { p: 'The Lee family had {4 1/2} pans of lasagna at the start of a party. They had {4 1/4} pans of lasagna left at the end of the party, as shown in the model.' },
    { bars: { den: 4, shaded: [4, 4, 4, 4, 1] } },
    { p: 'Enter the fraction of a pan of lasagna the family ate at the party.' } ],
  key: '1/4',
  traps: [
    { v: '17/4', why: '{17/4} is {4 1/4}, the amount that was left. Subtract to find the amount the family ate.' },
    { v: '0/1', why: 'Rename {1/2} as fourths first: {1/2} = {2/4}. Then {2/4} − {1/4} = {1/4}.' } ],
  explain: '{4 1/2} = {4 2/4}. Subtract what was left: {4 2/4} − {4 1/4} = {1/4}. The family ate {1/4} of a pan.',
  check: { expr: '{4 1/2} − {4 1/4}', left: '{4 1/4}' } },
{ id: 'R13', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {2 1/3} + {3/4}?' } ],
  choices: [
    { t: '= {2 1/3} + {3/4}\n= {2 1+3/3+4}\n= {2 4/7}',
      why: 'The tops were added and the bottoms were added. Fractions need a common denominator first.' },
    { t: '= {7×4/3×4} + {3×3/4×3}\n= {28/12} + {9/12}\n= {37/24} = {1 13/24}',
      why: 'The last step added the denominators. With the same denominator, add only the numerators: {28/12} + {9/12} = {37/12}.' },
    { t: '= {7×4/3×4} + {3×3/4×3}\n= {28/12} + {9/12}\n= {37/12} = {3 1/12}' },
    { t: '= {21/3} + {3/4}\n= {21×4/3×4} + {3×3/4×3}\n= {84/12} + {9/12}\n= {93/12} = {7 9/12} = {7 3/4}',
      why: '{2 1/3} is not {21/3}. Two wholes are {6/3}, so {2 1/3} = {7/3}.' } ],
  answer: 2,
  explain: '{2 1/3} = {7/3}. A common denominator for 3 and 4 is 12. {7/3} = {28/12} and {3/4} = {9/12}. {28/12} + {9/12} = {37/12} = {3 1/12}.',
  check: { target: '{2 1/3} + {3/4}' } },
{ id: 'R14', skill: 'models', type: 'entry',
  parts: [
    { p: 'Carlos is painting a fence.' },
    { bullets: [
      'Figure A and Figure B each represent one can of paint.',
      'The shaded part of Figure A shows the fraction of a can of white paint Carlos used.',
      'The shaded part of Figure B shows the fraction of a can of blue paint Carlos used.' ] },
    { grids: [ { label: 'Figure A', rows: 2, cols: 4, shaded: 1 }, { label: 'Figure B', rows: 2, cols: 2, shaded: 2 } ] },
    { p: 'How many cans of paint did Carlos use altogether? Enter the fraction in the box.' } ],
  key: '5/8',
  traps: [
    { v: '3/12', why: 'The shaded parts were added and the total parts were added. Rename both fractions with a common denominator of 8 first.' } ],
  explain: 'Figure A shows {1/8}. Figure B shows {2/4}, which equals {1/2}. A common denominator for 8 and 4 is 8: {2/4} = {4/8}. {1/8} + {4/8} = {5/8}.',
  check: { expr: '{1/8} + {2/4}' } },
{ id: 'R15', skill: 'models', type: 'entry',
  parts: [
    { p: 'The distance, in kilometers, Sofia ran in the morning is plotted at point A on the number line.' },
    { nline: { den: 6, at: 1, label: 'A' } },
    { p: 'Sofia ran {1/2} kilometer in the afternoon.' },
    { p: 'Enter the total distance, in kilometers, Sofia ran in the morning and afternoon.' } ],
  key: '4/6',
  traps: [
    { v: '2/8', why: 'The tops were added and the bottoms were added. Rename {1/2} as sixths first: {1/2} = {3/6}.' },
    { v: '2/6', why: '{1/2} is not {1/6}. Rename {1/2} as {3/6}.' } ],
  explain: 'The number line from 0 to 1 is cut into 6 equal parts, so each part is {1/6}. Point A is at {1/6}. {1/2} = {3/6}. {1/6} + {3/6} = {4/6}.',
  check: { expr: '{1/6} + {1/2}' } }
],

/* ======================================================================= REVIEW · TAKE 2
   The second take of the Review: the same 15 kinds of questions, new numbers, new answers,
   the right choice at a different letter. Still easier than Test A and Test B. */
R2: [
{ id: 'R2-01', skill: 'inverse', type: 'mc',
  parts: [
    { p: 'Four students make statements about the two equations shown.' },
    { eq: 'Equation A:  □ + {3/5} = 1' },
    { eq: 'Equation B:  1 + {3/5} = □' },
    { bubbles: [
      ['Gia', 'There is no number that correctly completes equation B.'],
      ['Hugo', 'Equation A and equation B can be correctly completed using a different number for each.'],
      ['Ivy', 'The same number correctly completes both equations.'],
      ['Jon', 'Neither equation A nor equation B can be correctly completed by any number.'] ] } ],
  ask: 'Which student made a correct statement?',
  choices: [
    { t: 'Gia', why: '1 + {3/5} = {1 3/5}, so a number does complete equation B.' },
    { t: 'Hugo' },
    { t: 'Ivy', why: 'Equation A needs {2/5}, but equation B needs {1 3/5}. They are not the same number.' },
    { t: 'Jon', why: 'Both equations can be completed: equation A with {2/5} and equation B with {1 3/5}.' } ],
  answer: 1,
  explain: 'Equation A: {2/5} + {3/5} = {5/5} = 1, so the box is {2/5}. Equation B adds: 1 + {3/5} = {1 3/5}, so the box is {1 3/5}. Each equation can be completed, but with a different number. That is what Hugo said.',
  check: { boxes: ['{2/5}', '{1 3/5}'] } },

{ id: 'R2-02', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {2 1/4} + {1 1/3}?' } ],
  choices: [
    { t: '{9/4×3} + {4/3×4} = {9/12} + {4/12} = {13/12} = {1 1/12}',
      why: 'Only the denominators were multiplied. When you multiply the bottom of a fraction, multiply the top by the same number.' },
    { t: '{1/4×3} + {1/3×4} = {1/12} + {1/12} = {2/12} = {1/6}',
      why: 'The whole numbers 2 and 1 were left out, and only the denominators were multiplied.' },
    { t: '{9×3/4×3} + {4×4/3×4} = {27/12} + {16/12} = {43/12} = {3 7/12}' },
    { t: '{9×3/4×3} + {4×3/3×4} = {27/12} + {12/12} = {39/12} = {3 3/12} = {3 1/4}',
      why: '{4/3} was multiplied by 3 on top but by 4 on the bottom. Multiply the top and bottom by the same number, 4.' } ],
  answer: 2,
  explain: '{2 1/4} = {9/4} and {1 1/3} = {4/3}. A common denominator for 4 and 3 is 12. {9/4} = {27/12} and {4/3} = {16/12}. {27/12} + {16/12} = {43/12} = {3 7/12}.',
  check: { target: '{2 1/4} + {1 1/3}' } },

{ id: 'R2-03', skill: 'expr', type: 'mc',
  parts: [ { p: 'Lucy rode her bike {2 2/3} miles on Saturday. She also rode {4 1/2} miles on Sunday.' } ],
  ask: 'Which expression could be used to determine the distance, in miles, Lucy rode altogether?',
  choices: [
    { t: '6 + {3/5}', why: 'The tops were added and the bottoms were added. Fractions need a common denominator before you add.' },
    { t: '2 + 4 + {4/6} + {3/6}' },
    { t: '2 + 4 + {2/3} + {1/3}', why: '{1/2} is not equal to {1/3}. Only the denominator was changed.' },
    { t: '6 + {3/6}', why: 'The numerators 2 and 1 were added before the fractions were renamed. {2/3} = {4/6} and {1/2} = {3/6}.' } ],
  answer: 1,
  explain: 'Add the whole numbers: 2 + 4. A common denominator for 3 and 2 is 6. {2/3} = {4/6} and {1/2} = {3/6}. So Lucy rode 2 + 4 + {4/6} + {3/6} miles.',
  check: { target: '{2 2/3} + {4 1/2}' } },

{ id: 'R2-04', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {3 1/3} + {1 3/4}?' } ],
  choices: [
    { t: '{10×4/3×4} + {7×3/4×3} = {40/12} + {21/12} = {61/12} = {5 1/12}' },
    { t: '{10×4/3×4} + {7×4/4×3} = {40/12} + {28/12} = {68/12} = {5 8/12} = {5 2/3}',
      why: '{7/4} was multiplied by 4 on top but by 3 on the bottom. To make twelfths, multiply the top and bottom of {7/4} by 3.' },
    { t: '{10/3×4} + {7/4×3} = {10/12} + {7/12} = {17/12} = {1 5/12}',
      why: 'Only the denominators were multiplied. The numerators must be multiplied by the same number.' },
    { t: '{1×4/3×4} + {3×3/4×3} = {4/12} + {9/12} = {13/12} = {1 1/12}',
      why: 'The whole numbers 3 and 1 were left out.' } ],
  answer: 0,
  explain: '{3 1/3} = {10/3} and {1 3/4} = {7/4}. A common denominator for 3 and 4 is 12. {10/3} = {40/12} and {7/4} = {21/12}. {40/12} + {21/12} = {61/12} = {5 1/12}.',
  check: { target: '{3 1/3} + {1 3/4}' } },

{ id: 'R2-05', skill: 'error', type: 'mc',
  parts: [
    { p: 'A student is adding the fractions {1/6} and {3/4}. The steps are shown.' },
    { steps: [
      'Step 1: A common denominator for 6 and 4 is 12.',
      'Step 2: {1/6} = {2/12}',
      'Step 3: {3/4} = {3/12}',
      'Step 4: {2/12} + {3/12} = {5/12}' ] } ],
  ask: 'In which step does the student first make an error?',
  choices: [
    { t: 'Step 1', why: '12 is a multiple of both 6 and 4, so 12 works as a common denominator.' },
    { t: 'Step 2', why: '1 × 2 = 2 and 6 × 2 = 12, so {1/6} = {2/12} is correct.' },
    { t: 'Step 3' },
    { t: 'Step 4', why: 'Step 4 adds correctly, but it uses a wrong number from an earlier step. Look for the first error.' } ],
  answer: 2,
  explain: 'To change fourths to twelfths, multiply the top and bottom by 3. {3/4} = {9/12}, not {3/12}. The student changed only the denominator. Step 3 is the first error.',
  check: { fracs: ['{1/6}', '{3/4}'], common: 12, s2: ['{1/6}', '{2/12}'], s3: ['{3/4}', '{3/12}'], s4: ['{2/12} + {3/12}', '{5/12}'] } },

{ id: 'R2-06', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{3/10} + {50/100}' } ],
  key: '80/100',
  traps: [
    { v: '53/100', why: '3 tenths is not 3 hundredths. Rename {3/10} as {30/100} first.' },
    { v: '53/110', why: 'Do not add the denominators. Rename {3/10} as {30/100}, then add the numerators.' } ],
  explain: '{3/10} = {30/100}. {30/100} + {50/100} = {80/100}.',
  check: { expr: '{3/10} + {50/100}' } },

{ id: 'R2-07', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{6/100} + {7/10}' } ],
  key: '76/100',
  traps: [
    { v: '13/100', why: '7 tenths is not 7 hundredths. Rename {7/10} as {70/100} first.' },
    { v: '13/110', why: 'Do not add the denominators. Rename {7/10} as {70/100}, then add the numerators.' } ],
  explain: '{7/10} = {70/100}. {6/100} + {70/100} = {76/100}.',
  check: { expr: '{6/100} + {7/10}' } },

{ id: 'R2-08', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the difference.' }, { eq: '{70/100} − {3/10}' } ],
  key: '40/100',
  traps: [
    { v: '67/100', why: '3 tenths is not 3 hundredths. Rename {3/10} as {30/100} first.' },
    { v: '67/90', why: 'Do not subtract the denominators. Rename {3/10} as {30/100}, then subtract the numerators.' } ],
  explain: '{3/10} = {30/100}. {70/100} − {30/100} = {40/100}.',
  check: { expr: '{70/100} − {3/10}' } },
{ id: 'R2-09', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the difference.' }, { eq: '{90/100} − {2/10}' } ],
  key: '70/100',
  traps: [
    { v: '88/100', why: '2 tenths is not 2 hundredths. Rename {2/10} as {20/100} first.' },
    { v: '88/90', why: 'Do not subtract the denominators. Rename {2/10} as {20/100}, then subtract the numerators.' } ],
  explain: '{2/10} = {20/100}. {90/100} − {20/100} = {70/100}.',
  check: { expr: '{90/100} − {2/10}' } },

{ id: 'R2-10', skill: 'expr', type: 'mc',
  parts: [ { p: 'Omar picked {2 2/3} pounds of apples. He also picked {1 1/6} pounds of pears.' } ],
  ask: 'Which expression can be used to determine the weight of the fruit, in pounds, Omar picked altogether?',
  choices: [
    { t: '2 + 1 + {3/9}', why: 'The tops were added and the bottoms were added. Rename {2/3} as sixths first.' },
    { t: '3 + {2/6} + {1/6}', why: '{2/3} is not equal to {2/6}. {2/3} = {4/6}.' },
    { t: '2 + 1 + {3/6} + {1/6}', why: '{2/3} is not equal to {3/6}. {3/6} is one half. {2/3} = {4/6}.' },
    { t: '3 + {4/6} + {1/6}' } ],
  answer: 3,
  explain: 'Add the whole numbers: 2 + 1 = 3. Rename {2/3} as sixths: {2/3} = {4/6}. So Omar picked 3 + {4/6} + {1/6} pounds of fruit.',
  check: { target: '{2 2/3} + {1 1/6}' } },
{ id: 'R2-11', skill: 'unlike', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{3/4} + {2/3}' } ],
  key: '17/12',
  traps: [
    { v: '5/7', why: 'The tops were added and the bottoms were added. Use a common denominator of 12.' },
    { v: '5/12', why: 'The numerators were added before the fractions were renamed. {3/4} = {9/12} and {2/3} = {8/12}.' } ],
  explain: 'A common denominator for 4 and 3 is 12. {3/4} = {9/12} and {2/3} = {8/12}. {9/12} + {8/12} = {17/12}. That is more than 1, and that is fine. {17/12} is the same as {1 5/12}.',
  check: { expr: '{3/4} + {2/3}' } },

{ id: 'R2-12', skill: 'models', type: 'entry',
  parts: [
    { p: 'The Diaz family had {1 3/4} pizzas at the start of dinner. They had {1 1/4} pizzas left at the end of dinner, as shown in the model.' },
    { bars: { den: 4, shaded: [4, 1] } },
    { p: 'Enter the fraction of a pizza the family ate at dinner.' } ],
  key: '2/4',
  traps: [
    { v: '5/4', why: '{5/4} is {1 1/4}, the amount that was left. Subtract to find the amount the family ate.' } ],
  explain: 'Subtract what was left: {1 3/4} − {1 1/4} = {2/4}. The family ate {2/4}, or {1/2}, of a pizza.',
  check: { expr: '{1 3/4} − {1 1/4}', left: '{1 1/4}' } },
{ id: 'R2-13', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {2 3/4} + {1/6}?' } ],
  choices: [
    { t: '= {11×3/4×3} + {1×2/6×2}\n= {33/12} + {2/12}\n= {35/12} = {2 11/12}' },
    { t: '= {2 3/4} + {1/6}\n= {2 3+1/4+6}\n= {2 4/10} = {2 2/5}',
      why: 'The tops were added and the bottoms were added. Fractions need a common denominator first.' },
    { t: '= {23/4} + {1/6}\n= {23×3/4×3} + {1×2/6×2}\n= {69/12} + {2/12}\n= {71/12} = {5 11/12}',
      why: '{2 3/4} is not {23/4}. Two wholes are {8/4}, so {2 3/4} = {11/4}.' },
    { t: '= {11×3/4×3} + {1×2/6×2}\n= {33/12} + {2/12}\n= {35/24} = {1 11/24}',
      why: 'The last step added the denominators. With the same denominator, add only the numerators: {33/12} + {2/12} = {35/12}.' } ],
  answer: 0,
  explain: '{2 3/4} = {11/4}. A common denominator for 4 and 6 is 12. {11/4} = {33/12} and {1/6} = {2/12}. {33/12} + {2/12} = {35/12} = {2 11/12}.',
  check: { target: '{2 3/4} + {1/6}' } },
{ id: 'R2-14', skill: 'models', type: 'entry',
  parts: [
    { p: 'Mr. Lopez is painting a sign.' },
    { bullets: [
      'Figure A and Figure B each represent one jar of paint.',
      'The shaded part of Figure A shows the fraction of a jar of red paint Mr. Lopez used.',
      'The shaded part of Figure B shows the fraction of a jar of green paint Mr. Lopez used.' ] },
    { grids: [ { label: 'Figure A', rows: 2, cols: 3, shaded: 2 }, { label: 'Figure B', rows: 2, cols: 2, shaded: 1 } ] },
    { p: 'How many jars of paint did Mr. Lopez use altogether? Enter the fraction in the box.' } ],
  key: '7/12',
  traps: [
    { v: '3/10', why: 'The shaded parts were added and the total parts were added. Rename both fractions with a common denominator of 12 first.' } ],
  explain: 'Figure A shows {2/6}, which equals {1/3}. Figure B shows {1/4}. A common denominator for 6 and 4 is 12: {2/6} = {4/12} and {1/4} = {3/12}. {4/12} + {3/12} = {7/12}.',
  check: { expr: '{2/6} + {1/4}' } },
{ id: 'R2-15', skill: 'models', type: 'entry',
  parts: [
    { p: 'The distance, in kilometers, Leo walked in the morning is plotted at point A on the number line.' },
    { nline: { den: 6, at: 3, label: 'A' } },
    { p: 'Leo walked {1/3} kilometer in the afternoon.' },
    { p: 'Enter the total distance, in kilometers, Leo walked in the morning and afternoon.' } ],
  key: '5/6',
  traps: [
    { v: '4/9', why: 'The tops were added and the bottoms were added. Rename {1/3} as sixths first: {1/3} = {2/6}.' },
    { v: '4/6', why: '{1/3} is not {1/6}. Rename {1/3} as {2/6}.' } ],
  explain: 'The number line from 0 to 1 is cut into 6 equal parts, so each part is {1/6}. Point A is at {3/6}. {1/3} = {2/6}. {3/6} + {2/6} = {5/6}.',
  check: { expr: '{3/6} + {1/3}' } }
],

/* ======================================================================= TEST A
   On par with the real FIAB, question by question. */
TA: [
{ id: 'TA01', skill: 'inverse', type: 'mc',
  parts: [
    { p: 'Four students make statements about the two equations shown.' },
    { eq: 'Equation A:  □ + {2/5} = 1' },
    { eq: 'Equation B:  1 − {2/5} = □' },
    { bubbles: [
      ['Nia', 'The same number correctly completes both equations.'],
      ['Omar', 'There is no number that correctly completes equation A.'],
      ['Priya', 'Neither equation A nor equation B can be correctly completed by any number.'],
      ['Leo', 'Equation A and equation B can be correctly completed using a different number for each.'] ] } ],
  ask: 'Which student made a correct statement?',
  choices: [
    { t: 'Nia' },
    { t: 'Omar', why: '{3/5} + {2/5} = 1, so a number does complete equation A.' },
    { t: 'Priya', why: 'Both equations can be completed. {3/5} works in each one.' },
    { t: 'Leo', why: 'The numbers are not different. {3/5} completes both equations.' } ],
  answer: 0,
  explain: 'One whole is {5/5}. Equation A: {3/5} + {2/5} = {5/5} = 1, so the box is {3/5}. Equation B: 1 − {2/5} = {3/5}, so the box is {3/5}. The same number completes both equations. That is what Nia said.',
  check: { boxes: ['{3/5}', '{3/5}'] } },

{ id: 'TA02', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {2 3/4} + {1 2/5}?' } ],
  choices: [
    { t: '{11/4×5} + {7/5×4} = {11/20} + {7/20} = {18/20} = {9/10}',
      why: 'Only the denominators were multiplied. When you multiply the bottom of a fraction, multiply the top by the same number.' },
    { t: '{3/4×5} + {2/5×4} = {3/20} + {2/20} = {5/20} = {1/4}',
      why: 'The whole numbers 2 and 1 were left out, and only the denominators were multiplied.' },
    { t: '{11×5/4×5} + {7×5/5×4} = {55/20} + {35/20} = {90/20} = {4 10/20} = {4 1/2}',
      why: '{7/5} was multiplied by 5 on top but by 4 on the bottom. The top and bottom must be multiplied by the same number.' },
    { t: '{11×5/4×5} + {7×4/5×4} = {55/20} + {28/20} = {83/20} = {4 3/20}' } ],
  answer: 3,
  explain: 'Change each mixed number to a fraction: {2 3/4} = {11/4} and {1 2/5} = {7/5}. A common denominator for 4 and 5 is 20. {11/4} = {55/20} (times 5 on top and bottom). {7/5} = {28/20} (times 4 on top and bottom). {55/20} + {28/20} = {83/20} = {4 3/20}.',
  check: { target: '{2 3/4} + {1 2/5}' } },

{ id: 'TA03', skill: 'expr', type: 'mc',
  parts: [ { p: 'Lena used {6 1/4} feet of ribbon to wrap a gift. She also used {2 2/3} feet of ribbon to make a bow.' } ],
  ask: 'Which expression could be used to determine the amount of ribbon, in feet, Lena used altogether?',
  choices: [
    { t: '6 + 2 + {1/3} + {2/3}', why: '{1/4} is not equal to {1/3}. Only the denominator was changed.' },
    { t: '6 + 2 + {3/12} + {8/12}' },
    { t: '8 + {3/12}', why: 'The numerators 1 and 2 were added before the fractions were renamed. {1/4} = {3/12} and {2/3} = {8/12}.' },
    { t: '8 + {3/7}', why: 'The tops were added and the bottoms were added. Fractions need a common denominator before you add.' } ],
  answer: 1,
  explain: 'Add the whole numbers: 6 + 2. A common denominator for 4 and 3 is 12. {1/4} = {3/12} and {2/3} = {8/12}. So Lena used 6 + 2 + {3/12} + {8/12} feet of ribbon.',
  check: { target: '{6 1/4} + {2 2/3}' } },

{ id: 'TA04', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {2 3/8} + {1 1/3}?' } ],
  choices: [
    { t: '{19×3/8×3} + {4×3/3×8} = {57/24} + {12/24} = {69/24} = {2 21/24} = {2 7/8}',
      why: '{4/3} was multiplied by 3 on top but by 8 on the bottom. To make twenty-fourths, multiply the top and bottom of {4/3} by 8.' },
    { t: '{19/8×3} + {4/3×8} = {19/24} + {4/24} = {23/24}',
      why: 'Only the denominators were multiplied. The numerators must be multiplied by the same number.' },
    { t: '{19×3/8×3} + {4×8/3×8} = {57/24} + {32/24} = {89/24} = {3 17/24}' },
    { t: '{3×3/8×3} + {1×8/3×8} = {9/24} + {8/24} = {17/24}',
      why: 'The whole numbers 2 and 1 were left out.' } ],
  answer: 2,
  explain: '{2 3/8} = {19/8} and {1 1/3} = {4/3}. A common denominator for 8 and 3 is 24. {19/8} = {57/24} and {4/3} = {32/24}. {57/24} + {32/24} = {89/24} = {3 17/24}.',
  check: { target: '{2 3/8} + {1 1/3}' } },
{ id: 'TA05', skill: 'error', type: 'mc',
  parts: [
    { p: 'A student is adding the fractions {5/6} and {3/8}. The steps are shown.' },
    { steps: [
      'Step 1: A common denominator for 6 and 8 is 24.',
      'Step 2: {5/6} = {20/24}',
      'Step 3: {3/8} = {9/24}',
      'Step 4: {20/24} + {9/24} = {29/48}' ] } ],
  ask: 'In which step does the student first make an error?',
  choices: [
    { t: 'Step 1', why: '24 is a multiple of both 6 and 8, so 24 works as a common denominator.' },
    { t: 'Step 2', why: '5 × 4 = 20 and 6 × 4 = 24, so {5/6} = {20/24} is correct.' },
    { t: 'Step 3', why: '3 × 3 = 9 and 8 × 3 = 24, so {3/8} = {9/24} is correct.' },
    { t: 'Step 4' } ],
  answer: 3,
  explain: 'Steps 1, 2 and 3 are correct. In Step 4 the student added the denominators: 24 + 24 = 48. When the denominators are the same, add only the numerators: {20/24} + {9/24} = {29/24}.',
  check: { fracs: ['{5/6}', '{3/8}'], common: 24, s2: ['{5/6}', '{20/24}'], s3: ['{3/8}', '{9/24}'], s4: ['{20/24} + {9/24}', '{29/48}'] } },

{ id: 'TA06', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{6/10} + {20/100}' } ],
  key: '80/100',
  traps: [
    { v: '26/100', why: '6 tenths is not 6 hundredths. Rename {6/10} as {60/100} first.' },
    { v: '26/110', why: 'Do not add the denominators. Rename {6/10} as {60/100}, then add the numerators.' } ],
  explain: '{6/10} = {60/100}. {60/100} + {20/100} = {80/100}.',
  check: { expr: '{6/10} + {20/100}' } },
{ id: 'TA07', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{7/100} + {6/10}' } ],
  key: '67/100',
  traps: [
    { v: '13/100', why: '6 tenths is not 6 hundredths. Rename {6/10} as {60/100} first.' },
    { v: '13/110', why: 'Do not add the denominators. Rename {6/10} as {60/100}, then add the numerators.' } ],
  explain: '{6/10} = {60/100}. {7/100} + {60/100} = {67/100}.',
  check: { expr: '{7/100} + {6/10}' } },

{ id: 'TA08', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the difference.' }, { eq: '{90/100} − {4/10}' } ],
  key: '50/100',
  traps: [
    { v: '86/100', why: '4 tenths is not 4 hundredths. Rename {4/10} as {40/100} first.' },
    { v: '86/90', why: 'Do not subtract the denominators. Rename {4/10} as {40/100}, then subtract the numerators.' } ],
  explain: '{4/10} = {40/100}. {90/100} − {40/100} = {50/100}.',
  check: { expr: '{90/100} − {4/10}' } },

{ id: 'TA09', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the difference.' }, { eq: '{90/100} − {3/10}' } ],
  key: '60/100',
  traps: [
    { v: '87/100', why: '3 tenths is not 3 hundredths. Rename {3/10} as {30/100} first.' },
    { v: '87/90', why: 'Do not subtract the denominators. Rename {3/10} as {30/100}, then subtract the numerators.' } ],
  explain: '{3/10} = {30/100}. {90/100} − {30/100} = {60/100}.',
  check: { expr: '{90/100} − {3/10}' } },
{ id: 'TA10', skill: 'expr', type: 'mc',
  parts: [ { p: 'Kai used {2 1/2} cups of milk to make pancakes. He also used {1 5/6} cups of milk to make a smoothie.' } ],
  ask: 'Which expression can be used to determine the amount of milk, in cups, Kai used altogether?',
  choices: [
    { t: '2 + 1 + {6/8}', why: 'The tops were added and the bottoms were added. Rename {1/2} as sixths first.' },
    { t: '3 + {1/6} + {5/6}', why: '{1/2} is not equal to {1/6}. {1/2} = {3/6}.' },
    { t: '3 + {3/6} + {5/6}' },
    { t: '2 + 1 + {2/6} + {5/6}', why: '{1/2} is not equal to {2/6}. {2/6} is one third. {1/2} = {3/6}.' } ],
  answer: 2,
  explain: 'Add the whole numbers: 2 + 1 = 3. Rename {1/2} as sixths: {1/2} = {3/6}. So Kai used 3 + {3/6} + {5/6} cups of milk.',
  check: { target: '{2 1/2} + {1 5/6}' } },
{ id: 'TA11', skill: 'unlike', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{5/8} + {2/3}' } ],
  key: '31/24',
  traps: [
    { v: '7/11', why: 'The tops were added and the bottoms were added. Use a common denominator of 24.' },
    { v: '7/24', why: 'The numerators were added before the fractions were renamed. {5/8} = {15/24} and {2/3} = {16/24}.' } ],
  explain: 'A common denominator for 8 and 3 is 24. {5/8} = {15/24} and {2/3} = {16/24}. {15/24} + {16/24} = {31/24}. That is more than 1, and that is fine. {31/24} is the same as {1 7/24}.',
  check: { expr: '{5/8} + {2/3}' } },
{ id: 'TA12', skill: 'models', type: 'entry',
  parts: [
    { p: 'Mr. Diaz’s class had {1 3/4} trays of muffins on Friday morning. They had {1 1/2} trays of muffins left on Friday afternoon, as shown in the model.' },
    { bars: { den: 4, shaded: [4, 2] } },
    { p: 'Enter the fraction of a tray of muffins the class ate on Friday.' } ],
  key: '1/4',
  traps: [
    { v: '6/4', why: '{6/4} is {1 1/2}, the amount that was left. Subtract to find the amount the class ate.' },
    { v: '2/4', why: 'Rename {1/2} as fourths first: {1/2} = {2/4}, not {1/4}. Then {3/4} − {2/4} = {1/4}.' } ],
  explain: '{1 1/2} = {1 2/4}. Subtract what was left: {1 3/4} − {1 2/4} = {1/4}. The class ate {1/4} of a tray.',
  check: { expr: '{1 3/4} − {1 1/2}', left: '{1 1/2}' } },
{ id: 'TA13', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {1 1/6} + {3/4}?' } ],
  choices: [
    { t: '= {1 1/6} + {3/4}\n= {1 1+3/6+4}\n= {1 4/10} = {1 2/5}',
      why: 'The tops were added and the bottoms were added. Fractions need a common denominator first.' },
    { t: '= {7×2/6×2} + {3×3/4×3}\n= {14/12} + {9/12}\n= {23/12} = {1 11/12}' },
    { t: '= {7×4/6×4} + {3×6/4×6}\n= {28/24} + {18/24}\n= {46/48} = {23/24}',
      why: 'The last step added the denominators. With the same denominator, add only the numerators: {28/24} + {18/24} = {46/24}.' },
    { t: '= {11/6} + {3/4}\n= {11×2/6×2} + {3×3/4×3}\n= {22/12} + {9/12}\n= {31/12} = {2 7/12}',
      why: '{1 1/6} is not {11/6}. One whole is {6/6}, so {1 1/6} = {7/6}.' } ],
  answer: 1,
  explain: '{1 1/6} = {7/6}. A common denominator for 6 and 4 is 12. {7/6} = {14/12} and {3/4} = {9/12}. {14/12} + {9/12} = {23/12} = {1 11/12}.',
  check: { target: '{1 1/6} + {3/4}' } },

{ id: 'TA14', skill: 'models', type: 'entry',
  parts: [
    { p: 'Jada is making fruit punch.' },
    { bullets: [
      'Figure A and Figure B each represent one liter of juice.',
      'The shaded part of Figure A shows the fraction of a liter of orange juice Jada used.',
      'The shaded part of Figure B shows the fraction of a liter of grape juice Jada used.' ] },
    { grids: [ { label: 'Figure A', rows: 2, cols: 3, shaded: 4 }, { label: 'Figure B', rows: 2, cols: 2, shaded: 1 } ] },
    { p: 'How many liters of juice did Jada use altogether? Enter the fraction in the box.' } ],
  key: '11/12',
  traps: [
    { v: '5/10', why: 'The shaded parts were added and the total parts were added. Rename both fractions with a common denominator of 12 first.' } ],
  explain: 'Figure A shows {4/6}, which equals {2/3}. Figure B shows {1/4}. A common denominator is 12: {2/3} = {8/12} and {1/4} = {3/12}. {8/12} + {3/12} = {11/12}.',
  check: { expr: '{4/6} + {1/4}' } },

{ id: 'TA15', skill: 'models', type: 'entry',
  parts: [
    { p: 'The distance, in miles, Maya biked in the morning is plotted at point A on the number line.' },
    { nline: { den: 6, at: 2, label: 'A' } },
    { p: 'Maya biked {1/3} mile in the afternoon.' },
    { p: 'Enter the total distance, in miles, Maya biked in the morning and afternoon.' } ],
  key: '4/6',
  traps: [
    { v: '3/9', why: 'The tops were added and the bottoms were added. Rename {1/3} as sixths first: {1/3} = {2/6}.' },
    { v: '3/6', why: '{1/3} is not {1/6}. Rename {1/3} as {2/6}.' } ],
  explain: 'The number line from 0 to 1 is cut into 6 equal parts, so each part is {1/6}. Point A is at {2/6}. {1/3} = {2/6}. {2/6} + {2/6} = {4/6}.',
  check: { expr: '{2/6} + {1/3}' } }
],

/* ======================================================================= TEST B
   On par with the real FIAB, question by question. */
TB: [
{ id: 'TB01', skill: 'inverse', type: 'mc',
  parts: [
    { p: 'Four students make statements about the two equations shown.' },
    { eq: 'Equation A:  □ + {5/6} = 1' },
    { eq: 'Equation B:  1 − {5/6} = □' },
    { bubbles: [
      ['Eli', 'Equation A and equation B can be correctly completed using a different number for each.'],
      ['Fatima', 'There is no number that correctly completes equation A.'],
      ['Gabe', 'The same number correctly completes both equations.'],
      ['Hana', 'Neither equation A nor equation B can be correctly completed by any number.'] ] } ],
  ask: 'Which student made a correct statement?',
  choices: [
    { t: 'Eli', why: 'The numbers are not different. {1/6} completes both equations.' },
    { t: 'Fatima', why: '{1/6} + {5/6} = 1, so a number does complete equation A.' },
    { t: 'Gabe' },
    { t: 'Hana', why: 'Both equations can be completed. {1/6} works in each one.' } ],
  answer: 2,
  explain: 'One whole is {6/6}. Equation A: {1/6} + {5/6} = {6/6} = 1, so the box is {1/6}. Equation B: 1 − {5/6} = {1/6}, so the box is {1/6}. The same number completes both equations. That is what Gabe said.',
  check: { boxes: ['{1/6}', '{1/6}'] } },
{ id: 'TB02', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {2 2/9} + {1 1/2}?' } ],
  choices: [
    { t: '{20/9×2} + {3/2×9} = {20/18} + {3/18} = {23/18} = {1 5/18}',
      why: 'Only the denominators were multiplied. When you multiply the bottom of a fraction, multiply the top by the same number.' },
    { t: '{20×2/9×2} + {3×9/2×9} = {40/18} + {27/18} = {67/18} = {3 13/18}' },
    { t: '{2/9×2} + {1/2×9} = {2/18} + {1/18} = {3/18} = {1/6}',
      why: 'The whole numbers 2 and 1 were left out, and only the denominators were multiplied.' },
    { t: '{20×2/9×2} + {3×2/2×9} = {40/18} + {6/18} = {46/18} = {2 10/18} = {2 5/9}',
      why: '{3/2} was multiplied by 2 on top but by 9 on the bottom. Multiply the top and bottom by the same number, 9.' } ],
  answer: 1,
  explain: '{2 2/9} = {20/9} and {1 1/2} = {3/2}. A common denominator for 9 and 2 is 18. {20/9} = {40/18} and {3/2} = {27/18}. {40/18} + {27/18} = {67/18} = {3 13/18}.',
  check: { target: '{2 2/9} + {1 1/2}' } },
{ id: 'TB03', skill: 'expr', type: 'mc',
  parts: [ { p: 'A bakery used {7 1/4} pounds of apples to make pies. It also used {2 1/3} pounds of apples to make muffins.' } ],
  ask: 'Which expression could be used to determine the amount of apples, in pounds, the bakery used altogether?',
  choices: [
    { t: '9 + {2/7}', why: 'The tops were added and the bottoms were added. Fractions need a common denominator before you add.' },
    { t: '7 + 2 + {1/3} + {1/3}', why: '{1/4} is not equal to {1/3}. Only the denominator was changed.' },
    { t: '7 + 2 + {3/12} + {4/12}' },
    { t: '9 + {2/12}', why: 'The numerators 1 and 1 were added before the fractions were renamed. {1/4} = {3/12} and {1/3} = {4/12}.' } ],
  answer: 2,
  explain: 'Add the whole numbers: 7 + 2. A common denominator for 4 and 3 is 12. {1/4} = {3/12} and {1/3} = {4/12}. So the bakery used 7 + 2 + {3/12} + {4/12} pounds of apples.',
  check: { target: '{7 1/4} + {2 1/3}' } },
{ id: 'TB04', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {1 3/4} + {2 1/5}?' } ],
  choices: [
    { t: '{7×5/4×5} + {11×4/5×4} = {35/20} + {44/20} = {79/20} = {3 19/20}' },
    { t: '{7×5/4×5} + {11×5/5×4} = {35/20} + {55/20} = {90/20} = {4 10/20} = {4 1/2}',
      why: '{11/5} was multiplied by 5 on top but by 4 on the bottom. To make twentieths, multiply the top and bottom of {11/5} by 4.' },
    { t: '{3×5/4×5} + {1×4/5×4} = {15/20} + {4/20} = {19/20}',
      why: 'The whole numbers 1 and 2 were left out.' },
    { t: '{7/4×5} + {11/5×4} = {7/20} + {11/20} = {18/20} = {9/10}',
      why: 'Only the denominators were multiplied. The numerators must be multiplied by the same number.' } ],
  answer: 0,
  explain: '{1 3/4} = {7/4} and {2 1/5} = {11/5}. A common denominator for 4 and 5 is 20. {7/4} = {35/20} and {11/5} = {44/20}. {35/20} + {44/20} = {79/20} = {3 19/20}.',
  check: { target: '{1 3/4} + {2 1/5}' } },
{ id: 'TB05', skill: 'error', type: 'mc',
  parts: [
    { p: 'A student is adding the fractions {3/8} and {5/12}. The steps are shown.' },
    { steps: [
      'Step 1: A common denominator for 8 and 12 is 24.',
      'Step 2: {3/8} = {9/24}',
      'Step 3: {5/12} = {5/24}',
      'Step 4: {9/24} + {5/24} = {14/24}' ] } ],
  ask: 'In which step does the student first make an error?',
  choices: [
    { t: 'Step 1', why: '24 is a multiple of both 8 and 12, so 24 works as a common denominator.' },
    { t: 'Step 2', why: '3 × 3 = 9 and 8 × 3 = 24, so {3/8} = {9/24} is correct.' },
    { t: 'Step 3' },
    { t: 'Step 4', why: 'Step 4 adds correctly, but it uses a wrong number from an earlier step. Look for the first error.' } ],
  answer: 2,
  explain: 'To change twelfths to twenty-fourths, multiply the top and bottom by 2. {5/12} = {10/24}, not {5/24}. The student changed only the denominator. Step 3 is the first error.',
  check: { fracs: ['{3/8}', '{5/12}'], common: 24, s2: ['{3/8}', '{9/24}'], s3: ['{5/12}', '{5/24}'], s4: ['{9/24} + {5/24}', '{14/24}'] } },
{ id: 'TB06', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{4/10} + {50/100}' } ],
  key: '90/100',
  traps: [
    { v: '54/100', why: '4 tenths is not 4 hundredths. Rename {4/10} as {40/100} first.' },
    { v: '54/110', why: 'Do not add the denominators. Rename {4/10} as {40/100}, then add the numerators.' } ],
  explain: '{4/10} = {40/100}. {40/100} + {50/100} = {90/100}.',
  check: { expr: '{4/10} + {50/100}' } },
{ id: 'TB07', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{4/100} + {8/10}' } ],
  key: '84/100',
  traps: [
    { v: '12/100', why: '8 tenths is not 8 hundredths. Rename {8/10} as {80/100} first.' },
    { v: '12/110', why: 'Do not add the denominators. Rename {8/10} as {80/100}, then add the numerators.' } ],
  explain: '{8/10} = {80/100}. {4/100} + {80/100} = {84/100}.',
  check: { expr: '{4/100} + {8/10}' } },

{ id: 'TB08', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the difference.' }, { eq: '{80/100} − {4/10}' } ],
  key: '40/100',
  traps: [
    { v: '76/100', why: '4 tenths is not 4 hundredths. Rename {4/10} as {40/100} first.' },
    { v: '76/90', why: 'Do not subtract the denominators. Rename {4/10} as {40/100}, then subtract the numerators.' } ],
  explain: '{4/10} = {40/100}. {80/100} − {40/100} = {40/100}.',
  check: { expr: '{80/100} − {4/10}' } },
{ id: 'TB09', skill: 'tenths', type: 'entry',
  parts: [ { p: 'Enter the difference.' }, { eq: '{60/100} − {3/10}' } ],
  key: '30/100',
  traps: [
    { v: '57/100', why: '3 tenths is not 3 hundredths. Rename {3/10} as {30/100} first.' },
    { v: '57/90', why: 'Do not subtract the denominators. Rename {3/10} as {30/100}, then subtract the numerators.' } ],
  explain: '{3/10} = {30/100}. {60/100} − {30/100} = {30/100}.',
  check: { expr: '{60/100} − {3/10}' } },
{ id: 'TB10', skill: 'expr', type: 'mc',
  parts: [ { p: 'Theo walked his dog {1 2/3} miles in the morning. He also walked his dog {3 5/6} miles in the evening.' } ],
  ask: 'Which expression can be used to determine the distance, in miles, Theo walked his dog altogether?',
  choices: [
    { t: '4 + {2/6} + {5/6}', why: '{2/3} is not equal to {2/6}. {2/3} = {4/6}.' },
    { t: '1 + 3 + {3/6} + {5/6}', why: '{2/3} is not equal to {3/6}. {3/6} is one half. {2/3} = {4/6}.' },
    { t: '1 + 3 + {7/9}', why: 'The tops were added and the bottoms were added. Rename {2/3} as sixths first.' },
    { t: '4 + {4/6} + {5/6}' } ],
  answer: 3,
  explain: 'Add the whole numbers: 1 + 3 = 4. Rename {2/3} as sixths: {2/3} = {4/6}. So Theo walked his dog 4 + {4/6} + {5/6} miles.',
  check: { target: '{1 2/3} + {3 5/6}' } },
{ id: 'TB11', skill: 'unlike', type: 'entry',
  parts: [ { p: 'Enter the sum.' }, { eq: '{2/3} + {4/7}' } ],
  key: '26/21',
  traps: [
    { v: '6/10', why: 'The tops were added and the bottoms were added. Use a common denominator of 21.' },
    { v: '6/21', why: 'The numerators were added before the fractions were renamed. {2/3} = {14/21} and {4/7} = {12/21}.' } ],
  explain: 'A common denominator for 3 and 7 is 21. {2/3} = {14/21} and {4/7} = {12/21}. {14/21} + {12/21} = {26/21}. That is more than 1, and that is fine. {26/21} is the same as {1 5/21}.',
  check: { expr: '{2/3} + {4/7}' } },
{ id: 'TB12', skill: 'models', type: 'entry',
  parts: [
    { p: 'Ms. Park had {3 1/2} rolls of tape at the start of the week. She had {3 1/4} rolls of tape left at the end of the week, as shown in the model.' },
    { bars: { den: 4, shaded: [4, 4, 4, 1] } },
    { p: 'Enter the fraction of a roll of tape Ms. Park used during the week.' } ],
  key: '1/4',
  traps: [
    { v: '13/4', why: '{13/4} is {3 1/4}, the amount that was left. Subtract to find the amount Ms. Park used.' },
    { v: '0/1', why: 'Rename {1/2} as fourths first: {1/2} = {2/4}. Then {2/4} − {1/4} = {1/4}.' } ],
  explain: '{3 1/2} = {3 2/4}. Subtract what was left: {3 2/4} − {3 1/4} = {1/4}. Ms. Park used {1/4} of a roll.',
  check: { expr: '{3 1/2} − {3 1/4}', left: '{3 1/4}' } },
{ id: 'TB13', skill: 'steps', type: 'mc',
  parts: [ { p: 'Which set of steps shows a correct strategy and solution for adding {1 5/6} + {3/4}?' } ],
  choices: [
    { t: '= {1 5/6} + {3/4}\n= {1 5+3/6+4}\n= {1 8/10} = {1 4/5}',
      why: 'The tops were added and the bottoms were added. Fractions need a common denominator first.' },
    { t: '= {11×2/6×2} + {3×3/4×3}\n= {22/12} + {9/12}\n= {31/12} = {2 7/12}' },
    { t: '= {11×4/6×4} + {3×6/4×6}\n= {44/24} + {18/24}\n= {62/48} = {1 14/48}',
      why: 'The last step added the denominators. With the same denominator, add only the numerators: {44/24} + {18/24} = {62/24}.' },
    { t: '= {15/6} + {3/4}\n= {15×2/6×2} + {3×3/4×3}\n= {30/12} + {9/12}\n= {39/12} = {3 3/12} = {3 1/4}',
      why: '{1 5/6} is not {15/6}. One whole is {6/6}, so {1 5/6} = {11/6}.' } ],
  answer: 1,
  explain: '{1 5/6} = {11/6}. A common denominator for 6 and 4 is 12. {11/6} = {22/12} and {3/4} = {9/12}. {22/12} + {9/12} = {31/12} = {2 7/12}.',
  check: { target: '{1 5/6} + {3/4}' } },
{ id: 'TB14', skill: 'models', type: 'entry',
  parts: [
    { p: 'Ms. Grant’s class is painting a mural.' },
    { bullets: [
      'Figure A and Figure B each represent one jar of paint.',
      'The shaded part of Figure A shows the fraction of a jar of green paint the class used.',
      'The shaded part of Figure B shows the fraction of a jar of yellow paint the class used.' ] },
    { grids: [ { label: 'Figure A', rows: 2, cols: 3, shaded: 3 }, { label: 'Figure B', rows: 2, cols: 2, shaded: 1 } ] },
    { p: 'How many jars of paint did the class use altogether? Enter the fraction in the box.' } ],
  key: '9/12',
  traps: [
    { v: '4/10', why: 'The shaded parts were added and the total parts were added. Rename both fractions with a common denominator first.' } ],
  explain: 'Figure A shows {3/6}, which equals {1/2}. Figure B shows {1/4}. A common denominator is 12: {3/6} = {6/12} and {1/4} = {3/12}. {6/12} + {3/12} = {9/12}, which equals {3/4}.',
  check: { expr: '{3/6} + {1/4}' } },
{ id: 'TB15', skill: 'models', type: 'entry',
  parts: [
    { p: 'The distance, in miles, Lucas rode his scooter in the morning is plotted at point A on the number line.' },
    { nline: { den: 6, at: 1, label: 'A' } },
    { p: 'Lucas rode his scooter {2/3} mile in the afternoon.' },
    { p: 'Enter the total distance, in miles, Lucas rode his scooter in the morning and afternoon.' } ],
  key: '5/6',
  traps: [
    { v: '3/9', why: 'The tops were added and the bottoms were added. Rename {2/3} as sixths first: {2/3} = {4/6}.' },
    { v: '3/6', why: '{2/3} is not {2/6}. Rename {2/3} as {4/6}.' } ],
  explain: 'The number line from 0 to 1 is cut into 6 equal parts, so each part is {1/6}. Point A is at {1/6}. {2/3} = {4/6}. {1/6} + {4/6} = {5/6}.',
  check: { expr: '{1/6} + {2/3}' } }
]
};
