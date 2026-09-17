# ThyroidMLP — Hypothyroidism Diagnostic App

A web-based clinical decision-support application for **hypothyroidism risk prediction** using a trained **25-feature PyTorch Deep Multi-Layer Perceptron (MLP)** model.

The application provides an interactive patient-data calculator, hypothyroidism risk prediction, biomarker analysis, model-performance visualization, patient cohort management, medical-report generation, and access to the corresponding model/training information.

> **Important:** This application is intended for research, educational, and clinical decision-support purposes only. It is **not a replacement for a qualified physician, laboratory testing, or professional medical diagnosis**.

---

## 🚀 Project Overview

**ThyroidMLP** is designed to demonstrate how machine learning can be applied to thyroid-related clinical data for hypothyroidism risk prediction.

The system accepts demographic information, clinical history, and thyroid laboratory measurements and produces:

* Hypothyroidism probability
* Risk category
* Biomarker interpretation
* Prediction explanation
* Diagnostic summary
* Model performance information
* Patient cohort records
* Printable medical reports

The application uses a **25-feature Deep MLP architecture** based on a cleaned and combined thyroid dataset.

---

## 🧠 Machine Learning Model

### Model Architecture

The application is based on a PyTorch Deep MLP:

```text
25 Input Features
        ↓
Linear(64)
        ↓
Batch Normalization
        ↓
ReLU
        ↓
Dropout(0.3)
        ↓
Linear(32)
        ↓
Batch Normalization
        ↓
ReLU
        ↓
Dropout(0.3)
        ↓
Linear(16)
        ↓
Batch Normalization
        ↓
ReLU
        ↓
Dropout(0.3)
        ↓
Linear(1)
        ↓
Logit
        ↓
Sigmoid
        ↓
Hypothyroidism Probability
```

The model uses a binary classification approach:

```text
0 → Negative / Non-Hypothyroid
1 → Hypothyroid
```

---

## 📊 Model Performance

According to the training metadata included in the project:

| Metric          |     Result |
| --------------- | ---------: |
| Test Accuracy   | **96.91%** |
| Test F1 Score   | **83.05%** |
| Test ROC-AUC    | **99.68%** |
| Training Epochs |     **69** |
| Early Stopping  |   Epoch 69 |

### Confusion Matrix

|                    | Predicted Negative | Predicted Hypothyroid |
| ------------------ | -----------------: | --------------------: |
| Actual Negative    |                581 |                    18 |
| Actual Hypothyroid |                  0 |                    49 |

Total test samples:

```text
648
```

### Classification Report

| Class       | Precision | Recall |   F1 |
| ----------- | --------: | -----: | ---: |
| Negative    |      1.00 |   0.97 | 0.98 |
| Hypothyroid |      0.71 |   1.00 | 0.83 |

The model achieved **100% recall for the hypothyroid class on the included test evaluation**, while precision was lower because some negative cases were classified as hypothyroid.

---

## 🧬 Input Features

The model uses 25 input features:

### Demographic

1. Age
2. Sex

### Clinical History

3. On thyroxine
4. Query on thyroxine
5. On antithyroid medication
6. Sick
7. Pregnant
8. Thyroid surgery
9. I131 treatment
10. Query hypothyroid
11. Query hyperthyroid
12. Lithium
13. Goitre
14. Tumor
15. Hypopituitary
16. Psych

### Thyroid Measurements

17. TSH measured
18. TSH
19. T3 measured
20. TT4 measured
21. TT4
22. T4U measured
23. T4U
24. FTI measured
25. FTI

---

## 🔬 Biomarkers

The application analyzes important thyroid-related laboratory measurements, including:

### TSH

**Thyroid-Stimulating Hormone (TSH)** is an important marker used in thyroid-function assessment.

The application gives particular importance to TSH when calculating hypothyroidism risk.

### TT4

**Total Thyroxine (TT4)** represents the total amount of thyroxine in the blood.

### T4U

**T4 Uptake (T4U)** is a laboratory measurement historically used in thyroid-function assessment.

### FTI

**Free Thyroxine Index (FTI)** is an index related to circulating thyroid hormone availability.

---

## ⚙️ Data Preprocessing

The model implementation includes preprocessing based on the training pipeline.

### Standardization

Continuous variables are standardized using:

```text
z = (x - mean) / scale
```

The application stores the scaler parameters in:

```text
src/data/modelWeights.ts
```

### Missing Measurements

If certain laboratory measurements are not available, the application uses predefined median values for the model calculation.

Examples include:

```text
TSH → 1.4
TT4 → 103.0
T4U → 0.98
FTI → 106.0
```

---

## 📚 Dataset Statistics

The model metadata included in the project reports:

```text
Clean rows:              3,771
Raw rows:                3,772
Combined rows:           7,543
Duplicates removed:      3,227
Final dataset:            4,316
```

Class distribution:

```text
Negative:       3,992
Hypothyroid:      324
```

Approximate class distribution:

```text
Negative:        92.5%
Hypothyroid:      7.5%
```

Imbalance ratio:

```text
12.3 : 1
```

The training configuration includes a positive-class weight of approximately:

```text
12.308
```

This is intended to compensate for the strong class imbalance during binary classification training.

---

# 💻 Application Features

## 1. Patient Calculator

The calculator allows users to enter:

* Age
* Sex
* Clinical history
* Medication information
* Pregnancy status
* Thyroid surgery history
* I-131 treatment
* Goitre/tumor information
* TSH
* T3
* TT4
* T4U
* FTI

The entered information is passed through the ThyroidMLP prediction pipeline.

---

## 2. Hypothyroidism Risk Prediction

The application calculates a probability score and presents the prediction using an interactive probability meter.

The result includes information such as:

```text
Hypothyroidism Probability
Risk Level
Prediction Summary
Biomarker Information
```

---

## 3. Biomarker Gauges

Interactive biomarker gauges are provided for important thyroid measurements.

These help users visually inspect values such as:

```text
TSH
TT4
T4U
FTI
```

---

## 4. Diagnostic Result Card

The diagnostic result interface provides:

* Prediction probability
* Risk classification
* Clinical interpretation
* Relevant findings
* Diagnostic summary
* Report generation

---

## 5. Model Performance Dashboard

The application includes a dedicated model-performance section showing information such as:

* Test accuracy
* F1 score
* ROC-AUC
* Confusion matrix
* Classification report
* Training/validation history
* ROC curve
* Dataset statistics

This makes the application useful not only as a calculator but also as an ML research demonstration.

---

## 6. Patient Cohort Manager

The application contains a patient cohort-management interface.

It supports functionality such as:

* Viewing patient records
* Searching records
* Filtering records
* Inspecting predictions
* Deleting records
* Exporting cohort information

Sample patient records are included for demonstration purposes.

---

## 7. Medical Report Generation

The application can generate a structured medical-style report containing:

* Patient information
* Clinical inputs
* Biomarker values
* Prediction
* Risk interpretation
* Model information

The report can also be prepared for printing.

---

## 8. Input Testing Report

An additional testing interface allows different combinations of patient inputs to be evaluated.

This is useful for:

* Model demonstrations
* Research experiments
* Input testing
* Understanding prediction behavior

---

## 9. Preset Patients

Several predefined patient scenarios are included.

Examples include:

### Overt Hypothyroidism

A patient with:

```text
TSH = 45.0
TT4 = 55.0
FTI = 60.0
```

### Healthy / Euthyroid Control

Example values include:

```text
TSH = 1.8
TT4 = 105
FTI = 108
```

### Subclinical Hypothyroidism

Example:

```text
TSH = 7.8
TT4 = 85
FTI = 88
```

### Post-Thyroidectomy Patient

Example:

```text
TSH = 28
TT4 = 42
FTI = 46
```

These presets are intended for demonstration and testing.

---

 
# 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### UI / Icons

* Lucide React

### Machine Learning

* PyTorch model
* Deep Multi-Layer Perceptron
* Binary classification
* Standard scaling
* BCE-based training configuration

### Development

* Node.js
* npm

---

# 📦 Installation

## Prerequisites

Make sure the following are installed:

```text
Node.js
npm
```

Check your installation:

```bash
node --version
npm --version
```

---

## Install Dependencies

Clone the repository and enter the project directory:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd thyroidmlp-hypothyroidism-diagnostic-app
```

Install dependencies:

```bash
npm install
```

---

# ▶️ Run the Application

Start the development server:

```bash
npm run dev
```

The Vite development server will start on port `3000`.

Open the local address shown in your terminal, typically:

```text
http://localhost:3000
```

---

# 🏭 Production Build

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

# 🔍 Type Checking

The project includes a TypeScript checking command:

```bash
npm run lint
```

This runs:

```bash
tsc --noEmit
```

---

# 🧪 Example Workflow

A typical prediction workflow is:

```text
Patient Information
        ↓
Clinical History
        ↓
Thyroid Laboratory Values
        ↓
Input Validation
        ↓
Missing-Value Handling
        ↓
Feature Standardization
        ↓
ThyroidMLP
        ↓
Logit
        ↓
Probability
        ↓
Risk Interpretation
        ↓
Diagnostic Report
```

---

# 📈 Training History

The project stores selected training epochs from the original model training process.

Example:

| Epoch | Train Accuracy | Validation Accuracy |
| ----: | -------------: | ------------------: |
|     1 |         50.61% |              61.21% |
|    10 |         86.79% |              95.83% |
|    20 |         90.53% |              92.89% |
|    30 |         93.28% |              95.52% |
|    40 |         95.33% |              95.52% |
|    50 |         95.43% |              95.05% |
|    60 |         95.30% |              95.21% |
|    69 |         96.12% |              96.88% |

The application visualizes this information in the model-performance dashboard.

---

# 📊 ROC-AUC

The included model metadata reports:

```text
ROC-AUC = 0.9968
```

The ROC curve is also stored in the application and displayed in the model-performance interface.

---

# ⚠️ Medical Safety and Limitations

This project is a **machine-learning research and demonstration application**.

It should not be used as an independent medical diagnostic system.

Important limitations include:

* Predictions depend on the underlying training dataset.
* Dataset class imbalance may affect model behavior.
* The reported metrics come from the included model evaluation.
* Real-world clinical populations may differ from the training/test population.
* Laboratory reference ranges can vary between laboratories.
* Clinical diagnosis requires symptoms, physical examination, laboratory interpretation, medical history, and professional judgment.
* A machine-learning probability is not equivalent to a confirmed medical diagnosis.
* The application should not be used to start, stop, or change medication without professional medical advice.

---

# 🔐 Privacy

Do not enter real patient-identifying information into a public or demonstration deployment unless appropriate privacy, security, consent, and regulatory requirements have been addressed.

The included cohort records are demonstration data.

---

# 🎯 Research Purpose

This project can be used as a demonstration of:

* Clinical machine learning
* Tabular-data classification
* Deep neural networks
* Binary classification
* Imbalanced-data handling
* Model evaluation
* Interactive ML applications
* Clinical decision-support interfaces
* Explainable presentation of ML predictions

It can also serve as a foundation for future research involving:

```text
Machine Learning
        +
Clinical Data
        +
Thyroid Disease
        +
Interactive Decision Support
```

---

# 🔮 Future Improvements

Possible future improvements include:

* External validation on an independent dataset
* Calibration analysis
* Precision-Recall curves
* SHAP-based explainability
* Feature importance analysis
* More comprehensive clinical variables
* Real laboratory reference ranges
* Model versioning
* Secure database integration
* Authentication and role-based access
* HIPAA/GDPR-aware deployment
* REST API for model inference
* Docker deployment
* Automated model retraining
* Prospective clinical validation

---

# 📄 License

Add an appropriate open-source license before publishing this repository, such as:

```text
MIT License
```

or another license appropriate for your research/project requirements.

---

# 👨‍💻 Project

**Project Name:** ThyroidMLP — Hypothyroidism Diagnostic App

**Model:** Deep MLP

**Input Features:** 25

**Task:** Hypothyroidism binary classification

**Frontend:** React + TypeScript + Vite

**Styling:** Tailwind CSS

**ML Framework:** PyTorch

---

## ⭐ Summary

ThyroidMLP combines a trained tabular-data neural network with an interactive web interface to demonstrate hypothyroidism risk prediction.

The application provides an end-to-end workflow:

```text
Patient Data
    ↓
25 Clinical Features
    ↓
Preprocessing
    ↓
Deep MLP
    ↓
Hypothyroidism Probability
    ↓
Risk Interpretation
    ↓
Clinical-Style Report
```

**For research and educational use only — not a substitute for professional medical diagnosis.**
