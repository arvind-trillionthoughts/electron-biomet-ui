import React, { useEffect, useState } from "react";
import $ from "jquery";

function DeviceLogs() {
  const w = window as any;
  const electronAPI = w?.electronAPI;
  const session = localStorage.getItem("session")
    ? JSON.parse(localStorage.getItem("session") ?? "")
    : {};
  const [dbStatus, setDbStatus] = useState(session.dbStatus ?? "Disconnected");
  const [deviceCount, setDeviceCount] = useState(session.deviceCount ?? 0);
  const [punchCount, setPunchCount] = useState(session.punchCount ?? 0);
  const [notificationStatus, setNotificationStatus] = useState(
    session.notificationStatus ?? 0
  );
  const [dbData, setDbData] = useState(
    session.dbData ?? {
      schema: "",
      host: "",
      dbname: "",
      username: "",
      password: "",
    }
  );
  useEffect(() => {
    const jsonObj = JSON.stringify({
      dbStatus,
      deviceCount,
      punchCount,
      notificationStatus,
      dbData,
    });
    localStorage.setItem("session", jsonObj);
    console.log(jsonObj);
  }, [dbStatus, deviceCount, punchCount, notificationStatus, dbData]);

  const setDbDataHandler = () => {
    electronAPI?.setDb({
      schema: dbData.schema,
      host: dbData.host,
      dbname: dbData.dbname,
      username: dbData.username,
      password: dbData.password,
    });
  };

  const scriptfile: any = () => {
    electronAPI?.handleDBConnection((event: any, value: any) => {
      setDbStatus(value);
    });
    electronAPI?.handlePunchesCount((event: any, value: any) => {
      setPunchCount(value);
    });
    electronAPI?.handleDeviceCount((event: any, value: any) => {
      setDeviceCount(value);
    });
    electronAPI?.handleNotificationStatus((event: any, value: any) => {
      setNotificationStatus(value);
    });

    electronAPI?.handlesuccess((event: any, value: any) => {
      $("#log-list").append(`<p>
      <span style="color: #4318ff"> ${Date.now()} </span>> ${value}
    </p>`);
      // schemaInput.disabled = true;
      // hostInput.disabled = true;
      // dbnameInput.disabled = true;
      // usernameInput.disabled = true;
      // passwordInput.disabled = true;
    });

    electronAPI?.handleDbcondfig((event: any, value: any) => {
      value = JSON.parse(value);
      console.log("Handleconfig>>", value);

      setDbData({
        schema: value.schema,
        host: value.host,
        dbname: value.dbname,
        username: value.username,
        password: value.password,
      });
    });
  };

  useEffect(() => {
    scriptfile();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        className="bg-primary"
        style={{ textAlign: "start", padding: "1rem", height: "5vh" }}
      >
        <h1 style={{ fontSize: "1.5rem" }} className="text-white">
          Biomet UpLink Server
        </h1>
      </div>
      <div className="d-flex" style={{ height: "90vh" }}>
        <div
          className="d-flex flex-column"
          style={{
            width: "50%",
            borderRight: "0.5px solid #0031664a",
            height: "100%",
          }}
        >
          <div className="left-section-top">
            <h3 className="title" style={{ color: "#003166" }}>
              Uplink Database Information
            </h3>
            <form
              style={{ marginTop: "0.5rem" }}
              onChange={(e) => {
                const target = e.target as any;
                setDbData((prev: any) => ({
                  ...prev,
                  [target.id]: target.value,
                }));
              }}
            >
              <div
                className="d-flex input-container"
                style={{ flexWrap: "wrap", justifyContent: "space-around" }}
              >
                <div className="left-input">
                  <div>
                    <p>Host</p>
                    <input
                      id="host"
                      placeholder="Localhost"
                      className="input-style"
                      type="text"
                    />
                  </div>
                  <div>
                    <p>DB Name</p>
                    <input
                      id="dbname"
                      placeholder="Mongo DB"
                      className="input-style"
                      type="text"
                    />
                  </div>
                  <div>
                    <p>Schema</p>
                    <input
                      id="schema"
                      placeholder="schema value"
                      className="input-style"
                      type="text"
                    />
                  </div>
                </div>
                <div className="right-input">
                  <div>
                    <p>User Name</p>
                    <input
                      id="username"
                      placeholder="Ragul Palanivel"
                      className="input-style"
                      type="text"
                    />
                  </div>
                  <div>
                    <p>Password</p>
                    <input
                      id="password"
                      placeholder="*********"
                      className="input-style"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="button-container">
                <button className="button-submit" onClick={setDbDataHandler}>
                  Save
                </button>
              </div>
            </form>
          </div>
          <div
            className="bottom-start"
            style={{ height: "50%", padding: "1rem" }}
          >
            <div>
              <div className="d-flex justify-content-between">
                <h3 style={{ color: "#003166" }}>Status</h3>
                <button className="button-reset">Reset</button>
              </div>
              <div>
                <div
                  className="d-flex mt-1"
                  style={{ gap: " 1rem", flexWrap: "wrap" }}
                >
                  <div className="cards" style={{ backgroundColor: "#eefcea" }}>
                    <h6>Total Devices</h6>
                    <p id="devicecount">{deviceCount}</p>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#edf2ff" }}>
                    <h6>Notification sents</h6>
                    <p id="notificationstatus">{notificationStatus}</p>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#fff6e9" }}>
                    <h6>Total Punches</h6>
                    <p id="punchcount">{punchCount}</p>
                  </div>
                  <div className="cards" style={{ backgroundColor: "#fff6e9" }}>
                    <h6>Database Status</h6>
                    <p id="dbconnectionstatus">{dbStatus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right-section" style={{ width: "50%" }}>
          <h3 className="title" style={{ color: "#003166" }}>
            Logs
          </h3>
          <div
            id="log-list"
            className="log-list"
            style={{ padding: "1rem" }}
          ></div>
        </div>
      </div>
      {/* <script src="https://code.jquery.com/jquery-3.6.1.js" integrity="sha256-3zlB5s2uwoUzrXK3BT7AX3FyvojsraNFxCc2vC/7pNI=" crossorigin="anonymous"></script> */}
    </div>
  );
}

export default DeviceLogs;
