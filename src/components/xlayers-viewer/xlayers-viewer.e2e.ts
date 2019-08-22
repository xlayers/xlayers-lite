import { newE2EPage } from '@stencil/core/testing';

describe('xlayers-viewer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xlayers-viewer></xlayers-viewer>');

    const element = await page.find('xlayers-viewer');
    expect(element).toHaveClass('hydrated');
  });
});
