/** Inline before paint to avoid flash — injected in root shell */
export const colorModeScript = `
(function(){
  try {
    var embedded = false;
    try { embedded = window.self !== window.top; } catch(e) { embedded = true; }
    if (embedded) document.documentElement.classList.add('is-embedded-preview');
    else document.documentElement.classList.add('js');
    var pref = localStorage.getItem('tny-color-mode');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = pref === 'dark' ? true : pref === 'light' ? false : systemDark;
    var mode = resolved ? 'dark' : 'light';
    document.documentElement.classList.add(mode);
    document.documentElement.style.colorScheme = mode;
    document.documentElement.dataset.colorMode = mode;
    var themeColor = resolved ? '#0c0c0c' : '#f7f6f4';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', themeColor);
  } catch(e) {}
})();
`;
