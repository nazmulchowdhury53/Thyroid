import React, { useState } from 'react';
import { Code, Copy, Check, FileCode2, Terminal, Cpu, Activity } from 'lucide-react';

interface ColabCodeViewerModalProps {
  onClose?: () => void;
}

export const ColabCodeViewerModal: React.FC<ColabCodeViewerModalProps> = () => {
  const [activeSnippet, setActiveSnippet] = useState<'model' | 'train' | 'predict' | 'data'>('model');
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    model: `# ---------------- 11. PyTorch ThyroidMLP Model ----------------
import torch
import torch.nn as nn

class ThyroidMLP(nn.Module):
    def __init__(self, in_features, hidden=(64, 32, 16), dropout=0.3):
        super().__init__()
        layers = []
        prev = in_features
        for h in hidden:
            layers += [
                nn.Linear(prev, h),
                nn.BatchNorm1d(h),
                nn.ReLU(),
                nn.Dropout(dropout)
            ]
            prev = h
        layers += [nn.Linear(prev, 1)]  # Output raw logits
        self.net = nn.Sequential(*layers)

    def forward(self, x):
        return self.net(x)

# Model initialization for 25 input features
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = ThyroidMLP(in_features=25).to(device)`,

    train: `# ---------------- 10 & 12. Weighted Loss & Training Loop ----------------
# Class imbalance handling: pos_weight = neg / pos
n_neg = (y_train == 0).sum()  # 2794
n_pos = (y_train == 1).sum()  # 227
pos_weight = torch.tensor([n_neg / n_pos], dtype=torch.float32).to(device)  # 12.308

criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=5)

EPOCHS = 100
PATIENCE = 15  # Early stopping counter

# Early stopping triggered at Epoch 69 with Best Val Loss: 0.1122
# Test Accuracy: 96.91%, F1-Score: 0.8305, ROC-AUC: 0.9968`,

    predict: `# ---------------- 15 & 16. Inference Pipeline ----------------
# Load checkpoint & standardize sample
ckpt = torch.load('thyroid_mlp_model.pth', map_location='cpu')
mean, scale = ckpt['scaler_mean'], ckpt['scaler_scale']

# Sample patient laboratory & history inputs
sample = {
    'age': 55, 'sex': 0, 'on thyroxine': 0, 'query on thyroxine': 0,
    'on antithyroid medication': 0, 'sick': 0, 'pregnant': 0, 'thyroid surgery': 0,
    'I131 treatment': 0, 'query hypothyroid': 0, 'query hyperthyroid': 0, 'lithium': 0,
    'goitre': 0, 'tumor': 0, 'hypopituitary': 0, 'psych': 0,
    'TSH measured': 1, 'TSH': 45.0, 'T3 measured': 1, 'TT4 measured': 1, 'TT4': 55.0,
    'T4U measured': 1, 'T4U': 0.85, 'FTI measured': 1, 'FTI': 60.0
}

x = np.array([sample[f] for f in ckpt['feature_names']], dtype=np.float32)
x_scaled = (x - mean) / scale
x_t = torch.tensor(x_scaled, dtype=torch.float32).unsqueeze(0)

with torch.no_grad():
    prob = torch.sigmoid(model(x_t)).item()

label = 'Hypothyroid' if prob >= 0.5 else 'Negative'
print(f'Probability of hypothyroid: {prob:.4f} -> {label}')
# Output: Probability of hypothyroid: 0.9915 -> Hypothyroid`,

    data: `# ---------------- 1 to 4. Data Merge & Cleaning Pipeline ----------------
import pandas as pd
import numpy as np

# Merge cleaned dataset and raw hypothyroid dataset
df_clean = pd.read_csv('cleaned_dataset_Thyroid1.csv')  # (3771, 26)
df_raw   = pd.read_csv('hypothyroid.csv')               # (3772, 30)

# Align binary columns (t -> 1, f -> 0)
# Align sex (F -> 0, M -> 1)
# Impute remaining missing values with column medians:
for c in ['age', 'TSH', 'TT4', 'T4U', 'FTI']:
    df[c] = df[c].fillna(df[c].median())
df['sex'] = df['sex'].fillna(df['sex'].mode()[0])

# Combined: 7543 rows -> 4316 rows after dropping 3227 duplicates
# Class distribution: 0 (Negative): 3992 | 1 (Hypothyroid): 324`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeSnippet]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">Google Colab Notebook Source & Architecture</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Exact PyTorch model definitions, class weighting formula, and preprocessing script
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Python Snippet'}</span>
        </button>
      </div>

      {/* Snippet Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveSnippet('model')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSnippet === 'model'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>ThyroidMLP Architecture</span>
        </button>

        <button
          onClick={() => setActiveSnippet('train')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSnippet === 'train'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Weighted Training Loop</span>
        </button>

        <button
          onClick={() => setActiveSnippet('predict')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSnippet === 'predict'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Inference Script (Cells 25 & 26)</span>
        </button>

        <button
          onClick={() => setActiveSnippet('data')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSnippet === 'data'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Data Pipeline & Imputation</span>
        </button>
      </div>

      {/* Code Box */}
      <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto font-mono text-xs text-teal-300/90 leading-relaxed shadow-inner">
        <pre>{codeSnippets[activeSnippet]}</pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Input Tensor</span>
          <span className="font-mono text-white font-semibold">Shape: (Batch, 25) float32</span>
        </div>
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Regularization</span>
          <span className="font-mono text-white font-semibold">BatchNorm1d + Dropout(0.3)</span>
        </div>
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Weights Serialization</span>
          <span className="font-mono text-white font-semibold">thyroid_mlp_model.pth</span>
        </div>
      </div>
    </div>
  );
};
