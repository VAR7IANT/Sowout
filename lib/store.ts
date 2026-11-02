import { Redis } from '@upstash/redis';
import { emptyState, type State } from './model';
export const redis = () => { if(!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) throw new Error('Redis is not configured'); return new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN,automaticDeserialization:false}); };
const key='sowout:state:v1';
export async function readState():Promise<State> { const raw=await redis().get<string>(key); return raw ? JSON.parse(raw) as State : emptyState(); }
export async function mutate<T>(fn:(s:State)=>T):Promise<T> { const db=redis(); for(let i=0;i<20;i++){ const raw=await db.get<string>(key); const state:State=raw?JSON.parse(raw):emptyState(); state.sessions=state.sessions.filter(x=>x.expiresAt>Date.now()); const result=fn(state); const success=await db.eval(`local old=redis.call('GET',KEYS[1]); if (old or '') ~= ARGV[1] then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1`,[key],[raw || '',JSON.stringify(state)]); if(Number(success)===1) return result; } throw new Error('Concurrent update limit exceeded'); }
export async function rateLimit(keyPart:string) { const count=await redis().eval(`local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n`,[`sowout:rate:${keyPart}`],[]); return Number(count)<=10; }
