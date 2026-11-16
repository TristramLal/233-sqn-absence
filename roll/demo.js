// Demo-only data layer: deliberately no real nominal roll, Firebase credentials, or network writes.
window.RollDemo=(()=>{
const key='233-sqn-demo-attendance-v1';
const date=()=>{const parts=new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Brisbane',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=t=>parts.find(p=>p.type===t).value;return get('year')+'-'+get('month')+'-'+get('day');};
const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}};
const write=rows=>{localStorage.setItem(key,JSON.stringify(rows));window.dispatchEvent(new Event('roll-demo-update'))};
const save=entry=>{const rows=read();const day=date();const i=rows.findIndex(r=>r.day===day&&r.flight===entry.flight&&r.name.toLowerCase()===entry.name.toLowerCase());const value={...entry,day};if(i>=0)rows[i]=value;else rows.push(value);write(rows)};
const seed=()=>{if(read().length)return;write([{name:'Demo Cadet One',rank:'CDT',flight:'1 Flight',status:'Unmarked',source:'Demo roster',day:date(),recorded:''},{name:'Demo Cadet Two',rank:'LCDT',flight:'2 Flight',status:'Unmarked',source:'Demo roster',day:date(),recorded:''},{name:'Demo Cadet Three',rank:'CCPL',flight:'3 Flight',status:'Unmarked',source:'Demo roster',day:date(),recorded:''},{name:'Demo Senior Cadet',rank:'CSGT',flight:'Senior Cadets',status:'Unmarked',source:'Demo roster',day:date(),recorded:''}])};
return {date,read,write,save,seed,clear:()=>write([])};
})();