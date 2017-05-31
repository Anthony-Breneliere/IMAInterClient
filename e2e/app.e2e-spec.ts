import { AngularCliStartPage } from './app.po';

describe('angular-cli-start App', () => {
  let page: AngularCliStartPage;

  beforeEach(() => {
    page = new AngularCliStartPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
