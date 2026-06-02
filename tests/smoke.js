const fs=require('fs'), vm=require('vm');
// Dependency-free browser-ish smoke test for the single-file app.
let html=fs.readFileSync('index.html','utf8');
let script=html.match(/<script>([\s\S]*)<\/script>/)[1];
script=script.replace(/\n\s*\}\(\)\);\s*$/, `
window.__test = { DIALECTS, switchDialect, update, expressionInput, victimText, outputText, trainerTitle, patternsToggle, inputPaneTitle, outputPaneTitle, trainerResults, getTrainerEntries };
}());`);
class El { constructor(id=''){ this.id=id; this.children=[]; this.dataset={}; this.style={setProperty(){}}; this.className=''; this.textContent=''; this.value=''; this.attributes={}; this.selectionStart=0; this.selectionEnd=0; this.classList={ contains:()=>false, add:()=>{}, remove:()=>{} }; }
 append(...nodes){this.children.push(...nodes)} appendChild(n){this.children.push(n);return n} setAttribute(k,v){this.attributes[k]=v} getAttribute(k){return this.attributes[k]} addEventListener(){} focus(){} setSelectionRange(s,e){this.selectionStart=s; this.selectionEnd=e} closest(){return null} contains(){return false} getBoundingClientRect(){return {top:0,bottom:100,left:0,width:100}} querySelectorAll(){return []} }
const ids={}; const doc={ documentElement:{dataset:{},removeAttribute(){}}, getElementById(id){return ids[id]||(ids[id]=new El(id))}, createElement(tag){return new El(tag)}, createTextNode(text){const e=new El('text'); e.textContent=String(text); return e}, querySelector(){return new El('q')}, querySelectorAll(){return []}, addEventListener(){} };
const store={}; const ctx={console, window:{matchMedia:()=>({matches:false})}, document:doc, localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v)}}, setTimeout:(fn)=>fn(), CSS:{escape:s=>s}};
ctx.window.window=ctx.window; ctx.window.document=doc;
vm.createContext(ctx); vm.runInContext(script, ctx);
const t=ctx.window.__test;
if (!t.DIALECTS.sed || !t.DIALECTS.bash) throw new Error('missing dialects');
if (!Object.keys(t.DIALECTS).includes('bash')) throw new Error('bash not selectable');
if (!/alpha NUM\nbeta NUM/.test(t.outputText.textContent)) throw new Error('sed default smoke failed: '+t.outputText.textContent);
t.switchDialect('bash');
if (t.trainerTitle.textContent !== 'Bash Ism Trainer') throw new Error('trainer title not bash');
if (t.patternsToggle.textContent !== 'isms') throw new Error('button not bash');
if (t.inputPaneTitle.textContent !== 'Demo Args / Input') throw new Error('input title not bash');
if (!/^printf/.test(t.expressionInput.value)) throw new Error('bash default expr missing');
if (!/\$# = 3/.test(t.outputText.textContent)) throw new Error('missing argc: '+t.outputText.textContent);
['$1 = one','$2 = two words','$3 = three'].forEach(x=>{if(!t.outputText.textContent.includes(x)) throw new Error('missing '+x)});
if (!/"\$@" expands as separate words:\n<one>\n<two words>\n<three>/.test(t.outputText.textContent)) throw new Error('quoted $@ did not preserve words: '+t.outputText.textContent);

t.expressionInput.value = `arr=(one "two words"); printf '<%s>\\n' "\${arr[@]}"`;
t.update();
if (!/arr has 2 element\(s\): one, "two words"/.test(t.outputText.textContent)) throw new Error('array demo did not parse literal array: '+t.outputText.textContent);
if (!t.outputText.textContent.includes('\"${arr[@]}\" expands as separate words:\n<one>\n<two words>')) throw new Error('array @ did not preserve elements: '+t.outputText.textContent);
const entries=t.getTrainerEntries();
if (!entries.length || entries.some(e=>e.dialect!=='bash')) throw new Error('trainer includes non-bash');
t.switchDialect('sed');
if (t.getTrainerEntries().some(e=>e.dialect!=='sed')) throw new Error('sed trainer includes non-sed');
console.log('smoke ok');
