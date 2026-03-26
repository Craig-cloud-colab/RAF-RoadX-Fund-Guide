
import { appConfig } from '../../data/flowConfig';
import { Button } from '../Common/Button';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const { disclaimer } = appConfig;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
            <span className="text-yellow-600 text-xl font-bold">!</span>
          </div>
          <h2 id="disclaimer-title" className="text-2xl font-bold text-raf-blue">
            {disclaimer.title}
          </h2>
        </div>
        <ul className="space-y-3 mb-6">
          {disclaimer.content.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
              <span className="mt-1 text-raf-blue">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Button onClick={onAccept} variant="primary" className="w-full">
          I Understand &amp; Accept
        </Button>
      </div>
    </div>
  );
}
