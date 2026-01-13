import { useEffect, useRef, useState } from "react";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export default function CameraClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [detection, setDetection] = useState<string>("Memuat...");
  const [loading, setLoading] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">(
    "environment"
  );

  // URL server Flask
  const SERVER = "http://192.168.10.214:4000";

  // token
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");


  // ⬇️ persistent client_id sekali seumur hidup device
  let client_id = localStorage.getItem("client_id");
  if (!client_id) {
    client_id = crypto.randomUUID();
    localStorage.setItem("client_id", client_id);
  }

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [cameraFacing]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setLoading(false);
      requestAnimationFrame(loopDetection);
    } catch (err) {
      alert("Izinkan akses kamera!");
    }
  }

  function stopCamera() {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
    }
  }

  async function loopDetection() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (video.videoWidth === 0) {
      return requestAnimationFrame(loopDetection);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = canvas.toDataURL("image/jpeg");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${SERVER}/api/detect_frame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // ⬇️ kirim client_id masuk ke backend
        body: JSON.stringify({ frame, client_id }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();
      const boxes: Box[] = data.boxes || [];
      const label = data.detection || "";

      if (label && boxes.length > 0) {
        setDetection(label);
      } else {
        setDetection("Tidak Ada Buah Terdeteksi");
      }

      boxes.forEach((p) => {
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, p.y, p.width, p.height);

        ctx.fillStyle = "lime";
        ctx.font = "16px Arial";
        ctx.fillText(
          `${p.label} ${(p.confidence * 100).toFixed(1)}%`,
          p.x,
          p.y - 5
        );
      });
    } catch (err) {
      setDetection("Server offline");
    }

    setTimeout(() => requestAnimationFrame(loopDetection), 80);
  }

  const switchCamera = () => {
    stopCamera();
    setCameraFacing((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  };

  return (
    <div className="relative w-full h-[500px] bg-gray-400">
      {loading && (
        <p
          className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-md"
        >
          Memuat kamera...
        </p>
      )}

      {/* switch kamera */}
      <button
        onClick={switchCamera}
        className="
          absolute z-20 top-3 right-3
          bg-blue-600 hover:bg-blue-700
          text-white px-3 py-1
          rounded-md shadow-md
          flex items-center gap-2
          text-sm
        "
      >
        <img src="assets/switch.png" className="w-5 h-5" />
      </button>

      <video
        ref={videoRef}
        muted
        className="w-full h-full object-cover rounded-lg"
      />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
      />

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs shadow-md">
        Buah Terdeteksi: <b>{detection}</b>
      </div>
    </div>
  );
}
