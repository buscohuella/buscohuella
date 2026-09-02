const accessibilityInitializationScript = `
(function () {
  try {
    var stored = window.localStorage.getItem('buscohuella-accessibility');
    var settings = stored ? JSON.parse(stored) : {};
    var root = document.documentElement;
    root.dataset.fontSize = settings.fontSize === 'large' || settings.fontSize === 'x-large' ? settings.fontSize : 'default';
    root.dataset.contrast = settings.contrast === 'high' ? 'high' : 'default';
    root.dataset.reducedMotion = settings.reducedMotion === true ? 'true' : 'false';
  } catch (_) {}
})();
`;

export function AccessibilityScript() {
  return <script id="buscohuella-accessibility-script" dangerouslySetInnerHTML={{ __html: accessibilityInitializationScript }} />;
}
