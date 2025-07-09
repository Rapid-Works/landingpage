const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.sendNewBlogNotification = onDocumentCreated(
    "blogs/{blogId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        // console.log("No data associated with the event");
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
        // console.log("No notification tokens to send to.");
        return;
      }
      //  console.log("Sending notification to", tokens.length, "tokens.");

      try {
        const messages = tokens.map((token) => ({
          token,
          // Generic notification for mobile lock screens etc.
          notification: {
            title,
            body: content,
          },
          // Specific instructions for web browsers (Desktop & Android Chrome)
          webpush: {
            notification: {
              title, // Be explicit
              body: content,
              icon: "https://www.rapid-works.io/opengraphimage.png", // Custom notification icon
              badge: "https://www.rapid-works.io/logo192.png", // For mobile UI
              actions: [
                {action: "open_blog", title: "Read Now"},
              ],
            },
            fcmOptions: {
              link: blogUrl,
            },
          },
          // Custom data for your service worker to handle clicks
          data: {
            url: blogUrl,
            title: title,
            excerpt: content,
            slug: blogSlug,
          },
        }));

        const response = await admin.messaging().sendEach(messages);
        // console.log("Successfully sent messages:", response.successCount);
        // console.log("Failed to send messages:", response.failureCount);

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
