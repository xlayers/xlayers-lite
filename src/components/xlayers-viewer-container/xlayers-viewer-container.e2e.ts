import { newE2EPage } from '@stencil/core/testing';

describe('xlayers-viewer-container', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xlayers-viewer-container></xlayers-viewer-container>');

    const element = await page.find('xlayers-viewer-container');
    expect(element).toHaveClass('hydrated');
  });
});
