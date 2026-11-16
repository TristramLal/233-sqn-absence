// Public demo only. No personal roll or production attendance data.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
const cfg=window.ROLL_CONFIG||{};
export const ready=Boolean(cfg.apiKey&&cfg.projectId&&cfg.appId);
const db=ready?getFirestore(initializeApp(cfg)):null;
export const demoNames=["Demo Cadet One","Demo Cadet Two","Demo Cadet Three","Demo Senior Cadet"];
export const flights=["1 Flight","2 Flight","3 Flight","Senior Cadets"];
export const ranks=["CDT","LCDT","CCPL","CSGT"];
export const statuses=["Unmarked","Present","Late","Away - leave request received","Away - no leave request"];
export const demoRoster=demoNames.map((name,i)=>({name,flight:flights[i],rank:ranks[i],id:"demo-"+(i+1)}));
export function today(){const p=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Brisbane",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());const v=t=>p.find(x=>x.type===t).value;return v("year")+"-"+v("month")+"-"+v("day")}
export function watch(day,callback,error){if(!ready){error(new Error("Firebase Web API Key not configured"));return ()=>{}}return onSnapshot(collection(db,"publicDemoDays",day,"attendance"),s=>callback(s.docs.map(d=>({id:d.id,...d.data()}))),error)}
export async function update(day,id,status){if(!ready)throw Error("Firebase is not configured");const p=demoRoster.find(x=>x.id===id);if(!p||!statuses.includes(status))throw Error("Invalid demonstration entry");await setDoc(doc(db,"publicDemoDays",day,"attendance",id),{name:p.name,rank:p.rank,flight:p.flight,status,source:status==="Present"?"Cadet demo":"Staff demo",updatedAt:serverTimestamp()})}
