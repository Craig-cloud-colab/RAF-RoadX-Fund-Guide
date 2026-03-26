
import { ChoiceStep as ChoiceStepType } from '../../types/flow';
import { Button } from '../Common/Button';
import { useFlow } from '../../hooks/useFlow';

interface ChoiceStepProps {
  step: ChoiceStepType;
}

export function ChoiceStep({ step }: ChoiceStepProps) {
  const { goToStep, goBack, canGoBack } = useFlow();

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {step.options.map((option, i) => (
          <button
            key={i}
            onClick={() => goToStep(option.next)}
            className="w-full text-left p-5 rounded-xl border-2 border-raf-blue hover:bg-raf-blue hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-raf-blue text-white group-hover:bg-white group-hover:text-raf-blue flex items-center justify-center font-bold transition-colors">
                {i + 1}
              </div>
              <span className="text-lg font-semibold">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
      {canGoBack && (
        <Button onClick={goBack} variant="outline">
          ← Back
        </Button>
      )}
    </div>
  );
}
