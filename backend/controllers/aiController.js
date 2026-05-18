const axios = require("axios");

// 🔥 MULTI-MODEL FALLBACK
const models = [
  "deepseek/deepseek-v4-flash:free",
  "baidu/cobuddy:free",
  "openrouter/owl-alpha",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openrouter/elephant-alpha",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "qwen/qwen3.6-plus:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "stepfun/step-3.5-flash:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
  "liquid/lfm-2.5-1.2b-thinking:free",
  "nvidia/llama-nemotron-embed-vl-1b-v2:free",
  "arcee-ai/trinity-large-preview:free",
  "arcee-ai/trinity-mini:free",
  "google/gemma-4-26b-a4b-it:free",
  "google/gemma-4-31b-it:free",
  "minimax/minimax-m2.5:free",
];

const generateAIText = async (req, res) => {
    console.log("🔥 AI ROUTE HIT");
  try {
    // 🔥 CLEAN PROMPT (VERY IMPORTANT)
    const { type = "overview", eventName, description } = req.body;

let prompt = "";

// 🔥 OVERVIEW PROMPT
if (type === "overview") {
  prompt = `
Write a clean and professional event overview in ONE paragraph (6–8 lines).

Do NOT use:
- headings
- bullet points
- markdown

Event Name: ${eventName}
Description: ${description}
`;
}
if (type === "subevent") {
  prompt = `
Write a clean, professional paragraph (7-8 lines) describing the sub-event "${eventName}".

Description: ${description}

IMPORTANT:
- Do NOT include phrases like "Here is", "Overview", "Key elements"
- Do NOT use bullet points or explanations
- Do NOT add formatting symbols (*, -, etc.)
- Output ONLY one clean paragraph
- Keep it concise and formal
`;
}

// 🔥 CONCLUSION PROMPT
else if (type === "conclusion") {
  prompt = `
Write a formal conclusion for an event report in ONE paragraph (5–6 lines).

Include:
- overall success of the event
- participation and outcomes
- final impact

Do NOT use:
- headings
- bullet points
- markdown

Event Name: ${eventName}
Description: ${description}
`;
}

    let aiText = "";

    // 🔥 TRY MODELS ONE BY ONE
    for (let model of models) {
      try {
        console.log("Trying model:", model);

        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        aiText = response.data.choices[0].message.content;

        console.log("✅ Success with:", model);
        break;

      } catch (err) {
        console.log(`❌ Failed: ${model}`);
        continue;
      }
    }

    // ❌ ALL FAILED
    if (!aiText) {
      return res.status(500).json({
        error: "All AI models are busy. Try again later.",
      });
    }

    // 🔥 CLEAN AI OUTPUT
    aiText = aiText
  .replace(/\*\*/g, "")          // remove **
  .replace(/#+/g, "")            // remove #
  .replace(/\n/g, " ")           // 🔥 convert new lines to space
  .replace(/\.\s+/g, ". ")       // normalize spacing after sentences
  .replace(/\s+/g, " ")          // remove extra spaces
  .trim();

    // 🔥 STOCK PARAGRAPH (SECOND PART)
   let stockParagraph = "";

// 🔥 OVERVIEW STOCK
if (type === "overview") {
  stockParagraph = `
The event ${eventName} was executed with a well-structured plan and efficient resource management. A dedicated team of volunteers ensured smooth coordination throughout the event. The allocated budget was utilized effectively to meet all logistical requirements. The event plan was followed systematically, ensuring timely execution of all activities. Overall, the event was successfully conducted and achieved its intended objectives.
`;
}

// 🔥 CONCLUSION STOCK
else if (type === "conclusion") {
  stockParagraph = `
In conclusion, the event ${eventName} proved to be a successful initiative that met its intended objectives. The participation, planning, and execution reflected strong coordination and teamwork. The event created a valuable platform for learning, interaction, and practical exposure. Overall, it left a positive impact on all participants and demonstrated effective event management.
`;
}

    // 🔥 FINAL COMBINED OUTPUT
   const finalOverview = `${aiText} ${stockParagraph}`
  .replace(/\n/g, " ")      // 🔥 remove all line breaks
  .replace(/\s+/g, " ")     // clean extra spaces
  .trim();

    // ✅ RESPONSE
    res.json({
      text: finalOverview,
    });

  } catch (err) {
    console.log("🔥 CONTROLLER ERROR:", err.message);

    res.status(500).json({
      error: "AI generation failed",
    });
  }
};

module.exports = { generateAIText };