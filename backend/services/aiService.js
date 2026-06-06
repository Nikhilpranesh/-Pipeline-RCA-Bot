const ERROR_LINE_RE = /error|exception|fail|fatal|panic|traceback|caused by|^\s*at\s+/i;

const truncateText = (text, maxChars, { prioritizeErrors = true } = {}) => {
  if (!text || text.length === 0) return '(empty)';
  if (text.length <= maxChars) return text;

  if (!prioritizeErrors) {
    const head = text.slice(0, Math.floor(maxChars * 0.3));
    const tail = text.slice(-Math.floor(maxChars * 0.6));
    return `${head}\n... [truncated] ...\n${tail}`.slice(0, maxChars);
  }

  const lines = text.split('\n');
  const selected = [];
  const seen = new Set();

  const addLine = (line) => {
    if (!seen.has(line)) {
      seen.add(line);
      selected.push(line);
    }
  };

  lines.slice(0, 20).forEach(addLine);
  lines.filter((line) => ERROR_LINE_RE.test(line)).slice(-40).forEach(addLine);
  lines.slice(-100).forEach(addLine);

  let result = selected.join('\n');
  if (result.length > maxChars) {
    result = `${result.slice(0, maxChars - 40)}\n... [truncated due to size limit]`;
  }

  return result;
};

const compactGitDiff = (gitDiffStats) => {
  const files = gitDiffStats?.filesChanged || [];
  const notAdded = gitDiffStats?.notAdded || [];
  const compact = {
    filesChanged: files.slice(0, 15),
    totalFilesChanged: files.length,
    notAdded: notAdded.slice(0, 10),
    totalUntracked: gitDiffStats?.totalUntracked ?? notAdded.length,
    linesAdded: gitDiffStats?.linesAdded ?? 0,
    linesDeleted: gitDiffStats?.linesDeleted ?? 0,
  };

  if (files.length > 15) {
    compact.note = `${files.length - 15} additional changed files omitted`;
  }
  if ((gitDiffStats?.totalUntracked ?? 0) > 10) {
    compact.untrackedNote = `${gitDiffStats.totalUntracked - 10} additional untracked files omitted`;
  }

  let json = JSON.stringify(compact);
  const maxGitChars = 1500;
  if (json.length > maxGitChars) {
    json = json.slice(0, maxGitChars - 3) + '...';
  }
  return json;
};

const buildPrompt = (failureLog, successLog, gitDiffStats) => {
  const maxPromptChars = Number(process.env.GROQ_MAX_PROMPT_CHARS) || 12000;
  const templateOverhead = 600;
  const gitBudget = 1500;
  const available = maxPromptChars - templateOverhead - gitBudget;

  const failureBudget = Math.floor(available * 0.65);
  const successBudget = available - failureBudget;

  const trimmedFailure = truncateText(failureLog, failureBudget, { prioritizeErrors: true });
  const trimmedSuccess = truncateText(successLog, successBudget, { prioritizeErrors: false });
  const trimmedGit = compactGitDiff(gitDiffStats);

  if (
    (failureLog?.length || 0) > failureBudget ||
    (successLog?.length || 0) > successBudget
  ) {
    console.warn(
      `Log content truncated for Groq API (failure: ${failureLog?.length || 0} -> ${trimmedFailure.length}, success: ${successLog?.length || 0} -> ${trimmedSuccess.length})`
    );
  }

  return `
You are a Senior DevOps Engineer specializing in Root Cause Analysis for pipeline failures.
Analyze the following information:
1. Failure Log:
${trimmedFailure}

2. Success Log:
${trimmedSuccess}

3. Git Diff (Recent changes):
${trimmedGit}

Extract the following from the failure log:
- Job Name (the name of the pipeline/job that failed)
- Failure Time (timestamp when the failure occurred)

Determine:
- Root Cause (concise explanation of what caused the failure)
- Evidence (array of 3-5 bullet points comparing failure vs success log and git changes)
- Impact (what systems/processes were affected)
- Recommended Action (array of 3-5 numbered steps to fix and prevent the issue)
- Confidence Score (0-100 based on evidence strength)

Return structured JSON ONLY exactly in the following format, without any markdown code blocks:
{
  "jobName": "...",
  "failureTime": "...",
  "rootCause": "...",
  "evidence": ["...", "...", "..."],
  "impact": "...",
  "recommendedAction": ["...", "...", "..."],
  "confidenceScore": "..."
}`;
};

const parseAIResponse = (textResult) => {
  const cleanedText = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedText);
};

const MOCK_RCA = {
  jobName: 'Auto-Detected Pipeline Failure',
  failureTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
  rootCause: 'Null Pointer Exception in the Data Transformer service due to unhandled undefined value.',
  evidence: [
    'NullPointerException observed in failure.log at DataTransformer.js:45',
    'Successful run did not contain this error',
    'Git diff shows recent changes to data transformation logic'
  ],
  impact: 'Pipeline stopped processing data, causing a 2-hour delay in the reporting dashboard updates.',
  recommendedAction: [
    'Add null checks before mapping the incoming dataset',
    'Implement retry logic for transient DB errors',
    'Add input validation to prevent undefined values'
  ],
  confidenceScore: '85',
};

const generateRCA = async (failureLog, successLog, gitDiffStats) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    console.warn('GROQ_API_KEY is not configured. Returning mock data.');
    return MOCK_RCA;
  }

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const prompt = buildPrompt(failureLog, successLog, gitDiffStats);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const textResult = data.choices?.[0]?.message?.content;

    if (!textResult) {
      throw new Error('Groq API returned an empty response');
    }

    try {
      return parseAIResponse(textResult);
    } catch (e) {
      console.error('Failed to parse Groq output:', textResult);
      throw new Error('AI response was not valid JSON');
    }
  } catch (error) {
    console.error('Error generating RCA with Groq:', error.message);
    throw error;
  }
};

module.exports = { generateRCA };
