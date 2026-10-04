/** Progress is shared by the curriculum, both lesson menus and the completion action. */
export function readProgress(course: string): string[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(`progress_${course}`) ?? '[]',
    );
    return Array.isArray(stored)
      ? [
          ...new Set(
            stored.filter((slug): slug is string => typeof slug === 'string'),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}

export function completeLesson(course: string, lesson: string): boolean {
  try {
    localStorage.setItem(
      `progress_${course}`,
      JSON.stringify([...new Set([...readProgress(course), lesson])]),
    );
    window.dispatchEvent(new CustomEvent('lesson-completed'));
    return true;
  } catch {
    return false;
  }
}

export function refreshProgress() {
  document
    .querySelectorAll<HTMLElement>('[data-course-progress]')
    .forEach((container) => {
      const course = container.dataset.courseProgress ?? '';
      const allowed: string[] = JSON.parse(container.dataset.lessons ?? '[]');
      const completed = readProgress(course).filter((slug) =>
        allowed.includes(slug),
      );
      const bar = container.querySelector<HTMLProgressElement>('progress');
      if (bar) {
        bar.max = Math.max(1, allowed.length);
        bar.value = completed.length;
      }
      const label = container.querySelector('[data-progress-text]');
      if (label)
        label.textContent = `${completed.length} / ${allowed.length} leçons`;
    });
  document.querySelectorAll<HTMLElement>('[data-lesson-nav]').forEach((nav) => {
    const completed = readProgress(nav.dataset.lessonNav ?? '');
    nav.querySelectorAll<HTMLElement>('[data-lesson-slug]').forEach((item) => {
      const done = completed.includes(item.dataset.lessonSlug ?? '');
      item.dataset.completed = String(done);
      const status = item.querySelector<HTMLElement>(
        '[data-completion-status]',
      );
      if (status) status.hidden = !done;
    });
  });
}
