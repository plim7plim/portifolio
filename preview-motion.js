export function initPreviewMotion(root = document) {
  const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  root.querySelectorAll('.project-preview, .catalog-preview').forEach((preview) => {
    let frame = 0;
    let point;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      preview.style.removeProperty('--preview-x');
      preview.style.removeProperty('--preview-y');
    };
    preview.addEventListener('pointermove', (event) => {
      if (!enabled.matches) return;
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = preview.getBoundingClientRect();
        preview.style.setProperty('--preview-x', ((point.y - bounds.top) / bounds.height - 0.5) * -3 + 'deg');
        preview.style.setProperty('--preview-y', ((point.x - bounds.left) / bounds.width - 0.5) * 3 + 'deg');
        frame = 0;
      });
    }, { passive: true });
    preview.addEventListener('pointerleave', reset);
    preview.addEventListener('pointercancel', reset);
  });
}
