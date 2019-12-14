import handler from '.';

jest.mock('./modules.json');

describe('nus handler', () => {
  const subcommands = ['coursem', 'lum', 'webcast'];
  subcommands.forEach((subcommand) => {
    describe(subcommand, () => {
      test('should redirect to homepage if no mod provided', async () => {
        const response = await handler.handle([subcommand]);
        expect(response).toMatchSnapshot();
      });

      test('should redirect to appropriate path for mod if can be found', async () => {
        let response;
        response = await handler.handle([subcommand, 'cs3219']);
        expect(response).toMatchSnapshot();
        response = await handler.handle([subcommand, 'cs3244']);
        expect(response).toMatchSnapshot();
      });

      test('should redirect to homepage if mod is provided but cannot be found', async () => {
        const homeResponse = await handler.handle([subcommand]);
        const modResponse = await handler.handle([subcommand, 'nonsensemod']);
        expect(homeResponse).toEqual(modResponse);
      });
    });
  });
});
