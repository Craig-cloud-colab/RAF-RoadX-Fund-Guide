
import { CalculatorStep as CalculatorStepType } from '../../types/flow';
import { Button } from '../Common/Button';
import { Slider } from '../Common/Slider';
import { Input } from '../Common/Input';
import { useFlow } from '../../hooks/useFlow';
import { useCalculator } from '../../hooks/useCalculator';

interface CalculatorStepProps {
  step: CalculatorStepType;
}

export function CalculatorStep({ step }: CalculatorStepProps) {
  const { goToStep, goBack, canGoBack } = useFlow();
  const { values, result, updateValues, formatCurrency } = useCalculator();

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-5 space-y-4">
        {step.fields.map((field) => {
          if (field.type === 'number') {
            return (
              <Input
                key={field.id}
                id={field.id}
                label={field.label}
                value={values[field.id as keyof typeof values] || ''}
                onChange={(val) =>
                  updateValues({ [field.id]: Number(val) || 0 } as Parameters<typeof updateValues>[0])
                }
                type="number"
                placeholder="0"
                prefix="R"
              />
            );
          }
          if (field.type === 'slider') {
            const unit = field.id === 'contingency' ? '%' : '';
            return (
              <Slider
                key={field.id}
                id={field.id}
                label={field.label}
                value={values[field.id as keyof typeof values]}
                min={field.min ?? 0}
                max={field.max ?? 100}
                onChange={(val) =>
                  updateValues({ [field.id]: val } as Parameters<typeof updateValues>[0])
                }
                unit={unit}
              />
            );
          }
          return null;
        })}
      </div>

      <div className="bg-white border-2 border-raf-blue rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-raf-blue text-lg">Calculation Results</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Past Loss of Earnings</span>
            <span className="font-semibold text-gray-800">{formatCurrency(result.past_loss)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Future Loss of Earnings</span>
            <span className="font-semibold text-gray-800">{formatCurrency(result.future_loss)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-bold text-gray-800">Total Estimated Loss</span>
            <span className="font-bold text-raf-blue text-lg">{formatCurrency(result.total)}</span>
          </div>
        </div>
      </div>

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
