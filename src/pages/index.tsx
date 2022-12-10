import { NavBar, Button } from "antd-mobile";
import MyCalendar from "./MyCalendar";
import TaskList from "./TaskList";
import { openTaskDB, createTaskTable } from "../services/Task";
import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [tab, setTab] = useState("calendar");
  const calRef = React.createRef();

  useEffect(() => {
    openTaskDB();
    createTaskTable();
  }, []);
  return (
    <div>
      <NavBar
        backArrow={null}
        right={
          <>
            {tab === "calendar" && (
              <Button
                size="mini"
                fill="outline"
                shape="rounded"
                onClick={() => {
                  calRef.current?.toToday();
                }}
                style={{ marginRight: "5px" }}
              >
                今天
              </Button>
            )}
            <Button
              size="mini"
              fill="outline"
              shape="rounded"
              onClick={() => {
                setTab(tab === "calendar" ? "list" : "calendar");
              }}
            >
              {tab === "calendar" ? "列表" : "日历"}
            </Button>
          </>
        }
      >
        日程清单
      </NavBar>
      {tab === "calendar" && <MyCalendar ref={calRef} />}
      {tab === "list" && <TaskList ref={calRef} />}
    </div>
  );
}
