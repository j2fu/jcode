import { map } from 'ramda';

interface StencilRaw {
  width: number;
  height: number;
  paths: string[];
}
export interface Stencil {
  width: number;
  height: number;
  path: Path2D;
}
export type StencilName = 'check' | 'cross' | 'arrow' | 'computer' | 'user';

const stencilRaws: Record<StencilName, StencilRaw> = {
  check: {
    width: 100,
    height: 100,
    paths: ['M0 54L18 36L37 58L81 6L100 22L37 93z']
  },
  cross: {
    width: 100,
    height: 100,
    paths: ['M6 20L20 6L50 36L80 6L94 20L64 50L94 80L80 94L50 64L20 94L6 80L36 50z']
  },
  arrow: {
    width: 100,
    height: 50,
    paths: ['M0 19L54 19L47 0L100 25L47 50L54 31L0 31z']
  },
  computer: {
    width: 91,
    height: 84,
    paths: [
      'M90.5,52.8h-90V5.9c0-3,2.4-5.4,5.4-5.4h79.2c3,0,5.4,2.4,5.4,5.4V52.8z M2.5,50.8h86V5.9' +
      'c0-1.9-1.5-3.4-3.4-3.4H5.9C4,2.5,2.5,4,2.5,5.9V50.8z',
      'M84.3,47.6H6.7c-0.6,0-1-0.4-1-1V9c0-1.8,1.5-3.3,3.3-3.3h73c1.8,0,3.3,1.5,3.3,3.3v37.6' +
      'C85.3,47.2,84.8,47.6,84.3,47.6z M7.7,45.6h75.6V9c0-0.7-0.6-1.3-1.3-1.3H9C8.3,7.7,7.7,8.3,7.7,9C7.7,9,7.7,45.6,7.7,45.6z',
      'M85.1,65.3H5.9c-3,0-5.4-2.4-5.4-5.4v-9h90v9C90.5,62.8,88.1,65.3,85.1,65.3z M2.5,52.8v7' +
      'c0,1.9,1.5,3.4,3.4,3.4h79.2c1.9,0,3.4-1.5,3.4-3.4v-7H2.5z',
      'M44 58.1a1.5 1.5 0 0 0 3 0a1.5 1.5 0 0 0-3 0',
      'M59.3,77.6H31.7c-0.4,0-0.8-0.3-1-0.7s0-0.9,0.4-1.1c3.8-2.8,6.3-7.1,7-11.7c0.1-0.5,0.5-0.9,1-0.9H52' +
      'c0.5,0,0.9,0.4,1,0.9c0.6,4.6,3.2,8.9,7,11.7c0.3,0.3,0.5,0.7,0.4,1.1S59.8,77.6,59.3,77.6z M34.4,75.6h22.2' +
      'c-2.8-2.8-4.8-6.4-5.5-10.4H39.9C39.2,69.2,37.2,72.8,34.4,75.6z',
      'M61.6,82.8H29.4c-2,0-3.6-1.6-3.6-3.6s1.6-3.6,3.6-3.6h32.1c2,0,3.6,1.6,3.6,3.6S63.5,82.8,61.6,82.8z' +
      'M29.4,77.6c-0.9,0-1.6,0.7-1.6,1.6s0.7,1.6,1.6,1.6h32.1c0.9,0,1.6-0.7,1.6-1.6s-0.7-1.6-1.6-1.6H29.4z'
    ]
  },
  user: {
    width: 100,
    height: 100,
    paths: [
      'M49.4,48.2c6.6,0,12.3-2.4,17-7.1c4.7-4.7,7.1-10.4,7.1-17c0-6.6-2.4-12.3-7.1-17C61.7,2.4,56,0,49.4,0' +
      'c-6.6,0-12.3,2.4-17,7.1s-7.1,10.4-7.1,17c0,6.6,2.4,12.3,7.1,17C37,45.8,42.8,48.2,49.4,48.2z',
      'M91.5,76.9c-0.1-1.9-0.4-4.1-0.8-6.3c-0.4-2.3-0.9-4.4-1.6-6.4c-0.6-2-1.5-4-2.6-5.9c-1.1-2-2.5-3.7-3.9-5.1' +
      'c-1.6-1.5-3.5-2.7-5.7-3.6c-2.2-0.9-4.6-1.3-7.2-1.3c-1,0-2,0.4-3.9,1.7c-1.2,0.8-2.5,1.7-4.1,2.6c-1.3,0.8-3.1,1.6-5.3,2.3' +
      'c-2.1,0.7-4.3,1-6.5,1s-4.3-0.4-6.5-1c-2.2-0.7-4-1.5-5.3-2.3c-1.5-1-2.9-1.9-4.1-2.6c-1.9-1.2-2.9-1.7-3.9-1.7' +
      'c-2.6,0-5,0.4-7.2,1.3c-2.2,0.9-4.1,2.1-5.7,3.6c-1.5,1.4-2.8,3.1-3.9,5.1c-1.1,1.9-2,3.9-2.6,5.9c-0.6,2-1.1,4.1-1.6,6.4' +
      'c-0.4,2.2-0.7,4.4-0.8,6.3c-0.1,1.9-0.2,3.9-0.2,5.9c0,5.2,1.7,9.4,4.9,12.6c3.2,3.1,7.5,4.6,12.7,4.6h48.2c5.2,0,9.5-1.6,12.7-4.6' +
      'c3.3-3.1,4.9-7.3,4.9-12.6C91.7,80.8,91.6,78.8,91.5,76.9z'
    ]
  }
};

export const stencils = map<Record<StencilName, StencilRaw>, Record<StencilName, Stencil>>(st => {
  const path = new Path2D();
  for (const p of st.paths) {
    path.addPath(new Path2D(p));
  }
  return { width: st.width, height: st.height, path };
}, stencilRaws);