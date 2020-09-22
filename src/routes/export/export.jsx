import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@material-ui/core";

import ExportDialog from "../../modals/export-config";

function Export() {
  const { projectId, optimId } = useParams();
  const [openExportModal, setOpenExportModal] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpenExportModal(true)}>Export</Button>
      <ExportDialog
        projectId={projectId}
        optimId={optimId}
        open={openExportModal}
        handleClose={() => setOpenExportModal(false)}
      />
    </div>
  );
}

export default Export;
