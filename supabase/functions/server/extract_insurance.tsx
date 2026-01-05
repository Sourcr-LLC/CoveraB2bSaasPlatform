// Helper function to extract insurance data from document using OpenAI
export async function extractInsuranceDataFromDocument(fileBuffer: ArrayBuffer, fileType: string) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  let extractionPrompt = '';
  let requestBody: any = {};

  if (fileType === 'application/pdf') {
    // For PDFs, extract text using pdf-parse
    console.log('📄 Extracting text from PDF...');
    
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
      // This won't be perfect but better than nothing
      const uint8Array = new Uint8Array(fileBuffer);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawText = decoder.decode(uint8Array);
      
      // Extract readable ASCII text (very basic fallback)
      pdfText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      
      if (!pdfText || pdfText.length < 50) {
        console.error('⚠️ Could not extract meaningful text from PDF');
        // Return empty structure rather than throwing
        return {
          expirationDate: null,
          policies: [],
          insuredName: null,
          certificateHolder: null
        };
      }
      
      console.log('📝 Fallback text extraction length:', pdfText.length);
    }
    
    // Use GPT-4o to analyze the extracted text
    extractionPrompt = `You are extracting information from a Certificate of Insurance (COI) document. Below is the TEXT extracted from the PDF. You MUST only extract information that is clearly present in this text. DO NOT make up, guess, or infer any information.

CRITICAL RULES:
1. ONLY extract data that you can clearly see in the text
2. If a field is not visible, not readable, or unclear, set it to null
3. DO NOT infer or calculate any dates
4. Use the EXACT dates shown in the text
5. Convert dates to YYYY-MM-DD format ONLY if you can clearly read them
6. If date format is ambiguous, use null

Return a JSON object with this EXACT structure:

{
  "expirationDate": "YYYY-MM-DD of the EARLIEST clearly visible policy expiration date, or null if not found",
  "policies": [
    {
      "type": "EXACT name of policy type as shown (e.g., COMMERCIAL GENERAL LIABILITY, WORKERS COMPENSATION, etc.)",
      "coverageLimit": "Numeric value of coverage limit without $ or commas, or null if not visible",
      "expiryDate": "YYYY-MM-DD format of expiration date EXACTLY as shown, or null if not found",
      "carrier": "Insurance carrier company name EXACTLY as shown, or null if not visible",
      "policyNumber": "Policy number EXACTLY as shown, or null if not visible"
    }
  ],
  "insuredName": "Name of insured party EXACTLY as shown, or null",
  "certificateHolder": "Certificate holder name EXACTLY as shown, or null"
}

IMPORTANT FOR DATES:
- Look for dates near "POLICY EXP", "EXPIRATION", "EXP DATE" keywords
- Common format: MM/DD/YYYY or MM/DD/YY
- Convert to YYYY-MM-DD format
- If you see "01/15/2026" convert to "2026-01-15"
- If date is unclear or not readable, use null

IMPORTANT FOR POLICY TYPES:
- Use EXACT wording: "COMMERCIAL GENERAL LIABILITY", "AUTOMOBILE LIABILITY", "WORKERS COMPENSATION", "UMBRELLA LIAB", etc.
- Do not rename or standardize them

IMPORTANT FOR COVERAGE LIMITS:
- Look for numbers near "EACH OCCURRENCE", "AGGREGATE", "COMBINED SINGLE LIMIT"
- Extract only the number (e.g., if you see "$1,000,000" return 1000000)
- If multiple limits exist, use the primary/occurrence limit
- If unclear, use null

PDF TEXT CONTENT:
${pdfText}

Return ONLY valid JSON. If the document is not a valid COI or data cannot be extracted, return:
{"expirationDate": null, "policies": [], "insuredName": null, "certificateHolder": null}`;

    requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert insurance document parser that ONLY extracts data that is clearly visible in text. You NEVER make up, infer, or guess information. If data is not clearly visible, you return null for that field."
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
    
    extractionPrompt = `You are extracting information from a Certificate of Insurance (COI) image. You MUST only extract information that is clearly visible and readable in the image. DO NOT make up, guess, or infer any information.

CRITICAL RULES:
1. ONLY extract data that you can clearly see in the image
2. If a field is not visible, not readable, or unclear, set it to null
3. DO NOT infer or calculate any dates
4. Use the EXACT dates shown on the certificate
5. Convert dates to YYYY-MM-DD format ONLY if you can clearly read them
6. If date format is ambiguous, use null

Return a JSON object with this EXACT structure:

{
  "expirationDate": "YYYY-MM-DD of the EARLIEST clearly visible policy expiration date, or null if not found",
  "policies": [
    {
      "type": "EXACT name of policy type as shown (e.g., COMMERCIAL GENERAL LIABILITY, WORKERS COMPENSATION, etc.)",
      "coverageLimit": "Numeric value of coverage limit without $ or commas, or null if not visible",
      "expiryDate": "YYYY-MM-DD format of expiration date EXACTLY as shown, or null if not found",
      "carrier": "Insurance carrier company name EXACTLY as shown, or null if not visible",
      "policyNumber": "Policy number EXACTLY as shown, or null if not visible"
    }
  ],
  "insuredName": "Name of insured party EXACTLY as shown, or null",
  "certificateHolder": "Certificate holder name EXACTLY as shown, or null"
}

IMPORTANT FOR DATES:
- Look in the "POLICY EXP DATE" or "EXPIRATION DATE" columns
- Common format on COI: MM/DD/YYYY
- Convert to YYYY-MM-DD format
- If you see "01/15/2026" convert to "2026-01-15"
- If date is unclear or not readable, use null

IMPORTANT FOR POLICY TYPES:
- Use EXACT wording from certificate: "COMMERCIAL GENERAL LIABILITY", "AUTOMOBILE LIABILITY", "WORKERS COMPENSATION", "UMBRELLA LIAB", etc.
- Do not rename or standardize them

IMPORTANT FOR COVERAGE LIMITS:
- Look for "EACH OCCURRENCE", "AGGREGATE", "COMBINED SINGLE LIMIT" columns
- Extract only the number (e.g., if you see "$1,000,000" return 1000000)
- If multiple limits exist, use the primary/occurrence limit
- If unclear, use null

Return ONLY valid JSON. If the image is not a valid COI or data cannot be extracted, return:
{"expirationDate": null, "policies": [], "insuredName": null, "certificateHolder": null}`;

    requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert insurance document parser that ONLY extracts data that is clearly visible in documents. You NEVER make up, infer, or guess information. If data is not clearly visible, you return null for that field."
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
    throw new Error('Failed to extract insurance data from document');
  }

  const data = await response.json();
  const extractedText = data.choices[0]?.message?.content;

  if (!extractedText) {
    throw new Error('No data extracted from document');
  }

  // Parse the JSON response
  const parsedData = JSON.parse(extractedText);
  
  // Validate that we got something meaningful
  if (!parsedData.policies || parsedData.policies.length === 0) {
    console.warn('⚠️ No insurance policies could be extracted from document');
  }
  
  return parsedData;
}