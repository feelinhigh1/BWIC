export interface TeamMember {
  name: string;
  position: string;
  experience: string;
  image: string;
  background: string;
  bio: string;
  achievements: string[];
}

export const teamMembers: TeamMember[] = [
  {
    name: "Rameshwor Paudel",
    position: "Founder & CEO",
    experience: "35+ years in real estate and entrepreneurship",
    image: "RP",
    background: "Property consultant, BBA from KU School of Management",
    bio: "Rameshwor leads BWIC with a passion for transforming Nepal's real estate landscape through innovation and accessibility. He focuses on long-term value creation and ethical investing.",
    achievements: [
      "Founded BWIC to simplify property investment in Nepal",
      "Built partnerships with key developers in Kathmandu Valley",
      "Established BWIC as a trusted brand in the Nepali real estate sector",
    ],
  },
  {
    name: "Roshan Poudel",
    position: "Chief Operating Officer",
    experience: "4+ years in accounts, project management and operations",
    image: "AA",
    background:
      "Former operations lead at a fintech startup, BBA from Ace Institute",
    bio: "Roshan ensures smooth execution of company strategies and investor services. She’s instrumental in setting up our internal processes and partner workflows.",
    achievements: [
      "Led setup of BWIC’s investment portal",
      "Managed pilot onboarding of early investors",
      "Streamlined due diligence and compliance procedures",
    ],
  },
  {
    name: "Rajan Khadka",
    position: "Head of Market Research",
    experience: "3+ years in real estate data analysis",
    image: "RK",
    background: "Economics graduate from Tribhuvan University",
    bio: "Rajan studies local and regional real estate trends to guide our acquisition strategy. His research helps BWIC make data-driven investment decisions.",
    achievements: [
      "Published reports on land value trends in Kathmandu & Pokhara",
      "Developed BWIC’s first market scoring framework",
      "Presented insights at Nepal Real Estate Forum 2024",
    ],
  },
  {
    name: "Sujata Tamang",
    position: "Community & Investor Relations Lead",
    experience: "4+ years in client engagement",
    image: "ST",
    background: "PR and Communications specialist, Bachelors from PU",
    bio: "Sujata handles our communication with investors and local communities. She fosters transparency, education, and trust around property investing.",
    achievements: [
      "Built BWIC’s investor onboarding and FAQ content",
      "Organized 10+ investor awareness sessions across Bagmati province",
      "Launched BWIC’s monthly investor newsletter",
    ],
  },
];
