export interface Service {
  title: string;
  icon: string;
  description: string;
  features: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    title: "Property Investment Advisory",
    icon: "🏘️",
    description:
      "Expert guidance on investing in residential and commercial real estate across Nepal.",
    features: [
      "Local market insights",
      "Feasibility studies",
      "Risk assessment",
      "ROI projections",
      "Custom investment plans",
    ],
  },
  {
    title: "Land Acquisition Support",
    icon: "🗺️",
    description:
      "We assist you in identifying and acquiring legally verified land in strategic locations.",
    features: [
      "Due diligence and title verification",
      "Government clearance assistance",
      "Location scouting",
      "Zoning & regulatory checks",
      "Purchase negotiation support",
    ],
  },
  {
    title: "Project Development Services",
    icon: "🏗️",
    description:
      "End-to-end support for real estate development, from planning to project execution.",
    features: [
      "Architectural planning",
      "Contractor liaison",
      "Regulatory compliance",
      "Timeline management",
      "Quality assurance",
    ],
  },
  {
    title: "Rental Property Management",
    icon: "🏠",
    description:
      "Manage and grow your rental property portfolio with our reliable property management services.",
    features: [
      "Tenant sourcing",
      "Rental agreements",
      "Maintenance coordination",
      "Rent collection",
      "Occupancy tracking",
    ],
  },
  {
    title: "Real Estate Portfolio Diversification",
    icon: "📈",
    description:
      "We help you diversify your investment portfolio with strategic real estate assets across Nepal.",
    features: [
      "Mixed-use properties",
      "Tourism real estate",
      "Agricultural lands",
      "Commercial spaces",
      "Joint venture opportunities",
    ],
  },
  {
    title: "Legal & Financial Consultation",
    icon: "📜",
    description:
      "Access professional legal and financial advisors to ensure safe and smart investment decisions.",
    features: [
      "Legal vetting",
      "Tax and compliance guidance",
      "Banking and loan assistance",
      "Document drafting",
      "Investment structuring",
    ],
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: "1",
    title: "Initial Consultation",
    description:
      "We begin with a comprehensive discussion of your financial goals, risk tolerance, and current situation.",
  },
  {
    step: "2",
    title: "Strategy Development",
    description:
      "Our team creates a customized investment strategy aligned with your objectives and timeline.",
  },
  {
    step: "3",
    title: "Implementation",
    description:
      "We execute your investment plan with precision, leveraging our expertise and market relationships.",
  },
  {
    step: "4",
    title: "Ongoing Management",
    description:
      "Continuous monitoring, regular reviews, and strategic adjustments to keep you on track.",
  },
];
