import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Determine today's date in America/New_York timezone
        const now = new Date();
        const localDateStr = now.toLocaleDateString("en-US", { timeZone: "America/New_York" });
        const [month, day, year] = localDateStr.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        // Call the built-in LLM to search for funny historical events on this date
        const prompt = `Search the internet for funny, unusual, or bizarre historical events that occurred on ${localDateStr} throughout history. Generate an engaging daily fun fact formatted beautifully in Markdown with a catchy title. Make it lighthearted, humorous, and educational. Include specific dates, names, and amusing details.`;
        
        const response = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            add_context_from_internet: true,
            model: "gemini_3_flash",
            response_json_schema: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Catchy title for the fun fact" },
                    content: { type: "string", description: "The beautiful Markdown content of the funny historical event" }
                },
                required: ["title", "content"]
            }
        });

        // Check if a record already exists for today
        const existing = await base44.asServiceRole.entities.DailyFunFact.filter({ date: formattedDate });
        
        if (existing.length > 0) {
            // Update existing record
            await base44.asServiceRole.entities.DailyFunFact.update(existing[0].id, {
                title: response.title,
                content: response.content
            });
        } else {
            // Create new record
            await base44.asServiceRole.entities.DailyFunFact.create({
                date: formattedDate,
                title: response.title,
                content: response.content
            });
        }

        return Response.json({ success: true, date: formattedDate, fact: response });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});