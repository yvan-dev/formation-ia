import { test, expect } from '@playwright/test';

const BASE = '/formation-ia';

test('all internal links resolve (no dead links)', async ({
  page,
  baseURL,
}) => {
  const visited = new Set<string>();
  const broken: { url: string; status: number; source: string }[] = [];
  const queue: { url: string; source: string }[] = [
    { url: `${baseURL}${BASE}/`, source: 'start' },
  ];

  while (queue.length > 0) {
    const { url, source } = queue.shift()!;
    const normalized = url.split('#')[0].split('?')[0];

    if (visited.has(normalized)) continue;
    visited.add(normalized);

    const response = await page.goto(normalized, { waitUntil: 'load' });
    const status = response?.status() ?? 0;

    if (status >= 400) {
      broken.push({ url: normalized, status, source });
      continue;
    }

    // Collect all internal links on this page
    const links = await page.$$eval('a[href]', (anchors) =>
      anchors.map((a) => a.getAttribute('href')!).filter(Boolean),
    );

    for (const href of links) {
      let absolute: string;
      try {
        absolute = new URL(href, normalized).href;
      } catch {
        continue;
      }

      // Only follow internal links
      if (!absolute.startsWith(baseURL!)) continue;

      const clean = absolute.split('#')[0].split('?')[0];
      if (!visited.has(clean)) {
        queue.push({ url: clean, source: normalized });
      }
    }
  }

  if (broken.length > 0) {
    const report = broken
      .map((b) => `  ${b.status} ${b.url} (linked from ${b.source})`)
      .join('\n');
    expect(broken, `Dead links found:\n${report}`).toHaveLength(0);
  }

  // Ensure we actually tested some pages
  expect(visited.size).toBeGreaterThan(0);
});
