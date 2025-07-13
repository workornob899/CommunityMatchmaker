import logoPath from "@assets/logo.png";

export const LOGO_URL = logoPath;

export const COMPANY_STATS = {
  totalVerifiedProfiles: 7000,
  dailyAddedProfiles: "50-70",
  highProfiles: 5000,
};

export const ADMIN_CREDENTIALS = {
  username: "admin12345",
  password: "admin12345",
};

export const GENDERS = {
  MALE: "Male",
  FEMALE: "Female",
} as const;

export const PROFESSION_OPTIONS = [
  "Doctor",
  "Engineer",
  "Teacher",
  "Business Owner",
  "Government Employee",
  "Private Employee",
  "Lawyer",
  "Accountant",
  "Student",
  "Other",
];

export const QUALIFICATION_OPTIONS = [
  "High School",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Diploma",
  "Certificate",
  "MBA",
  "Engineering Degree",
  "Medical Degree",
  "Law Degree",
  "Other",
];

export const HEIGHT_OPTIONS = [
  "4'10\"",
  "4'11\"",
  "5'0\"",
  "5'1\"",
  "5'2\"",
  "5'3\"",
  "5'4\"",
  "5'5\"",
  "5'6\"",
  "5'7\"",
  "5'8\"",
  "5'9\"",
  "5'10\"",
  "5'11\"",
  "6'0\"",
  "6'1\"",
  "6'2\"",
  "6'3\"",
  "6'4\"",
  "6'5\"",
];

// Generate age options from 18 to 80
export const AGE_OPTIONS = Array.from({ length: 63 }, (_, i) => (i + 18).toString());

// Generate birth year options from 1950 to 2090
export const BIRTH_YEAR_OPTIONS = Array.from({ length: 141 }, (_, i) => (1950 + i).toString());

// Dynamic options fetching function
export const fetchCustomOptions = async (fieldType: string) => {
  try {
    const response = await fetch(`/api/custom-options/${fieldType}`);
    if (response.ok) {
      const customOptions = await response.json();
      return customOptions.map((option: any) => option.value);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching custom options for ${fieldType}:`, error);
    return [];
  }
};

// Function to get combined options (default + custom)
export const getCombinedOptions = async (fieldType: string) => {
  const customOptions = await fetchCustomOptions(fieldType);
  
  switch (fieldType) {
    case 'profession':
      return [...PROFESSION_OPTIONS, ...customOptions];
    case 'qualification':
      return [...QUALIFICATION_OPTIONS, ...customOptions];
    case 'height':
      return [...HEIGHT_OPTIONS, ...customOptions];
    case 'gender':
      return [GENDERS.MALE, GENDERS.FEMALE, ...customOptions];
    case 'age':
      return [...AGE_OPTIONS, ...customOptions];
    case 'birthYear':
      return [...BIRTH_YEAR_OPTIONS, ...customOptions];
    default:
      return customOptions;
  }
};
