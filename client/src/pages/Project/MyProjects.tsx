import PageHeading from "@/components/PageHeading";
import ToolTip from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { IoAddCircleOutline, IoReload } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MyProjects = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-10 gap-4">
        <PageHeading title="My Projects" />

        <div className="flex justify-end items-center gap-2">
          <ToolTip tooltipText="Refresh">
            <Button
              onClick={() => {
                // refetch();
                toast.success("Refreshed successfully");
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
            >
              <IoReload />
            </Button>
          </ToolTip>

          <Button
            className="flex items-center justify-center bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
            onClick={() => navigate("/projects/create")}
          >
            <IoAddCircleOutline />
            Create Project
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-lg font-semibold">No projects found</p>
        <p className="text-gray-500">You can create a new project by clicking the button above.</p>
      </div>

      {/* PROJECT CARDS*/}
      {/* REMEMBER github repo */}
      {/* MONITORING PAGE WITHIN */}
    </div>
  );
};

export default MyProjects;
