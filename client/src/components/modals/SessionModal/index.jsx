//
// client/src/components/modals/SessionModal/index.jsx

import { useModalNavigation } from "../../../hooks/useModalNavigation";
import { useQueryClient } from "@tanstack/react-query";

import useFetchSession from "../../../hooks/fetch/production/useFetchSession";
import usePostRequestCommitSession from "../../../hooks/fetch/production/usePostRequestCommitSession";

import SectionHeader from "./SectionHeader";
import SectionLines from "./SectionLines";
import Loading from "../../loaders/Loading";

const SessionModal = () => {
  const { modalParams, syncCloseModal, syncOpenModal } = useModalNavigation();
  const requestCommitSession = usePostRequestCommitSession();
  const queryClient = useQueryClient();

  const sessionNo = modalParams?.sessionNo;

  const enabled = sessionNo !== undefined;
  const { data, isLoading } = useFetchSession(enabled, sessionNo);

  const { header, lines = [] } = data?.data || {};

  const handleCommit = () => {
    if (
      !requestCommitSession.isPending &&
      header.isPosted === 0 &&
      header.details.lines > 0
    ) {
      requestCommitSession.mutate(
        { sessionNo: header.sessionNo },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["session", sessionNo]);
          },
        }
      );
    }
  };

  if (!modalParams) return null;
  return (
    <div className="large-modal-container">
      {isLoading && <Loading />}
      <div className="modal-title-wrapper">
        <div className="modal-title-content">
          <h3>Session View</h3>
          <div className="modal-title-btn-wrapper">
            <button
              className="small-btn cancel-btn"
              onClick={() => handleCommit()}
              disabled={header?.commitDisabled || header === null}
            >
              <i className="fas fa-check-to-slot"></i>
              Commit
            </button>
          </div>
        </div>
      </div>
      <div className="modal-body">
        <SectionHeader data={header} />
        <SectionLines rows={lines} />
      </div>
      <div className="btn-container">
        <button className="regular-btn cancel-btn" onClick={syncCloseModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SessionModal;
