// e2e/brothers.role.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Admin Brothers — role/category display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', 'admin@matthew-journal.com');
    await page.fill('input[name="password"]', 'matthew123');
    await page.click('button:has-text("Ingresar")');
    await page.goto('/admin/brothers');
    await page.waitForURL('/admin/brothers', { timeout: 10000 });
  });

  test('Crea hermano con rol Hermano + category Hermanos y verifica badges', async ({ page }) => {
    await page.click('button:has-text("Nuevo hermano")');
    await page.fill('input[placeholder="Ej: Sofía"]', 'Prueba Hermano');

    // Relación (role) = Hermano — el primer select es "Relación"
    const roleSelect = page.locator('label:has-text("Relación") + select');
    await roleSelect.selectOption({ label: 'Hermano' });

    // Categoría = Hermanos — segundo select es "Categoría en galería"
    const catSelect = page.locator('label:has-text("Categoría en galería") + select');
    await catSelect.selectOption({ label: 'Hermanos' });

    // Mensaje
    await page.fill('textarea[placeholder*="Ej: Siempre"]', 'mensaje de prueba');

    // Foto (SVG local válido)
    const svgPath = path.resolve(__dirname, '../public/images/placeholder-brother-1.svg');
    await page.setInputFiles('input[type="file"]', svgPath);

    await page.click('button:has-text("Crear hermano")');

    // Esperar al listado
    await page.waitForSelector('h3:has-text("Prueba Hermano")', { timeout: 10000 });

    // DEBUG: imprimir todo el texto del row del hermano creado
    const row = page.locator('h3:text("Prueba Hermano")').locator('..').locator('..');
    const rowText = await row.textContent();
    console.log('=== ROW TEXT (badge role/categoria visibles):');
    console.log(rowText);

    // El badge de ROLE debe decir "Hermano" (no "Primo")
    await expect(page.locator('text="Hermano"').first()).toBeVisible();

    // El badge de CATEGORY debe decir "Hermanos"
    await expect(page.locator('text="Hermanos"').first()).toBeVisible();

    console.log('✅ Brother role/category badge test passed');
  });
});
