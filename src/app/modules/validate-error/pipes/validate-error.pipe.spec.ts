import { ValidateErrorPipe } from './validate-error.pipe';

describe('ValidateErrorPipe', () => {
  it('create an instance', () => {
    const pipe = new ValidateErrorPipe();
    expect(pipe).toBeTruthy();
  });
});
