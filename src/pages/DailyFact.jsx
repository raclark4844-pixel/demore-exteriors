import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar, Loader2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import useSEO from "@/hooks/useSEO";

// Custom D2F branded header image (Ohio State colors - scarlet red, gray, white, black with sleek 3D space theme)
const D2F_HEADER_IMAGE = 'https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/45250d807_generated_image.png';

function getRelatedImage(title, type) {
    // Historical context - use vintage book/library image
    if (type === 'historical') {
        return 'https://images.unsplash.com/photo-1524997171538-33820d3a0a9f?w=600&q=80';
    }
    // Archive/document images
    return 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80';
}

export default function DailyFact() {
    const { date } = useParams();

    useSEO({
        description:
            "Today's fun historical fact from the world of homes and construction, shared by Demore Exterior Solutions — your Mentor, OH exterior contractor.",
        canonical: `/daily-fact/${date}`,
    });
    const targetDate = date === "today" ? 
        new Date().toLocaleDateString("en-US", { timeZone: "America/New_York" }).split('/').reverse().join('-').split('-').map((p, i) => i === 0 ? p : p.padStart(2, '0')).join('-') 
        : date;

    const { data: fact, isLoading, error } = useQuery({
        queryKey: ['dailyFact', targetDate],
        queryFn: async () => {
            const results = await base44.entities.DailyFunFact.filter({ date: targetDate });
            return results[0] || null;
        }
    });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-16">

                <Link
                    to="/daily-facts"
                    className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-primary hover:text-primary/80 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Past Fun Facts
                </Link>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-3 text-lg">Loading today's fun fact...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <h1 className="text-3xl font-heading font-bold mb-4">Oops!</h1>
                        <p className="text-muted-foreground">Something went wrong loading the fact.</p>
                    </div>
                ) : !fact ? (
                    <div className="text-center py-20">
                        <Calendar className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                        <h1 className="text-3xl font-heading font-bold mb-4">No Fact Yet</h1>
                        <p className="text-muted-foreground">Today's fun fact hasn't been generated yet. Check back after midnight!</p>
                    </div>
                ) : (
                    <article className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                        {/* D2F Branded Header Image */}
                        <div className="h-64 sm:h-80 relative overflow-hidden">
                            <img 
                                src={D2F_HEADER_IMAGE}
                                alt="Daily Fun Fact"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        <div className="p-8 sm:p-10">
                            {/* Daily Fun Fact Title */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-2">
                                    Daily Fun Fact
                                </h2>
                                <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                            </div>
                            {/* Date - Centered */}
                            <div className="flex justify-center mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-primary">
                                        {new Date(fact.date + 'T00:00:00').toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Fact Title - Centered */}
                            <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-8 text-foreground text-center leading-tight">
                                {fact.title}
                            </h1>
                            
                            {/* Content - Better Flow */}
                            <div className="prose prose-invert prose-lg max-w-none">
                                <ReactMarkdown 
                                    components={{
                                        p: ({node, ...props}) => <p className="text-muted-foreground leading-relaxed mb-4" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-xl font-heading font-bold mt-6 mb-3 text-primary" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-lg font-heading font-semibold mt-4 mb-2" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2" {...props} />,
                                        li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                                        strong: ({node, ...props}) => <strong className="text-foreground font-semibold" {...props} />,
                                        em: ({node, ...props}) => <em className="text-primary/90 italic" {...props} />,
                                    }}
                                >
                                    {fact.content}
                                </ReactMarkdown>
                            </div>
                            

                        </div>
                    </article>
                )}
            </div>
            <Footer />
        </div>
    );
}