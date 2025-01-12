import React, { useState, useEffect, useRef } from "react";
import mqtt from "mqtt";

const Setupmqtt = () => {
  // const [client, setClient] = useState(null);
  const client = useRef(null);
  const [message, setMessage] = useState(""); // สำหรับข้อความที่จะส่ง
  const [receivedMessage, setReceivedMessage] = useState(""); // สำหรับข้อความที่ได้รับ
  const [isConnected, setIsConnected] = useState(false); // สำหรับตรวจสอบสถานะการเชื่อมต่อ
  const [mqttClient] = useState(() => {

  })

  useEffect(() => {
    // สร้างการเชื่อมต่อ MQTT
    const mqttClient = mqtt.connect("ws://fourpig-dns.scnd.space:9001", {
      clientId: "text_client",
      username: "test",
      password: "1234"
    }) // แก้ไขเป็น URL ของ Broker คุณ

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT Broker");
      setIsConnected(true);
      mqttClient.subscribe("backend/to/client", (err) => {
        if (err) {
          console.error("Subscribe error:", err);
        } else {
          console.log("Subscribed to topic: backend/to/client");
        }
      });
    });

    mqttClient.on("message", (topic, payload) => {
      console.log(`Message received on ${topic}: ${payload.toString()}`);
      setReceivedMessage(payload.toString());
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT Error: ", err);
    });

    mqttClient.on("close", () => {
      console.log("MQTT connection closed");
      setIsConnected(false);
    });

    client.current = mqttClient

    // Cleanup connection when component unmounts
    return () => {
      if (mqttClient) mqttClient.end();
    };
  }, []);

  const sendMessage = () => {
    if (client.current && isConnected) {
      client.current?.publish("client/to/backend", message, (err) => {
        if (err) {
          console.error("Publish error:", err);
        } else {
          console.log(`Message sent: ${message}`);
          setMessage(""); // เคลียร์ข้อความหลังส่งสำเร็จ
        }
      });
    } else {
      console.error("MQTT client is not connected");
    }
  };




  
  return (
    <div style={{ padding: "20px" }}>
      <h1>MQTT React Client</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          style={{
            padding: "10px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Connection Status:</h2>
        <p>{isConnected ? "Connected" : "Disconnected"}</p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Received Message:</h2>
        <p>{receivedMessage}</p>
      </div>
    </div>
  );
};

export default Setupmqtt;
