
import { FlowchartStep as FlowchartStepType } from '../../types/flow';
import { Button } from '../Common/Button';
import { useFlow } from '../../hooks/useFlow';

interface FlowchartStepProps {
  step: FlowchartStepType;
}

export function FlowchartStep({ step }: FlowchartStepProps) {
  const { goBack, canGoBack } = useFlow();

  return (
    <div className="space-y-6">
      <div className="relative">
        {step.steps.map((item, i) => (
          <div key={i} className="flex items-start gap-4 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-raf-blue text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              {i < step.steps.length - 1 && (
                <div className="w-0.5 h-8 bg-raf-blue opacity-30 mt-1" />
              )}
            </div>
            <div
              className={`flex-1 p-4 rounded-xl border-2 mt-0.5 ${
                i === step.steps.length - 1
                  ? 'bg-raf-green/10 border-raf-green text-raf-green'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <span className="font-medium">{item}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
        <p className="text-blue-700 font-semibold">You have completed the RAF RoadX &amp; Fund Guide</p>
        <p className="text-blue-600 text-sm mt-1">Remember to consult a qualified attorney for legal advice.</p>
      </div>

      {canGoBack && (
        <Button onClick={goBack} variant="outline">
          ← Back
        </Button>
      )}
    </div>
  );
}
