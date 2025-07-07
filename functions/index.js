const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.sendNewBlogNotification = onDocumentCreated(
    "blogs/{blogId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }
      const blogData = snapshot.data();

      const title = blogData.title || "New Post!";
      const content = blogData.summary || "Check out our latest article.";

      const tokensSnapshot = await db.collection("fcmTokens").get();
      const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

      if (tokens.length === 0) {
        console.log("No notification tokens to send to.");
        return;
      }

      console.log("Sending notification to", tokens.length, "tokens.");

      try {
        // Use the modern send method instead of sendToDevice
        const messages = tokens.map((token) => ({
          notification: {
            title: `New Blog Post: ${title}`,
            body: content,
          },
          webpush: {
            notification: {
              icon: "/logo192.png",
              click_action: "https://landingpage-606e9.web.app/blog",
            },
          },
          token: token,
        }));

        const response = await admin.messaging().sendEach(messages);
        console.log("Successfully sent messages:", response.successCount);
        console.log("Failed to send messages:", response.failureCount);

        // Clean up invalid tokens
        const tokensToRemove = [];
        response.responses.forEach((result, index) => {
          if (!result.success) {
            const error = result.error;
            console.error("Error sending to token:", tokens[index], error);
            if (error.code === "messaging/invalid-registration-token" ||
                error.code === "messaging/registration-token-not-registered") {
              // Find the document with this token and delete it
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
