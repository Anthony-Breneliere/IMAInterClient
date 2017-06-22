import { Angular2TestAppPage } from './app.po';

describe('angular2-test-app App', () => {
  let page: Angular2TestAppPage;

  beforeEach(() => {
    page = new Angular2TestAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
