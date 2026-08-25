import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface PatientRiskInput {
  patientId: string;
  symptoms: string[] | string;
  village: string;
  waterQuality: string;
  referralStatus: string;
}

export interface RiskResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  reason: string;
}

/**
 * Calculates a patient risk score using the Google Gemini API (gemini-1.5-flash)
 * in JSON response mode, and stores the outcome document in the "RiskScores" collection in Firestore.
 *
 * @param patientData Object containing patient health indicators.
 * @returns A promise resolving to the risk score details.
 */
export async function calculateRiskScore(patientData: PatientRiskInput): Promise<RiskResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not defined. Please add it to your .env file.');
  }

  // Initialize the Gemini API client
  const genAI = new GoogleGenerativeAI(apiKey);

  // Use gemini-1.5-flash model and configure JSON output mode
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const prompt = `
Analyze the following patient and village health indicators and calculate an AI Risk Score.
Assign a riskLevel of "Low", "Medium", or "High" and provide a brief plain-English reasoning explaining the assessment.

Return exactly a JSON object matching this schema:
{
  "riskLevel": "Low" | "Medium" | "High",
  "reason": "a short plain-English explanation of why this risk level was given"
}

Health data to assess:
- Symptoms: ${Array.isArray(patientData.symptoms) ? patientData.symptoms.join(', ') : patientData.symptoms}
- Village: ${patientData.village}
- Water Quality status: ${patientData.waterQuality}
- Referral status: ${patientData.referralStatus}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON response
    const parsedResult = JSON.parse(text) as RiskResult;

    if (!parsedResult.riskLevel || !parsedResult.reason) {
      throw new Error('Invalid JSON format returned from Gemini model.');
    }

    // Save the result into Firestore collection "RiskScores"
    const riskScoresCol = collection(db, 'RiskScores');
    await addDoc(riskScoresCol, {
      patientId: patientData.patientId || 'unknown-patient',
      riskLevel: parsedResult.riskLevel,
      reason: parsedResult.reason,
      timestamp: serverTimestamp()
    });

    return parsedResult;
  } catch (error) {
    console.error('Error in calculateRiskScore:', error);
    throw error;
  }
}

// Expose testing helpers to the window console for verification
if (typeof window !== 'undefined') {
  (window as any).calculateRiskScore = calculateRiskScore;
  (window as any).runRiskScoreTest = async (testId?: string) => {
    const dummyPatient: PatientRiskInput = {
      patientId: testId || `test-patient-${Math.floor(Math.random() * 100000)}`,
      symptoms: ['acute fever', 'persistent cough', 'severe dehydration'],
      village: 'Neelambur',
      waterQuality: 'Poor (contaminated/unboiled supply)',
      referralStatus: 'Awaiting Action'
    };

    console.log('Starting AI Risk Score Test Call...');
    console.log('Input Patient Data:', dummyPatient);

    try {
      const result = await calculateRiskScore(dummyPatient);
      console.log('%cAI Risk Score Test Completed Successfully!', 'color: #10b981; font-weight: bold;');
      console.log('Result payload:', result);
      return result;
    } catch (error) {
      console.log('%cAI Risk Score Test Failed!', 'color: #ef4444; font-weight: bold;');
      console.error(error);
      throw error;
    }
  };

  console.log('aiRisk service loaded! Run "runRiskScoreTest()" in this console to verify.');
}
