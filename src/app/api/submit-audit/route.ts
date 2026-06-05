import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  let firstName = "";
  let lastName = "";
  let email = "";
  let gdprConsent = false;
  let quizAnswers = null;

  try {
    // 1. Parse JSON body
    const body = await req.json();
    firstName = body.firstName;
    lastName = body.lastName;
    email = body.email;
    gdprConsent = body.gdprConsent;
    quizAnswers = body.quizAnswers;

    // Trim string inputs to avoid whitespace-only submissions
    const trimmedFirstName = typeof firstName === "string" ? firstName.trim() : "";
    const trimmedLastName = typeof lastName === "string" ? lastName.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";

    // 2. Validate payload
    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !gdprConsent || !quizAnswers) {
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
    if (!emailRegex.test(trimmedEmail)) {
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
      Sentry.captureMessage("N8N_WEBHOOK_URL environment variable is missing", "error");
      return NextResponse.json(
        { 
          success: false, 
          error: "Server configuration error. Webhook endpoint is not set up." 
        },
        { status: 500 }
      );
    }

    // 4. Send request to n8n webhook
    console.log(`[Submit Audit] Forwarding payload for ${trimmedEmail} to n8n webhook.`);
    console.log(`[DEBUG] Webhook URL exactly evaluated as: "${webhookUrl}"`);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        gdprConsent,
        submittedAt: new Date().toISOString(),
        quizAnswers,
      }),
    });

    console.log(`[DEBUG] Webhook Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.log(`[DEBUG] Webhook Response Body: ${responseText}`);
      console.error(`[Submit Audit Error] n8n responded with status ${response.status}: ${responseText}`);
      
      Sentry.captureMessage(`n8n webhook failed with status ${response.status}`, {
        level: "error",
        extra: {
          status: response.status,
          responseText,
          email: trimmedEmail,
        }
      });

      let errorMessage = `Failed to submit data to n8n workflow (status: ${response.status}).`;
      if (response.status === 404) {
        errorMessage = "n8n webhook not found. Check workflow active state, webhook path, and whether you are using production or test URL.";
      }

      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage
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
    Sentry.captureException(error, {
      extra: {
        email,
        firstName,
        lastName,
        quizAnswers,
      }
    });
    return NextResponse.json(
      { 
        success: false, 
        error: "An unexpected internal server error occurred while processing your request." 
      },
      { status: 500 }
    );
  }
}
