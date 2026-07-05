const labels = ["smoke", "traffic", "garbage", "dust", "industrial", "chemical"] as const;
export type Label = (typeof labels)[number];

export type ClassificationResult = {
  valid: boolean;
  label: Label;
  reason: string;
};

export async function classifyEnvironmentImage(imageDataUrl: string): Promise<ClassificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const label = labels[Math.floor(Math.random() * labels.length)];
  return {
    valid: true,
    label,
    reason: "Mock classification result",
  };
}
