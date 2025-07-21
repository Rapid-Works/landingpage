const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const {GoogleGenerativeAI} = require("@google/generative-ai");

admin.initializeApp();

const db = admin.firestore();

// Helper function to submit data to Airtable
const submitToAirtableTable = async (tableName, fields) => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error("Airtable API key or Base ID not configured");
  }

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: fields,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable Error Details:", errorData);
      const errorMessage = `Failed to submit data to Airtable: ` +
        `${response.statusText} (Status: ${response.status})`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting to Airtable:", error);
    throw error;
  }
};

// Callable function for general service requests
exports.submitServiceRequest = onCall(async (request) => {
  const {email, service, notes = ""} = request.data;

  if (!email || !service) {
    throw new Error("Email and service are required");
  }

  try {
    const result = await submitToAirtableTable("Table 1", {
      "Email": email,
      "Service": service,
      "Notes": notes,
    });

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitServiceRequest:", error);
    throw new Error(`Failed to submit service request: ${error.message}`);
  }
});

// Callable function for webinar registrations
exports.submitWebinarRegistration = onCall(async (request) => {
  const {
    name,
    email,
    phone,
    questions,
    selectedDate,
    selectedDateString,
  } = request.data;

  if (!name || !email || !selectedDate) {
    throw new Error("Name, email, and selected date are required");
  }

  try {
    const result = await submitToAirtableTable("Webinar", {
      "Name": name,
      "Email": email,
      "Phone": phone || "",
      "Questions": questions || "",
      "Selected Date": selectedDate,
      "Selected Display Time": selectedDateString,
    });

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitWebinarRegistration:", error);
    const errorMessage = `Failed to submit webinar registration: ` +
      `${error.message}`;
    throw new Error(errorMessage);
  }
});

// Callable function for partner interest
exports.submitPartnerInterest = onCall(async (request) => {
  const {email, partnerNeedsString} = request.data;

  if (!email || !partnerNeedsString) {
    throw new Error("Email and partner needs are required");
  }

  try {
    const result = await submitToAirtableTable("Partners", {
      "Email": email,
      "Partner Needs": partnerNeedsString,
    });

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitPartnerInterest:", error);
    throw new Error(`Failed to submit partner interest: ${error.message}`);
  }
});

// Callable function for expert requests
exports.submitExpertRequest = onCall(async (request) => {
  const {email, expertType} = request.data;

  if (!email || !expertType) {
    throw new Error("Email and expert type are required");
  }

  try {
    const result = await submitToAirtableTable("Expert Request", {
      "Email": email,
      "Type": expertType,
    });

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitExpertRequest:", error);
    throw new Error(`Failed to submit expert request: ${error.message}`);
  }
});

// Callable function for newsletter subscriptions
exports.submitNewsletterSubscription = onCall(async (request) => {
  const {email} = request.data;

  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const result = await submitToAirtableTable("Newsletter", {
      "Email": email,
    });

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitNewsletterSubscription:", error);
    const errorMessage = `Failed to submit newsletter subscription: ` +
      `${error.message}`;
    throw new Error(errorMessage);
  }
});

// Callable function for AI prompt logging
exports.submitAIPrompt = onCall(async (request) => {
  const {
    userPrompt,
    aiResponse,
    language,
    sessionId,
    userEmail,
    timestamp,
  } = request.data;

  if (!userPrompt || !aiResponse) {
    throw new Error("User prompt and AI response are required");
  }

  try {
    const result = await submitToAirtableTable("AI user prompts", {
      "User Prompt": userPrompt,
      "AI Response": aiResponse,
      "Language": language || "de",
      "Session ID": sessionId || "",
      "User Email": userEmail || "",
      "Timestamp": timestamp || new Date().toISOString(),
    });

    return {success: true, data: result};
  } catch (error) {
    console.error("Error in submitAIPrompt:", error);
    throw new Error(`Failed to submit AI prompt: ${error.message}`);
  }
});

// Alternative: Firestore-triggered functions
exports.onServiceRequestCreated = onDocumentCreated(
    "serviceRequests/{requestId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const requestData = snapshot.data();

      try {
        await submitToAirtableTable("Table 1", {
          "Email": requestData.email,
          "Service": requestData.service,
          "Notes": requestData.notes || "",
        });

        // Update the document to mark as synced
        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Service request synced to Airtable successfully");
      } catch (error) {
        console.error("Failed to sync service request to Airtable:", error);

        // Update the document to mark sync failure
        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

exports.onWebinarRegistrationCreated = onDocumentCreated(
    "webinarRegistrations/{registrationId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const registrationData = snapshot.data();

      try {
        await submitToAirtableTable("Webinar", {
          "Name": registrationData.name,
          "Email": registrationData.email,
          "Phone": registrationData.phone || "",
          "Questions": registrationData.questions || "",
          "Selected Date": registrationData.selectedDate,
          "Selected Display Time": registrationData.selectedDateString,
        });

        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Webinar registration synced to Airtable successfully");
      } catch (error) {
        const errorMessage = "Failed to sync webinar registration to " +
          "Airtable:";
        console.error(errorMessage, error);

        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

exports.onPartnerInterestCreated = onDocumentCreated(
    "partnerInterests/{interestId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const interestData = snapshot.data();

      try {
        await submitToAirtableTable("Partners", {
          "Email": interestData.email,
          "Partner Needs": interestData.partnerNeedsString,
        });

        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Partner interest synced to Airtable successfully");
      } catch (error) {
        console.error("Failed to sync partner interest to Airtable:", error);

        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

exports.onExpertRequestCreated = onDocumentCreated(
    "expertRequests/{requestId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const requestData = snapshot.data();

      try {
        await submitToAirtableTable("Expert Request", {
          "Email": requestData.email,
          "Type": requestData.expertType,
        });

        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Expert request synced to Airtable successfully");
      } catch (error) {
        console.error("Failed to sync expert request to Airtable:", error);

        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

exports.onAIPromptCreated = onDocumentCreated(
    "aiPrompts/{promptId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }

      const promptData = snapshot.data();

      try {
        await submitToAirtableTable("AI user prompts", {
          "User Prompt": promptData.userPrompt,
          "AI Response": promptData.aiResponse,
          "Language": promptData.language || "de",
          "Session ID": promptData.sessionId || "",
          "User Email": promptData.userEmail || "",
          "Timestamp": promptData.createdAt ?
            promptData.createdAt.toDate().toISOString() :
            new Date().toISOString(),
        });

        await snapshot.ref.update({
          syncedToAirtable: true,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("AI prompt synced to Airtable successfully");
      } catch (error) {
        console.error("Failed to sync AI prompt to Airtable:", error);

        await snapshot.ref.update({
          syncedToAirtable: false,
          syncError: error.message,
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

// Your existing blog notification function
exports.sendNewBlogNotification = onDocumentCreated(
    "blogs/{blogId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        return;
      }
      const blogData = snapshot.data();

      const title = blogData.title || "New Post!";
      const content = blogData.excerpt || "Check out our latest article.";
      const blogSlug = blogData.slug || event.params.blogId;
      const blogUrl = `https://www.rapid-works.io/blogs/${blogSlug}`;

      const tokensSnapshot = await db.collection("fcmTokens").get();
      const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

      if (tokens.length === 0) {
        return;
      }

      try {
        const messages = tokens.map((token) => ({
          token,
          notification: {
            title,
            body: content,
          },
          webpush: {
            notification: {
              title,
              body: content,
              icon: "https://www.rapid-works.io/opengraphimage.png",
              badge: "https://www.rapid-works.io/logo192.png",
              actions: [
                {action: "open_blog", title: "Read Now"},
              ],
            },
            fcmOptions: {
              link: blogUrl,
            },
          },
          data: {
            url: blogUrl,
            title: title,
            excerpt: content,
            slug: blogSlug,
          },
        }));

        const response = await admin.messaging().sendEach(messages);

        const tokensToRemove = [];
        response.responses.forEach((result, index) => {
          if (!result.success) {
            const error = result.error;
            console.error("Error sending to token:", tokens[index], error);
            const invalidTokenCodes = [
              "messaging/invalid-registration-token",
              "messaging/registration-token-not-registered",
            ];
            if (invalidTokenCodes.includes(error.code)) {
              tokensToRemove.push(
                  db.collection("fcmTokens")
                      .where("token", "==", tokens[index])
                      .get()
                      .then((snapshot) => {
                        snapshot.docs.forEach((doc) => doc.ref.delete());
                      }),
              );
            }
          }
        });

        return Promise.all(tokensToRemove);
      } catch (error) {
        console.error("Error sending notifications:", error);
        throw error;
      }
    },
);

// Callable function for AI chat using Gemini
exports.chatWithAI = onCall(async (request) => {
  const {message, language = "de"} = request.data;

  if (!message) {
    throw new Error("Message is required");
  }

  const apiKey = process.env.GEMINI_API_KEY ||
    "AIzaSyCkcAo0KV6xD7v9FoEiL8sUsdQ1wTjOmf4";
  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});

    // Context about RapidWorks
    const systemContext = `You are Rapi, the AI Assistant for RapidWorks, ` +
      `a platform that helps startups in Germany find the right experts, ` +
      `secure funding, receive coaching, develop MVPs, launch products, ` +
      `and grow sustainably.

ROLE & MISSION:
Your mission is to answer user questions, explain services, help identify ` +
      `the right solutions for their situation, and guide them toward the ` +
      `next best steps (webinar, consultation, or form submission).

PRIMARY RESPONSIBILITIES:
• Respond to questions about RapidWorks services: Branding, Coaching, ` +
      `Experts, Financing, MVP, Partners
• Explain prices, timeframes, and package details
• Provide technical support and ongoing collaboration information
• Explain why these services are essential for founders
• Share the mission, background, and unique approach of RapidWorks
• Discuss geographic coverage (Germany, with future expansion)
• Explain funding application support (up to €300,000, no commissions)
• Discuss available Developers, Designers, Marketing, and Finance experts

IMPORTANT PROMOTION:
At every suitable opportunity, mention that every two weeks, we host a ` +
      `free "Rapid Answers" webinar where founders can get all their ` +
      `questions answered. Invite users to sign up via the website.

FREE OFFERS:
1. Free call with RapidWorks via navigation bar button - all questions ` +
      `about services answered free of charge
2. "Rapid Answers" Webinars every 2 weeks with CEO Yannick (founder ` +
      `of 3 startups) answering startup questions live
3. Try one "Rapid Expert" for free for 1 hour (call or task)
4. "Rapid Financing" - show founders lucrative startup subsidies ` +
      `and help create applications completely free

SERVICES & PRICING:
• Rapid Branding: Entry-level service at €999 fixed price
• Customizations: €40/hour
• Lean startup methodology coaching
• Demand validation before expensive product development

FINANCING:
• All German businesses eligible for €100,000 in Deminimis Funding ` +
      `per year
• Up to €300,000 over 3 years in grants
• Help founders use this potential early
• Show most lucrative subsidies they could receive

KEY DIFFERENTIATORS:
• Full transparency
• Full cost control
• Holistic approach
• Capital-efficient methods
• Focused around startups and founders

TONE & STYLE:
• Supportive, friendly, professional
• Act like a coach or mentor
• Use clear, simple language focused on founder needs
• Keep responses short and easy to understand for small chat window
• Break information into bullet points if needed
• If question too general - ask clarifying question

COACHING APPROACH:
If user appears uncertain or lost:
• Be supportive, ask about their main bottleneck
• Suggest relevant solutions
• If no solution fits - recommend webinar or free consultation

LANGUAGES:
Communicate in either German or English, automatically based on the ` +
      `user's language.

DATA HANDLING:
• Never ask for or store personal data
• If users offer personal info - politely decline
• Chat history saved anonymously for internal analysis

LIMITATIONS:
If user asks about something unrelated to RapidWorks, politely explain ` +
      `that you only respond to questions about RapidWorks services.

GREETING:
When starting conversations: "Hi! 👋 Welcome to RapidWorks — your ` +
      `startup's all-in-one support hub 🚀 We help founders in Germany ` +
      `with everything from branding and MVP building to funding, coaching, ` +
      `and expert matching — all capital-efficient, transparent, and ` +
      `startup-focused. How can I support you today?"

IMPORTANT: Always respond in ${language === "de" ? "German" : "English"} ` +
      `language. User interface language is ${language}.`;


    const prompt = `${systemContext}\n\nUser Question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      response: text,
    };
  } catch (error) {
    console.error("Error with Gemini AI:", error);
    throw new Error("Failed to process AI request");
  }
});
