/**
 * Simple rule-based triage logic to calculate clinical urgency from patient symptoms.
 *
 * @param symptoms A string or an array of symptom strings.
 * @returns Urgency level: "Emergency" | "Soon" | "Routine"
 */
export function checkUrgency(symptoms: string | string[]): 'Emergency' | 'Soon' | 'Routine' {
  // Normalize symptoms to lowercase string for reliable keyword matching
  const symptomsStr = Array.isArray(symptoms) ? symptoms.join(' ').toLowerCase() : symptoms.toLowerCase();

  // 1. Emergency Symptoms (Immediate attention required)
  const emergencyKeywords = [
    'chest pain',
    'breathing difficulty',
    'difficulty breathing',
    'shortness of breath',
    'severe bleeding',
    'unconscious',
    'loss of consciousness',
    'stroke',
    'seizure',
    'stiff neck',
    'poisoning',
    'anaphylaxis'
  ];

  // 2. Soon Symptoms (Attention needed within a few hours)
  const soonKeywords = [
    'fever',
    'vomiting',
    'abdominal pain',
    'stomach pain',
    'high bp',
    'high blood pressure',
    'fracture',
    'sprain',
    'deep cut',
    'severe headache',
    'dizziness'
  ];

  // Check matching keywords in precedence order
  const matchesKeyword = (keywords: string[]) => keywords.some((keyword) => symptomsStr.includes(keyword));

  if (matchesKeyword(emergencyKeywords)) {
    return 'Emergency';
  }

  if (matchesKeyword(soonKeywords)) {
    return 'Soon';
  }

  return 'Routine';
}

// Console testing helpers
if (typeof window !== 'undefined') {
  (window as any).checkUrgency = checkUrgency;
  (window as any).runTriageTest = () => {
    console.log('Running Digital Triage Urgency Level Test Cases...');

    const testCases = [
      {
        symptoms: ['cough', 'mild headache'],
        expected: 'Routine',
        desc: 'Routine cold symptoms'
      },
      {
        symptoms: 'High fever and persistent vomiting for 2 days',
        expected: 'Soon',
        desc: 'Soon classification due to fever/vomiting'
      },
      {
        symptoms: ['chest pain', 'shortness of breath'],
        expected: 'Emergency',
        desc: 'Emergency classification due to critical indicators'
      },
      {
        symptoms: 'Unconscious patient after a fall',
        expected: 'Emergency',
        desc: 'Emergency classification due to unconsciousness'
      }
    ];

    testCases.forEach((tc, idx) => {
      const result = checkUrgency(tc.symptoms);
      const passed = result === tc.expected;
      const statusColor = passed ? 'color: #10b981; font-weight: bold;' : 'color: #ef4444; font-weight: bold;';
      console.log(
        `Test Case #${idx + 1}: ${tc.desc}\n` +
          `  Symptoms: "${Array.isArray(tc.symptoms) ? tc.symptoms.join(', ') : tc.symptoms}"\n` +
          `  Expected: "${tc.expected}" | Got: "${result}" -> ` +
          `%c${passed ? 'PASSED' : 'FAILED'}`,
        statusColor
      );
    });
  };

  console.log('triage service loaded! Call runTriageTest() in console to verify test cases.');
}
