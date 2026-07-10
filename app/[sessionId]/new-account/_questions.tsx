import { StepDef } from "./_common";

export default function getSteps(age: number | null): StepDef[] {
  const isJunior = age !== null && age < 18;

  const steps: StepDef[] = [
    { id: "fullName", section: "personal", label: "What's your full name?" },
    { id: "fatherName", section: "personal", label: "What's your father's name?" },
    { id: "gender", section: "personal", label: "What's your gender?" },
    {
      id: "dob",
      section: "personal",
      label: "What's your date of birth?",
      description: "Under 18 registers as a Junior Member, 18 and above as a Senior Member.",
    },
  ];

  if (age !== null) {
    steps.push(
      isJunior
        ? { id: "formBNumber", section: "personal", label: "What's the Form B Number?" }
        : {
          id: "cnicNumber",
          section: "personal",
          label: "What is the CNIC Number?",
          description: "Format: 12345-1234567-1",
        }
    );
  }

  steps.push(
    { id: "address", section: "personal", label: "What's your address?" },
    // { id: "jurisdiction", section: "personal", label: "Which jurisdiction does this fall under?" },
    // { id: "province", section: "personal", label: "Which province is this in?" },
    // { id: "city", section: "personal", label: "Which city is this in?" },
    { id: "contactNumber", section: "personal", label: "What is the contact number?" },
    { id: "email", section: "personal", label: "What is the email address?" },

    // { id: "emergencyContactName", section: "emergency", label: "Who should we contact in an emergency?" },
    // { id: "emergencyContactNumber", section: "emergency", label: "What is their contact number?" },

    { id: "highestEducation", section: "education", label: "What is the highest level of education?" },
    { id: "institution", section: "education", label: "Which institution was / is attended?" },
    { id: "progressDegree", section: "education", label: "What is the progress / degree?" },
    { id: "educationStatus", section: "education", label: "Is this completed or anticipated?" },
    { id: "yearOfCompletion", section: "education", label: "What year was / will this be completed?" }
  );

  if (!!isJunior && age !== null) {
    steps.push(
      { id: "profession", section: "professional", label: "What is the profession?" },
      { id: "company", section: "professional", label: "Which company is this for?" },
      { id: "designation", section: "professional", label: "What is the designation?" }
    );
  }

  return steps;
}