import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useSEO from "@/hooks/useSEO";

// Custom D2F branded header image (Ohio State colors - scarlet red, gray, white, black with sleek 3D space theme)
const D2F_HEADER_IMAGE = 'https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/45250d807_generated_image.png';

export default function DailyFactsIndex() {
    useSEO({
        title: "Daily Fun Fact Archive | Demore Exterior Solutions",
        description:
            "Browse every past Daily Fun Fact from Demore Exterior Solutions — funny historical events from the world of homes and construction, refreshed daily.",
        canonical: "/daily-facts",
    });
    const { data: facts, isLoading } = useQuery({
        queryKey: ['dailyFactsIndex'],
        queryFn: async () => {
            const allFacts = await base44.entities.DailyFunFact.list('-date', 100);
            return allFacts;
        }
    });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* D2F Branded Header Image */}
                <div className="h-64 sm:h-80 relative overflow-hidden rounded-2xl mb-8">
                    <img 
                        src={D2F_HEADER_IMAGE}
                        alt="Daily Fun Fact"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="text-center mb-8">
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Browse all previously generated daily fun facts about funny historical events. 
                        New facts are generated every day at 12:32 AM!
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                    </div>
                ) : !facts || facts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No fun facts generated yet. Check back tomorrow!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {facts.map((fact) => (
                            <Link
                                key={fact.id}
                                to={`/daily-fact/${fact.date}`}
                                className="group block bg-card hover:bg-card/80 rounded-xl p-6 border border-border hover:border-primary/50 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-heading font-semibold group-hover:text-primary transition-colors">
                                            {fact.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {new Date(fact.date + 'T00:00:00').toLocaleDateString("en-US", { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}