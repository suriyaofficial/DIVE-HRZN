import React, { useMemo } from "react";

// Mocking the JSON response you expect from the API
const aboutData = {
  title: "DIVE_HRZN",
  subtitle: "The line between dream and reality",
  meaning: {
    headline: "Dive Above & Below the Horizon",
    description:
      "DIVE_HRZN is the bridge between two worlds: the ocean below the horizon and the sky above it. The planet is 71% water — a world of life, silence and adventure — while the remainder is the air and sky that teach freedom and possibility. DIVE_HRZN connects both: exploration, learning and transformation.",
  },
  founder: {
    name: "Suriya",
    short_bio:
      "Engineer, developer, and adventure seeker who builds technology and leads people into the ocean and the sky.",

    upcoming_goal:
      "Become a PADI Open Water Scuba Instructor (OWSI) to teach and bring more people into the underwater world.",
  },
  roadmap: [
    { year: "2014–2018", text: "Mechanical Engineering graduation" },
    {
      year: "2018–2022",
      text: "Worked as Automation Engineer — robotics, sensors & machine automation",
    },
    {
      year: "2023–2025",
      text: "Full Stack Developer — building applications and platforms",
    },
    { year: "2023", text: "Joined Skydiving AFF program" },
    {
      year: "2025",
      text: "Completed PADI Divemaster with 150+ dives + specialties",
    },
    {
      year: "Upcoming",
      text: "Plan to pursue PADI Open Water Scuba Instructor (OWSI)",
    },
  ],
  vision: {
    headline: "Why we exist",
    text: "To inspire people to break fear, explore more, and feel alive. The sky teaches freedom. The ocean teaches peace. Both teach who you really are. DIVE_HRZN exists to bring these experiences to everyone.",
  },
  ngo_projects: [
    {
      project_key: "DIVE_HRZN_PathFinder",
      display_name: "DIVE_HRZN PathFinder",
      mission:
        "Help the next generation step into the world of scuba and skydiving.",
      goals: [
        "Introduce 100 students into scuba diving",
        "Guide 100 students to start skydiving",
        "Provide mentorship, safety awareness and career advice",
      ],
      notes: "Focus on outreach, training scholarships and mentorship.",
    },
    {
      project_key: "DIVE_HRZN_HopeDive",
      display_name: "DIVE_HRZN HopeDive",
      mission:
        "Give one person every month a free Discover Scuba Diving (DSD) experience.",
      eligibility: [
        "People who cannot afford adventure",
        "Students and underserved individuals who dream of the ocean",
        "First-time explorers who lack opportunity",
      ],
      notes: "Small monthly gift — one life-changing experience at a time.",
    },
  ],
  conservation: {
    headline: "Protecting Our Planet — Ocean Conservation",
    principles: [
      "Zero-impact diving mindset",
      "No plastic on the beach or boat",
      "Respect marine life and habitats",
      "Educate students about ocean care",
      "Participate in underwater clean-ups and local conservation efforts",
    ],
    statement:
      "Adventure means nothing without a healthy planet. The ocean gives us adventure; we must give back protection.",
  },
  support: {
    headline: "Support the Mission",
    qr_url: "https://razorpay.me/@suriyapay",
    text: "If you believe in the mission and want to support the NGO projects, you can contribute. Your contribution helps someone touch the sky or explore the ocean for the first time.",
  },
};

// --- Icons (using Lucide-React alternatives/SVGs) ---

const GlobeIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const UserIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ZapIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const HeartIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

// --- Reusable Components ---

const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-center space-x-3 mb-6">
    {Icon && <Icon className="w-8 h-8 text-cyan-500" />}
    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 border-b-4 border-cyan-500 pb-1 inline-block">
      {children}
    </h2>
  </div>
);

const TimelineItem = ({ period, role, event, isLast }) => (
  // Compacted: mb-6 instead of mb-8, and consistent pl-8 (32px)
  <li className="relative mb-6 pl-8">
    {/* Alignment Fix: 
            Axis line center is set at 12px from the LI edge.
            Dot (16px) is centered at 12px. Start position: 12px - 8px = 4px (left-[4px])
        */}
    <div
      className={`absolute w-4 h-4 rounded-full mt-0.5 left-[4px] border-2 border-cyan-500 bg-white shadow-md z-10`}
    />

    {/* Line (2px): Centered at 12px. Start position: 12px - 1px = 11px (left-[11px])
     */}
    {!isLast && (
      <div
        className={`absolute h-full w-0.5 bg-gray-300 left-[11px] top-0 z-0`}
      />
    )}

    {/* Compaction: text-base for title (was text-lg) and mb-0.5 (was mb-1) */}
    <p className="text-base font-bold text-gray-900 mb-0.5">
      {period || event}
    </p>
    <p className="text-gray-600 text-sm">{role || event}</p>
  </li>
);

const Timeline = ({ data, type }) => {
  if (!data || data.length === 0) return null;

  return (
    <ul className="list-none p-0 relative">
      {data.map((item, index) => (
        <TimelineItem
          key={index}
          period={item.period || item.year}
          role={item.role || item.event || item.text}
          isLast={index === data.length - 1}
        />
      ))}
    </ul>
  );
};

const ProjectCard = ({ project }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
    <h3 className="text-xl font-bold text-cyan-600 mb-2 flex items-center">
      <ZapIcon className="w-5 h-5 mr-2 text-amber-500" />
      {project.display_name}
    </h3>
    <p className="text-gray-700 italic mb-4">{project.mission}</p>

    {/* Goals / Eligibility List */}
    <div className="space-y-2">
      {(project.goals || project.eligibility)?.map((item, index) => (
        <div key={index} className="flex items-start text-sm text-gray-600">
          <span className="text-cyan-500 mr-2 text-lg leading-none">
            &bull;
          </span>
          {item}
        </div>
      ))}
    </div>

    {project.notes && (
      <p className="mt-4 text-xs text-gray-500 border-t pt-2">
        Note: {project.notes}
      </p>
    )}
  </div>
);

// --- Main App Component ---

const App = () => {
  // Memoize the data to prevent unnecessary re-renders (good practice)
  const data = useMemo(() => aboutData, []);

  // Helper to render lists (Principles or Goals/Eligibility)
  const renderList = (items) => (
    <ul className="list-none p-0 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start text-gray-700">
          <span className="text-cyan-500 mr-3 text-2xl leading-none">
            &bull;
          </span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8 lg:p-12">
      {/* Header Section */}
      <header className="text-center mb-16 pt-8 pb-12 bg-white rounded-xl shadow-2xl border-b-4 border-cyan-500">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {data.title}
        </h1>
        <p className="mt-3 text-xl md:text-2xl text-cyan-600 font-light italic">
          {data.subtitle}
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-24">
        {/* 1. Meaning / Vision Section */}
        <section
          id="meaning"
          className="grid md:grid-cols-2 gap-12 p-6 bg-cyan-50 rounded-2xl shadow-inner"
        >
          {/* Meaning */}
          <div>
            <SectionTitle icon={GlobeIcon}>
              {data.meaning.headline}
            </SectionTitle>
            <p className="text-gray-700 text-lg leading-relaxed">
              {data.meaning.description}
            </p>
          </div>

          {/* Vision */}
          <div>
            <SectionTitle icon={ZapIcon}>{data.vision.headline}</SectionTitle>
            <p className="text-gray-700 text-lg leading-relaxed font-semibold">
              {data.vision.text}
            </p>
          </div>
        </section>

        {/* 2. Founder Section */}
        <section id="founder">
          <SectionTitle icon={UserIcon}>
            Meet the Founder: {data.founder.name}
          </SectionTitle>
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-10">
            {/* Short Bio & Goal */}
            <div className="grid md:grid-cols-3 gap-8 border-b pb-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  The Short Story
                </h3>
                <p className="text-gray-600 text-lg italic">
                  {data.founder.short_bio}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl shadow-md border-l-4 border-blue-500">
                <h4 className="font-semibold text-lg text-blue-800 mb-1">
                  Upcoming Goal
                </h4>
                <p className="text-sm text-gray-700">
                  {data.founder.upcoming_goal}
                </p>
              </div>
            </div>

            {/* <div className="bg-white p-8 rounded-2xl shadow-xl"> */}
            <Timeline data={data.roadmap} type="roadmap" />
            {/* </div> */}
          </div>
        </section>

        {/* 4. NGO Projects Section */}
        <section id="projects">
          <SectionTitle icon={HeartIcon}>
            NGO and Community Projects
          </SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            {data.ngo_projects.map((project, index) => (
              <ProjectCard
                key={project.project_key || index}
                project={project}
              />
            ))}
          </div>
        </section>

        {/* 5. Conservation & Support Section (Two columns) */}
        <section className="grid lg:grid-cols-3 gap-12">
          {/* Conservation */}
          <div id="conservation" className="lg:col-span-2">
            <SectionTitle icon={GlobeIcon}>
              {data.conservation.headline}
            </SectionTitle>
            <p className="text-cyan-700 text-lg italic mb-6">
              {data.conservation.statement}
            </p>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-gray-800 mb-3">
                Our Core Principles:
              </h4>
              {renderList(data.conservation.principles)}
            </div>
          </div>

          {/* Support */}
          <div
            id="support"
            className="lg:col-span-1 bg-cyan-100 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center"
          >
            <ZapIcon className="w-10 h-10 text-cyan-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {data.support.headline}
            </h3>
            <p className="text-gray-700 mb-6 text-sm">{data.support.text}</p>

            {/* Mock QR Code/Contribution Area */}
            <div className="p-4 bg-white rounded-lg shadow-inner">
              <img
                src={data.support.qr_url}
                alt="Mock QR Code for Donations"
                className="w-32 h-32 rounded"
              />
            </div>
            <button className="mt-6 w-full py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition duration-300 shadow-md">
              Contribute Now
            </button>
          </div>
        </section>
      </main>

      <footer className="mt-20 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} DIVE_HRZN. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
