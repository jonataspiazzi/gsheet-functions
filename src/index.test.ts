import { greeting } from './index';

describe("Global testing", () => {
  it('Should greet', () => {
    const msg = greeting();

    expect(msg).toBe('Hello World!');
  });
});