import {HISTORY,INITIAL_MEASUREMENTS,PROFILE} from '../data/seed.js';
const KEY='workout-revolution-2-v1';
const clone = x=>JSON.parse(JSON.stringify(x));
export function freshState(){return {version:1,profile:clone(PROFILE),history:clone(HISTORY),measurements:clone(INITIAL_MEASUREMENTS),photos:[],active:null,lastReadiness:null,programOverrides:{},changeLog:[],videoLinks:{},chat:[],view:'overview',selectedPlan:'push',selectedMetric:'incline-db|db-bench-30'}}
export function loadState(){try{const raw=localStorage.getItem(KEY);if(!raw)return freshState();const v=JSON.parse(raw);if(v.version!==1||!Array.isArray(v.history))throw Error('schema');return {...freshState(),...v,profile:{...PROFILE,...v.profile}}}catch(e){console.warn('Training data could not be loaded:',e);return freshState()}}
export function saveState(state){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){console.error('Local save failed:',e);return false}}
export function isValidImport(x){return x&&x.version===1&&Array.isArray(x.history)&&Array.isArray(x.measurements)&&x.profile&&typeof x.profile==='object'&&Array.isArray(x.changeLog||[])}
export function replaceState(x){if(!isValidImport(x))throw Error('This is not a valid Workout Revolution 2.0 backup.');const clean={...freshState(),...x,active:x.active||null,view:'overview'};if(!saveState(clean))throw Error('Browser storage is full.');return clean}
export function resetState(){const s=freshState();localStorage.removeItem(KEY);saveState(s);return s}
export function downloadBackup(state){const date=new Date().toISOString().slice(0,10);const body=JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2);const blob=new Blob([body],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`workout-revolution-backup-${date}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
