import ViteraVBImage from './images/vitera_vb.png'; // Assuming it's in src/images/
import LeilaVBImage from './images/leila_vb.png'; // Add this import

export const testimonials = [
  // --- Sample Combined/Featured Testimonial ---
  {
    id: 1,
    quote:
      "First, RapidWorks helped me secure €50,000 in subsidies. In parallel, we set up our branding in just 5 days, allowing us to scale to customers right as the subsidy was granted. With Yannick as our coach, we maintain momentum through weekly sessions. Thanks to our Rapid Expert, we're adding new features to our software daily at an unprecedented pace. These services combined helped us validate demand, pivot our marketing, and reach paying customers, putting us on track for growth. Thank you RapidWorks, it would have taken years to get where we are now in just 10 weeks!",
    authorName: "Alex Müller",
    authorTitle: "Founder, TechInnovate GmbH",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Sample image
    companyLogoUrl: null, // Add logo URL if available
    services: ["financing", "branding", "coaching", "experts"], // Services used
    isFeatured: true, // Mark for main page
  },
  // --- Sample Service-Specific Testimonials ---
  {
    id: 2,
    quote:
      "The Rapid Branding package gave us a professional look overnight. The website looks fantastic, and the quick turnaround was exactly what we needed to start our marketing push.",
    authorName: "Sophia Brandt",
    authorTitle: "Co-Founder, EcoSolutions UG",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Sample image
    companyLogoUrl: null,
    services: ["branding"],
    isFeatured: true,
  },
  {
    id: 3,
    quote:
      "Yannick's coaching sessions are invaluable. His experience helped us avoid critical mistakes and stay focused on our strategic goals. Highly recommended for any early-stage founder.",
    authorName: "David Fischer",
    authorTitle: "CEO, HealthTech Startup",
    imageUrl: null, // No image example
    companyLogoUrl: null,
    services: ["coaching"],
    isFeatured: true,
  },
  {
    id: 4,
    quote:
      "Navigating the subsidy landscape was daunting. RapidWorks made the financing process smooth and successful, securing essential funding for our growth.",
    authorName: "Lena Mayer",
    authorTitle: "Founder, FoodTech Inc.",
    imageUrl: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Sample image
    companyLogoUrl: null,
    services: ["financing"],
    isFeatured: false,
  },
   {
    id: 5,
    quote:
      "Getting access to a skilled software expert on demand through Rapid Experts accelerated our development cycle significantly. It's flexible and cost-effective.",
    authorName: "Max Hoffmann",
    authorTitle: "CTO, SaaS Platform",
    imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Sample image
    companyLogoUrl: null,
    services: ["experts"],
    isFeatured: false,
  },
  // Updated Branding Testimonial for Vitera
  {
    id: 6,
    quote:
      "The branding process was incredibly efficient. RapidWorks delivered a complete set of assets, including our new website design, social media banners, and even billboard mockups, all within a week. This quick turnaround was crucial for our market launch.",
    authorName: "The Vitera Team", // Updated
    authorTitle: "Project Staffing Reinvented", // Updated
    imageUrl: null, // You can add a generic Vitera logo or author image if you have one
    companyLogoUrl: null, // Or Vitera logo here if distinct from imageUrl
    services: ["branding"],
    isFeatured: false,
    projectShowcaseImage: ViteraVBImage // <<< Use the imported variable
  },
  {
    id: 7,
    quote:
      "Rapid Works helped us align our business and brand with our values. The branding and website reflect our mission perfectly, and the process was smooth and inspiring. Highly recommended for any impact-driven business!",
    authorName: "Dr. Leila Momen",
    authorTitle: "Founder, tax&purpose",
    imageUrl: null, // Add a profile image if available
    companyLogoUrl: null, // Or logo if available
    services: ["branding"],
    isFeatured: false,
    projectShowcaseImage: LeilaVBImage // Use the imported variable
  },
  // Add more testimonials as needed...
]; 