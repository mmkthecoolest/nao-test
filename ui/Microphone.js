"use client";

import { useRecordVoice } from "@/hooks/useRecordVoice";
import { useState, useEffect } from "react";

const Microphone = () => {
  const { recording, startRecording, stopRecording, text } = useRecordVoice();
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
	if (isRecording) {
		console.log("started recording");
		startRecording();
	} else {
		console.log("stopped recording");
		stopRecording();
	}
  }, [isRecording]);

  return (
	<div className="flex flex-col justify-center items-center">
    <button
      onMouseDown={() => {
		setIsRecording(x => !x);
	  }}    // Start recording when mouse is pressed
      //onMouseUp={stopRecording}        // Stop recording when mouse is released
      //onTouchStart={startRecording}    // Start recording when touch begins on a touch device
      //onTouchEnd={stopRecording}        // Stop recording when touch ends on a touch device
    >
      {isRecording ? "Recording..." : "Record"}
    </button>
	<p>{text}</p>
	</div>
  );
};

export { Microphone };