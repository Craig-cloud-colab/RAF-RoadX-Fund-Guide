import { useFlowContext } from '../context/FlowContext';

export function useCalculator() {
  const { state, updateCalculatorValues } = useFlowContext();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return {
    values: state.calculatorValues,
    result: state.calculationResult,
    updateValues: updateCalculatorValues,
    formatCurrency,
  };
}
