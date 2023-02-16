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
    getPlus();
  }, []);

  // 获取plus对象
  const getPlus = () => {
    if (window.plus) {
      changeExitEvent();
      return;
    }
    document.addEventListener("plusready", function () {
      window.plus = plus;
      changeExitEvent();
    });
  };

  // 修改返回事件
  const changeExitEvent = () => {
    var first = null;
    var webview = window.plus.webview.currentWebview();
    window.plus.key.addEventListener("backbutton", function () {
      webview.canBack(function (e) {
        if (e.canBack) {
          webview.back(); //这里不建议修改自己跳转的路径
        } else {
          //首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime(); //获取第一次点击的时间戳
            window.plus.nativeUI.toast("再按一次退出应用", {
              duration: "short",
            }); //通过H5+ API 调用Android 上的toast 提示框
            setTimeout(function () {
              first = null;
            }, 1000);
          } else {
            // 获取第二次点击的时间戳, 两次之差 小于 1000ms 说明1s点击了两次,
            if (new Date().getTime() - first < 1000) {
              window.plus.runtime.quit(); //退出应用
            }
          }
        }
      });
    });
  };

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
