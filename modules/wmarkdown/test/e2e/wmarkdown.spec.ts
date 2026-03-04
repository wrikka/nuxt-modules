import { test, expect } from '@playwright/test'

test('WMarkdown Preview Mode', async ({ page }) => {
  await page.goto('/')
  
  // Check if preview mode is rendered
  await expect(page.locator('.wmarkdown-preview')).toBeVisible()
  
  // Check if editor exists
  await expect(page.locator('textarea')).toBeVisible()
})

test('Editor Mode Toggle', async ({ page }) => {
  await page.goto('/')
  
  // Click editor mode button
  await page.click('text=Editor Mode')
  
  // Check if editor is visible
  await expect(page.locator('.wmarkdown-editor')).toBeVisible()
})

test('Markdown parsing works', async ({ page }) => {
  await page.goto('/')
  
  // Type in textarea
  await page.fill('textarea', '# Hello World')
  
  // Check if heading is rendered
  await expect(page.locator('h1:has-text("Hello World")')).toBeVisible()
})
