import { createContext, useContext, useState, ReactNode } from 'react';
import { FlowState, CalculatorValues } from '../types/flow';

const defaultCalculatorValues: CalculatorValues = {
  monthly_income: 0,
  months_off: 0,
  future_years: 0,
  contingency: 15,
};

const initialState: FlowState = {
  currentStepId: 'entry',
  history: [],
  decisions: {},
  checkedItems: {},
  calculatorValues: defaultCalculatorValues,
  calculationResult: { past_loss: 0, future_loss: 0, total: 0 },
  disclaimerAccepted: false,
};

interface FlowContextType {
  state: FlowState;
  goToStep: (stepId: string) => void;
  goBack: () => void;
  setDecision: (questionId: string, value: boolean) => void;
  toggleCheckedItem: (item: string) => void;
  updateCalculatorValues: (values: Partial<CalculatorValues>) => void;
  acceptDisclaimer: () => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(initialState);

  const goToStep = (stepId: string) => {
    setState((prev) => ({
      ...prev,
      history: [...prev.history, prev.currentStepId],
      currentStepId: stepId,
    }));
  };

  const goBack = () => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const history = [...prev.history];
      const previousStepId = history.pop()!;
      return { ...prev, history, currentStepId: previousStepId };
    });
  };

  const setDecision = (questionId: string, value: boolean) => {
    setState((prev) => ({
      ...prev,
      decisions: { ...prev.decisions, [questionId]: value },
    }));
  };

  const toggleCheckedItem = (item: string) => {
    setState((prev) => ({
      ...prev,
      checkedItems: { ...prev.checkedItems, [item]: !prev.checkedItems[item] },
    }));
  };

  const updateCalculatorValues = (values: Partial<CalculatorValues>) => {
    setState((prev) => {
      const newValues = { ...prev.calculatorValues, ...values };
      const past_loss = newValues.monthly_income * newValues.months_off;
      const future_loss =
        newValues.monthly_income * 12 * newValues.future_years * (1 - newValues.contingency / 100);
      const total = past_loss + future_loss;
      return {
        ...prev,
        calculatorValues: newValues,
        calculationResult: { past_loss, future_loss, total },
      };
    });
  };

  const acceptDisclaimer = () => {
    setState((prev) => ({ ...prev, disclaimerAccepted: true }));
  };

  return (
    <FlowContext.Provider
      value={{ state, goToStep, goBack, setDecision, toggleCheckedItem, updateCalculatorValues, acceptDisclaimer }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlowContext(): FlowContextType {
  const context = useContext(FlowContext);
  if (!context) throw new Error('useFlowContext must be used within FlowProvider');
  return context;
}
