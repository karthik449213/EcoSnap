// Placeholder module for action classification that can be replaced by real AI logic later

export interface ClassificationResult {
  predictedAction: string;
  confidenceScore: number;
  difficultyAdjustment: number; // percentage to adjust difficulty by (e.g. 0.1 for +10%)
}

export async function classifyEcoAction(imageUri: string): Promise<ClassificationResult> {
  // currently returns a dummy result; in future integrate with OpenAI Vision, TensorFlow, etc.
  // To keep behaviour consistent, we simply return a random prediction with low confidence.

  const possible = ['recycling', 'composting', 'public_transport', 'zero_plastic_day'];
  const predicted = possible[Math.floor(Math.random() * possible.length)];
  const confidence = Math.random() * 0.5 + 0.3; // 0.3 - 0.8
  const difficultyAdjustment = confidence > 0.8 ? 0.1 : 0;
  return { predictedAction: predicted, confidenceScore: confidence, difficultyAdjustment };
}
