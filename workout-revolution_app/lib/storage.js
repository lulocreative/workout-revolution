import {HISTORY,INITIAL_MEASUREMENTS,PROFILE} from '../data/seed.js';
import {nutritionDefaults,migrateNutrition} from './nutrition.js';
const KEY='workout-revolution-2-v1';
const clone = x=>JSON.parse(JSON.stringify(x));
export function freshState(){return {version:1,profile:clone(PROFILE),history:clone(HISTORY),measurements:clone(INITIAL_MEASUREMENTS),photos:[],active:null,lastReadiness:null,programOverrides:{},changeLog:[],videoLinks:{},chat:[],nutrition:nutritionDefaults(),view:'overview',selectedPlan:'pull',selectedMetric:'incline-db|db-bench-30'}}
// Upgrade any saved state or backup (including ones made before the Food module existed) without
// touching workout history, the active workout, photos or measurements; only missing parts get defaults.
export function migrateState(v){return {...freshState(),...v,profile:{...PROFILE,...(v.profile||{})},nutrition:migrateNutrition(v.nutrition)}}
export function loadState(){try{const raw=localStorage.getItem(KEY);if(!raw)return freshState();const v=JSON.parse(raw);if(v.version!==1||!Array.isArray(v.history))throw Error('schema');return migrateState(v)}catch(e){console.warn('Training data could not be loaded:',e);return freshState()}}
export function saveState(state){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){console.error('Local save failed:',e);return false}}
export function isValidImport(x){return x&&x.version===1&&Array.isArray(x.history)&&Array.isArray(x.measurements)&&x.profile&&typeof x.profile==='object'&&Array.isArray(x.changeLog||[])}
export function prepareImport(x){if(!isValidImport(x))throw Error('This is not a valid Workout Revolution 2.0 backup.');return {...migrateState(x),active:x.active||null,view:'overview'}}
export function replaceState(x){const clean=prepareImport(x);if(!saveState(clean))throw Error('Browser storage is full.');return clean}
export function resetState(){const s=freshState();localStorage.removeItem(KEY);saveState(s);return s}
// Backups contain the whole state: gym history, workouts, photos, measurements AND nutrition logs.
export function backupPayload(state){return {...state,exportedAt:new Date().toISOString()}}
export function downloadBackup(state){const date=new Date().toISOString().slice(0,10);const body=JSON.stringify(backupPayload(state),null,2);const blob=new Blob([body],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`workout-revolution-backup-${date}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
