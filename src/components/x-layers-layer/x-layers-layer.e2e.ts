import { newE2EPage } from '@stencil/core/testing';

describe('x-layers-layer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-layers-layer></x-layers-layer>');

    const element = await page.find('x-layers-layer');
    expect(element).toHaveClass('hydrated');
  });
});
