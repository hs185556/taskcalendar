import React, { useEffect, useState } from "react";
import { Picker } from "antd-mobile";

// 基础用法
export default function BasicDemo(props) {
  const {
    task,
    submit,
    basicColumns,
    visible,
    setVisible,
  } = props;

  return (
    <>
      <Picker
        columns={basicColumns}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        destroyOnClose
        onConfirm={(v) => {
          submit({ id: task.id, status: v[0] });
        }}
      />
    </>
  );
}
