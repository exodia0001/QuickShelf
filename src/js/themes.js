const themeToggleButton = document.getElementById('theme-toggle');

const applyTheme = () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', theme === 'dark');
};

applyTheme();

themeToggleButton.addEventListener('click', () => {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    document.body.classList.toggle('dark-theme', !isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'light' : 'dark');
});
