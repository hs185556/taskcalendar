import { Calendar } from "antd-mobile";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import { LoopOutline } from "antd-mobile-icons";
import { Button } from "antd-mobile";
import React from "react";
import Task from "../Task";
import styles from "./index.less";
import { getTaskCountInMonthSync } from "@/services/Task";

export default forwardRef((props, ref) => {
  const [date, setDate] = useState();
  const [delayDays, setDelayDays] = useState([]);
  const calRef = React.createRef();

  useImperativeHandle(ref, () => ({
    toToday: () => {
      calRef.current?.jumpToToday?.();
      setDate(new Date());
    },
  }));

  const queryDelayTask = async (YM, status?) => {
    const rs = await getTaskCountInMonthSync(YM, status);
    const mDays = dayjs().daysInMonth() + 1;
    const mCounts = Array(mDays).fill(0);
    Array.from(rs.rows).forEach((row) => {
      const idx = dayjs(row.startTime).date() - 1;
      mCounts[idx] = row.count;
    });
    setDelayDays(mCounts);
  };

  useEffect(() => {
    setTimeout(() => {
      // 延迟查询 等待数据库实例化完成
      setDate(new Date());
    }, 200);
  }, []);

  useEffect(() => {
    if (date) {
    }
  }, [date]);

  return (
    <div className={styles.container}>
      <Calendar
        ref={calRef}
        selectionMode="single"
        value={date}
        onChange={(val) => {
          if (val) {
            setDate(val);
          }
        }}
        onPageChange={(year, month) => {
          const YM = year + "-" + (month < 10 ? "0" + month : month);
          queryDelayTask(YM, [0, 1, 2]);
        }}
        renderLabel={(date: Date) => {
          const item = delayDays[date.getDate() - 1];
          return item ? item : "";
        }}
      />
      <Task
        date={date && dayjs(date).format("YYYY-MM-DD")}
        queryDelayTask={queryDelayTask}
      />
    </div>
  );
});
