import { useState } from "react";

import { localStorageAvailable, sessionStorageAvailable } from "../../../components";

const useGettingStarted = () => {
  const userShownKey = "nmGettingStartedUserShown";
  const userDoNotShowKey = "nmGettingStartedUserDoNotShow";
  let initUserShown = false;
  let initUserDoNotShow = false;

  if (localStorageAvailable()) {
    const tmpUserDoNotShow = localStorage.getItem(userDoNotShowKey);

    if (tmpUserDoNotShow !== null) {
      initUserDoNotShow = tmpUserDoNotShow === "true";
    } else {
      localStorage.setItem(userDoNotShowKey, "true");
      initUserDoNotShow = true;
    }
  }

  if (sessionStorageAvailable()) {
    const tmpUserShown = sessionStorage.getItem(userShownKey);

    if (tmpUserShown !== null) {
      initUserShown = true;
    } else {
      sessionStorage.setItem(userShownKey, "true");
    }
  }

  const [userDoNotShow, setStateUserDoNotShow] = useState(initUserDoNotShow);
  const [open, setOpen] = useState(!initUserShown && !initUserDoNotShow);

  return {
    userDoNotShow,
    setUserDoNotShow: (val) => {
      setStateUserDoNotShow(val);

      if (localStorageAvailable()) {
        localStorage.setItem(userDoNotShowKey, val ? "true" : "false");
      }
    },
    gettingStartedOpen: open,
    setGettingStartedOpen: setOpen,
  };
};

export default useGettingStarted;
