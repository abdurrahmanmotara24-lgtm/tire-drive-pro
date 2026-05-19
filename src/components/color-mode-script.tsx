/** Inline before paint to avoid flash — injected in root shell */
export const colorModeScript = `
(function(){
  try {
    var embedded = false;
    try { embedded = window.self !== window.top; } catch(e) { embedded = true; }
    if (embedded) document.documentElement.classList.add('is-embedded-preview');
    else document.documentElement.classList.add('js');
    var m = localStorage.getItem('tny-color-mode');
    var d = m === 'dark' || (!m && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.add(d ? 'dark' : 'light');
    document.documentElement.style.colorScheme = d ? 'dark' : 'light';
  } catch(e) {}
})();
`;
