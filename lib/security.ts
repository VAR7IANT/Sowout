import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
const scrypt = (password:string,salt:string,length:number,options:{N:number;r:number;p:number}) => new Promise<Buffer>((resolve,reject)=>scryptCallback(password,salt,length,options,(error,key)=>error?reject(error):resolve(key))); 
export const randomToken = () => randomBytes(32).toString('base64url');
export const digest = (v:string) => createHash('sha256').update(v).digest('hex');
export async function hashPassword(password:string) { const salt=randomBytes(16).toString('hex'); const key=await scrypt(password,salt,64,{N:16384,r:8,p:1}) as Buffer; return `scrypt$16384$8$1$${salt}$${key.toString('hex')}`; }
export async function verifyPassword(password:string, hash:string) { try { const [alg,n,r,p,salt,key]=hash.split('$'); if(alg!=='scrypt' || n!=='16384' || r!=='8' || p!=='1' || !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(key)) return false; const actual=await scrypt(password,salt,64,{N:16384,r:8,p:1}) as Buffer; return timingSafeEqual(actual,Buffer.from(key,'hex')); } catch { return false; } }
export function originOK(request:Request) { try { const configured=process.env.APP_ORIGIN; return !!configured && new URL(configured).origin===request.headers.get('origin'); } catch { return false; } }
