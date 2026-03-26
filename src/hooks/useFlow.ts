import { useFlowContext } from '../context/FlowContext';
import { appConfig } from '../data/flowConfig';
import { FlowStep } from '../types/flow';

export function useFlow() {
  const { state, goToStep, goBack, setDecision, toggleCheckedItem } = useFlowContext();

  const currentStep = appConfig.flow.find((s) => s.id === state.currentStepId) as FlowStep;
  const totalSteps = appConfig.flow.length;
  const currentIndex = appConfig.flow.findIndex((s) => s.id === state.currentStepId);
  const progress = Math.round(((currentIndex + 1) / totalSteps) * 100);
  const canGoBack = state.history.length > 0;

  const evaluateDecisionLogic = (logic: string): boolean => {
    const decisions = state.decisions;
    // Safe evaluation: parse simple "variable == true/false" expressions joined by && or ||
    // Supports: "var == true", "var == false", combined with && / ||
    const evaluateAtom = (atom: string): boolean => {
      const match = atom.trim().match(/^([a-z_]+)\s*==\s*(true|false)$/i);
      if (!match) return false;
      const [, varName, expected] = match;
      const actual = decisions[varName];
      return actual === (expected.toLowerCase() === 'true');
    };

    if (logic.includes('||')) {
      return logic.split('||').some((part) => evaluateAtom(part));
    }
    if (logic.includes('&&')) {
      return logic.split('&&').every((part) => evaluateAtom(part));
    }
    return evaluateAtom(logic);
  };

  return {
    currentStep,
    currentIndex,
    totalSteps,
    progress,
    canGoBack,
    decisions: state.decisions,
    checkedItems: state.checkedItems,
    goToStep,
    goBack,
    setDecision,
    toggleCheckedItem,
    evaluateDecisionLogic,
  };
}
