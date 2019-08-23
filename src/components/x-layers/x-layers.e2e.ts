import { newE2EPage } from '@stencil/core/testing';

describe('x-layers', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-layers></x-layers>');

    const element = await page.find('x-layers');
    expect(element).toHaveClass('hydrated');
  });
});
