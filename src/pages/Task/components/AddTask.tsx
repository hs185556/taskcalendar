import { Popup, Form, Input, Button, DatePicker } from "antd-mobile";
import type { FormInstance } from "antd-mobile/es/components/form";
import React, { useEffect } from "react";
import dayjs from "dayjs";
// import styles from "./index.less";

export default function CalendarList(props) {
  const formRef = React.createRef<FormInstance>();
  const { values, visible, setVisible, submit, date } = props;

  useEffect(() => {
    if (visible) {
      if (values && Object.keys(values).length) {
        setTimeout(() => {
          formRef.current?.setFieldsValue({
            ...values,
            startTime: new Date(values.startTime),
            stopTime: new Date(values.stopTime),
          });
        }, 200);
      } else {
        formRef.current?.resetFields([
          "title",
          "desc",
          "startTime",
          "stopTime",
        ]);
      }
    }
  }, [visible]);

  return (
    <div /* className={styles.container} */>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        position="right"
        bodyStyle={{ width: "80vw" }}
      >
        <Form
          ref={formRef}
          name="form"
          onFinish={(formvalues) =>
            submit({
              ...formvalues,
              startTime: dayjs(formvalues.startTime).format("YYYY-MM-DD"),
              stopTime: dayjs(formvalues.stopTime).format("YYYY-MM-DD"),
              id: values.id,
            })
          }
          footer={
            <Button block type="submit" color="primary" size="large">
              提交
            </Button>
          }
        >
          <Form.Header>新建任务</Form.Header>
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item name="desc" label="描述">
            <Input placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="开始时间"
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
            initialValue={(date && new Date(date)) || undefined}
          >
            <DatePicker>
              {(value) =>
                value ? (
                  dayjs(value).format("YYYY-MM-DD")
                ) : (
                  <span style={{ color: "#cccccc" }}>请选择日期</span>
                )
              }
            </DatePicker>
          </Form.Item>
          <Form.Item
            name="stopTime"
            label="截止时间"
            trigger="onConfirm"
            onClick={(e, datePickerRef) => {
              datePickerRef.current?.open();
            }}
            initialValue={(date && new Date(date)) || undefined}
            dependencies={["startTime"]}
            rules={[
              {
                validator: () => {
                  const { startTime, stopTime } =
                    formRef.current?.getFieldsValue();
                  if (startTime > stopTime) {
                    return Promise.reject("截止时间应该在开始时间之后！");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker>
              {(value) =>
                value ? (
                  dayjs(value).format("YYYY-MM-DD")
                ) : (
                  <span style={{ color: "#cccccc" }}>请选择日期</span>
                )
              }
            </DatePicker>
          </Form.Item>
        </Form>
      </Popup>
    </div>
  );
}
