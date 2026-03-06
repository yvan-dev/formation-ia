import { expect, test } from '@playwright/test';

const BASE = '/formation-ia';

test('navigation keeps one primary CTA focus', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}${BASE}/`, { waitUntil: 'networkidle' });

  const header = page.locator('header');
  const formationCta = header.getByRole('link', {
    name: /Découvrir notre première formation/i,
  });
  const quizCta = header.getByRole('link', {
    name: /Faire un quiz de placement/i,
  });

  await expect(formationCta).toHaveClass(/nav-main-cta-active/);
  await expect(quizCta).toBeVisible();

  await quizCta.first().click();
  await expect(page).toHaveURL(/\/formation-ia\/quiz-niveau/);

  await expect(quizCta).toHaveClass(/nav-main-cta-primary-active/);
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
  await expect(progressText).toContainText(/1\s*\/\s*\d+\s*leçons/i);
});