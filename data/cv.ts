import type { CVData } from "@/types/cv";

export const cvData: CVData = {
  contact: {
    name: "Ahmed Hesham Lotfy",
    phone: "+20 10 1878 9502",
    email: "ahmedheshamcontact@gmail.com",
    linkedin: "https://linkedin.com/in/ahmed-hesham-8h",
    github: "https://github.com/ahmed8ch",
    militaryStatus: "Exempted",
    location: "Giza, Egypt",
  },
  summary:
    "Software developer with hands-on experience building Flutter mobile applications and product-focused user interfaces. Experienced in integrating REST APIs and designing bilingual, RTL-ready mobile experiences. Currently expanding into React and modern web development through the DEPI program.",
  skills: [
    { category: "Programming Languages", skills: ["JavaScript (ES6+)", "TypeScript", "Dart", "Python", "C++"] },
    { category: "Web & Mobile", skills: ["Flutter", "HTML5", "CSS3", "Bootstrap", "Responsive UI", "REST API Integration", "Localization / RTL"] },
    { category: "Developer Tools", skills: ["Git", "GitHub", "Visual Studio Code", "Android Studio", "Cursor"] },
    { category: "Design Tools", skills: ["Figma", "Affinity", "Canva"] },
  ],
  training: [
    {
      role: "React Frontend Web Developer Trainee",
      institution: "Digital Egypt Pioneers Initiative (DEPI)",
      organization: "Ministry of Communications and Information Technology (MCIT)",
      mode: "Hybrid",
      location: "Giza, Egypt",
      period: "Jul 2026 — Present",
      isCurrent: true,
      highlights: ["Currently training in HTML5, CSS3, JavaScript, TypeScript, Bootstrap, Git/GitHub, UI/UX, and clean-code practices."],
      upcomingModules: ["React", "Next.js", "Node.js/Express.js", "NestJS", "Docker", "Unit Testing", "Full-Stack Capstone"],
    },
    {
      role: "Backend AI Engineering Intern",
      institution: "FlyRank AI",
      organization: "FlyRank AI",
      mode: "Remote",
      location: "Remote",
      period: "Aug 2026 — Present",
      isCurrent: true,
      highlights: [
        "Developing foundational backend and AI engineering skills through structured technical modules and assignments.",
        "Contributing to an in-progress capstone project focused on APIs, application data flow, and AI-powered systems.",
      ],
    },
  ],
  projects: [
    {
      slug: "otlob",
      title: "Otlob",
      subtitle: "Food Ordering Mobile App",
      type: "Graduation Project",
      period: "Jul 2025 — Jan 2026",
      stack: ["Flutter", "Dart", "Riverpod", "GoRouter", "Hive", ".NET REST APIs", "Figma"],
      highlights: [
        "Developed the Flutter client, delivering 30+ screens across authentication, onboarding, restaurant browsing and details, favourites, cart, orders, account management, and support.",
        "Integrated the Flutter client with the team's .NET backend through REST APIs, covering the application's core workflows; used Riverpod for state management, GoRouter for navigation, and Hive, SharedPreferences, and Flutter Secure Storage for local and session data.",
        "Implemented English/Arabic localization, RTL layouts, and light/dark themes; created the Figma visual system, including the palette, typography, logo assets, iconography, and Otto, the AI-assistant mascot.",
      ],
    },
    {
      slug: "pulse-news",
      title: "Pulse News",
      subtitle: "Mobile News Reader",
      period: "Jul 2024 — Sep 2024",
      stack: ["Flutter", "Dart", "NewsAPI.org", "REST APIs"],
      highlights: [
        "Built an API-driven Flutter news app using NewsAPI.org to display category-filtered headlines, images, summaries, and article details.",
        "Enabled readers to mark articles as favourites, share them through native controls, return to the top in one tap, and read full articles within the app using WebView or open them in an external browser.",
      ],
    },
    {
      slug: "connect-4",
      title: "Connect 4",
      subtitle: "2D Strategy Game",
      period: "Mar 2024 — May 2024",
      stack: ["Python", "Pygame"],
      highlights: [
        "Developed PvP and PvAI gameplay in Pygame with score and turn tracking, win detection across rows, columns, and diagonals, persistent side-panel controls, and audio feedback.",
        "Integrated a rule-based opponent that prioritizes winning moves and blocks immediate threats.",
      ],
    },
  ],
  education: [{ degree: "Bachelor of Science (B.Sc.) in Computer Engineering and Information Technology", institution: "Modern Academy for Engineering and Technology", location: "Maadi, Cairo, Egypt", graduationDate: "May 2026" }],
  certifications: [
    {
      title: "Flutter Application Development",
      hours: 60,
      issuer: "YAT Learning Centers",
      issuedDate: "Sep 2024",
      location: "Maadi, Cairo, Egypt",
      credentialUrl: "https://www.linkedin.com/in/ahmed-hesham-8h/overlay/Certifications/2006174317/treasury/?profileId=ACoAAETOWREBm7NY4RLzrni6oTTGKxX-YgEmBa0",
      highlights: ["Completed hands-on training in Dart fundamentals, Flutter widgets, and navigation architecture.", "Developed stateful mobile interfaces connected to backend data providers via REST API integration."],
    },
    {
      title: "ALX Software Engineering Program — Foundations",
      issuer: "ALX Africa",
      issuedDate: "Nov 2023 — Mar 2024",
      location: "Remote",
      highlights: ["Worked through daily, project-based assignments in Linux and WSL environments using Bash, SSH, Vim, and Nano for command-line navigation and file management.", "Managed version-control workflows using Git and GitHub while engaging in remote peer collaboration."],
    },
    {
      title: "CCNA: Introduction to Networks",
      hours: 70,
      issuer: "Cisco Networking Academy",
      issuedDate: "Aug 2023",
      location: "Maadi, Cairo, Egypt",
      credentialUrl: "https://www.credly.com/badges/c4e186e4-0774-427a-83f6-0f35ab0f38b1",
      highlights: ["Built foundational networking skills through instructor-led labs configuring routers, switches, and end devices with Cisco hardware and Packet Tracer.", "Covered network models and protocols, Ethernet, IPv4/IPv6 addressing, subnetting, switching, IP connectivity, and network-security fundamentals."],
    },
  ],
  volunteer: [{ role: "Multimedia Intern", organization: "Enactus Modern Academy", location: "Cairo, Egypt", period: "Feb 2020 — Mar 2020", highlights: ["Designed member ID badges using Adobe Illustrator.", "Created team T-shirt graphics and event designs using Canva."] }],
};
