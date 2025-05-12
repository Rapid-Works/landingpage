// Function to submit data to Airtable
export const submitToAirtable = async ({ email, service, notes = '' }) => {
  const apiKey = 'patFi7iCFm2Fc7OXN.d485d6f0d50ee40db49ba528838de34dd53b98f7771c855daca2c281467adea6';
  const baseId = 'appYmDZQRkTIJBLH4';
  const tableName = 'Table 1';

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Email: email,
          Service: service, 
          Notes: notes
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit data to Airtable: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting to Airtable:", error);
    throw error;
  }
};

// Function to submit webinar registration data to Airtable
export const submitWebinarRegistrationToAirtable = async ({ name, email, phone, questions, selectedDate, selectedDateString }) => {
  const apiKey = 'patFi7iCFm2Fc7OXN.d485d6f0d50ee40db49ba528838de34dd53b98f7771c855daca2c281467adea6'; // Use the same API key
  const baseId = 'appYmDZQRkTIJBLH4'; // Use the same Base ID
  const tableName = 'Webinar'; // Specific table for webinar registrations

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          // Map the input data to Airtable field names
          // Ensure these field names exactly match your Airtable column names
          'Name': name,
          'Email': email,
          'Phone': phone || '', // Send empty string if phone is optional and not provided
          'Questions': questions || '', // Send empty string if questions are optional
          'Selected Date': selectedDate, // Send the original date/timestamp to the Date field
          'Selected Display Time': selectedDateString, // +++ Send the formatted string to the new text field +++
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable Error Details:", errorData);
      throw new Error(`Failed to submit webinar registration to Airtable: ${response.statusText} (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting webinar registration to Airtable:", error);
    throw error; // Re-throw the error to be handled by the calling component
  }
};

// Function to submit partner interest data to Airtable
export const submitPartnerInterestToAirtable = async ({ email, partnerNeedsString }) => {
  const apiKey = 'patFi7iCFm2Fc7OXN.d485d6f0d50ee40db49ba528838de34dd53b98f7771c855daca2c281467adea6'; // Use the same API key
  const baseId = 'appYmDZQRkTIJBLH4'; // Use the same Base ID
  const tableName = 'Partners'; // Specific table for partner interest

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          // Map the input data to Airtable field names
          // Ensure these field names exactly match your Airtable column names
          'Email': email,
          // Store the structured partner needs in a 'Notes' or similar field
          'Partner Needs': partnerNeedsString,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable Error Details:", errorData);
      throw new Error(`Failed to submit partner interest to Airtable: ${response.statusText} (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting partner interest to Airtable:", error);
    throw error; // Re-throw the error to be handled by the calling component
  }
};

// Function to submit expert request data to Airtable
export const submitExpertRequestToAirtable = async ({ email, expertType }) => {
  const apiKey = 'patFi7iCFm2Fc7OXN.d485d6f0d50ee40db49ba528838de34dd53b98f7771c855daca2c281467adea6'; // Use the same API key
  const baseId = 'appYmDZQRkTIJBLH4'; // Use the same Base ID
  const tableName = 'Expert Request'; // **NEW TABLE NAME**

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          // Map the input data to Airtable field names
          // Ensure these field names exactly match your Airtable column names
          'Email': email,
          'Type': expertType, // The type of expert requested
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable Error Details:", errorData);
      throw new Error(`Failed to submit expert request to Airtable: ${response.statusText} (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting expert request to Airtable:", error);
    throw error; // Re-throw the error to be handled by the calling component
  }
}; 