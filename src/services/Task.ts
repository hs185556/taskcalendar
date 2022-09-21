import dayjs from "dayjs";
import websql from "../pages/utils/websql";

export const openTaskDB = () => {
  websql.openDB("taskcalendar", "1.0", "taskcalendar", 128 * 1024 * 1024);
};
export const createTaskTable = () => {
  websql.createTable(
    "task",
    "id integer primary key autoincrement,title text,desc text,startTime date,stopTime date,status tinyint,created datetime"
  );
};
export const getTasks = (date, callback) => {
  websql.exe(
    date
      ? "select * from task where startTime <= ? and stopTime >= ?  ORDER BY status ASC, created DESC;"
      : "select * from task ORDER BY status ASC, created DESC;",
    date ? [date, date] : [],
    callback
  );
};
export const getTasksSync = async (date, status?) => {
  const inSql = Array.isArray(status)
    ? `(${status.map(
        (v) => `'${v}'`
      ).join(",")})`
    : "";
  return await websql.exeSync(
    date
      ? `select * from task where startTime <= ? and stopTime >= ? ${
          inSql ? "and status in " + inSql : ""
        } ORDER BY status ASC, created DESC`
      : `select * from task ORDER BY status ASC, created DESC ${inSql ? "where status in" + inSql : ""}`,
    date ? [date, date] : []
  );
};

export const addTask = (data) => {
  websql.exe(
    "insert into task(title,desc,startTime,stopTime,status,created) values(?,?,?,?,?,?)",
    [
      data.title,
      data.desc || "",
      data.startTime,
      data.stopTime,
      1,
      dayjs().format("YYYY-MM-DD HH:mm:ss"),
    ]
  );
};
export const deleteTask = (id) => {
  websql.exe("delete from task where id = ?", [id]);
};

export const updateTask = (data) => {
  websql.exe(
    `update task set ${data.title !== undefined ? "title = ?," : ""} ${
      data.desc !== undefined ? "desc = ?," : ""
    } ${data.startTime !== undefined ? "startTime = ?," : ""} ${
      data.stopTime !== undefined ? "stopTime = ?" : ""
    } ${data.status !== undefined ? "status = ?" : ""} where id =?`,
    [
      data.title,
      data.desc,
      data.startTime,
      data.stopTime,
      data.status,
      data.id,
    ].filter((v) => v !== undefined)
  );
};
