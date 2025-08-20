import React from "react";
import { services, processSteps } from "@/utils/Services";

const Service = () => {
  return (
    <div className="bg-slate-800 min-h-screen lg-mt-15 mt-10">
      {/* Header Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-6" />
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive investment solutions designed to help you navigate
            every stage of your financial journey with confidence and expertise.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="sm:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-slate-200 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer"
              >
                <div className="text-5xl mb-5">{service.icon}</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How We Work
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Our proven four-step process ensures your investment journey is
              smooth, transparent, and successful.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {/* Line between steps on large screens */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-full h-px bg-blue-200 transform translate-x-[calc(50%+2rem)]" />
                )}

                {/* Icon with glow effect */}
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition">
                  {step.step}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mt-5 mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed px-2">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Service;
