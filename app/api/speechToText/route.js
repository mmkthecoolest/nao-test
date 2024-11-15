require('dotenv').config();

import { NextResponse } from "next/server";
import fs from "fs"; 
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();

  const base64Audio = body.audio;

  // Convert the base64 audio data to a Buffer
  const audio = Buffer.from(base64Audio, "base64");

  //console.log("Audio: " + audio);
  // Define the file path for storing the temporary WAV file
  const filePath = "tmp/input.wav";

  try {
    // Write the audio data to a temporary WAV file synchronously
    fs.writeFileSync(filePath, audio);

    // Create a readable stream from the temporary WAV file
    const readStream = fs.createReadStream(filePath);

    const data = await openai.audio.transcriptions.create({
      file: readStream,
      model: "whisper-1",
    });

    // Remove the temporary file after successful processing
    fs.unlinkSync(filePath);

	console.log(NextResponse.json(data));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.error();
  }
}