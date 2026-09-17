import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {base44} from "@/api/base44Client";
export default function StormAlertBar(){
 const [notices,setNotices]=useState([]); const [now,setNow]=useState(Date.now());
 useEffect(()=>{let live=true;const refresh=()=>base44.entities.StormNotice.filter({status:"published"},"-issued_at",50).then(rows=>{if(live){setNotices(rows);setNow(Date.now());}}).catch(()=>{if(live)setNotices([]);});refresh();const timer=setInterval(refresh,60000);return()=>{live=false;clearInterval(timer);};},[]);
 const notice=notices.find(n=>Date.parse(n.expires_at)>now && Date.parse(n.issued_at)<=now);
 if(!notice)return null;
 return <aside className="bg-amber-100 text-slate-950 px-4 py-4 text-center" aria-label="Local weather notice"><strong>{notice.event}: {notice.county} County.</strong> Follow official safety instructions. <Link className="underline font-semibold" to={"/storm-updates/"+notice.slug}>View warning details and next steps</Link></aside>;
}