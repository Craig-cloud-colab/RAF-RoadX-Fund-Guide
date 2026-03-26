
import { useFlow } from '../../hooks/useFlow';
import { FlowStep } from './FlowStep';
import { appConfig } from '../../data/flowConfig';

export function FlowContainer() {
  const { currentStep, currentIndex, totalSteps, progress } = useFlow();

  if (!currentStep) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-raf-blue text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">{appConfig.app.name}</h1>
              <p className="text-xs opacity-75">v{appConfig.app.version}</p>
            </div>
            <div className="text-right text-sm">
              <p className="opacity-75">Step {currentIndex + 1} of {totalSteps}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-white/20 rounded-full h-2">
            <div
              className="bg-raf-gold rounded-full h-2 transition-all duration-500"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress: ${progress}%`}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-raf-blue mb-6">{currentStep.title}</h2>
          <FlowStep step={currentStep} />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        Educational tool only. Not legal advice. Consult a qualified attorney.
      </footer>
    </div>
  );
}
