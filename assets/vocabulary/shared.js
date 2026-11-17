/* One lazy, file://-compatible source for dictionary and exercise views. */
(function(){'use strict';
const sourceUrl=new URL('data.js',document.currentScript.src).href;let pending,raw,index;
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function bindWord(w,topicId,listId){w.id=listId+':'+(w.number||slug(w.en));w.topicId=topicId;return w}
function buildIndex(d){const entries=new Map();
 for(const t of d.themes){for(const w of t.words||[])bindWord(w,t.id,t.id),entries.set(w.id,w);for(const g of t.groups||[])for(const w of g.words)bindWord(w,t.id,g.id),entries.set(w.id,w)}
 for(const mode of ['cardinal','ordinal'])for(const w of d.numbers[mode])bindWord(w,'numbers','numbers-'+mode),entries.set(w.id,w);
 // Suffix adapters refer to the original table row; they are not a second vocabulary database.
 for(const s of d.suffixes)for(const row of s.rows)for(const side of ['base','derived']){const id='suffixes:'+slug(row[side]);if(entries.has(id))continue;const x={id,topicId:'suffixes',suffixId:s.id};Object.defineProperties(x,{en:{enumerable:true,get:()=>row[side]},ru:{enumerable:true,get:()=>row[side+'Ru']},example:{enumerable:true,get:()=>row[side+'Example']},translation:{enumerable:true,get:()=>row[side+'Translation']}});entries.set(id,x)}
 return entries;
}
function load(){if(raw)return Promise.resolve(raw);if(pending)return pending;pending=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=sourceUrl;script.onload=()=>{try{const d=window.__AE_VOCABULARY_DATA__;if(!d||d.themes.length!==25)throw new Error('Invalid vocabulary source');raw=d;index=buildIndex(raw);resolve(raw)}catch(e){pending=null;reject(e)}};script.onerror=()=>{pending=null;script.remove();reject(new Error('Не удалось загрузить общую базу словаря'))};document.head.appendChild(script)});return pending}
window.AEVocabulary=Object.freeze({load,getWord:id=>index?.get(id),getWords:()=>index?[...index.values()]:[],getThemes:()=>raw?.themes||[]});
})();
