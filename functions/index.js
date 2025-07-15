const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

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
