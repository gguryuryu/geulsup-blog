// Runs before the app and styles paint; no document data is stored here.
try {
  const choice=localStorage.getItem('editor-theme')||'dark';
  document.documentElement.dataset.theme=choice==='light'||choice==='system'&&!matchMedia('(prefers-color-scheme: dark)').matches?'light':'dark';
  document.documentElement.dataset.density=localStorage.getItem('editor-density')||'normal';
} catch {}
