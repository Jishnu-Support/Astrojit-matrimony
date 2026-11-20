with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    engine = f.read()

bav_code = '''
export const BAV_CONTRIBUTORS = {
  sun: {
    sun: [1,2,4,7,8,9,10,11],
    moon: [3,6,10,11],
    mars: [1,2,4,7,8,9,10,11],
    mercury: [3,5,6,9,10,11,12],
    jupiter: [5,6,9,11],
    venus: [6,7,12],
    saturn: [1,2,4,7,8,9,10,11],
    lagna: [3,4,6,10,11,12]
  },
  moon: {
    sun: [3,6,7,8,10,11],
    moon: [1,3,6,7,10,11],
    mars: [2,3,5,6,9,10,11],
    mercury: [1,3,4,5,7,8,10,11],
    jupiter: [1,4,7,8,10,11,12],
    venus: [3,4,5,7,9,10,11],
    saturn: [3,5,6,11],
    lagna: [3,6,10,11]
  },
  mars: {
    sun: [3,5,6,10,11],
    moon: [3,6,11],
    mars: [1,2,4,7,8,10,11],
    mercury: [3,5,6,11],
    jupiter: [6,10,11,12],
    venus: [6,8,11,12],
    saturn: [1,4,7,8,9,10,11],
    lagna: [1,3,6,10,11]
  },
  mercury: {
    sun: [5,6,9,11,12],
    moon: [2,4,6,8,10,11],
    mars: [1,2,4,7,8,9,10,11],
    mercury: [1,3,5,6,9,10,11,12],
    jupiter: [6,8,11,12],
    venus: [1,2,3,4,5,8,9,11],
    saturn: [1,2,4,7,8,9,10,11],
    lagna: [1,2,4,6,8,10,11]
  },
  jupiter: {
    sun: [1,2,3,4,7,8,9,10,11],
    moon: [2,5,7,9,11],
    mars: [1,2,4,7,8,10,11],
    mercury: [1,2,4,5,6,9,10,11],
    jupiter: [1,2,3,4,7,8,10,11],
    venus: [2,5,6,9,10,11],
    saturn: [3,5,6,12],
    lagna: [1,2,4,5,6,7,9,10,11]
  },
  venus: {
    sun: [8,11,12],
    moon: [1,2,3,4,5,8,9,11,12],
    mars: [3,5,6,9,11,12],
    mercury: [3,5,6,9,11],
    jupiter: [5,8,9,10,11],
    venus: [1,2,3,4,5,8,9,10,11],
    saturn: [3,4,5,8,9,10,11],
    lagna: [1,2,3,4,5,8,9,11]
  },
  saturn: {
    sun: [1,2,4,7,8,10,11],
    moon: [3,6,11],
    mars: [3,5,6,10,11,12],
    mercury: [6,8,9,10,11,12],
    jupiter: [5,6,11,12],
    venus: [6,11,12],
    saturn: [3,5,6,11],
    lagna: [1,3,4,6,10,11]
  }
};

const RASI_MULT_ARRAY = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];
const GRAHA_MULT_MAP = {
  sun: 5,
  moon: 5,
  mars: 8,
  mercury: 5,
  jupiter: 10,
  venus: 7,
  saturn: 5
};
'''

if 'const BAV_CONTRIBUTORS' not in engine and 'export const BAV_CONTRIBUTORS' not in engine:
    target = 'export function computeBavDetailsForGraha'
    engine = engine.replace(target, bav_code + '\n' + target)
    with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
        f.write(engine)
    print('BAV_CONTRIBUTORS added!')
else:
    print('BAV_CONTRIBUTORS already present!')
