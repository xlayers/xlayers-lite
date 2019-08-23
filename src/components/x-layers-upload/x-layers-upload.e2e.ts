import { newE2EPage } from '@stencil/core/testing';

describe('xlayers-upload', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xlayers-upload></xlayers-upload>');

    const element = await page.find('xlayers-upload');
    expect(element).toHaveClass('hydrated');
  });
});
