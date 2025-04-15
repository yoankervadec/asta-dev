//
// client/src/pages/DashBoard/index.jsx

import useFetchJobs from "../../hooks/fetch/dashboard/useFetchJobs";

import Loading from "../../components/loaders/Loading";
import NavigationBar from "../../components/NavigationBar";
import JobBoard from "./JobBoard";

const DashBoard = () => {
  const { data, isLoading } = useFetchJobs();
  const jobs = data?.data?.jobs || [];

  const navIcons = [
    {
      type: "link",
      to: "/home",
      title: "Home",
      icon: "fas fa-house",
    },
  ];
  return (
    <div className="content-wrapper">
      {isLoading ? <Loading /> : null}
      <div className="content">
        <JobBoard jobs={jobs} />
      </div>
      <NavigationBar navIcons={navIcons} />
    </div>
  );
};

export default DashBoard;
