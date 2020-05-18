import { getClosestModcode, getClosestModule, modules } from './nus';

jest.mock('./modules.json');

describe(getClosestModcode, () => {
  it('should return a closest modcode if present', () => {
    expect(getClosestModcode('abcdef')).toBeFalsy();
    expect(getClosestModcode('0000')).toBeFalsy();
    expect(getClosestModcode('cs3219')).toEqual('CS3219');
    expect(getClosestModcode('cs32')).toEqual('CS3219');
    expect(getClosestModcode('cs324')).toEqual('CS3244');
    expect(getClosestModcode('324')).toEqual('CS3244');
  });
});

describe(getClosestModule, () => {
  it('should return a closest module if present', () => {
    expect(getClosestModule('abcdef')).toBeFalsy();
    expect(getClosestModule('424')).toEqual(modules.CS3244);
  });
});
