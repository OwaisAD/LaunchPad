import Header from "@/components/Header";

const LandingPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/landingPageBackground.png" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45 z-10" />

      {/* Header */}
      <div className="z-30">
        <Header />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-md">LaunchPad</h1>
        <p className="text-xl md:text-2xl max-w-xl drop-shadow-sm">
          Instantly scaffold compliant, full-stack projects with DevOps best practices.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
