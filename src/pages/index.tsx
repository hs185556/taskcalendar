import { NavBar } from "antd-mobile";
import MyCalendar from "./MyCalendar";
import { openTaskDB, createTaskTable } from "../services/Task";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(()=>{
    openTaskDB();
    createTaskTable();
  },[])
  return (
    <div>
      <NavBar backArrow={null}>日程清单</NavBar>
      <MyCalendar />
    </div>
  );
}
