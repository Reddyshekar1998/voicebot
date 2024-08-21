import React, { useState, useRef } from 'react';

const AudioPlayer = ({ audioBase64 }) => {
    const audioSrc = `data:audio/wav;base64,${audioBase64}`;

    return (
        <audio controls autoPlay>
            <source src={audioSrc} type="audio/wav" />
            Your browser does not support the audio element.
        </audio>
    );
};

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const [response, setResponse] = useState("");
    const [audioBase64, setAudioBase64] = useState('');
    const mediaRecorderRef = useRef(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = async (event) => {
            const formData = new FormData();
            formData.append("file", event.data, "audio.wav");

            try {
                const response = await fetch("https://2ee8-35-184-209-81.ngrok-free.app/api/transcribe", {
                    method: "POST",
                    body: formData,
                });
                // replace ngrok url to fetch the backend data 
                // If bcakend code running in localhost url: "http://localhost:8000"

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const data = await response.json();
                setTranscription(data.speaked_text);
                setResponse(data.generated_text || "");
                setAudioBase64(data.audio_np); 

            } catch (error) {
                console.error("Error during transcription request:", error);
            }
        };

        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <div className="audio-recorder">
            <h2>Voice Call Transcription</h2>
            {recording ? (
                <button onClick={stopRecording}>Stop Recording</button>
            ) : (
                <button onClick={startRecording}>Start Recording</button>
            )}
            {transcription && <p>Speaked Text: {transcription}</p>}
            {response && <p>Generated Text: {response}</p>}
            {audioBase64 && <AudioPlayer audioBase64={audioBase64} />}
        </div>
    );
};

export default AudioRecorder;

