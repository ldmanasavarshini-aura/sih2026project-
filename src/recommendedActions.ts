/**
 * Resolves list of recommended medical and preventive actions based on computed risk levels.
 *
 * @param riskLevel The target patient or village risk tier: "High" | "Medium" | "Low"
 * @returns Array of recommended action descriptions (strings).
 */
export function getRecommendedActions(riskLevel: 'High' | 'Medium' | 'Low' | string): string[] {
  // Normalize string for safety
  const level =
    typeof riskLevel === 'string'
      ? riskLevel.trim().charAt(0).toUpperCase() + riskLevel.trim().slice(1).toLowerCase()
      : '';

  switch (level) {
    case 'High':
      return ['Inspect water source', 'Screen community', 'Distribute safe water/medicine'];
    case 'Medium':
      return ['Increase monitoring', 'Send awareness alert'];
    case 'Low':
      return ['Continue routine monitoring'];
    default:
      console.warn(`Unrecognized risk level "${riskLevel}" passed to getRecommendedActions. Defaulting to empty suggestions.`);
      return [];
  }
}

// Console testing helpers
if (typeof window !== 'undefined') {
  (window as any).getRecommendedActions = getRecommendedActions;
  (window as any).runRecommendedActionsTest = () => {
    console.log('Running Recommended Actions Suggester Test Cases...');

    const testTiers = [
      { level: 'High', expectedCount: 3 },
      { level: 'medium', expectedCount: 2 }, // lower case safety test
      { level: 'Low', expectedCount: 1 },
      { level: 'Unknown', expectedCount: 0 }
    ];

    testTiers.forEach((tc, idx) => {
      const actions = getRecommendedActions(tc.level);
      const passed = actions.length === tc.expectedCount;
      const statusColor = passed ? 'color: #10b981; font-weight: bold;' : 'color: #ef4444; font-weight: bold;';
      console.log(
        `Test Case #${idx + 1}: Risk level "${tc.level}"\n` +
          `  Recommendations: [${actions.map((a) => `"${a}"`).join(', ')}]\n` +
          `  Expected Suggestions Count: ${tc.expectedCount} | Got: ${actions.length} -> ` +
          `%c${passed ? 'PASSED' : 'FAILED'}`,
        statusColor
      );
    });
  };

  console.log('recommendedActions service loaded! Call runRecommendedActionsTest() in console to verify.');
}
