import { useState, useEffect } from "react";
import mqtt from "mqtt"; // นำเข้า mqtt
import axios from "axios";

function WebSocketPage() {
  const [query, setQuery] = useState("");
  const [giphy, setGiphy] = useState([]);
  const [error, setError] = useState("");
  const [limit] = useState(2);

  const API_KEY = "QjPdhpCzacOKBXlWVGGucMTZKtQB3Ym4";
  const searchEndpoint = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}`;

  const searchEmoji = async (searchQuery) => {
    setGiphy([]);
    setError("");
    if (!searchQuery || searchQuery.trim() === "") return;

    try {
      const response = await axios.get(
        `${searchEndpoint}&q=${searchQuery}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data.length > 0) {
        setGiphy(response.data.data);
      } else {
        setError("No GIPHY found!");
      }
    } catch (error) {
      setError("Error fetching emojis!");
    }
  };

  // ใช้ MQTT เพื่อรับข้อมูลจาก client
  useEffect(() => {
    const client = mqtt.connect("ws://fourpig-dns.scnd.space:9001"); // เชื่อมต่อกับ MQTT broker

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("giphy/query"); // รับข้อมูลจาก topic ที่กำหนด
    });

    client.on("message", (topic, message) => {
      if (topic === "giphy/query") {
        const data = message.toString();
        setQuery(data); // ตั้งค่าคำค้นหาจากข้อมูลที่ได้รับ
        searchEmoji(data); // ค้นหา GIPHY ด้วยคำค้นหานั้น
      }
    });

    return () => {
      client.end(); // ปิดการเชื่อมต่อเมื่อ component unmount
    };
  }, []);

  return (
    <>
      <div className="emoji-search-container flex justify-center flex-col gap-5 mt-8">
        <h1 className="text-center text-2xl font-bold">Real-Time GIPHY Viewer</h1>

        <div id="emoji-container" className="emoji-container">
          {error && <p className="error-message text-red-500">{error}</p>}
          <div className="grid grid-cols-3 gap-5">
            {giphy.map((gif, index) => (
              <div key={index}>
                <img
                  src={gif.images.fixed_height.url}
                  title={gif.id}
                  className="w-[200px] h-[200px] object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default WebSocketPage;
