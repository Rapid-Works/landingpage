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