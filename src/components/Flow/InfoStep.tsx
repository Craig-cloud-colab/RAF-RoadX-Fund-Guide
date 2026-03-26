
import { InfoStep as InfoStepType } from '../../types/flow';
import { Button } from '../Common/Button';
import { useFlow } from '../../hooks/useFlow';

interface InfoStepProps {
  step: InfoStepType;
}

export function InfoStep({ step }: InfoStepProps) {
  const { goToStep, goBack, canGoBack } = useFlow();
  const content = Array.isArray(step.content) ? step.content : [step.content];

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {content.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-700">
            <span className="mt-1 w-5 h-5 rounded-full bg-raf-blue text-white text-xs flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-3 pt-4">
        {canGoBack && (
          <Button onClick={goBack} variant="outline">
            ← Back
          </Button>
        )}
        <Button onClick={() => goToStep(step.next)} variant="primary" className="flex-1">
          Next →
        </Button>
      </div>
    </div>
  );
}
