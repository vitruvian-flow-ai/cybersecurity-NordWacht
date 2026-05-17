import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse JSON body
    const body = await req.json();
    const { firstName, lastName, email, gdprConsent, quizAnswers } = body;

    // 2. Validate payload
    if (!firstName || !lastName || !email || !gdprConsent || !quizAnswers) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: firstName, lastName, email, gdprConsent, and quizAnswers are all required." 
        },
        { status: 400 }
      );
    }

    if (typeof gdprConsent !== "boolean" || !gdprConsent) {
      return NextResponse.json(
        { 
          success: false, 
          error: "GDPR compliance consent is mandatory." 
        },
        { status: 400 }
      );
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid email address format." 
        },
        { status: 400 }
      );
    }

    // 3. Check environment variable
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[Submit Audit Error] N8N_WEBHOOK_URL environment variable is not configured.");
      return NextResponse.json(
        { 
          success: false, 
          error: "Server configuration error. Webhook endpoint is not set up." 
        },
        { status: 500 }
      );
    }

    // 4. Send request to n8n webhook
    console.log(`[Submit Audit] Forwarding payload for ${email} to n8n webhook.`);
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        gdprConsent,
        submittedAt: new Date().toISOString(),
        quizAnswers,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error(`[Submit Audit Error] n8n responded with status ${response.status}: ${responseText}`);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to submit data to n8n workflow (status: ${response.status}).` 
        },
        { status: 502 }
      );
    }

    console.log(`[Submit Audit Success] Payload successfully forwarded to n8n.`);
    return NextResponse.json(
      { 
        success: true, 
        message: "Your request has been successfully submitted!" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[Submit Audit Fatal Error]", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "An unexpected internal server error occurred while processing your request." 
      },
      { status: 500 }
    );
  }
}
