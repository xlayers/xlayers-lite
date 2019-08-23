import { newE2EPage } from '@stencil/core/testing';

describe('x-layers-page', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-layers-page></x-layers-page>');

    const element = await page.find('x-layers-page');
    expect(element).toHaveClass('hydrated');
  });
});
