import { useState, useEffect, useCallback, useRef } from "react";

export type TransactionStage = 'idle' | 'proving' | 'signing' | 'submitting' | 'finalizing' | 'indexing' | 'confirmed';

export interface TransactionProgress {
  stage: TransactionStage;
  message: string;
  percentage: number;
  isActive: boolean;
}

const stagePercentages: Record<TransactionStage, number> = {
  idle: 0,
  proving: 20,
  signing: 40,
  submitting: 60,
  finalizing: 75,
  indexing: 90,
  confirmed: 100,
};

const stageMessages: Record<TransactionStage, string> = {
  idle: '',
  proving: 'Generating zero-knowledge proof...',
  signing: 'Check your wallet extension — you may need to approve the transaction.',
  submitting: 'Submitting transaction to network...',
  finalizing: 'Waiting for block confirmation — check your wallet if prompted.',
  indexing: 'Waiting for indexer to update state...',
  confirmed: 'Transaction confirmed!',
};

function parseStageFromFlowMessage(msg: string | undefined): TransactionStage {
  if (!msg) return 'idle';

  const lowerMsg = msg.toLowerCase();

  if (lowerMsg.includes('prov') || lowerMsg.includes('proof') || lowerMsg.includes('zk')) {
    return 'proving';
  }
  if (lowerMsg.includes('sign') || lowerMsg.includes('wallet')) {
    return 'signing';
  }
  if (lowerMsg.includes('submit') || lowerMsg.includes('broadcast') || lowerMsg.includes('send')) {
    return 'submitting';
  }
  if (lowerMsg.includes('confirm') || lowerMsg.includes('final') || lowerMsg.includes('wait')) {
    return 'finalizing';
  }

  // If we have a message but can't categorize it, assume proving (first active stage)
  return 'proving';
}

// Order of stages for comparison (higher = further along)
const stageOrder: Record<TransactionStage, number> = {
  idle: 0,
  proving: 1,
  signing: 2,
  submitting: 3,
  finalizing: 4,
  indexing: 5,
  confirmed: 6,
};

export function useTransactionProgress() {
  const [stage, setStageState] = useState<TransactionStage>('idle');
  const targetRoundRef = useRef<bigint | null>(null);
  const isTrackingRef = useRef(false);

  const isActive = stage !== 'idle' && stage !== 'confirmed';
  const percentage = stagePercentages[stage];
  const message = stageMessages[stage];

  const setStageFromFlowMessage = useCallback((msg: string | undefined) => {
    setStageState((current) => {
      // Don't override indexing/confirmed stages based on flowMessage
      if (current === 'indexing' || current === 'confirmed') {
        return current;
      }

      const newStage = parseStageFromFlowMessage(msg);

      // If we're actively tracking a transaction, never go back to idle
      // This prevents the modal from closing when flowMessage temporarily becomes undefined
      if (isTrackingRef.current && newStage === 'idle') {
        return current;
      }

      // Only allow forward progress (don't go backwards in stages)
      if (isTrackingRef.current && stageOrder[newStage] < stageOrder[current]) {
        return current;
      }

      return newStage;
    });
  }, []);

  const setStage = useCallback((newStage: TransactionStage) => {
    setStageState(newStage);
  }, []);

  const reset = useCallback(() => {
    isTrackingRef.current = false;
    targetRoundRef.current = null;
    setStageState('idle');
  }, []);

  // Start tracking - call this before starting a transaction
  // Pass the current round value so we can detect when it changes
  const startTracking = useCallback((currentRound: bigint) => {
    isTrackingRef.current = true;
    targetRoundRef.current = currentRound + 1n;
    setStageState('proving');
  }, []);

  // Call this when transaction is submitted to start waiting for indexer
  const waitForIndexer = useCallback(() => {
    setStageState('indexing');
  }, []);

  // Call this when round changes to check if we've reached our target
  const checkRoundUpdate = useCallback((currentRound: bigint) => {
    if (targetRoundRef.current !== null && currentRound >= targetRoundRef.current) {
      setStageState('confirmed');
      // Auto-reset after showing confirmed state briefly
      setTimeout(() => {
        isTrackingRef.current = false;
        targetRoundRef.current = null;
        setStageState('idle');
      }, 1500);
    }
  }, []);

  // Register beforeunload event listener when transaction is active
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers ignore custom messages, but we set returnValue for compatibility
      e.returnValue = 'Transaction in progress. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive]);

  const progress: TransactionProgress = {
    stage,
    message,
    percentage,
    isActive: stage !== 'idle',  // Include 'confirmed' as active so modal shows the success
  };

  return {
    progress,
    setStage,
    setStageFromFlowMessage,
    startTracking,
    waitForIndexer,
    checkRoundUpdate,
    reset,
  };
}
