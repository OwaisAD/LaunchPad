import { getOrganizations } from "@/api/organizations";
import Loader from "@/components/Loader";
import ToolTip from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { IoReload } from "react-icons/io5";

const MyOrganizations = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>My Organizations</p>

      <p>{JSON.stringify(data)}</p>

      <p>list of organizations</p>

      <p>create organization</p>

      <ToolTip tooltipText="Refresh">
        <Button onClick={() => refetch()} className="bg-blue-500 text-white px-3 py-1 rounded mb-4 cursor-pointer">
          <IoReload />
        </Button>
      </ToolTip>
    </div>
  );
};

export default MyOrganizations;
