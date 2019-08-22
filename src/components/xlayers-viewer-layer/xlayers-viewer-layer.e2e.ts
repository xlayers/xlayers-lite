import { newE2EPage } from '@stencil/core/testing';

describe('xlayers-viewer-layer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xlayers-viewer-layer></xlayers-viewer-layer>');

    const element = await page.find('xlayers-viewer-layer');
    expect(element).toHaveClass('hydrated');
  });
});
