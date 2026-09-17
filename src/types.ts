export interface PatientInput {
  age: number;
  sex: 0 | 1; // 0 = Female, 1 = Male
  on_thyroxine: 0 | 1;
  query_on_thyroxine: 0 | 1;
  on_antithyroid_medication: 0 | 1;
  sick: 0 | 1;
  pregnant: 0 | 1;
  thyroid_surgery: 0 | 1;
  i131_treatment: 0 | 1;
  query_hypothyroid: 0 | 1;
  query_hyperthyroid: 0 | 1;
  lithium: 0 | 1;
  goitre: 0 | 1;
  tumor: 0 | 1;
  hypopituitary: 0 | 1;
  psych: 0 | 1;
  tsh_measured: 0 | 1;
  tsh: number;
  t3_measured: 0 | 1;
  tt4_measured: 0 | 1;
  tt4: number;
  t4u_measured: 0 | 1;
  t4u: number;
  fti_measured: 0 | 1;
  fti: number;
}

export type RiskTier = 'Low Risk (Negative)' | 'Borderline / Subclinical' | 'High Risk (Hypothyroid)';

export interface BiomarkerStatus {
  value: number;
  measured: boolean;
  unit: string;
  normalRange: string;
  status: 'low' | 'normal' | 'elevated' | 'severely_elevated' | 'high';
  clinicalMeaning: string;
}

export interface ContributingFactor {
  feature: string;
  label: string;
  value: string | number;
  direction: 'increases_risk' | 'decreases_risk' | 'neutral';
  weight: number; // relative weight magnitude
  clinicalNote: string;
}

export interface PredictionResult {
  probability: number; // 0.0 - 1.0
  probabilityPercent: number; // 0.0 - 100.0%
  predictedClass: 'Negative' | 'Hypothyroid';
  riskTier: RiskTier;
  confidenceScore: number;
  biomarkers: {
    tsh: BiomarkerStatus;
    tt4: BiomarkerStatus;
    t4u: BiomarkerStatus;
    fti: BiomarkerStatus;
  };
  keyFactors: ContributingFactor[];
  clinicalRecommendations: string[];
}

export interface PatientRecord {
  id: string;
  patientCode: string;
  patientName?: string;
  createdAt: string;
  input: PatientInput;
  prediction: PredictionResult;
  clinicalNotes?: string;
}

export interface PatientPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  data: PatientInput;
}

export interface EpochMetric {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  trainAcc: number;
  valAcc: number;
}

export interface ModelMetadata {
  architecture: string;
  totalFeatures: number;
  epochsRun: number;
  earlyStoppingEpoch: number;
  testAccuracy: number;
  testF1: number;
  testAuc: number;
  confusionMatrix: {
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
    truePositive: number;
    total: number;
  };
  classificationReport: {
    negative: { precision: number; recall: number; f1: number; support: number };
    hypothyroid: { precision: number; recall: number; f1: number; support: number };
    overallAccuracy: number;
  };
  datasetStats: {
    cleanRows: number;
    rawRows: number;
    totalCombined: number;
    duplicatesDropped: number;
    finalRows: number;
    negativeCount: number;
    hypothyroidCount: number;
    imbalanceRatio: string;
    posWeight: number;
  };
}
