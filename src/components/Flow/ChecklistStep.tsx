
import { ChecklistStep as ChecklistStepType } from '../../types/flow';
import { Button } from '../Common/Button';
import { useFlow } from '../../hooks/useFlow';

interface ChecklistStepProps {
  step: ChecklistStepType;
}

export function ChecklistStep({ step }: ChecklistStepProps) {
  const { goToStep, goBack, canGoBack, toggleCheckedItem, checkedItems } = useFlow();
  const checkedCount = step.items.filter((item) => checkedItems[item]).length;

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-sm">
        Check the documents you have gathered ({checkedCount}/{step.items.length})
      </p>
      <ul className="space-y-3">
        {step.items.map((item) => (
          <li key={item}>
            <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={!!checkedItems[item]}
                onChange={() => toggleCheckedItem(item)}
                className="w-5 h-5 rounded accent-raf-blue cursor-pointer"
                aria-label={item}
              />
              <span
                className={`text-gray-800 ${checkedItems[item] ? 'line-through text-gray-400' : ''}`}
              >
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 rounded-xl p-3 text-blue-700 text-sm">
        <strong>Note:</strong> You can proceed without checking all items. This checklist is for your reference.
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
