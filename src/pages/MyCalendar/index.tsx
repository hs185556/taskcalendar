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
  const [startX, setStartX] = useState(-1);
  const [endX, setEndX] = useState(-1);
  const [YM, setYM] = useState();
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

  /*手接触屏幕*/
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };
  /*手在屏幕上移动*/
  const handleTouchMove = (e) => {
    setEndX(e.touches[0].clientX);
  };
  /*手离开屏幕*/
  const handleTouchEnd = (e) => {
    // 获取滑动范围
    if (startX > -1 && endX > -1) {
      let distance = Math.abs(startX - endX);
      if (distance > 50) {
        if (startX > endX) {
          // 右滑
          handleChangePanel(1);
        } else {
          // 左滑
          handleChangePanel(-1);
        }
      }
    }

    setStartX(-1);
    setEndX(-1);
  };

  const handleChangePanel = (offset) => {
    const date1 = YM ? new Date(YM) : new Date();
    date1.setMonth(date1.getMonth() + offset)
    const val = `${date1.getFullYear()}-${(date1.getMonth() + 1) < 10 ? '0' + (date1.getMonth() + 1) : (date1.getMonth() + 1)}`
    // console.log(val);
    setYM(val);
    calRef.current?.jumpTo?.({ year: date1.getFullYear(), month: date1.getMonth() + 1 })
    queryDelayTask(val, [0, 1, 2]);
  }

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
    <div
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
          const val = year + "-" + (month < 10 ? "0" + month : month);
          setYM(val);
          queryDelayTask(val, [0, 1, 2]);
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
