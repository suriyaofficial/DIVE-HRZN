import { Avatar } from "antd";
import React from "react";

const PolicyLayout = ({
  title,
  updatedAt,
  sections,
  companyName,
  logoUrl,
  signed,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 px-3 py-6 md:px-6 md:py-10">
      {/* A4-style page */}
      <main
        className="
          relative
          mx-auto
          bg-white
          shadow-lg
          rounded-md
          border border-gray-200
          max-w-[794px]           /* ~A4 width at 96dpi */
          min-h-[1123px]          /* ~A4 height */
          px-5 py-6 md:px-10 md:py-8
        "
      >
        {/* Header with logo + company name */}
        <header className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo on left */}
            {logoUrl ? (
              
              <Avatar size={100} src={logoUrl} />
            ) : (
              <div className="h-10 md:h-12" />
            )}

            {/* Company name & small info on right */}
            <div className="text-right">
              {companyName && (
                <p className="text-xs md:text-sm font-semibold text-gray-800">
                  {companyName}
                </p>
              )}
              {updatedAt && (
                <p className="text-[10px] md:text-xs text-gray-500">
                  Last updated: {updatedAt}
                </p>
              )}
            </div>
          </div>

          {/* Document title centered below */}
          <h1 className="mt-4 text-lg md:text-xl font-bold text-center text-gray-900 tracking-wide">
            {title}
          </h1>
        </header>

        {/* Body content */}
        <div className="space-y-5 text-[13px] md:text-sm text-gray-800 leading-relaxed pr-4">
          {sections?.map((section, idx) => (
            <section key={idx} className="space-y-1.5">
              {section.heading && (
                <h2 className="font-semibold text-gray-900 text-sm md:text-base">
                  {section.heading}
                </h2>
              )}

              {section.paragraphs?.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="list-disc pl-5 space-y-1">
                  {section.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Signature / seal image bottom-right */}
        {signed && (
          <div className="absolute bottom-10 right-10 text-right text-[10px] text-gray-500">
            <div className="inline-flex flex-col items-center">
              <img
                src={signed}
                alt="Authorised signature and seal"
                className="h-20 md:h-24 object-contain mb-1"
              />
              <span>Authorised Signatory</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PolicyLayout;
