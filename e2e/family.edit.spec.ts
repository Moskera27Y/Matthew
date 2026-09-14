// e2e/family.edit.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Family CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', 'admin@matthew-journal.com');
    await page.fill('input[name="password"]', 'matthew123');
    await page.click('button:has-text("Ingresar")');
    await page.waitForURL('/admin/family');
  });

  test('Admin family allows editing members', async ({ page }) => {
    await expect(page.locator('text=Gestión de Familia')).toBeVisible();
    
    // Wait for members to load (use heading role to avoid ambiguity)
    await page.waitForSelector('h3:has-text("Cristian")', { timeout: 10000 });
    await expect(page.locator('h3:has-text("Cristian")')).toBeVisible();
    
    // Click edit on first member
    await page.locator('button[title="Editar"]').first().click();
    
    // Verify form appears
    await expect(page.locator('text=Guardar cambios')).toBeVisible();
    await expect(page.locator('input[placeholder="Nombre completo"]')).toBeVisible();

    // Change name
    await page.fill('input[placeholder="Nombre completo"]', 'Cristian EDITADO');
    await page.click('button:has-text("Guardar cambios")');

    // Verify save
    await expect(page.locator('h3:has-text("Cristian EDITADO")')).toBeVisible();
    
    console.log('✅ Family editing test passed');
  });

  test('Admin family allows adding new member', async ({ page: page2 }) => {
    const { page } = { page: page2 };
    await expect(page.locator('text=Gestión de Familia')).toBeVisible();
    await page.waitForSelector('h3:has-text("Cristian")');
    
    // Click "Nuevo miembro"
    await page.click('button:has-text("Nuevo miembro")', { timeout: 10000 });
    
    // Form should appear for new member
    await expect(page.locator('input[placeholder="Nombre completo"]')).toBeVisible();
    await page.fill('input[placeholder="Nombre completo"]', 'Abuela Nueva');
    await page.fill('input[placeholder="Papá, Mamá, Abuela..."]', 'Abuela');
    
    await page.click('button:has-text("Guardar cambios")');
    await expect(page.locator('h3:has-text("Abuela Nueva")')).toBeVisible();
    
    console.log('✅ Add new member test passed');
  });

  test('Admin family photo upload works', async ({ page }) => {
    await expect(page.locator('text=Gestión de Familia')).toBeVisible();
    await page.waitForSelector('h3:has-text("Cristian")');
    
    // Click edit on first member
    await page.locator('button[title="Editar"]').first().click();
    
    // Enter a photo URL
    await page.fill('input[type="url"]', 'https://placehold.co/200x200/png?text=Cristian');
    
    // Save
    await page.click('button:has-text("Guardar cambios")');
    
    // Verify the photo URL is saved (Avatar should have the src)
    await page.waitForSelector('img[alt="Cristian"]', { timeout: 10000 });
    
    console.log('✅ Photo upload test passed');
  });
});
