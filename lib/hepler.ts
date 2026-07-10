// for sidebar and breadcrumbs components
export const formatSegmentName = (segment: string): string => {
  switch (segment) {
    case "d":
      return "Dashboard";
    case "ci":
      return "Cataloguing & Inventory";
    case "mm":
      return "Member Management";
    case "cc":
      return "Circulation Control";
    case "sc":
      return "Settings & Configurations";
    default:
      return segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};

export const calculateAge = (dob: Date | undefined | null): number | null => {
  if (!dob) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

export const phoneRegex = /^\+?[0-9]{10,15}$/;
export const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

export const formatCNICNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 13);

  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
};

