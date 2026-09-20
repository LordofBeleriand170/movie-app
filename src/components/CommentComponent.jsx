"use client";

import React from "react";

import CommentFormatComponent from "./CommentFormatComponent";

const CommentComponent = ({ comment }) => {
  return <CommentFormatComponent comment={comment} type={true} />;
};

export default CommentComponent;
