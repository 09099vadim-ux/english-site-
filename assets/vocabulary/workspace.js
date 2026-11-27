/* One main section, two persistent inner panels. Both legacy deep links remain valid. */
(function(){'use strict';
const root=document.querySelector('[data-section="english-words"]'),main=document.querySelector('nav.tabs [data-tab="english-words"]');if(!root||!main)return;
const tabs=[...root.querySelectorAll('[data-vocab-view]')],panels={words:document.getElementById('tv-dictionary'),exercises:document.getElementById('tv-exercises')};let view='words';
function choose(next,writeHash=true){view=next;tabs.forEach(b=>{const on=b.dataset.vocabView===view;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});Object.entries(panels).forEach(([key,p])=>p.hidden=key!==view);panels[view].dispatchEvent(new Event('vocab:open'));if(writeHash)history.replaceState(null,'',view==='words'?'#english-words':'#vocabulary-exercises')}
tabs.forEach(b=>b.addEventListener('click',()=>choose(b.dataset.vocabView)));
root.querySelector('.tv-main-tabs').addEventListener('keydown',e=>{const b=e.target.closest('[data-vocab-view]');if(!b)return;let i=tabs.indexOf(b);if(e.key==='ArrowRight'||e.key==='ArrowLeft')i=1-i;else if(e.key==='Home')i=0;else if(e.key==='End')i=1;else return;e.preventDefault();tabs[i].click();tabs[i].focus()});
main.addEventListener('click',()=>choose(view));
function deepLink(){if(location.hash==='#vocabulary-exercises'){view='exercises';main.click()}else if(['#english-words','#thematic-vocabulary','#english-words-affixes'].includes(location.hash)){const affixes=location.hash==='#english-words-affixes';view='words';main.click();if(affixes){panels.words.dispatchEvent(new Event('vocab:affixes'));history.replaceState(null,'','#english-words-affixes');}}}
window.addEventListener('hashchange',deepLink);deepLink();
})();
