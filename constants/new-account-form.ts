

export const InterestOfOptions = [
  "reading room",
  "digital literacy programs",
  "computer fundamentals",
  "coding and programming workshops",
  "productivity software training",
  "career development sessions",
  "short—term certification and crash sources",
  "camps, movies/documentaries",
] as const;

export const stepAnimationStyles = `
@keyframes stepSlideInForward {
  from { opacity: 0; transform: translateX(28px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes stepSlideInBackward {
  from { opacity: 0; transform: translateX(-28px); }
  to { opacity: 1; transform: translateX(0); }
}
.step-forward { animation: stepSlideInForward 320ms cubic-bezier(0.16, 1, 0.3, 1); }
.step-backward { animation: stepSlideInBackward 320ms cubic-bezier(0.16, 1, 0.3, 1); }
`;