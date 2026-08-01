export function validateSupportingFile(file: File | null): string | null {
  if (!file) {
    return null;
  }

  const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const acceptedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const maxSizeBytes = 5 * 1024 * 1024;
  const normalizedName = file.name.toLowerCase();
  const hasAcceptedExtension = acceptedExtensions.some((extension) =>
    normalizedName.endsWith(extension)
  );

  if (!acceptedTypes.includes(file.type) && !hasAcceptedExtension) {
    return 'Only PDF, JPG, and PNG files are supported.';
  }

  if (file.size > maxSizeBytes) {
    return 'The file must be 5MB or smaller.';
  }

  return null;
}

export function getAppealErrorMessage(error: unknown): string {
  const responseData = (
    error as { response?: { data?: { message?: string; errors?: Array<{ message?: string }> } } }
  )?.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  const firstValidationMessage = responseData?.errors?.find((entry) => entry?.message)?.message;
  if (firstValidationMessage) {
    return firstValidationMessage;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'The appeal could not be submitted. Please review the form and try again.';
}
