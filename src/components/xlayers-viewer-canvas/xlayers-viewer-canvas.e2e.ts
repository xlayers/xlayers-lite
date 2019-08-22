import { newE2EPage } from '@stencil/core/testing';

describe('xlayers-viewer-canvas', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xlayers-viewer-canvas></xlayers-viewer-canvas>');

    const element = await page.find('xlayers-viewer-canvas');
    expect(element).toHaveClass('hydrated');
  });
});
