
import { DecisionStep as DecisionStepType } from '../../types/flow';
import { Button } from '../Common/Button';
import { useFlow } from '../../hooks/useFlow';

interface DecisionStepProps {
  step: DecisionStepType;
}

export function DecisionStep({ step }: DecisionStepProps) {
  const { goToStep, goBack, canGoBack, setDecision, decisions, evaluateDecisionLogic } = useFlow();

  const allAnswered = step.questions.every((q) => q.id in decisions);
  const canProceed = allAnswered && evaluateDecisionLogic(step.logic);
  const isIneligible = allAnswered && !evaluateDecisionLogic(step.logic);

  return (
    <div className="space-y-6">
      {step.questions.map((q) => (
        <div key={q.id} className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-800 font-medium mb-3">{q.question}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDecision(q.id, true)}
              className={`flex-1 py-2 px-4 rounded-lg border-2 font-semibold transition-colors ${
                decisions[q.id] === true
                  ? 'bg-raf-green text-white border-raf-green'
                  : 'border-gray-300 text-gray-700 hover:border-raf-green'
              }`}
              aria-pressed={decisions[q.id] === true}
            >
              Yes
            </button>
            <button
              onClick={() => setDecision(q.id, false)}
              className={`flex-1 py-2 px-4 rounded-lg border-2 font-semibold transition-colors ${
                decisions[q.id] === false
                  ? 'bg-red-500 text-white border-red-500'
                  : 'border-gray-300 text-gray-700 hover:border-red-400'
              }`}
              aria-pressed={decisions[q.id] === false}
            >
              No
            </button>
          </div>
        </div>
      ))}

      {isIneligible && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          <strong>Not Eligible:</strong> Based on your answers, you may not qualify for a RAF claim.
          The injury must arise from a motor vehicle accident. Please consult an attorney for advice.
        </div>
      )}

      <div className="flex gap-3 pt-4">
        {canGoBack && (
          <Button onClick={goBack} variant="outline">
            ← Back
          </Button>
        )}
        <Button
          onClick={() => goToStep(step.next)}
          variant="primary"
          disabled={!canProceed}
          className="flex-1"
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
