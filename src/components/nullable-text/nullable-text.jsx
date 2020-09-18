import React from "react";
import PropTypes from "prop-types";

function NullableText({ value, placeholder, proxyCheck }) {
  const checkVal = proxyCheck ? proxyCheck : value;

  if (!checkVal) {
    return <i>{placeholder}</i>;
  }

  return value;
}

NullableText.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  checkVal: PropTypes.string,
};

export default NullableText;
