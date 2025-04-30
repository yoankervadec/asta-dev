//
// client/src/pages/DashBoard/index.jsx

import { viewPdf } from "../../api/pdf/viewPdf";

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
    {
      type: "button",
      title: "Production list",
      icon: "fas fa-download",
      onClick: () => {
        viewPdf("/pdf/production-list", "", "Production List");
      },
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
