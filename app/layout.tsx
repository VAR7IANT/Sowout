import './globals.css'; import type { Metadata } from 'next';
export const metadata:Metadata={title:'Sowout',description:'Your subscriptions, in one place.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}