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
    try {
      // Safe evaluation: replace variable names with their boolean values
      const evaluated = logic.replace(/\b([a-z_]+)\b/g, (match) => {
        if (match in decisions) return String(decisions[match]);
        return match;
      });
      // Only allow simple boolean expressions
      if (/^[a-z_\s=!&|()truefals]+$/i.test(evaluated)) {
        return Function('"use strict"; return (' + evaluated + ')')() as boolean;
      }
      return false;
    } catch {
      return false;
    }
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
