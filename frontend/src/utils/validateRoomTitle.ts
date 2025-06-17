export const validateRoomTitle = (
  value: string,
): { isValid: boolean; errorMessage: string | null } => {
  if (!value.trim()) {
    return { isValid: false, errorMessage: "Don't forget your title!" };
  }

  const ruleRegex = /^[a-z0-9_]+$/;
  if (!ruleRegex.test(value) || value.length > 22) {
    return {
      isValid: false,
      errorMessage:
        'Names must be lowercase, without spaces or periods, and shorter than 22 characters.',
    };
  }

  return { isValid: true, errorMessage: null };
};
