import { expect, test } from '@playwright/test';

const BASE = '/formation-ia';

test('active navigation tab updates between Formations and Quiz', async ({
  page,
  baseURL,
}) => {
  await page.goto(`${baseURL}${BASE}/`, { waitUntil: 'networkidle' });

  const formationsTab = page.getByRole('link', { name: /^Formations$/i });
  const quizTab = page.getByRole('link', { name: /^Quiz$/i });

  await expect(formationsTab).toHaveClass(/nav-tab-active/);
  await expect(quizTab).not.toHaveClass(/nav-tab-active/);

  await quizTab.click();
  await expect(quizTab).toHaveClass(/nav-tab-active/);
  await expect(formationsTab).not.toHaveClass(/nav-tab-active/);
});

test('theme toggle switches light and dark modes', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}${BASE}/`, { waitUntil: 'networkidle' });

  const html = page.locator('html');
  const initial = await html.getAttribute('data-theme');
  expect(initial === 'light' || initial === 'dark').toBeTruthy();

  await page.getByRole('button', { name: /Basculer le thème/i }).click();
  const after = await html.getAttribute('data-theme');
  expect(after).not.toBe(initial);
});

test('user can open lesson and mark it completed', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}${BASE}/courses/ia-appliquee-metiers-tech`, {
    waitUntil: 'networkidle',
  });

  const firstLesson = page.locator('[data-lesson-item]').first();
  await expect(firstLesson).toBeVisible();
  await firstLesson.click();

  const completeBtn = page.getByRole('button', {
    name: /Marquer la leçon comme terminée|Leçon terminée/i,
  });
  await expect(completeBtn).toBeVisible();
  await completeBtn.click();
  await expect(completeBtn).toContainText('Leçon terminée');

  await page.goto(`${baseURL}${BASE}/courses/ia-appliquee-metiers-tech`, {
    waitUntil: 'networkidle',
  });

  const progressText = page.locator('#progress-text');
  await expect(progressText).toContainText(/1\s*\/\s*30\s*leçons/i);
});

