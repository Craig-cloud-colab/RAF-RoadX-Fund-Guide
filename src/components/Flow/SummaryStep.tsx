
import { SummaryStep as SummaryStepType } from '../../types/flow';
import { Button } from '../Common/Button';
import { useFlow } from '../../hooks/useFlow';
import { useCalculator } from '../../hooks/useCalculator';

interface SummaryStepProps {
  step: SummaryStepType;
}

export function SummaryStep({ step }: SummaryStepProps) {
  const { goToStep, goBack, canGoBack } = useFlow();
  const { result, formatCurrency } = useCalculator();

  return (
    <div className="space-y-6">
      <div className="bg-raf-blue rounded-2xl p-6 text-white text-center">
        <p className="text-sm uppercase tracking-wide opacity-80 mb-2">Estimated Total Loss of Earnings</p>
        <p className="text-4xl font-bold">{formatCurrency(result.total)}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="opacity-75 mb-1">Past Loss</p>
            <p className="font-semibold">{formatCurrency(result.past_loss)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="opacity-75 mb-1">Future Loss</p>
            <p className="font-semibold">{formatCurrency(result.future_loss)}</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠ Important Notes</h3>
        <ul className="space-y-2">
          {step.content.map((item, i) => (
            <li key={i} className="text-yellow-700 text-sm">• {item}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 pt-4">
        {canGoBack && (
          <Button onClick={goBack} variant="outline">
            ← Back
          </Button>
        )}
        <Button onClick={() => goToStep(step.next)} variant="primary" className="flex-1">
          View RAF Process →
        </Button>
      </div>
    </div>
  );
}
