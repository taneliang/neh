import { getClosestModcode, getClosestModule, modules } from './nus';

describe(getClosestModcode, () => {
  it('should return a closest modcode if present', () => {
    expect(getClosestModcode('abcdef')).toBeFalsy();
    expect(getClosestModcode('0000')).toBeFalsy();
    expect(getClosestModcode('cs3219')).toEqual('CS3219');
    expect(getClosestModcode('cs32')).toEqual('CS3219');
    expect(getClosestModcode('cs323')).toEqual('CS3230');
    expect(getClosestModcode('323')).toEqual('CS3230');
  });
});

describe(getClosestModule, () => {
  it('should return a closest module if present', () => {
    expect(getClosestModule('abcdef')).toBeFalsy();
    expect(getClosestModule('424')).toEqual(modules.CS4246);
  });
});
