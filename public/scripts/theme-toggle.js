// Theme toggle logic
function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
  localStorage.setItem('theme', theme);
  // Update toggle UI
  const btns = document.querySelectorAll('.theme-btn');
  btns.forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.theme === theme ? 'true' : 'false');
  });
}

function getSavedTheme() {
  return localStorage.getItem('theme') || 'dark';
}

function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', e => {
    if (e.target.classList.contains('theme-btn')) {
      setTheme(e.target.dataset.theme);
    }
  });
  setTheme(getSavedTheme());
}

document.addEventListener('DOMContentLoaded', setupThemeToggle);

// Instant theme on page load (for FOUC prevention)
(function instantTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'light') {
    document.body.classList.add('light');
  }
})(); 