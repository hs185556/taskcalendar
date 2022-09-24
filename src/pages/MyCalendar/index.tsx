import { Calendar } from "antd-mobile";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LoopOutline } from "antd-mobile-icons";
import React from "react";
import Task from "../Task";
import styles from "./index.less";
import { getTasksSync } from "@/services/Task";

let prevYM = dayjs().format("YYYY-M");

export default function CalendarList() {
  const [date, setDate] = useState();
  const [delayDays, setDelayDays] = useState([]);
  const ref = React.createRef();

  const queryDelayTask = (YM) => {
    const cYM = dayjs().format("YYYY-MM");
    let mDays;
    if (cYM === YM) {
      mDays = dayjs().date();
    } else {
      mDays = dayjs().daysInMonth() + 1;// daysInMonth从0计数
    }
    const daystrs = Array(mDays)
      .fill("")
      .map((ignore, i) => {
        const v = i + 1;
        return YM + "-" + (v < 10 ? "0" + v : v);
      });
    const promises = daystrs.map(async (ds) => {
      return await getTasksSync(ds, [0, 1, 2]);
    });
    Promise.all(promises).then((rsList) => {
      setDelayDays(rsList.map((rs) => Array.from(rs.rows).length));
    });
  };

  useEffect(() => {
    setTimeout(() => {
      // 延迟查询 等待数据库实例化完成
      setDate(new Date());
    }, 200);
  }, []);

  useEffect(() => {
    if (date) {
      const YM = dayjs(date).format("YYYY-MM");
      if (YM !== prevYM) {
        prevYM = YM;
        queryDelayTask(YM);
      }
    }
  }, [date]);

  return (
    <div className={styles.container}>
      <LoopOutline
        className={styles.positionIcon}
        onClick={() => {
          ref.current?.jumpToToday?.();
          setDate(new Date());
        }}
      />
      <Calendar
        ref={ref}
        selectionMode="single"
        value={date}
        onChange={(val) => {
          if (val) {
            setDate(val);
          }
        }}
        onPageChange={(year, month) => {
          const YM = year + "-" + (month < 10 ? "0" + month : month);
          if (YM !== prevYM) {
            prevYM = YM;
            queryDelayTask(YM);
          }
        }}
        renderLabel={(date: Date) => {
          const item = delayDays[date.getDate() - 1];
          return Number(prevYM.split("-")[1]) === date.getMonth() + 1 && item
            ? item
            : "";
        }}
      />
      <Task date={date && dayjs(date).format("YYYY-MM-DD")} />
    </div>
  );
}
