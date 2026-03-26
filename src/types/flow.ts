export type StepType =
  | 'info'
  | 'decision'
  | 'choice'
  | 'checklist'
  | 'calculator'
  | 'summary'
  | 'flowchart';

export interface BaseStep {
  id: string;
  type: StepType;
  title: string;
}

export interface InfoStep extends BaseStep {
  type: 'info';
  content: string | string[];
  next: string;
}

export interface DecisionQuestion {
  id: string;
  question: string;
  type: 'boolean';
}

export interface DecisionStep extends BaseStep {
  type: 'decision';
  questions: DecisionQuestion[];
  logic: string;
  next: string;
}

export interface ChoiceOption {
  label: string;
  next: string;
}

export interface ChoiceStep extends BaseStep {
  type: 'choice';
  options: ChoiceOption[];
}

export interface ChecklistStep extends BaseStep {
  type: 'checklist';
  items: string[];
  next: string;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: 'number' | 'slider';
  min?: number;
  max?: number;
  default?: number;
}

export interface CalculatorFormula {
  past_loss: string;
  future_loss: string;
  total: string;
}

export interface CalculatorStep extends BaseStep {
  type: 'calculator';
  fields: CalculatorField[];
  formula: CalculatorFormula;
  next: string;
}

export interface SummaryStep extends BaseStep {
  type: 'summary';
  content: string[];
  next: string;
}

export interface FlowchartStep extends BaseStep {
  type: 'flowchart';
  steps: string[];
}

export type FlowStep =
  | InfoStep
  | DecisionStep
  | ChoiceStep
  | ChecklistStep
  | CalculatorStep
  | SummaryStep
  | FlowchartStep;

export interface AppConfig {
  app: { name: string; version: string };
  disclaimer: {
    title: string;
    content: string[];
    accept_required: boolean;
  };
  flow: FlowStep[];
}

export interface CalculatorValues {
  monthly_income: number;
  months_off: number;
  future_years: number;
  contingency: number;
}

export interface CalculationResult {
  past_loss: number;
  future_loss: number;
  total: number;
}

export interface FlowState {
  currentStepId: string;
  history: string[];
  decisions: Record<string, boolean>;
  checkedItems: Record<string, boolean>;
  calculatorValues: CalculatorValues;
  calculationResult: CalculationResult;
  disclaimerAccepted: boolean;
}
