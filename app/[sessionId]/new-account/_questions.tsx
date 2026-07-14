import { StepDef } from "./_common";

export default function getSteps(age: number | null): StepDef[] {
  const isJunior = age !== null && age < 18;

  const steps: StepDef[] = [
    {
      id: "fullName",
      section: "personal",
      label: "Your full name?",
    },
    {
      id: "fatherName",
      section: "personal",
      label: "Father/Husband Name?",
    },
    {
      id: "gender",
      section: "personal",
      label: "Select you Gender?",
    },
    {
      id: "dob",
      section: "personal",
      label: "Your Date of Birth?",
      description:
        "If you're under 18, you'll be registered as a Junior Member. Otherwise, you'll be registered as a Senior Member.",
    },
  ];

  if (age !== null) {
    steps.push({
      id: "cnicNumber",
      section: "personal",
      label: isJunior
        ? "Your B-Form Number?"
        : "Your CNI Number?",
      description: "Format: 12345-1234567-1",
    });
  }

  steps.push(
    {
      id: "address",
      section: "personal",
      label: "Complete Address?",
    },
    {
      id: "contactNumber",
      section: "personal",
      label: "Your Contact Number?",
    },
    {
      id: "email",
      section: "personal",
      label: "Your email Address?",
    },
    {
      id: "highestEducation",
      section: "education",
      label: "Your highest education?",
      description: "For example: School, College, or University",
    },
    {
      id: "institution",
      section: "education",
      label: "Name of your educational institution?",
    },
    {
      id: "areaOfInterest",
      section: "interest",
      label: "Which service of this facility, you will be most interested in?",
    },
    {
      id: "partOfReadingClub",
      section: "opinion",
      label: "Would like to be a part of our Reading club?",
    },
    {
      id: "genre",
      section: "opinion",
      label: "Tell us your favourite genre in books?",
      description: "Use commas, if more than one. eg: Comedy, Mystery, Horror",
    },
    {
      id: "activities",
      section: "opinion",
      label: "What services and activities would you like us plan for you?",
    },
    {
      id: "suggestionForImpovement",
      section: "opinion",
      label: "Tell us anything that you would like to change or add to the library.",
    },
    // {
    //   id: "progressDegree",
    //   section: "education",
    //   label: "What degree, diploma, or program are you pursuing or have you completed?",
    // },
    // {
    //   id: "educationStatus",
    //   section: "education",
    //   label: "Have you completed it, or are you still studying?",
    // },
    // {
    //   id: "yearOfCompletion",
    //   section: "education",
    //   label: "What year did you complete it, or when do you expect to finish?",
    //   description: "Year"
    // }
  );

  return steps;
}