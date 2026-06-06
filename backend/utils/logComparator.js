const Diff = require('diff');

const compareLogs = (successLog, failureLog) => {
  if (!successLog || !failureLog) {
    return {
      missingInFailure: [],
      unexpectedInFailure: [],
      flowDivergence: false
    };
  }

  const successLines = successLog.split('\n').filter(line => line.trim());
  const failureLines = failureLog.split('\n').filter(line => line.trim());

  // Use diff to compare lines
  const differences = Diff.diffLines(successLog, failureLog);

  const missingInFailure = [];
  const unexpectedInFailure = [];

  differences.forEach((part) => {
    if (part.removed) {
      // Lines present in success but not in failure
      const lines = part.value.split('\n').filter(line => line.trim());
      missingInFailure.push(...lines);
    } else if (part.added) {
      // Lines present in failure but not in success
      const lines = part.value.split('\n').filter(line => line.trim());
      unexpectedInFailure.push(...lines);
    }
  });

  // Detect flow divergence (significant difference in structure)
  const flowDivergence = detectFlowDivergence(successLines, failureLines);

  return {
    missingInFailure: missingInFailure.slice(0, 20), // Limit to 20 lines
    unexpectedInFailure: unexpectedInFailure.slice(0, 20), // Limit to 20 lines
    flowDivergence
  };
};

const detectFlowDivergence = (successLines, failureLines) => {
  // Simple heuristic: if more than 30% of lines are different, it's a flow divergence
  const maxLength = Math.max(successLines.length, failureLines.length);
  if (maxLength === 0) return false;

  const differences = Diff.diffLines(successLines.join('\n'), failureLines.join('\n'));
  let changedLines = 0;

  differences.forEach((part) => {
    if (part.added || part.removed) {
      changedLines += part.value.split('\n').filter(line => line.trim()).length;
    }
  });

  const divergenceRatio = changedLines / maxLength;
  return divergenceRatio > 0.3;
};

module.exports = { compareLogs };
