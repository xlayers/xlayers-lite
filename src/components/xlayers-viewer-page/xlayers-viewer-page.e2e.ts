import { newE2EPage } from '@stencil/core/testing';

describe('xlayers-viewer-page', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xlayers-viewer-page></xlayers-viewer-page>');

    const element = await page.find('xlayers-viewer-page');
    expect(element).toHaveClass('hydrated');
  });
});
