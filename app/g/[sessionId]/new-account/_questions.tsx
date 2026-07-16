import { StepDef } from "./_common";

export default function getSteps(age: number | null): StepDef[] {
  const isJunior = age !== null && age < 18;

  const steps: StepDef[] = [
    {
      id: "fullName",
      section: "personal",
      label: "Your Full Name",
    },
    {
      id: "fatherName",
      section: "personal",
      label: "Father/ Husband Full name",
    },
    {
      id: "gender",
      section: "personal",
      label: "Your Gender",
    },
    {
      id: "dob",
      section: "personal",
      label: "Your Date of Birth",
      description:
        "If you're under 13, you'll be registered as a Junior Member. Otherwise, you'll be registered as a Senior Member.",
    },
  ];

  if (age !== null) {
    steps.push({
      id: "cnicNumber",
      section: "personal",
      label: isJunior
        ? "B-Form Number"
        : "CNIC Number",
      description: "Format: 12345-1234567-1",
    });
  }

  steps.push({
    id: "email",
    section: "personal",
    label: isJunior
      ? "Parent/ Guardian's Email Address"
      : "Email Address",
  },
    {
      id: "address",
      section: "personal",
      label: "Complete Address",
    },
    {
      id: "contactNumber",
      section: "personal",
      label: isJunior
        ? "Parent/Guardian's Contact Number"
        : "Your Contact Number",
    },
    {
      id: "highestEducation",
      section: "education",
      label: "Your Highest Level of Education",
      description: "For example: Matriculation, Intermediate, or Undergraduate",
    },
    {
      id: "institution",
      section: "education",
      label: "Name of Your Educational Institution",
    },
    {
      id: "areaOfInterest",
      section: "interest",
      label: "Service you will be most interested in",
    },
    {
      id: "partOfReadingClub",
      section: "opinion",
      label: "Would you like to join our reading club",
    },
    {
      id: "genre",
      section: "opinion",
      label: "Your Favorite Book Genre",
      description: "Use commas, if more than one. E.g: Comedy, Mystery, Horror, etc",
    },
    {
      id: "activities",
      section: "opinion",
      label: "Services and activities you would like us to offer",
    },
    {
      id: "suggestionForImpovement",
      section: "opinion",
      label: "Your suggestions for improving the library",
    },
  );

  return steps;
}