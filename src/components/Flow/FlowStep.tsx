
import { FlowStep as FlowStepType } from '../../types/flow';
import { InfoStep } from './InfoStep';
import { DecisionStep } from './DecisionStep';
import { ChoiceStep } from './ChoiceStep';
import { ChecklistStep } from './ChecklistStep';
import { CalculatorStep } from './CalculatorStep';
import { SummaryStep } from './SummaryStep';
import { FlowchartStep } from './FlowchartStep';

interface FlowStepProps {
  step: FlowStepType;
}

export function FlowStep({ step }: FlowStepProps) {
  switch (step.type) {
    case 'info':
      return <InfoStep step={step} />;
    case 'decision':
      return <DecisionStep step={step} />;
    case 'choice':
      return <ChoiceStep step={step} />;
    case 'checklist':
      return <ChecklistStep step={step} />;
    case 'calculator':
      return <CalculatorStep step={step} />;
    case 'summary':
      return <SummaryStep step={step} />;
    case 'flowchart':
      return <FlowchartStep step={step} />;
    default:
      return null;
  }
}
