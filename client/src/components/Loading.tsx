import { DNA } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <DNA visible={true} height="80" width="80" ariaLabel="dna-loading" wrapperClass="dna-wrapper" />
    </div>
  );
};

export default Loading;
