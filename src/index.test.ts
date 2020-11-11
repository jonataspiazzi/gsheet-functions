import { GET_ORDER } from './index';

describe('Global testing', () => {
  const matrix = [
    ['ID', 'Description', 'Dependencies', 'Priority'],
    ['', '', '', ''],
    ['I', 'I Description', '', 20],
    ['A', 'A Description', 'B', 1],
    ['B', 'B Description', 'C', 2],
    ['C', 'C Description', '', 3],
    ['D', 'D Description', 'E, F, I, A, J', 4],
    ['E', 'E Description', '', 5],
    ['F', 'F Description', '', 6],
    ['G', 'G Description', 'A', 7],
    ['H', 'H Description', 'A, C', 0],
    ['J', 'J Description', '', -1],
    ['K', 'K Description', '',]
  ];

  it('Should get order of all items.', () => {
    expect(GET_ORDER('Z', matrix, 0, 2, 3)).toBe('');
    expect(GET_ORDER('K', matrix, 0, 2, 3)).toBe('');
    expect(GET_ORDER('A', matrix, 0, 2, 3)).toBe(4);
    expect(GET_ORDER('B', matrix, 0, 2, 3)).toBe(3);
    expect(GET_ORDER('C', matrix, 0, 2, 3)).toBe(2);
    expect(GET_ORDER('D', matrix, 0, 2, 3)).toBe(8);
    expect(GET_ORDER('E', matrix, 0, 2, 3)).toBe(5);
    expect(GET_ORDER('F', matrix, 0, 2, 3)).toBe(6);
    expect(GET_ORDER('G', matrix, 0, 2, 3)).toBe(9);
    expect(GET_ORDER('H', matrix, 0, 2, 3)).toBe('');
    expect(GET_ORDER('I', matrix, 0, 2, 3)).toBe(7);
    expect(GET_ORDER('J', matrix, 0, 2, 3)).toBe(1);
  });
});