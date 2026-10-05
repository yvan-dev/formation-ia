import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';

const lessonDirectory = new URL(
  '../src/pages/lessons/ia-appliquee-metiers-tech/',
  import.meta.url,
);
const course = JSON.parse(
  readFileSync(
    new URL(
      '../src/content/courses/ia-appliquee-metiers-tech.json',
      import.meta.url,
    ),
    'utf8',
  ),
) as { modules: { lessons: { slug: string; title: string }[] }[] };
const lessons = course.modules.flatMap((module) => module.lessons);

// Compare the actual pages with the collection so an orphaned lesson cannot
// silently disappear from the course, as advanced prompting previously did.
test('every lesson page is listed exactly once in the curriculum', () => {
  const pages = readdirSync(lessonDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
  const slugs = lessons.map((lesson) => lesson.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
  expect(slugs.sort()).toEqual(pages.sort());
});

test('all lessons render their objectives and usable practice corrections', async ({
  page,
}) => {
  for (const [index, lesson] of lessons.entries()) {
    const response = await page.goto(
      `/formation-ia/lessons/ia-appliquee-metiers-tech/${lesson.slug}`,
    );
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText(lesson.title);
    const article = page.getByRole('article');
    await expect(
      article.getByRole('heading', {
        name: 'Objectifs de la leçon',
        exact: true,
      }),
    ).toBeVisible();
    const practice = article.locator('.lesson-practice');
    expect(await practice.locator('li').count()).toBeGreaterThan(0);
    const details = practice.locator('details');
    await expect(details).not.toHaveAttribute('open', '');
    if (index === 0) {
      await details.locator('summary').focus();
      await page.keyboard.press('Enter');
    } else {
      await details.locator('summary').click();
    }
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('p')).toBeVisible();
    expect((await details.locator('p').innerText()).length).toBeGreaterThan(
      100,
    );
    await expect(
      article.getByRole('heading', {
        name: 'Sources et mise à jour',
        exact: true,
      }),
    ).toHaveCount(1);
    expect(
      await article.locator('a[href^="https://"]').count(),
    ).toBeGreaterThan(0);
  }
});

test('lesson four uses développeur augmenté and its correction is usable on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(
    '/formation-ia/lessons/ia-appliquee-metiers-tech/bon-ingenieur-ia',
  );
  const article = page.getByRole('article');
  await expect(
    article.getByRole('heading', { name: /vibe coder.*développeur augmenté/ }),
  ).toBeVisible();
  await expect(article).not.toContainText('développeur argumenté');
  await article.locator('.lesson-practice summary').click();
  await expect(article.locator('.lesson-practice details p')).toBeVisible();
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflows).toBe(false);
});
