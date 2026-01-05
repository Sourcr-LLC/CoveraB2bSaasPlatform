// Helper function to extract contract data from document using OpenAI
export async function extractContractDataFromDocument(fileBuffer: ArrayBuffer, fileType: string) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  let extractionPrompt = '';
  let requestBody: any = {};

  if (fileType === 'application/pdf') {
    // For PDFs, extract text using pdf-parse
    console.log('📄 Extracting text from PDF contract...');
    
    let pdfText = '';
    
    try {
      // Import Buffer from node:buffer for Deno
      const { Buffer } = await import('node:buffer');
      
      // Use pdf-parse to extract text from PDF
      const { default: pdfParse } = await import('npm:pdf-parse@1.1.1');
      const pdfBuffer = Buffer.from(fileBuffer);
      const pdfData = await pdfParse(pdfBuffer);
      pdfText = pdfData.text;
      console.log('✅ Extracted PDF text length:', pdfText.length);
      console.log('📝 PDF text preview:', pdfText.substring(0, 500));
    } catch (parseError) {
      console.error('PDF parsing error:', parseError);
      console.warn('⚠️ PDF text extraction failed, falling back to basic extraction');
      
      // Fallback: Try to extract any readable text using a simple approach
      const uint8Array = new Uint8Array(fileBuffer);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawText = decoder.decode(uint8Array);
      
      // Extract readable ASCII text (very basic fallback)
      pdfText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      
      if (!pdfText || pdfText.length < 50) {
        console.error('⚠️ Could not extract meaningful text from PDF');
        // Return empty structure rather than throwing
        return {
          contractType: null,
          startDate: null,
          endDate: null,
          value: null,
          autoRenewal: false,
          parties: [],
          description: null
        };
      }
      
      console.log('📝 Fallback text extraction length:', pdfText.length);
    }
    
    // Use GPT-4o to analyze the extracted text
    extractionPrompt = `You are extracting information from a CONTRACT document. Below is the TEXT extracted from the PDF. You MUST only extract information that is clearly present in this text. DO NOT make up, guess, or infer any information.

CRITICAL RULES:
1. ONLY extract data that you can clearly see in the text
2. If a field is not visible, not readable, or unclear, set it to null
3. DO NOT infer or calculate any dates
4. Use the EXACT dates shown in the text
5. Convert dates to YYYY-MM-DD format ONLY if you can clearly read them
6. If date format is ambiguous, use null

Return a JSON object with this EXACT structure:

{
  "contractType": "Type of contract (e.g., Service Agreement, NDA, Purchase Order, MSA, etc.) or null if not found",
  "startDate": "YYYY-MM-DD format of contract effective/start date, or null if not found",
  "endDate": "YYYY-MM-DD format of contract expiration/end date, or null if not found",
  "value": "Numeric value of contract without $ or commas (e.g., 50000 for $50,000), or null if not visible",
  "autoRenewal": true or false based on whether auto-renewal clause is present,
  "parties": [
    {
      "name": "Name of party/organization EXACTLY as shown",
      "role": "Role (e.g., Client, Vendor, Service Provider, etc.)"
    }
  ],
  "description": "Brief summary of contract purpose/scope in 1-2 sentences, or null if unclear"
}

IMPORTANT FOR DATES:
- Look for dates near "EFFECTIVE DATE", "START DATE", "EXECUTION DATE", "EXPIRATION", "TERM" keywords
- Common format: MM/DD/YYYY or MM/DD/YY
- Convert to YYYY-MM-DD format
- If you see "01/15/2026" convert to "2026-01-15"
- If date is unclear or not readable, use null

IMPORTANT FOR CONTRACT TYPES:
- Common types: "Service Agreement", "Master Service Agreement", "Non-Disclosure Agreement", "Purchase Order", "Consulting Agreement", "Maintenance Contract", "Software License", etc.
- Use standard naming if possible

IMPORTANT FOR CONTRACT VALUE:
- Look for "TOTAL", "CONTRACT VALUE", "AMOUNT", "PAYMENT" sections
- Extract only the number (e.g., if you see "$50,000.00" return 50000)
- If unclear or variable pricing, use null

IMPORTANT FOR AUTO-RENEWAL:
- Look for keywords: "auto-renew", "automatic renewal", "evergreen", "shall renew automatically"
- If found, return true. Otherwise false.

IMPORTANT FOR PARTIES:
- Usually found at the beginning under "PARTIES", "BETWEEN", "THIS AGREEMENT IS MADE BETWEEN"
- Extract company/individual names and their roles

PDF TEXT CONTENT:
${pdfText}

Return ONLY valid JSON. If the document is not a valid contract or data cannot be extracted, return:
{"contractType": null, "startDate": null, "endDate": null, "value": null, "autoRenewal": false, "parties": [], "description": null}`;

    requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert contract document parser that ONLY extracts data that is clearly visible in text. You NEVER make up, infer, or guess information. If data is not clearly visible, you return null for that field."
        },
        {
          role: "user",
          content: extractionPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 2000,
    };
  } else {
    // For images (PNG, JPG), use vision API
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
    const mimeType = fileType === 'image/png' ? 'image/png' : 'image/jpeg';
    
    extractionPrompt = `You are extracting information from a CONTRACT document image. You MUST only extract information that is clearly visible and readable in the image. DO NOT make up, guess, or infer any information.

CRITICAL RULES:
1. ONLY extract data that you can clearly see in the image
2. If a field is not visible, not readable, or unclear, set it to null
3. DO NOT infer or calculate any dates
4. Use the EXACT dates shown on the document
5. Convert dates to YYYY-MM-DD format ONLY if you can clearly read them
6. If date format is ambiguous, use null

Return a JSON object with this EXACT structure:

{
  "contractType": "Type of contract (e.g., Service Agreement, NDA, Purchase Order, MSA, etc.) or null if not found",
  "startDate": "YYYY-MM-DD format of contract effective/start date, or null if not found",
  "endDate": "YYYY-MM-DD format of contract expiration/end date, or null if not found",
  "value": "Numeric value of contract without $ or commas (e.g., 50000 for $50,000), or null if not visible",
  "autoRenewal": true or false based on whether auto-renewal clause is present,
  "parties": [
    {
      "name": "Name of party/organization EXACTLY as shown",
      "role": "Role (e.g., Client, Vendor, Service Provider, etc.)"
    }
  ],
  "description": "Brief summary of contract purpose/scope in 1-2 sentences, or null if unclear"
}

IMPORTANT FOR DATES:
- Look for "EFFECTIVE DATE", "START DATE", "EXECUTION DATE", "EXPIRATION", "TERM" sections
- Common format: MM/DD/YYYY
- Convert to YYYY-MM-DD format
- If you see "01/15/2026" convert to "2026-01-15"
- If date is unclear or not readable, use null

IMPORTANT FOR CONTRACT TYPES:
- Common types: "Service Agreement", "Master Service Agreement", "Non-Disclosure Agreement", "Purchase Order", "Consulting Agreement", "Maintenance Contract", "Software License"
- Use standard naming if possible

IMPORTANT FOR CONTRACT VALUE:
- Look for "TOTAL", "CONTRACT VALUE", "AMOUNT", "PAYMENT" sections
- Extract only the number (e.g., if you see "$50,000.00" return 50000)
- If unclear or variable pricing, use null

IMPORTANT FOR AUTO-RENEWAL:
- Look for keywords: "auto-renew", "automatic renewal", "evergreen", "shall renew automatically"
- If found, return true. Otherwise false.

Return ONLY valid JSON. If the image is not a valid contract or data cannot be extracted, return:
{"contractType": null, "startDate": null, "endDate": null, "value": null, "autoRenewal": false, "parties": [], "description": null}`;

    requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert contract document parser that ONLY extracts data that is clearly visible in documents. You NEVER make up, infer, or guess information. If data is not clearly visible, you return null for that field."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: extractionPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 2000,
    };
  }

  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', errorText);
    throw new Error('Failed to extract contract data from document');
  }

  const data = await response.json();
  const extractedText = data.choices[0]?.message?.content;

  if (!extractedText) {
    throw new Error('No data extracted from document');
  }

  // Parse the JSON response
  const parsedData = JSON.parse(extractedText);
  
  // Validate that we got something meaningful
  if (!parsedData.contractType && !parsedData.startDate && !parsedData.endDate) {
    console.warn('⚠️ No contract data could be extracted from document');
  }
  
  return parsedData;
}
