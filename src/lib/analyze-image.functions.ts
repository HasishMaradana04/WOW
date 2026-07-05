import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  imageDataUrl: z.string().min(20),
});

export const classifyEnvironmentImage = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Mock successful response when no API key is provided
      await new Promise(r => setTimeout(r, 1500));
      return { valid: true, reason: "Mock: Valid environmental report.", label: "smoke" as const };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You classify photos submitted to a civic pollution-reporting app. Reply with strict JSON only: {\"valid\": boolean, \"label\": \"smoke\"|\"traffic\"|\"garbage\"|\"dust\"|\"industrial\"|\"chemical\"|\"other_environment\"|\"invalid\", \"reason\": string}. Set valid=true ONLY for photos of real-world outdoor environment incidents: visible smoke/fire, garbage piles, burning waste, traffic congestion, construction dust, industrial emissions, chemical spills, polluted streets or water. Set valid=false for selfies, memes, screenshots, indoor scenes, food, pets, random objects, blank images, or anything unrelated to environmental pollution.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Classify this image." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return { valid: false, reason: `AI error (${res.status})`, label: "unknown" as const, raw: txt };
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    const cleaned = content.replace(/```json\s*|\s*```/g, "").trim();
    try {
      const parsed = JSON.parse(cleaned);
      return {
        valid: !!parsed.valid,
        label: String(parsed.label ?? "unknown"),
        reason: String(parsed.reason ?? ""),
      };
    } catch {
      return { valid: false, label: "unknown", reason: "Could not parse AI response" };
    }
  });
