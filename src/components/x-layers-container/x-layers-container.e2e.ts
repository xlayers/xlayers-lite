import { newE2EPage } from '@stencil/core/testing';

describe('x-layers-container', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-layers-container></x-layers-container>');

    const element = await page.find('x-layers-container');
    expect(element).toHaveClass('hydrated');
  });
});
