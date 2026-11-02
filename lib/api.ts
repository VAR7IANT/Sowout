import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { digest, originOK } from './security';
import { readState } from './store';
import { validSession } from './model';
export const cookieName='sowout_session';
export function json(data:unknown,status=200) { return NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}}); }
export async function authenticate(admin=false) { const token=(await cookies()).get(cookieName)?.value; if(!token) return null; const state=await readState(); const user=validSession(state,digest(token)); return user && (!admin || user.role==='admin') ? user : null; }
export function guardOrigin(req:Request) { return originOK(req); }
export function fail(error:unknown) { console.error(error); return json({error:'Request failed. Please try again.'},500); }
