import greet from './greetings';

describe('Greeting module', () => {
  const name = 'Dr stange';
  it(`Should greet ${name}`, () => {
    expect(greet(name)).toMatch(`Welcome to blib amigo ${name}`);
  });
});
