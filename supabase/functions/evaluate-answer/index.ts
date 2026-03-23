import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, question_id, user_answer } = await req.json();

    if (!session_id || !question_id || !user_answer) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get Supabase client with service role for DB access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the question details
    const { data: question, error: qError } = await supabase
      .from("questions")
      .select("*")
      .eq("id", question_id)
      .single();

    if (qError || !question) {
      return new Response(JSON.stringify({ error: "Question not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use Lovable AI for semantic evaluation
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const evaluationPrompt = `You are an interview answer evaluator. Evaluate the candidate's answer against the ideal answer and keywords.

Question: ${question.question}
Ideal Answer: ${question.ideal_answer}
Keywords to look for: ${question.keywords.join(", ")}
Candidate's Answer: ${user_answer}

Evaluate and return a JSON response with:
1. "semantic_score": 0-100 score for how semantically similar the answer is to the ideal answer
2. "keyword_score": 0-100 score for how many relevant keywords/concepts are covered
3. "feedback": 2-3 sentences of constructive feedback

Consider:
- Semantic similarity: Does the answer convey the same meaning even with different words?
- Keyword coverage: Does the answer mention the key concepts?
- Completeness: Does the answer cover all important aspects?

Return ONLY valid JSON with keys: semantic_score, keyword_score, feedback`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a precise interview evaluator. Always respond with valid JSON only." },
          { role: "user", content: evaluationPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "evaluate_answer",
              description: "Return the evaluation scores and feedback",
              parameters: {
                type: "object",
                properties: {
                  semantic_score: { type: "number", description: "Semantic similarity score 0-100" },
                  keyword_score: { type: "number", description: "Keyword matching score 0-100" },
                  feedback: { type: "string", description: "Constructive feedback for the candidate" },
                },
                required: ["semantic_score", "keyword_score", "feedback"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "evaluate_answer" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI error:", status, await aiResponse.text());
      return new Response(JSON.stringify({ error: "AI evaluation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    let evaluation;

    // Parse tool call response
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      evaluation = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try parsing from content
      const content = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        evaluation = { semantic_score: 50, keyword_score: 50, feedback: "Unable to fully evaluate. Please try again." };
      }
    }

    const semanticScore = Math.max(0, Math.min(100, Math.round(evaluation.semantic_score)));
    const keywordScore = Math.max(0, Math.min(100, Math.round(evaluation.keyword_score)));
    const finalScore = Math.round(0.6 * semanticScore + 0.4 * keywordScore);

    // Generate feedback label
    let feedbackPrefix = "";
    if (finalScore >= 80) feedbackPrefix = "Excellent answer! ";
    else if (finalScore >= 60) feedbackPrefix = "Good answer, but can improve. ";
    else if (finalScore >= 40) feedbackPrefix = "Partial answer. ";
    else feedbackPrefix = "Needs improvement. ";

    const feedback = feedbackPrefix + evaluation.feedback;

    // Save result
    const { data: result, error: insertError } = await supabase
      .from("interview_results")
      .insert({
        session_id,
        question_id,
        user_answer,
        semantic_score: semanticScore,
        keyword_score: keywordScore,
        final_score: finalScore,
        feedback,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save result" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
