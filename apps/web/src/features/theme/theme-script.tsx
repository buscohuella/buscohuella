const themeInitializationScript = `
(function () {
  try {
    var storageKey = 'buscohuella-theme';
    var stored = window.localStorage.getItem(storageKey);
    var preference =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    var root = document.documentElement;

    window.localStorage.setItem(storageKey, preference);
    root.dataset.themePreference = preference;
    root.dataset.theme = preference;
    root.style.colorScheme = preference;
  } catch (_) {
    document.documentElement.dataset.themePreference = 'light';
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
  }
})();
`;

export function ThemeScript() {
  return (
    <script
      id="buscohuella-theme-script"
      dangerouslySetInnerHTML={{
        __html: themeInitializationScript,
      }}
    />
  );
}