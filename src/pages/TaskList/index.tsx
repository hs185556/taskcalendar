import { List, Radio, Dialog, SwipeAction, Tag } from "antd-mobile";
import { AddOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Action } from "antd-mobile/es/components/swipe-action";
import { statusObj, statusNext } from "@/pages/Task/index";
import AddTask from "@/pages/Task/components/AddTask";
import StatuPicker from "@/pages/Task/components/StatuPicker";
import { addTask, deleteTask, getTasks, updateTask } from "../../services/Task";
import styles from "./index.less";

export default function Task(props: any) {
  const [values, setValues] = useState({});
  const [visible1, setVisible1] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState({});

  const queryTasks = (date?) => {
    getTasks(date, (rs) => {
      setTasks(Array.from(rs.rows));
      /* .sort(
          (a, b) =>
            new Date(b.startTime).getMilliseconds() -
            new Date(a.startTime).getMilliseconds()
        ) */
      console.log("------------", Array.from(rs.rows));
    }, "ORDER BY startTime DESC, status ASC");
  };

  useEffect(() => {
    queryTasks();
  }, []);

  const getTitle = (time1: string, time2: string) => {
    return time1 === time2 ? time1 : `${time1} / ${time2}`;
  };

  const removeTask = (id) => {
    deleteTask(id);
    queryTasks();
  };

  const modifyTask = (data) => {
    updateTask(data);
    queryTasks();
    setPickerVisible(false);
  };

  const submit = (values) => {
    console.log(values);
    if (values.id) {
      modifyTask(values);
    } else {
      addTask(values);
      queryTasks();
    }
    setVisible1(false);
  };

  const rightActions: Action[] = [
    {
      key: "update",
      text: "修改",
      color: "warning",
    },
    {
      key: "delete",
      text: "删除",
      color: "danger",
    },
  ];

  return (
    <div className={styles.container}>
      <List header="任务列表" className={styles.list}>
        <AddOutline
          className={styles.addIcon}
          onClick={() => {
            setValues({});
            setVisible1(true);
          }}
        />
        {tasks.map((v) => {
          return (
            <SwipeAction
              key={v.id}
              rightActions={rightActions}
              onAction={async (action) => {
                switch (action.key) {
                  case "update":
                    setValues(v);
                    setVisible1(true);
                    break;
                  case "delete":
                    const result = await Dialog.confirm({
                      content: "是否删除记录",
                    });
                    if (result) {
                      removeTask(v.id);
                    }
                    break;
                  default:
                    break;
                }
              }}
            >
              <List.Item
                onClick={() => {
                  setCurrentTask(v);
                  setPickerVisible(true);
                }}
                description={v.desc || ""}
                prefix={
                  <Tag color={statusObj[v.status].color}>
                    {statusObj[v.status].text}
                  </Tag>
                }
                extra={getTitle(v.startTime, v.stopTime)}
                key={v.id}
              >
                {v.title}
              </List.Item>
            </SwipeAction>
          );
        })}
      </List>
      <AddTask
        values={values}
        visible={visible1}
        setVisible={setVisible1}
        submit={submit}
        date={undefined}
      />
      <StatuPicker
        task={currentTask}
        submit={modifyTask}
        basicColumns={[
          (statusNext[currentTask.status] || []).map((item) => ({
            label: statusObj[item].text,
            value: item,
          })),
        ]}
        visible={pickerVisible}
        setVisible={setPickerVisible}
      />
    </div>
  );
}
