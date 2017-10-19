import React from "react";


const BaseSpanButton = ({ text, fontClass, fontClassSize, cssExtra, onClick }) => <span className={`fa ${fontClass} ${fontClassSize} ${cssExtra}`} aria-hidden="true" onClick={onClick} > {text}</span>;

const SpanButton = (props) => <BaseSpanButton {...props} />;


export default SpanButton;
