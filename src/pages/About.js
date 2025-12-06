// AboutPage.jsx
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAbout } from "../services/api";
import { QRCode, Spin } from "antd";
// --- Icons & small components (same as your current file) ---
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

const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-center space-x-3 mb-6">
    {Icon && <Icon className="w-8 h-8 text-cyan-500" />}
    <h2 className="text-xl md:text-xl xs:text-s font-extrabold text-gray-800 border-b-4 border-cyan-500 pb-1 inline-block">
      {children}
    </h2>
  </div>
);

const TimelineItem = ({ period, role, isLast }) => (
  <li className="relative mb-3 pl-8">
    <div className="absolute w-4 h-4 rounded-full mt-0.5 left-[4px] border-2 border-cyan-500 bg-white shadow-md z-10" />
    {!isLast && (
      <div className="absolute h-full w-0.5 bg-gray-300 left-[11px] top-0 z-0" />
    )}
    <p className="text-base font-bold text-gray-900 mb-0.5">{period || role}</p>
    <p className="text-gray-600 text-sm">{role}</p>
  </li>
);

const Timeline = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <ul className="list-none p-0 relative">
      {data.map((item, index) => (
        <TimelineItem
          key={index}
          period={item.year || item.period}
          role={item.text || item.role || item.event}
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

    <div className="space-y-2">
      {(project.goals || project.eligibility || []).map((item, index) => (
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

// MAIN COMPONENT
const AboutPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["about"],
    queryFn: getAbout,
    refetchOnWindowFocus: false,
  });

  const about = useMemo(() => data || {}, [data]);

  const renderList = (items = []) => (
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Spin />

      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">
          Failed to load about content. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8 lg:p-12">
      {/* Header Section */}
      <header className="text-center mb-10 pt-8 pb-8 bg-white rounded-xl shadow-2xl border-b-4 border-cyan-500">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {about.title}
        </h1>
        <p className="mt-3 text-xl md:text-2xl text-cyan-600 font-light italic">
          {about.subtitle}
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-5">
        {/* Meaning & Vision */}
        <section
          id="meaning"
          className="grid md:grid-cols-2 gap-12 p-6 bg-cyan-50 rounded-2xl shadow-inner"
        >
          <div>
            <SectionTitle icon={GlobeIcon}>
              {about?.meaning?.headline}
            </SectionTitle>
            <p className="text-gray-700 text-lg leading-relaxed font-semibold">
              {about?.meaning?.description}
            </p>
          </div>

          <div>
            <SectionTitle icon={ZapIcon}>
              {about?.vision?.headline}
            </SectionTitle>
            <p className="text-gray-700 text-lg leading-relaxed font-semibold">
              {about?.vision?.text}
            </p>
          </div>
        </section>

        {/* Founder */}
        <section id="founder">
          <SectionTitle icon={UserIcon}>
            Meet the Founder: {about?.founder?.name}
          </SectionTitle>
          <p className="text-cyan-700 text-lg italic mb-6">
            {about?.founder?.short_bio}
          </p>
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-10">
            <Timeline data={about.roadmap || []} />
          </div>
        </section>

        {/* NGO Projects */}
        <section id="projects">
          <SectionTitle icon={HeartIcon}>
            NGO and Community Projects
          </SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            {(about.ngo_projects || []).map((project) => (
              <ProjectCard key={project.project_key} project={project} />
            ))}
          </div>
        </section>

        {/* Conservation & Support */}
        <section className="grid lg:grid-cols-3 gap-12">
          <div id="conservation" className="lg:col-span-2">
            <SectionTitle icon={GlobeIcon}>
              {about?.conservation?.headline}
            </SectionTitle>
            <p className="text-cyan-700 text-lg italic mb-6">
              {about?.conservation?.statement}
            </p>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-gray-800 mb-3">
                Our Core Principles:
              </h4>
              {renderList(about?.conservation?.principles || [])}
            </div>
          </div>

          <div
            id="support"
            className="lg:col-span-1 bg-cyan-100 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center"
          >
            <ZapIcon className="w-10 h-10 text-cyan-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {about?.support?.headline}
            </h3>
            <p className="text-gray-700 mb-6 text-sm">{about?.support?.text}</p>

            {/* QR / image placeholder – you can replace with actual QR image later */}
            {about?.support?.qr_url && (
              <div className="p-4 bg-white rounded-lg shadow-inner">
                <QRCode
                  errorLevel="H"
                  value={about?.support?.qr_url}
                  icon={"https://cdn.jsdelivr.net/gh/suriyaofficial/DIVE_HRZN_ASSETS/companyLogo/companyLogo.png"}
                />
              </div>
            )}

            <button
              onClick={() => window.open(about?.support.qr_url, "_blank")}
              className="mt-6 w-full py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition duration-300 shadow-md"
            >
              Contribute Now
            </button>
          </div>
        </section>
      </main>

      <footer className="mt-20 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} DIVE HRZN. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutPage;
