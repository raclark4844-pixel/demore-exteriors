import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {base44} from "@/api/base44Client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";
export default function ReviewUs(){
 const [url,setUrl]=useState("");const [loading,setLoading]=useState(true);
 useSEO({title:"Share Your Experience | Demore Exterior Solutions",description:"Leave honest feedback about your experience with Demore Exterior Solutions.",canonical:"/review-us"});
 useEffect(()=>{base44.entities.GrowthSettings.filter({key:"default"}).then(rows=>{const value=rows[0]?.google_review_url;try{const u=new URL(value);if(u.protocol==="https:"&&["g.page","maps.app.goo.gl","search.google.com","maps.google.com","www.google.com"].includes(u.hostname))setUrl(value);}catch{/* No verified link yet. */}}).catch(()=>{}).finally(()=>setLoading(false));},[]);
 return <div className="min-h-screen bg-background"><Navbar/><main className="max-w-2xl mx-auto px-5 pt-36 pb-24 text-center"><p className="text-primary font-semibold">Thank you for choosing Demore</p><h1 className="text-4xl font-heading font-bold mt-3 mb-5">How did we do?</h1><p className="text-muted-foreground text-lg mb-8">Your honest feedback helps other homeowners know what to expect. We welcome every experience.</p>{loading?<p role="status">Loading review options…</p>:url?<a href={url} target="_blank" rel="noopener noreferrer" className="inline-block bg-primary text-primary-foreground rounded-lg px-6 py-4 font-bold">Leave a Google review</a>:<Link to="/reviews#write" className="inline-block bg-primary text-primary-foreground rounded-lg px-6 py-4 font-bold">Share your experience on our website</Link>}<p className="text-sm text-muted-foreground mt-6">A review is optional. No incentive or positive rating is required.</p></main><Footer/></div>;
}