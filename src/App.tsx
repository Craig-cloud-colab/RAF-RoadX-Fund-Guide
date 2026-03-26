
import { FlowProvider } from './context/FlowContext';
import { FlowContainer } from './components/Flow/FlowContainer';
import { DisclaimerModal } from './components/Disclaimer/DisclaimerModal';
import { useFlowContext } from './context/FlowContext';

function AppContent() {
  const { state, acceptDisclaimer } = useFlowContext();
  return (
    <>
      {!state.disclaimerAccepted && <DisclaimerModal onAccept={acceptDisclaimer} />}
      <FlowContainer />
    </>
  );
}

export default function App() {
  return (
    <FlowProvider>
      <AppContent />
    </FlowProvider>
  );
}
