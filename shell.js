// RC99 loading cover (11/15). Registered in the engine's intro-shell slot (<meta name="ue-shell" content="shell.js">,
// injected by Tools/deploy_ghpages.py). It keeps the engine's bar, byte count and start-up steps, and adds what a player
// can use while the first visit downloads: the title art, the controls, the floor-tile rules and a rotating tip.
// When the game is ready while the tab is in the background, the tab title says so until the player comes back.
(() => {
  const title0 = document.title;
  const css = `
#shell .rc-bg{position:absolute;inset:0;background:#141210 url(loading_art.jpg) center top/cover no-repeat;image-rendering:pixelated}
#shell .rc-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#0000 0%,#0000 45%,#141210e6 72%,#141210 100%)}
#art.shell .title{top:auto;bottom:max(16px,4cqh)}
#art.shell #loader{max-width:min(640px,92cqw);margin:0 auto}
#shell .rc-card{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(max(16px,4cqh) + 52px);width:min(640px,92cqw);
  color:#e9e4da;font:500 14px/1.45 system-ui,sans-serif;text-align:left}
#shell .rc-row{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;margin-bottom:8px}
#shell .rc-row span{white-space:nowrap}
#shell kbd{display:inline-block;min-width:1.4em;padding:1px 6px;margin-right:4px;border-radius:4px;background:#e9e4da;color:#1a1714;
  font:700 12px/1.5 ui-monospace,monospace;text-align:center}
#shell .rc-rules{display:flex;gap:18px;justify-content:center;margin-bottom:8px}
#shell .rc-tile{display:inline-block;width:12px;height:12px;margin-right:6px;vertical-align:-1px}
#shell .rc-tip{text-align:center;color:#c9c1b3;min-height:2.9em;transition:opacity .4s}
@container (max-height:520px){#shell .rc-tip{display:none}}
@container (max-height:420px){#shell .rc-rules{display:none}}`;
  const tips = [
    'First visit only: the browser keeps the files, so the next launch skips this download.',
    'Lost a take? Pick "Edit weapon" and redraw your weapon in the Editing Room, then roll again.',
    'Every attack is drawn on the floor before it lands. Watch the tiles, not the boss.',
    'Parry on the beat to stagger a boss. A perfect parry freezes the frame.',
    'Beat a boss, then edit its core into your weapon in the Editing Room.',
    'Hold the left mouse button to charge a swing; release to slam.',
    'Right-click erases in the Editing Room.',
  ];
  const html = `<div class="rc-bg"></div><div class="rc-card">
  <div class="rc-row"><span><kbd>A</kbd><kbd>D</kbd>move</span><span><kbd>Space</kbd>jump</span><span><kbd>Shift</kbd>dash</span>
    <span><kbd>LMB</kbd>swing</span><span><kbd>RMB</kbd>parry</span><span><kbd>Q</kbd>special</span><span><kbd>Tab</kbd>Editing Room</span></div>
  <div class="rc-rules"><span><i class="rc-tile" style="background:#d8402f"></i>red tile: dodge</span>
    <span><i class="rc-tile" style="background:#f0b429"></i>gold tile: parry</span></div>
  <div class="rc-tip"></div></div>`;
  let timer = null;
  const shell = {
    show(container) {
      const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
      container.innerHTML = html;
      const tip = container.querySelector('.rc-tip');
      let i = 0;
      const next = () => { tip.style.opacity = 0; setTimeout(() => { tip.textContent = tips[i++ % tips.length]; tip.style.opacity = 1; }, 400); };
      tip.textContent = tips[i++]; timer = setInterval(next, 7000);
    },
    handoff() { if (timer) clearInterval(timer); return Promise.resolve(); },
    hideLoader: false,
  };
  if (window.ue && window.ue.shell) window.ue.shell.register(shell);
  // Ready while the player is in another tab: say so in the tab title until they come back
  const back = () => { if (!document.hidden) { document.title = title0; document.removeEventListener('visibilitychange', back); } };
  window.addEventListener('ue-ready', () => {
    if (!document.hidden) return;
    document.title = '(Ready) ' + title0;
    document.addEventListener('visibilitychange', back);
  }, { once: true });
})();
