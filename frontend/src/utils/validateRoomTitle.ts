export const validateRoomTitle = (
  value: string
): { isValid: boolean; errorMessage: string | null } => {
  if (!value.trim()) {
    return { isValid: false, errorMessage: "Don't forget your title!" };
  }

  if (value.length > 22) {
    return {
      isValid: false,
      errorMessage: 'Names must be shorter than 22 characters.',
    };
  }

  return { isValid: true, errorMessage: null };
};
