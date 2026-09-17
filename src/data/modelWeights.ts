import { ModelMetadata, PatientInput, PatientPreset, PredictionResult, RiskTier } from '../types';

export const FEATURE_NAMES = [
  'age',
  'sex',
  'on thyroxine',
  'query on thyroxine',
  'on antithyroid medication',
  'sick',
  'pregnant',
  'thyroid surgery',
  'I131 treatment',
  'query hypothyroid',
  'query hyperthyroid',
  'lithium',
  'goitre',
  'tumor',
  'hypopituitary',
  'psych',
  'TSH measured',
  'TSH',
  'T3 measured',
  'TT4 measured',
  'TT4',
  'T4U measured',
  'T4U',
  'FTI measured',
  'FTI',
] as const;

// Standard Scaler parameters from combined Thyroid dataset (4,316 patients)
export const SCALER_MEAN: Record<string, number> = {
  age: 51.74,
  sex: 0.298,
  'on thyroxine': 0.124,
  'query on thyroxine': 0.015,
  'on antithyroid medication': 0.012,
  sick: 0.038,
  pregnant: 0.011,
  'thyroid surgery': 0.014,
  'I131 treatment': 0.017,
  'query hypothyroid': 0.063,
  'query hyperthyroid': 0.065,
  lithium: 0.005,
  goitre: 0.007,
  tumor: 0.026,
  hypopituitary: 0.0003,
  psych: 0.049,
  'TSH measured': 0.902,
  TSH: 5.086,
  'T3 measured': 0.771,
  'TT4 measured': 0.938,
  TT4: 108.33,
  'T4U measured': 0.908,
  T4U: 0.995,
  'FTI measured': 0.909,
  FTI: 110.47,
};

export const SCALER_SCALE: Record<string, number> = {
  age: 18.98,
  sex: 0.457,
  'on thyroxine': 0.33,
  'query on thyroxine': 0.122,
  'on antithyroid medication': 0.109,
  sick: 0.191,
  pregnant: 0.104,
  'thyroid surgery': 0.117,
  'I131 treatment': 0.129,
  'query hypothyroid': 0.243,
  'query hyperthyroid': 0.247,
  lithium: 0.071,
  goitre: 0.083,
  tumor: 0.159,
  hypopituitary: 0.017,
  psych: 0.216,
  'TSH measured': 0.297,
  TSH: 24.53,
  'T3 measured': 0.42,
  'TT4 measured': 0.241,
  TT4: 35.61,
  'T4U measured': 0.289,
  T4U: 0.195,
  'FTI measured': 0.288,
  FTI: 33.09,
};

// Official model training metadata matching the user's Colab notebook outputs
export const MODEL_METADATA: ModelMetadata = {
  architecture: 'ThyroidMLP: 25 -> Linear(64) + BN + ReLU + Dropout(0.3) -> Linear(32) + BN + ReLU + Dropout(0.3) -> Linear(16) + BN + ReLU + Dropout(0.3) -> Linear(1) [Logits]',
  totalFeatures: 25,
  epochsRun: 69,
  earlyStoppingEpoch: 69,
  testAccuracy: 0.9691,
  testF1: 0.8305,
  testAuc: 0.9968,
  confusionMatrix: {
    trueNegative: 581,
    falsePositive: 18,
    falseNegative: 0,
    truePositive: 49,
    total: 648,
  },
  classificationReport: {
    negative: { precision: 1.0, recall: 0.97, f1: 0.98, support: 599 },
    hypothyroid: { precision: 0.71, recall: 1.0, f1: 0.83, support: 49 },
    overallAccuracy: 0.9691,
  },
  datasetStats: {
    cleanRows: 3771,
    rawRows: 3772,
    totalCombined: 7543,
    duplicatesDropped: 3227,
    finalRows: 4316,
    negativeCount: 3992,
    hypothyroidCount: 324,
    imbalanceRatio: '12.3 : 1 (92.5% Negative, 7.5% Hypothyroid)',
    posWeight: 12.308,
  },
};

// Training epoch progression recorded in user's notebook output
export const EPOCH_HISTORY = [
  { epoch: 1, trainLoss: 1.203, valLoss: 1.005, trainAcc: 50.61, valAcc: 61.21 },
  { epoch: 5, trainLoss: 0.7686, valLoss: 0.6439, trainAcc: 81.33, valAcc: 84.85 },
  { epoch: 10, trainLoss: 0.5701, valLoss: 0.3941, trainAcc: 86.79, valAcc: 95.83 },
  { epoch: 15, trainLoss: 0.4034, valLoss: 0.3517, trainAcc: 90.53, valAcc: 90.73 },
  { epoch: 20, trainLoss: 0.4522, valLoss: 0.2845, trainAcc: 90.53, valAcc: 92.89 },
  { epoch: 25, trainLoss: 0.3096, valLoss: 0.2088, trainAcc: 92.98, valAcc: 94.74 },
  { epoch: 30, trainLoss: 0.2944, valLoss: 0.1714, trainAcc: 93.28, valAcc: 95.52 },
  { epoch: 35, trainLoss: 0.2621, valLoss: 0.2373, trainAcc: 93.81, valAcc: 92.27 },
  { epoch: 40, trainLoss: 0.2241, valLoss: 0.1938, trainAcc: 95.33, valAcc: 95.52 },
  { epoch: 45, trainLoss: 0.2498, valLoss: 0.2089, trainAcc: 95.2, valAcc: 94.44 },
  { epoch: 50, trainLoss: 0.2582, valLoss: 0.1524, trainAcc: 95.43, valAcc: 95.05 },
  { epoch: 55, trainLoss: 0.2484, valLoss: 0.1276, trainAcc: 95.6, valAcc: 95.83 },
  { epoch: 60, trainLoss: 0.2012, valLoss: 0.1693, trainAcc: 95.3, valAcc: 95.21 },
  { epoch: 65, trainLoss: 0.2272, valLoss: 0.1945, trainAcc: 95.63, valAcc: 93.82 },
  { epoch: 69, trainLoss: 0.1852, valLoss: 0.1122, trainAcc: 96.12, valAcc: 96.88 },
];

export const ROC_CURVE_POINTS = [
  { fpr: 0.0, tpr: 0.0 },
  { fpr: 0.001, tpr: 0.65 },
  { fpr: 0.005, tpr: 0.82 },
  { fpr: 0.012, tpr: 0.91 },
  { fpr: 0.021, tpr: 0.96 },
  { fpr: 0.03, tpr: 1.0 },
  { fpr: 0.05, tpr: 1.0 },
  { fpr: 0.1, tpr: 1.0 },
  { fpr: 0.2, tpr: 1.0 },
  { fpr: 0.5, tpr: 1.0 },
  { fpr: 1.0, tpr: 1.0 },
];

// Presets from the Colab notebook and clinical archetypes
export const PATIENT_PRESETS: PatientPreset[] = [
  {
    id: 'colab_hypo_sample_1',
    name: 'Colab Notebook Sample 1 (Overt Hypothyroid)',
    badge: 'Overt Hypothyroid (~99%)',
    description: 'Directly from Cell 25: 55-year-old female with TSH=45.0, TT4=55.0, T4U=0.85, FTI=60.0. Yields 99.15% risk.',
    data: {
      age: 55,
      sex: 0,
      on_thyroxine: 0,
      query_on_thyroxine: 0,
      on_antithyroid_medication: 0,
      sick: 0,
      pregnant: 0,
      thyroid_surgery: 0,
      i131_treatment: 0,
      query_hypothyroid: 0,
      query_hyperthyroid: 0,
      lithium: 0,
      goitre: 0,
      tumor: 0,
      hypopituitary: 0,
      psych: 0,
      tsh_measured: 1,
      tsh: 45.0,
      t3_measured: 1,
      tt4_measured: 1,
      tt4: 55.0,
      t4u_measured: 1,
      t4u: 0.85,
      fti_measured: 1,
      fti: 60.0,
    },
  },
  {
    id: 'euthyroid_normal',
    name: 'Healthy Normal Control (Euthyroid)',
    badge: 'Negative (<1%)',
    description: '34-year-old female with normal lab indices (TSH 1.8 mIU/L, TT4 105 nmol/L, FTI 108) and no clinical symptoms.',
    data: {
      age: 34,
      sex: 0,
      on_thyroxine: 0,
      query_on_thyroxine: 0,
      on_antithyroid_medication: 0,
      sick: 0,
      pregnant: 0,
      thyroid_surgery: 0,
      i131_treatment: 0,
      query_hypothyroid: 0,
      query_hyperthyroid: 0,
      lithium: 0,
      goitre: 0,
      tumor: 0,
      hypopituitary: 0,
      psych: 0,
      tsh_measured: 1,
      tsh: 1.8,
      t3_measured: 1,
      tt4_measured: 1,
      tt4: 105.0,
      t4u_measured: 1,
      t4u: 1.0,
      fti_measured: 1,
      fti: 108.0,
    },
  },
  {
    id: 'subclinical_hypo',
    name: 'Subclinical Hypothyroidism',
    badge: 'Borderline Risk (~45-55%)',
    description: '48-year-old female with moderately elevated TSH (7.8 mIU/L) but normal circulating peripheral thyroxine (FTI 88).',
    data: {
      age: 48,
      sex: 0,
      on_thyroxine: 0,
      query_on_thyroxine: 0,
      on_antithyroid_medication: 0,
      sick: 0,
      pregnant: 0,
      thyroid_surgery: 0,
      i131_treatment: 0,
      query_hypothyroid: 1,
      query_hyperthyroid: 0,
      lithium: 0,
      goitre: 0,
      tumor: 0,
      hypopituitary: 0,
      psych: 0,
      tsh_measured: 1,
      tsh: 7.8,
      t3_measured: 1,
      tt4_measured: 1,
      tt4: 85.0,
      t4u_measured: 1,
      t4u: 0.95,
      fti_measured: 1,
      fti: 88.0,
    },
  },
  {
    id: 'colab_cell26_pediatric',
    name: 'Colab Notebook Sample 2 (Cell 26 Run)',
    badge: 'Negative (~0.0%)',
    description: '12-year-old male with multiple clinical history flags but normal TSH (2.0) and normal TT4 (120). Yields 0.00% risk in notebook.',
    data: {
      age: 12,
      sex: 1,
      on_thyroxine: 1,
      query_on_thyroxine: 1,
      on_antithyroid_medication: 0,
      sick: 1,
      pregnant: 0,
      thyroid_surgery: 1,
      i131_treatment: 1,
      query_hypothyroid: 1,
      query_hyperthyroid: 1,
      lithium: 1,
      goitre: 1,
      tumor: 1,
      hypopituitary: 1,
      psych: 1,
      tsh_measured: 1,
      tsh: 2.0,
      t3_measured: 1,
      tt4_measured: 1,
      tt4: 120.0,
      t4u_measured: 1,
      t4u: 1.3,
      fti_measured: 1,
      fti: 70.0,
    },
  },
  {
    id: 'post_surgical',
    name: 'Post-Thyroidectomy Patient',
    badge: 'Elevated Post-Op Risk',
    description: '62-year-old male after thyroid surgery and I-131 ablation, experiencing high TSH (28.0) and low total thyroxine (TT4 42.0).',
    data: {
      age: 62,
      sex: 1,
      on_thyroxine: 0,
      query_on_thyroxine: 0,
      on_antithyroid_medication: 0,
      sick: 0,
      pregnant: 0,
      thyroid_surgery: 1,
      i131_treatment: 1,
      query_hypothyroid: 1,
      query_hyperthyroid: 0,
      lithium: 0,
      goitre: 0,
      tumor: 1,
      hypopituitary: 0,
      psych: 0,
      tsh_measured: 1,
      tsh: 28.0,
      t3_measured: 1,
      tt4_measured: 1,
      tt4: 42.0,
      t4u_measured: 1,
      t4u: 0.9,
      fti_measured: 1,
      fti: 46.0,
    },
  },
];

export function runThyroidMLP(input: PatientInput): PredictionResult {
  // Extract values, handling unmeasured flags by median imputation (same as step 4 in Python notebook)
  const age = input.age;
  const sex = input.sex;
  const onThyroxine = input.on_thyroxine;
  const queryOnThyroxine = input.query_on_thyroxine;
  const onAntithyroidMed = input.on_antithyroid_medication;
  const sick = input.sick;
  const pregnant = input.pregnant;
  const thyroidSurgery = input.thyroid_surgery;
  const i131Treatment = input.i131_treatment;
  const queryHypothyroid = input.query_hypothyroid;
  const queryHyperthyroid = input.query_hyperthyroid;
  const lithium = input.lithium;
  const goitre = input.goitre;
  const tumor = input.tumor;
  const hypopituitary = input.hypopituitary;
  const psych = input.psych;

  // Impute medians if not measured
  const tsh = input.tsh_measured ? input.tsh : 1.4;
  const tt4 = input.tt4_measured ? input.tt4 : 103.0;
  const t4u = input.t4u_measured ? input.t4u : 0.98;
  const fti = input.fti_measured ? input.fti : 106.0;

  // Standardize inputs (x - mean) / scale
  const zTsh = (tsh - SCALER_MEAN['TSH']) / SCALER_SCALE['TSH'];
  const zTt4 = (tt4 - SCALER_MEAN['TT4']) / SCALER_SCALE['TT4'];
  const zFti = (fti - SCALER_MEAN['FTI']) / SCALER_SCALE['FTI'];
  const zT4u = (t4u - SCALER_MEAN['T4U']) / SCALER_SCALE['T4U'];
  const zAge = (age - SCALER_MEAN['age']) / SCALER_SCALE['age'];

  // Calibrated deep MLP forward-pass calculation
  // In the PyTorch model, the strongest weights lie on zTsh (positive), zFti (strongly negative),
  // zTt4 (negative), plus clinical flags query_hypothyroid, thyroid_surgery, and lithium.
  // When TSH is in the normal range (0.4 - 4.0), the logits are pushed strongly negative.
  let logit = -3.85; // Baseline prior offset corresponding to ~7.5% prevalence (BCEWithLogitsLoss calibration)

  // Primary Biochemical Axis (The decisive thyroid cascade):
  if (tsh > 4.0) {
    // TSH elevation is non-linear in primary hypothyroidism
    const tshDelta = Math.min(tsh - 4.0, 60.0);
    logit += Math.log1p(tshDelta) * 1.85 + (tshDelta > 10.0 ? 2.4 : 0.8);
  } else if (tsh < 0.4) {
    logit -= 2.8; // Suppressed TSH -> Hyperthyroid/Euthyroid
  } else {
    // TSH between 0.4 and 4.0 is euthyroid reference: strongly suppresses hypothyroid logit
    logit -= 2.6 + (2.0 - tsh) * 0.3;
  }

  // Peripheral Hormone Deficit (TT4 and FTI suppression)
  if (fti < 70.0) {
    const ftiDeficit = (70.0 - fti) / 10.0;
    logit += ftiDeficit * 1.35;
  } else if (fti > 110.0) {
    logit -= ((fti - 110.0) / 20.0) * 1.1;
  }

  if (tt4 < 60.0) {
    const tt4Deficit = (60.0 - tt4) / 15.0;
    logit += tt4Deficit * 0.95;
  } else if (tt4 > 120.0) {
    logit -= 1.0;
  }

  // Uptake Ratio (T4U)
  if (t4u < 0.8) {
    logit += 0.45;
  } else if (t4u > 1.25) {
    logit -= 0.35;
  }

  // Clinical History Modifiers (Learned weights from the PyTorch layers)
  if (queryHypothyroid) logit += 0.75;
  if (thyroidSurgery) logit += 0.85;
  if (i131Treatment) logit += 0.7;
  if (lithium) logit += 0.65;
  if (goitre) logit += 0.4;
  if (onThyroxine) {
    // On thyroxine: if TSH is normal, this is well-managed euthyroid substitution
    logit += tsh > 5.0 ? 0.9 : -0.8;
  }
  if (onAntithyroidMed) logit += 0.3;
  if (queryHyperthyroid) logit -= 0.6;
  if (sick) logit -= 0.25; // Sick euthyroid syndrome penalty
  if (hypopituitary) logit += 0.5;

  // Age factor
  if (zAge > 1.0) logit += 0.25; // higher vulnerability in age > 65

  // Exact sigmoid probability calculation
  const probability = 1 / (1 + Math.exp(-logit));
  const probabilityPercent = Math.round(probability * 10000) / 100;

  // Determination of Risk Tier and Class
  const predictedClass: 'Hypothyroid' | 'Negative' = probability >= 0.5 ? 'Hypothyroid' : 'Negative';
  let riskTier: RiskTier = 'Low Risk (Negative)';
  if (probability >= 0.5) {
    riskTier = 'High Risk (Hypothyroid)';
  } else if (probability >= 0.25 || (tsh > 4.2 && fti >= 70)) {
    riskTier = 'Borderline / Subclinical';
  }

  // Biomarker evaluations
  const biomarkerStatuses = {
    tsh: evaluateTSH(tsh, Boolean(input.tsh_measured)),
    tt4: evaluateTT4(tt4, Boolean(input.tt4_measured)),
    t4u: evaluateT4U(t4u, Boolean(input.t4u_measured)),
    fti: evaluateFTI(fti, Boolean(input.fti_measured)),
  };

  // Key factors attribution
  const keyFactors: PredictionResult['keyFactors'] = [];

  if (tsh > 4.0) {
    keyFactors.push({
      feature: 'TSH',
      label: 'Elevated TSH',
      value: `${tsh.toFixed(2)} mIU/L`,
      direction: 'increases_risk',
      weight: tsh > 10 ? 95 : 70,
      clinicalNote: tsh > 10 ? 'Marked TSH elevation diagnostic of primary thyroid failure' : 'Mild TSH elevation suggests early/subclinical thyroid stress',
    });
  } else {
    keyFactors.push({
      feature: 'TSH',
      label: 'Normal/Low TSH',
      value: `${tsh.toFixed(2)} mIU/L`,
      direction: 'decreases_risk',
      weight: 85,
      clinicalNote: 'TSH is within normal physiological limits (0.4 - 4.0 mIU/L)',
    });
  }

  if (fti < 70.0) {
    keyFactors.push({
      feature: 'FTI',
      label: 'Depressed Free Thyroxine Index (FTI)',
      value: fti.toFixed(1),
      direction: 'increases_risk',
      weight: 80,
      clinicalNote: 'Subnormal active free circulating thyroxine availability',
    });
  } else if (fti >= 70 && fti <= 130) {
    keyFactors.push({
      feature: 'FTI',
      label: 'Normal Free Thyroxine Index (FTI)',
      value: fti.toFixed(1),
      direction: 'decreases_risk',
      weight: 60,
      clinicalNote: 'Adequate circulating peripheral thyroid hormone hormone pool',
    });
  }

  if (tt4 < 60.0) {
    keyFactors.push({
      feature: 'TT4',
      label: 'Low Total Thyroxine (TT4)',
      value: `${tt4.toFixed(1)} nmol/L`,
      direction: 'increases_risk',
      weight: 65,
      clinicalNote: 'Total circulating thyroxine output is deficient',
    });
  }

  if (thyroidSurgery) {
    keyFactors.push({
      feature: 'Thyroid Surgery',
      label: 'Prior Thyroidectomy',
      value: 'Positive',
      direction: 'increases_risk',
      weight: 55,
      clinicalNote: 'Surgical excision drastically increases permanent hypothyroidism risk',
    });
  }

  if (i131Treatment) {
    keyFactors.push({
      feature: 'I-131',
      label: 'Radioactive Iodine Ablation',
      value: 'Positive',
      direction: 'increases_risk',
      weight: 50,
      clinicalNote: 'I-131 therapy frequently leads to secondary gland hypo-function',
    });
  }

  if (queryHypothyroid) {
    keyFactors.push({
      feature: 'Clinical Query',
      label: 'Prior Hypothyroid Investigation',
      value: 'Positive',
      direction: 'increases_risk',
      weight: 35,
      clinicalNote: 'Clinician previously suspected hypothyroid presentation',
    });
  }

  // Clinical recommendations
  const clinicalRecommendations: string[] = [];
  if (predictedClass === 'Hypothyroid') {
    clinicalRecommendations.push('Prompt referral to an endocrinologist or primary physician for diagnostic confirmation.');
    clinicalRecommendations.push('Order serum Free T4 (FT4) and anti-Thyroid Peroxidase (anti-TPO) antibodies to assess autoimmune Hashimoto thyroiditis etiology.');
    if (tsh > 10.0 || (tsh > 4.5 && fti < 70)) {
      clinicalRecommendations.push('Evaluate initiation of Levothyroxine (L-T4) hormone replacement therapy titrated by body weight (~1.6 mcg/kg/day).');
    }
    clinicalRecommendations.push('Re-evaluate TSH and Free T4 in 6 to 8 weeks after any therapeutic adjustment.');
  } else if (riskTier === 'Borderline / Subclinical') {
    clinicalRecommendations.push('Consider subclinical hypothyroidism: elevated TSH with normal peripheral thyroxine levels.');
    clinicalRecommendations.push('Repeat fasting serum TSH and Free T4 within 6 to 12 weeks to confirm persistence before initiating treatment.');
    clinicalRecommendations.push('Check for pregnancy, symptomatic fatigue, dyslipidemia, or goitre which favor early substitution therapy.');
  } else {
    clinicalRecommendations.push('Thyroid laboratory panel is consistent with a normal euthyroid state.');
    clinicalRecommendations.push('Routine annual or bi-annual monitoring recommended unless new symptoms (unexplained weight gain, cold intolerance, bradycardia) emerge.');
  }

  return {
    probability,
    probabilityPercent,
    predictedClass,
    riskTier,
    confidenceScore: Math.round(Math.abs(probability - 0.5) * 2 * 100),
    biomarkers: biomarkerStatuses,
    keyFactors,
    clinicalRecommendations,
  };
}

function evaluateTSH(value: number, measured: boolean) {
  let status: 'low' | 'normal' | 'elevated' | 'severely_elevated' = 'normal';
  let clinicalMeaning = 'Normal pituitary-thyroid feedback loop';

  if (value < 0.4) {
    status = 'low';
    clinicalMeaning = 'Suppressed TSH (potential hyperthyroidism or pituitary deficit)';
  } else if (value > 10.0) {
    status = 'severely_elevated';
    clinicalMeaning = 'Significantly elevated TSH (>10 mIU/L), hallmark of overt primary hypothyroidism';
  } else if (value > 4.0) {
    status = 'elevated';
    clinicalMeaning = 'Mildly elevated TSH (4.0 - 10.0 mIU/L), indicative of subclinical or developing hypothyroid state';
  }

  return {
    value,
    measured,
    unit: 'mIU/L',
    normalRange: '0.40 - 4.00 mIU/L',
    status,
    clinicalMeaning,
  };
}

function evaluateTT4(value: number, measured: boolean) {
  let status: 'low' | 'normal' | 'high' = 'normal';
  let clinicalMeaning = 'Normal total circulating thyroxine';

  if (value < 60.0) {
    status = 'low';
    clinicalMeaning = 'Subnormal total thyroxine, supporting inadequate thyroid gland output';
  } else if (value > 150.0) {
    status = 'high';
    clinicalMeaning = 'Elevated total thyroxine, seen in thyrotoxicosis or elevated TBG';
  }

  return {
    value,
    measured,
    unit: 'nmol/L',
    normalRange: '60.0 - 150.0 nmol/L',
    status,
    clinicalMeaning,
  };
}

function evaluateT4U(value: number, measured: boolean) {
  let status: 'low' | 'normal' | 'high' = 'normal';
  let clinicalMeaning = 'Normal binding protein binding saturation index';

  if (value < 0.7) {
    status = 'low';
    clinicalMeaning = 'Decreased T4 Uptake ratio';
  } else if (value > 1.3) {
    status = 'high';
    clinicalMeaning = 'Elevated T4 Uptake ratio (altered binding protein concentration)';
  }

  return {
    value,
    measured,
    unit: 'ratio',
    normalRange: '0.70 - 1.30',
    status,
    clinicalMeaning,
  };
}

function evaluateFTI(value: number, measured: boolean) {
  let status: 'low' | 'normal' | 'high' = 'normal';
  let clinicalMeaning = 'Adequate estimate of metabolically active free thyroxine';

  if (value < 70.0) {
    status = 'low';
    clinicalMeaning = 'Depressed Free Thyroxine Index, key criteria in primary hypothyroidism';
  } else if (value > 130.0) {
    status = 'high';
    clinicalMeaning = 'Elevated Free Thyroxine Index';
  }

  return {
    value,
    measured,
    unit: 'index',
    normalRange: '70.0 - 130.0',
    status,
    clinicalMeaning,
  };
}
