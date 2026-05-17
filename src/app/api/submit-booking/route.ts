import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  let name = "";
  let email = "";
  let orgSize = "";
  let environment = "";
  let compliance = "";
  let priority = "";
  let role = "";
  let timeline = "";
  let objective = "";

  try {
    // 1. Parse JSON body
    const body = await req.json();
    name = body.name;
    email = body.email;
    orgSize = body.orgSize;
    environment = body.environment;
    compliance = body.compliance;
    priority = body.priority;
    role = body.role;
    timeline = body.timeline;
    objective = body.objective;

    // Trim string inputs to avoid whitespace-only submissions
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedOrgSize = typeof orgSize === "string" ? orgSize.trim() : "";
    const trimmedEnvironment = typeof environment === "string" ? environment.trim() : "";
    const trimmedCompliance = typeof compliance === "string" ? compliance.trim() : "";
    const trimmedPriority = typeof priority === "string" ? priority.trim() : "";
    const trimmedRole = typeof role === "string" ? role.trim() : "";
    const trimmedTimeline = typeof timeline === "string" ? timeline.trim() : "";
    const trimmedObjective = typeof objective === "string" ? objective.trim() : "";

    // 2. Validate payload
    if (!trimmedName || !trimmedEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: name and email are required for lead capture." 
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
      console.error("[Submit Booking Lead Error] N8N_WEBHOOK_URL environment variable is not configured.");
      Sentry.captureMessage("N8N_WEBHOOK_URL environment variable is missing in lead capture", "error");
      return NextResponse.json(
        { 
          success: false, 
          error: "Server configuration error. Webhook endpoint is not set up." 
        },
        { status: 500 }
      );
    }

    // 4. Send request to n8n webhook
    console.log(`[Submit Booking Lead] Forwarding lead payload for ${trimmedEmail} to n8n webhook.`);
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadType: "Calendly Booking Pre-capture",
        name: trimmedName,
        email: trimmedEmail,
        orgSize: trimmedOrgSize,
        environment: trimmedEnvironment,
        compliance: trimmedCompliance,
        priority: trimmedPriority,
        role: trimmedRole,
        timeline: trimmedTimeline,
        objective: trimmedObjective,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error(`[Submit Booking Lead Error] n8n responded with status ${response.status}: ${responseText}`);
      
      Sentry.captureMessage(`n8n booking lead webhook failed with status ${response.status}`, {
        level: "error",
        extra: {
          status: response.status,
          responseText,
          email: trimmedEmail,
        }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to submit data to n8n workflow (status: ${response.status}).` 
        },
        { status: 502 }
      );
    }

    console.log(`[Submit Booking Lead Success] Lead payload successfully forwarded to n8n.`);
    return NextResponse.json(
      { 
        success: true, 
        message: "Lead successfully captured!" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[Submit Booking Lead Fatal Error]", error);
    Sentry.captureException(error, {
      extra: {
        email,
        name,
        orgSize,
        environment,
        compliance,
        priority,
        role,
        timeline,
        objective,
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
