export const toTitleCase = s =>
  s ? s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) : '';

export const formatPhone = p => {
  if (!p) return null;
  const digits = p.replace(/\D/g, '');
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (digits.startsWith('62')) return digits;
  return '62' + digits;
};