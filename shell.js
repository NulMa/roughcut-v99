// RC99 loading cover (11/15). Registered in the engine's intro-shell slot (<meta name="ue-shell" content="shell.js">,
// injected by Tools/deploy_ghpages.py). It keeps the engine's bar, byte count and start-up steps, and adds what a player
// can use while the first visit downloads: the title art, the controls, the floor-tile rules and a rotating tip.
// When the game is ready while the tab is in the background, the tab title says so until the player comes back.
(() => {
  const title0 = document.title;
  const css = `
#shell{background:radial-gradient(ellipse at 50% 35%,#39362f 0%,#26231f 60%,#141210 100%)}
#shell .rc-top{position:absolute;left:0;right:0;top:0;bottom:min(300px,45cqh);display:flex;align-items:center;justify-content:center}
#shell .rc-bg{width:auto;height:auto;max-width:100%;max-height:100%;image-rendering:pixelated;
  -webkit-mask-image:linear-gradient(180deg,#000 75%,#0000 100%);mask-image:linear-gradient(180deg,#000 75%,#0000 100%)}
#art.shell .title{top:auto;bottom:max(12px,3cqh)}
#art.shell #loader,#art.shell #notice{max-width:min(640px,92cqw);margin-left:auto;margin-right:auto}
#art .rc-card{width:min(640px,92cqw);margin:10px auto 0;color:#e9e4da;font:500 14px/1.45 system-ui,sans-serif}
#art .rc-row{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;margin-bottom:8px}
#art .rc-row span{white-space:nowrap}
#art .rc-card kbd{display:inline-block;min-width:1.4em;padding:1px 6px;margin-right:4px;border-radius:4px;background:#e9e4da;color:#1a1714;
  font:700 12px/1.5 ui-monospace,monospace;text-align:center}
#art .rc-rules{display:flex;gap:18px;justify-content:center;margin-bottom:6px}
#art .rc-tile{display:inline-block;width:12px;height:12px;margin-right:6px;vertical-align:-1px}
#art .rc-tip{color:#c9c1b3;min-height:2.9em;transition:opacity .4s}
@container (max-height:560px){#art .rc-tip{display:none}}
@container (max-height:460px){#art .rc-rules{display:none}}`;
  const tips = [
    'First visit only: the browser keeps the files, so the next launch skips this download.',
    'Lost a take? Pick "Edit weapon" and redraw your weapon in the Editing Room, then roll again.',
    'Every attack is drawn on the floor before it lands. Watch the tiles, not the boss.',
    'Parry on the beat to stagger a boss. A perfect parry freezes the frame.',
    'Beat a boss, then edit its core into your weapon in the Editing Room.',
    'Hold the left mouse button to charge a swing; release to slam.',
    'Right-click erases in the Editing Room.',
  ];
  const bg = '<div class="rc-top"><img class="rc-bg" src="loading_art.jpg" alt=""></div>';
  const html = `<div class="rc-card">
  <div class="rc-row"><span><kbd>A</kbd><kbd>D</kbd>move</span><span><kbd>Space</kbd>jump</span><span><kbd>Shift</kbd>dash</span>
    <span><kbd>LMB</kbd>swing</span><span><kbd>RMB</kbd>parry</span><span><kbd>Q</kbd>special</span><span><kbd>Tab</kbd>Editing Room</span></div>
  <div class="rc-rules"><span><i class="rc-tile" style="background:#d8402f"></i>red tile: dodge</span>
    <span><i class="rc-tile" style="background:#f0b429"></i>gold tile: parry</span></div>
  <div class="rc-tip"></div></div>`;
  let timer = null;
  const shell = {
    show(container) {
      const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
      container.innerHTML = bg;
      // the card goes under the engine's bar (in its flow, so the browser notice cannot cover it)
      const card = document.createElement('div'); card.innerHTML = html;
      const loader = document.getElementById('loader');
      loader.parentNode.insertBefore(card.firstElementChild, loader.nextSibling);
      const tip = document.querySelector('#art .rc-tip');
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
