//
// client/src/modals/global/SessionModal/index.jsx

import ASModalWrapper from "../../ASModalWrapper";
import ASModalStyles from "../../ASModalWrapper/styles.module.css";

import { useModalNavigation } from "../../../hooks/useModalNavigation";
import { useQueryClient } from "@tanstack/react-query";

import useFetchSession from "../../../hooks/fetch/production/useFetchSession";
import usePostRequestCommitSession from "../../../hooks/fetch/production/usePostRequestCommitSession";

import SectionHeader from "./SectionHeader";
import SectionLines from "./SectionLines";
import Loading from "../../../components/loaders/Loading";

const SessionModal = ({ isHidden, onClose }) => {
  const { modalParams } = useModalNavigation();
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
    <ASModalWrapper isHidden={isHidden} onClose={onClose} size="medium">
      <div className={ASModalStyles.stickyTitleBar}>
        <div className={ASModalStyles.title}>
          <h3>Inventory Session</h3>
        </div>
        <div className={ASModalStyles.titleButtons}>
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
      <div className={ASModalStyles.modalBody}>
        <SectionHeader data={header} />
        <SectionLines rows={lines} />
      </div>
      <div className="btn-container">
        <button className="regular-btn cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </ASModalWrapper>
  );
};

export default SessionModal;
