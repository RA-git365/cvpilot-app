import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      skills,
      experience,
      role,
      jobDescription,
      template,
      contact,
    } = body;

    let styleInstruction = "";

    if (template === "modern") {
      styleInstruction =
        "Use a modern, clean, slightly creative tone.";
    } else if (template === "professional") {
      styleInstruction =
        "Use a strict professional corporate tone.";
    } else {
      styleInstruction =
        "Use a minimal and concise tone.";
    }

    const prompt = `
Act as a professional resume writer.

Create an ATS-optimized resume.

Candidate Details:
Name: ${name}
Contact: ${contact}
Skills: ${skills}
Experience: ${experience}
Target Role: ${role}
Job Description: ${jobDescription}

Instructions:
- ${styleInstruction}
- Use strong action verbs
- Include measurable achievements
- Match keywords from job description
- Keep it concise and impactful
- Structure in sections:
1. Summary
2. Skills
3. Experience
4. Projects
5. Contact Info

Return clean formatted text only.
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!data.choices) {
      return NextResponse.json(
        {
          error: "AI response error",
          details: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result:
        data.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}