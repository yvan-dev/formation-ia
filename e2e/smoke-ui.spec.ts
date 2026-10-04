import { expect, test } from '@playwright/test';

const BASE = '/formation-ia';
const COURSE = `${BASE}/courses/ia-appliquee-metiers-tech`;

test('navigation identifies the current page on desktop and mobile', async ({
  page,
}) => {
  await page.goto(`${BASE}/`);
  const header = page.locator('.site-header');
  await expect(
    header.getByRole('link', { name: 'Accueil', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await header.getByRole('link', { name: 'Le parcours', exact: true }).click();
  await expect(page).toHaveURL(/\/courses\/ia-appliquee-metiers-tech/);
  await expect(
    header.getByRole('link', { name: 'Le parcours', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page.setViewportSize({ width: 390, height: 844 });
  await header
    .getByRole('link', { name: /Me positionner/ })
    .filter({ visible: true })
    .click();
  await expect(page).toHaveURL(/\/quiz-niveau/);
  await expect(
    header
      .getByRole('link', { name: /Me positionner/ })
      .filter({ visible: true }),
  ).toHaveAttribute('aria-current', 'page');
});

test('dark is the default and the theme preference survives navigation and reload', async ({
  page,
}) => {
  await page.goto(`${BASE}/`);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /Basculer le thème/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto(COURSE);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('lesson completion persists across both lesson menus and the curriculum', async ({
  page,
}) => {
  await page.goto(COURSE);
  await page.locator('[data-lesson-item]').first().click();
  const complete = page.getByRole('button', {
    name: /Marquer la leçon comme terminée|Leçon terminée/,
  });
  await complete.click();
  await expect(complete).toContainText('Leçon terminée');
  await expect(complete).toBeDisabled();
  await page.reload();
  await expect(complete).toBeDisabled();
  await expect(page.locator('.lesson-progress progress')).toHaveJSProperty(
    'value',
    1,
  );
  await expect(
    page.locator('.desktop-lesson-nav [aria-current="page"]'),
  ).toHaveAttribute('data-completed', 'true');
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByText('Le programme et les autres leçons', { exact: true })
    .click();
  await expect(
    page.locator('.mobile-lesson-nav [aria-current="page"]'),
  ).toHaveAttribute('data-completed', 'true');
  await page
    .locator('.mobile-lesson-nav')
    .getByRole('link', { name: 'Le programme', exact: true })
    .click();
  await expect(page.locator('#progress-text')).toHaveText('1 / 14 leçons');
  await expect(page.locator('[data-lesson-item]').first()).toHaveAttribute(
    'data-completed',
    'true',
  );
});

test('homepage module links open the matching curriculum section', async ({
  page,
}) => {
  await page.goto(`${BASE}/`);
  await page.locator('.module-row').nth(2).click();
  await expect(page.locator('#module-3')).toHaveAttribute('open', '');
  await expect(
    page.locator('#module-3 [data-lesson-item]').first(),
  ).toBeVisible();
  await expect(page.locator('.coming-soon li')).toHaveCount(5);
  await expect(page.locator('[data-lesson-item]')).toHaveCount(14);
});

test('hero motion moves, pauses with the keyboard and suspends offscreen', async ({
  page,
}) => {
  await page.goto(`${BASE}/`);
  const hero = page.locator('.hero-art');
  await expect(hero).toHaveAttribute('data-animation', 'running');
  const dot = hero.locator('.orbital-rotation').first();
  const initial = await dot.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => dot.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(initial);
  const pause = page.getByRole('button', {
    name: 'Mettre l’animation en pause',
  });
  await pause.focus();
  await page.keyboard.press('Enter');
  await expect(hero).toHaveAttribute('data-animation', 'paused');
  await expect(dot).toHaveCSS('animation-play-state', 'paused');
  // Allow the compositor to commit the pause before sampling its transform.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))),
      ),
  );
  const frozen = await dot.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(150);
  expect(await dot.evaluate((el) => getComputedStyle(el).transform)).toBe(
    frozen,
  );
  await page.getByRole('button', { name: 'Reprendre l’animation' }).click();
  await expect(hero).toHaveAttribute('data-animation', 'running');
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-animation', 'paused');
  await hero.scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-animation', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(hero).toHaveAttribute('data-animation', 'reduced');
  await expect(hero.locator('.future-layer')).toBeHidden();
  await expect(hero.locator('.hero-motion-toggle')).toBeHidden();
  await expect(hero.locator('img')).toBeVisible();
});

test('keyboard controls reach the quiz and the native radio choices', async ({
  page,
}) => {
  await page.goto(`${BASE}/quiz-niveau`);
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Aller au contenu' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  const choices = page.getByRole('radio');
  await choices.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(choices.nth(1)).toBeChecked();
  await page.getByRole('button', { name: /Continuer/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.quiz-meta')).toContainText('Question 2 / 10');
});

for (const points of [0, 1, 2, 3, 4]) {
  test(`complete quiz preserves the level ${points + 1} diagnostic, plan and stored score`, async ({
    page,
  }) => {
    await page.goto(`${BASE}/quiz-niveau`);
    await expect(
      page.getByRole('button', { name: /Continuer/ }),
    ).toBeDisabled();
    for (let question = 0; question < 10; question++) {
      await page.getByRole('radio').nth(points).check();
      await page
        .getByRole('button', { name: /Continuer|Voir mon niveau/ })
        .click();
    }
    await expect(page.locator('#quiz-result-title')).toContainText(
      `Niveau ${points + 1}`,
    );
    await expect(page.locator('.quiz-diagnostic p')).toHaveCount(2);
    await expect(page.locator('.quiz-plan li')).toHaveCount(3);
    await expect(page.locator('.quiz-recommendation')).not.toBeEmpty();
    expect(
      await page.evaluate(() => localStorage.getItem('placement_quiz_level')),
    ).toBe(String(points + 1));
    expect(
      await page.evaluate(() => localStorage.getItem('placement_quiz_score')),
    ).toBe(String(points * 25));
    await page.getByRole('button', { name: 'Refaire le quiz' }).click();
    await expect(page.locator('.quiz-meta')).toContainText('Question 1 / 10');
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  });
}

test('corrupt and duplicate progress cannot break or overstate the curriculum', async ({
  page,
}) => {
  await page.goto(COURSE);
  await page.evaluate(() =>
    localStorage.setItem('progress_ia-appliquee-metiers-tech', '{invalid'),
  );
  await page.reload();
  await expect(page.locator('#progress-text')).toHaveText('0 / 14 leçons');
  const slug = await page
    .locator('[data-lesson-item]')
    .first()
    .getAttribute('data-lesson-item');
  await page.evaluate(
    (slug) =>
      localStorage.setItem(
        'progress_ia-appliquee-metiers-tech',
        JSON.stringify([slug, slug, 'unpublished', null]),
      ),
    slug,
  );
  await page.reload();
  await expect(page.locator('#progress-text')).toHaveText('1 / 14 leçons');
});

test('all views fit narrow screens, tablets and desktop in both themes', async ({
  page,
}) => {
  for (const theme of ['dark', 'light']) {
    for (const route of [
      `${BASE}/`,
      COURSE,
      `${BASE}/lessons/ia-appliquee-metiers-tech/plan-first`,
      `${BASE}/quiz-niveau`,
    ]) {
      await page.goto(route);
      await page.evaluate((theme) => {
        localStorage.setItem('aot-theme', theme);
        document.documentElement.dataset.theme = theme;
      }, theme);
      for (const width of [320, 360, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const size = await page.evaluate(() => ({
          content: document.documentElement.scrollWidth,
          viewport: document.documentElement.clientWidth,
        }));
        expect(
          size.content,
          `${route} ${theme} ${width}px`,
        ).toBeLessThanOrEqual(size.viewport);
      }
    }
  }
});

test('storage failures leave lesson completion retryable and the quiz result readable', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage unavailable', 'QuotaExceededError');
    };
  });
  await page.goto(`${BASE}/lessons/ia-appliquee-metiers-tech/plan-first`);
  const complete = page.getByRole('button', {
    name: /Marquer la leçon comme terminée/,
  });
  await complete.click();
  await expect(complete).toBeEnabled();
  await expect(page.locator('#completion-status')).toContainText(
    'n’a pas pu être enregistrée',
  );
  await page.goto(`${BASE}/quiz-niveau`);
  for (let question = 0; question < 10; question++) {
    await page.getByRole('radio').first().check();
    await page
      .getByRole('button', { name: /Continuer|Voir mon niveau/ })
      .click();
  }
  await expect(page.locator('#quiz-result-title')).toContainText('Niveau 1');
  await expect(page.locator('.storage-error')).toContainText(
    'empêche son enregistrement',
  );
});

test('illustrations retain transparent backgrounds in the light theme', async ({
  page,
}) => {
  await page.goto(`${BASE}/`);
  await page.getByRole('button', { name: /Basculer le thème/ }).click();
  const images = page.locator('.hero-art img, .team-visual img');
  await expect(images).toHaveCount(5);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const alpha = await image.evaluate((el: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      canvas.width = el.naturalWidth;
      canvas.height = el.naturalHeight;
      const context = canvas.getContext('2d')!;
      context.drawImage(el, 0, 0);
      return context.getImageData(0, 0, 1, 1).data[3];
    });
    expect(alpha).toBe(0);
  }
  await expect(page.locator('.learning-path svg')).toHaveCount(9);
  await expect(page.locator('.maturity-symbol svg')).toHaveCount(5);
});
