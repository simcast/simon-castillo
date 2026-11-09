function setTheme(theme) {
	const next = theme === 'light' ? 'light' : 'dark';
	if (next === 'light') {
		document.documentElement.setAttribute('data-theme', 'light');
	} else {
		document.documentElement.removeAttribute('data-theme');
	}
	localStorage.setItem('theme', next);
	document.querySelectorAll('.theme-btn').forEach((btn) => {
		btn.setAttribute('aria-pressed', btn.dataset.theme === next ? 'true' : 'false');
	});
}

function setupThemeToggle() {
	const toggle = document.getElementById('theme-toggle');
	if (!toggle || toggle.dataset.ready === 'true') return;
	toggle.dataset.ready = 'true';
	toggle.addEventListener('click', (event) => {
		const btn = event.target.closest('.theme-btn');
		if (!btn) return;
		setTheme(btn.dataset.theme);
	});
	setTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', setupThemeToggle);
} else {
	setupThemeToggle();
}
