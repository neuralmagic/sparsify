import React from "react";
import PropTypes from "prop-types";

function NullableText({ value, placeholder, proxyCheck, children }) {
  const checkVal = proxyCheck ? proxyCheck : value;

  if (!checkVal) {
    return <i>{placeholder}</i>;
  }

  return children;
}

NullableText.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string.isRequired,
  checkVal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
};

export default NullableText;
