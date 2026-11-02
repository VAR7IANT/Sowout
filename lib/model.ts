export type User = { id:string; username:string; passwordHash:string; role:'admin'|'user'; enabled:boolean; createdAt:string; updatedAt:string; version:number };
export type Subscription = { id:string; name:string; url:string; createdAt:string; updatedAt:string };
export type Session = { id:string; userId:string; expiresAt:number; version:number };
export type State = { users:User[]; subscriptions:Subscription[]; assignments:{userId:string; subscriptionId:string}[]; sessions:Session[] };
export const emptyState = ():State => ({users:[], subscriptions:[], assignments:[], sessions:[]});
export function visibleSubscriptions(s:State, userId:string) { const ids = new Set(s.assignments.filter(a=>a.userId===userId).map(a=>a.subscriptionId)); return s.subscriptions.filter(x=>ids.has(x.id)); }
export function revoke(s:State, user:User) { user.version++; s.sessions = s.sessions.filter(x=>x.userId!==user.id); }
export function removeSubscription(s:State,id:string) { s.subscriptions=s.subscriptions.filter(x=>x.id!==id); s.assignments=s.assignments.filter(x=>x.subscriptionId!==id); }
export function validSession(s:State,id:string,now=Date.now()) { const session=s.sessions.find(x=>x.id===id && x.expiresAt>now); const user=session && s.users.find(x=>x.id===session.userId && x.enabled && x.version===session.version); return user || null; }
