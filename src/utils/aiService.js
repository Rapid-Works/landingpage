import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

// AI Chat Service using Firebase Functions
export const chatWithAI = async (message, language = 'de') => {
  try {
    const chatFunction = httpsCallable(functions, 'chatWithAI');
    const result = await chatFunction({
      message: message,
      language: language
    });
    
    return result.data;
  } catch (error) {
    console.error("Error calling AI chat function:", error);
    throw error;
  }
};

// Helper function to handle AI responses with error handling
export const sendMessageToAI = async (message, language = 'de') => {
  try {
    const response = await chatWithAI(message, language);
    
    if (response.success) {
      return response.response;
    } else {
      throw new Error('AI response was not successful');
    }
  } catch (error) {
    console.error("Error sending message to AI:", error);
    // Return a fallback response in case of error
    return "I apologize, but I'm having trouble processing your request right now. Please try again later or contact our team directly for assistance.";
  }
}; 