"use client";

import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "@/utils/blobToBase64";
import { createMediaStream } from "@/utils/createMediaStream";

export const useRecordVoice = () => {
  const [text, setText] = useState("");
  const isRecording = useRef(false);

  // State to hold the media recorder instance
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // State to track whether recording is currently in progress
  const [recording, setRecording] = useState(false);

  // Ref to store audio chunks during recording
  const chunks = useRef([]);

  // Function to start the recording
  const startRecording = () => {
    if (mediaRecorder) {
	  isRecording.current = true;
      mediaRecorder.start();
      setRecording(true);
    }
  };

  // Function to stop the recording
  const stopRecording = () => {
    if (mediaRecorder) {
	  isRecording.current = false;
      mediaRecorder.stop(); 
      setRecording(false);
    }
  };

  const getText = async (base64data) => {
    try {
      const response = await fetch("/api/speechToText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: base64data,
        }),
      }).then((res) => res.json());
      const { text } = response;
      setText(text);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to initialize the media recorder with the provided stream
  const initialMediaRecorder = (stream) => {
    const mediaRecorder = new MediaRecorder(stream);

    // Event handler when recording starts
    mediaRecorder.onstart = () => {
      createMediaStream(stream);
	  chunks.current = []; // Resetting chunks array
    };

    // Event handler when data becomes available during recording
    mediaRecorder.ondataavailable = (ev) => {
      chunks.current.push(ev.data); // Storing data chunks
    };

    // Event handler when recording stops
    mediaRecorder.onstop = () => {
      // Creating a blob from accumulated audio chunks with WAV format
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
	  blobToBase64(audioBlob, getText);
      console.log(audioBlob, 'audioBlob')

      // You can do something with the audioBlob, like sending it to a server or processing it further
    };

    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []); 

  return { recording, startRecording, stopRecording, text
 };
};