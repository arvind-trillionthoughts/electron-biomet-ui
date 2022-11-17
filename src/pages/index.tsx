import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
import { converBase64ToImage } from "convert-base64-to-image";
import { url } from "inspector";

function DeviceLogs() {
  const w = window as any;
  const electronAPI = w?.electronAPI;
  const session = localStorage.getItem("session")
    ? JSON.parse(localStorage.getItem("session") ?? "")
    : {};
  const [dbStatus, setDbStatus] = useState(session.dbStatus ?? "Disconnected");
  const [webhookstatus, setWebhookstatus] = useState(
    session.webhookstatus ?? "Offline"
  );
  const [deviceCount, setDeviceCount] = useState(session.deviceCount ?? 0);
  const [punchCount, setPunchCount] = useState(session.punchCount ?? 0);
  const [notificationStatus, setNotificationStatus] = useState(
    session.notificationStatus ?? 0
  );
  const [logData, setLogData] = useState<any[]>([]);
  const [dbData, setDbData] = useState(
    session.dbData ?? {
      schema: "",
      host: "",
      dbname: "",
      username: "",
      password: "",
      url: "",
    }
  );
  useEffect(() => {
    const jsonObj = JSON.stringify({
      dbStatus,
      deviceCount,
      punchCount,
      notificationStatus,
      dbData,
      webhookstatus,
    });
    localStorage.setItem("session", jsonObj);
  }, [
    dbStatus,
    deviceCount,
    punchCount,
    notificationStatus,
    dbData,
    webhookstatus,
  ]);

  const setDbDataHandler = () => {
    electronAPI?.setDb({
      schema: dbData.schema,
      host: dbData.host,
      dbname: dbData.dbname,
      username: dbData.username,
      password: dbData.password,
      url: dbData.url,
    });
  };

  const scriptfile: any = () => {
    electronAPI?.handleDBConnection((event: any, value: any) => {
      setDbStatus(value);
    });
    electronAPI?.handlePunchesCount((event: any, value: any) => {
      setPunchCount(value);
      try {
        axios.post(
          "https://webhook.site/220cf9f8-eeaa-4e1e-a3f9-e0b3e60728b0",
          {
            id: value,
            time: Date.now(),
          }
        );
        setWebhookstatus("Online");
      } catch (error) {
        setWebhookstatus("Offline");
      }
    });
    electronAPI?.handleDeviceCount((event: any, value: any) => {
      setDeviceCount(value);
    });
    electronAPI?.handleNotificationStatus((event: any, value: any) => {
      setNotificationStatus(value);
    });

    electronAPI?.handlesuccess((event: any, value: any) => {
      const dateFormat = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (value?.message) {
        setLogData((prev) => [value, ...prev]);
      }
    });

    electronAPI?.handleDbcondfig((event: any, value: any) => {
      value = JSON.parse(value);
      console.log("Handleconfig>>", value, event);

      setDbData({
        schema: value.schema,
        host: value.host,
        dbname: value.dbname,
        username: value.username,
        password: value.password,
        url: value.url,
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
                      value={dbData.host}
                      id="host"
                      placeholder="Localhost"
                      className="input-style"
                      type="text"
                    />
                  </div>
                  <div>
                    <p>DB Name</p>
                    <input
                      value={dbData.dbname}
                      id="dbname"
                      placeholder="Mongo DB"
                      className="input-style"
                      type="text"
                    />
                  </div>
                  <div>
                    <p>Schema</p>
                    <input
                      value={dbData.schema}
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
                      value={dbData.username}
                      id="username"
                      placeholder="Ragul Palanivel"
                      className="input-style"
                      type="text"
                    />
                  </div>
                  <div>
                    <p>Password</p>
                    <input
                      value={dbData.password}
                      id="password"
                      placeholder="*********"
                      className="input-style"
                      type="password"
                    />
                  </div>
                  <div>
                    <p>URL</p>
                    <input
                      value={dbData.url}
                      id="url"
                      placeholder="Enter the URL"
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
                {/* <button className="button-reset">Reset</button> */}
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
                  <div className="cards" style={{ backgroundColor: "#edf2ff" }}>
                    <h6>Webhook Status</h6>
                    <p id="dbconnectionstatus">{webhookstatus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right-section" style={{ width: "50%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h3 className="title" style={{ color: "#003166" }}>
              Realtime logs
            </h3>
            <button className="button-reset" onClick={() => setLogData([])}>
              Clear log
            </button>
          </div>
          <div id="log-list" className="log-list" style={{ padding: "1rem" }}>
            {logData.map((value) => (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  borderBottom: "1px solid #ccc",
                  padding: "1rem 0",
                  justifyContent: "space-between",
                }}
              >
                <p>
                  <span style={{ color: "#4318ff" }}>
                    {new Date().toLocaleTimeString()}
                  </span>{" "}
                  {">"}{" "}
                  <span
                    style={{
                      color: (value.message as string)?.includes("Stranger")
                        ? "red"
                        : "green",
                    }}
                  >
                    {value?.message}
                  </span>
                </p>
                {value?.image && (
                  <img
                    className="zoom-hover"
                    src={`data:image/jpeg;base64,${value.image}`}
                    height="100"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <script src="https://code.jquery.com/jquery-3.6.1.js" integrity="sha256-3zlB5s2uwoUzrXK3BT7AX3FyvojsraNFxCc2vC/7pNI=" crossorigin="anonymous"></script> */}
    </div>
  );
}

export default DeviceLogs;
