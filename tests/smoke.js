const fs=require('fs'), vm=require('vm');
// Dependency-free browser-ish smoke test for the single-file app.
let html=fs.readFileSync('index.html','utf8');
const readme=fs.readFileSync('README.md','utf8');
let script=html.match(/<script>([\s\S]*)<\/script>/)[1];
script=script.replace(/\n\s*\}\(\)\);\s*$/, `
window.__test = { DIALECTS, switchDialect, update, expressionInput, victimText, outputText, trainerTitle, patternsToggle, inputPaneTitle, outputPaneTitle, trainerResults, getTrainerEntries, messages, trainerSupportFilter, cards };
}());`);
class El { constructor(id=''){ this.id=id; this.children=[]; this.dataset={}; this.style={setProperty(){}}; this.className=''; this.textContent=''; this.value=''; this.attributes={}; this.selectionStart=0; this.selectionEnd=0; this.classList={ contains:()=>false, add:()=>{}, remove:()=>{} }; }
 append(...nodes){this.children.push(...nodes)} appendChild(n){this.children.push(n);return n} setAttribute(k,v){this.attributes[k]=v} getAttribute(k){return this.attributes[k]} addEventListener(){} focus(){} setSelectionRange(s,e){this.selectionStart=s; this.selectionEnd=e} closest(){return null} contains(){return false} getBoundingClientRect(){return {top:0,bottom:100,left:0,width:100}} querySelectorAll(){return []} set innerHTML(value){this.children=[]; this._innerHTML=String(value)} get innerHTML(){return this._innerHTML||''} }
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
if (!/Bash analyzer\nSelected expansions only; not a full shell\./.test(t.outputText.textContent)) throw new Error('compact bash caveat missing: '+t.outputText.textContent);
if (!/"\$@" expands as separate words:\n<one>\n<two words>\n<three>/.test(t.outputText.textContent)) throw new Error('quoted $@ did not preserve words: '+t.outputText.textContent);
const messageText = () => t.messages.children.map(child => child.textContent).join('\n');

const treeText = node => (node.textContent || '') + (node.children || []).map(treeText).join('\n');
const cardsText = () => treeText(t.cards);
const fillerPhrases = [
  'syntax shape and support level',
  'Recognized in this Bash analyzer',
  'Use the demo input format',
  'Reference-only unless',
  'Bash syntax shape',
  'Bash loop syntax shape'
];
if (/not a full shell execution|does not execute arbitrary Bash|Reference-only unless/.test(messageText())) throw new Error('global bash caveat leaked into warning boxes: '+messageText());
if (t.trainerSupportFilter.value !== 'all') throw new Error('bash trainer should default to all support levels');
t.expressionInput.value = `printf '<%s>\n' $@`;
t.update();
if (!/Unquoted \$@ is usually unsafe/.test(messageText())) throw new Error('unquoted $@ warning missing: '+messageText());

t.expressionInput.value = '$(( 38 / 7 ))';
t.update();
if (!/Arithmetic expansion/.test(cardsText()) || !/integer arithmetic gives 5/.test(cardsText()) || !/prints:\n5/.test(cardsText()) || !/integer arithmetic and expands to 5/.test(t.outputText.textContent)) throw new Error('arithmetic expansion card/output missing integer detail: '+cardsText()+'\nOUTPUT:'+t.outputText.textContent);

t.expressionInput.value = '(( count++ ))';
t.update();
if (!/Arithmetic command/.test(cardsText()) || !/side effects/.test(cardsText()) || /Arithmetic expansion/.test(cardsText())) throw new Error('arithmetic command card confused with expansion: '+cardsText());

t.expressionInput.value = 'while done';
t.update();
if (!/Broken while loop/.test(cardsText()) || /Loop shape/.test(cardsText())) throw new Error('while done loop recognition wrong: '+cardsText());

t.expressionInput.value = 'while';
t.update();
if (!/Incomplete while loop/.test(cardsText()) || /Loop shape/.test(cardsText())) throw new Error('while loop fragment recognition wrong: '+cardsText());

t.expressionInput.value = 'while :; do echo tick; done';
t.update();
if (!/While loop/.test(cardsText()) || !/required while/.test(cardsText())) throw new Error('complete while loop not recognized: '+cardsText());

t.expressionInput.value = 'for name in "$@"; do printf \'%s\\n\' "$name"; done';
t.update();
if (!/For loop/.test(cardsText())) throw new Error('complete for loop not recognized: '+cardsText());

t.expressionInput.value = 'until [[ -f $path ]]; do continue; done';
t.update();
if (!/Until loop/.test(cardsText())) throw new Error('complete until loop not recognized: '+cardsText());

fillerPhrases.forEach(phrase => {
  ['$(( 38 / 7 ))', '(( count++ ))', 'while done', 'printf \'<%s>\\n\' "$@"', 'name=; printf \'%s\\n\' "${name:-world}"', 'arr=(one "two words"); printf \'<%s>\\n\' "${arr[@]}"'].forEach(expr => {
    t.expressionInput.value = expr;
    t.update();
    if (cardsText().includes(phrase)) throw new Error('filler phrase in bash card: '+phrase+' for '+expr+'\n'+cardsText());
  });
});

t.expressionInput.value = `arr=(one "two words"); printf '<%s>\\n' "\${arr[@]}"`;
t.update();
if (!/arr has 2 element\(s\): one, "two words"/.test(t.outputText.textContent)) throw new Error('array demo did not parse literal array: '+t.outputText.textContent);
if (!t.outputText.textContent.includes('\"${arr[@]}\" expands as separate words:\n<one>\n<two words>')) throw new Error('array @ did not preserve elements: '+t.outputText.textContent);
const entries=t.getTrainerEntries();
if (entries.length < 100 || entries.some(e=>e.dialect!=='bash')) throw new Error('bash trainer entries not expanded or include non-bash: '+entries.length);
['${var:-default}','declare -A map','shopt -s failglob','<<< "$text"'].forEach(snippet=>{if(!entries.some(e=>e.snippet.includes(snippet)||e.title.includes(snippet))) throw new Error('missing bash trainer snippet '+snippet)});
['small multi-mode browser workbench','Bash-ism analyzer/demonstrator','does not execute arbitrary Bash','does not include external Unix commands','mode selector switches','no CDN assets','PR #12 — Polish Bash analyzer cards'].forEach(text=>{if(!readme.includes(text)) throw new Error('README missing Bash/current app docs: '+text)});
t.switchDialect('sed');
if (t.getTrainerEntries().some(e=>e.dialect!=='sed')) throw new Error('sed trainer includes non-sed');
console.log('smoke ok');
