import { getAppealErrorMessage, validateSupportingFile } from './appealSubmissionUtils';

describe('appeal submission helpers', () => {
  it('accepts a supported PDF file within size limits', () => {
    const file = new File(['hello'], 'evidence.pdf', { type: 'application/pdf' });

    expect(validateSupportingFile(file)).toBeNull();
  });

  it('rejects unsupported file types', () => {
    const file = new File(['hello'], 'evidence.txt', { type: 'text/plain' });

    expect(validateSupportingFile(file)).toBe('Only PDF, JPG, and PNG files are supported.');
  });

  it('extracts the server message from an axios-style error', () => {
    const error = {
      response: {
        data: {
          message: 'An active appeal already exists for this grade.',
        },
      },
    };

    expect(getAppealErrorMessage(error)).toBe('An active appeal already exists for this grade.');
  });
});
