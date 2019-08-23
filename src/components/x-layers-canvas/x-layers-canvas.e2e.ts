import { newE2EPage } from '@stencil/core/testing';

describe('x-layers-canvas', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-layers-canvas></x-layers-canvas>');

    const element = await page.find('x-layers-canvas');
    expect(element).toHaveClass('hydrated');
  });
});
