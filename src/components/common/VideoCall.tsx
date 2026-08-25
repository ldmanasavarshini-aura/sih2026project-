import React, { useState } from 'react';

interface VideoCallProps {
  callLink: string;
  width?: string;
  height?: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  callLink,
  width = '100%',
  height = '500px'
}) => {
  const [joined, setJoined] = useState(false);

  // Parse the Jitsi URL to use with the iframe, adding configuration parameters for clean embed
  const getEmbedUrl = (link: string) => {
    if (link.includes('meet.jit.si')) {
      const url = new URL(link);
      url.searchParams.set('config.prejoinPageEnabled', 'false');
      url.searchParams.set('config.disableDeepLinking', 'true');
      return url.toString();
    }
    return link;
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl w-full mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800">Teleconsultation Room</h3>
        <p className="text-xs text-slate-500 mt-1">Connect securely with your patient/doctor.</p>
      </div>

      {!joined ? (
        <div
          className="flex flex-col items-center justify-center w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12 text-center"
          style={{ height }}
        >
          <div className="w-14 h-14 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700">Ready to join your call?</p>
          <p className="text-xs text-slate-400 mt-1 mb-6 max-w-xs">
            Make sure your camera and microphone permissions are allowed.
          </p>
          <button
            onClick={() => setJoined(true)}
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Join Call</span>
          </button>
        </div>
      ) : (
        <div
          className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-black shadow-inner"
          style={{ height }}
        >
          <iframe
            src={getEmbedUrl(callLink)}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Jitsi Video Call"
          />
          <button
            onClick={() => setJoined(false)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
          >
            Leave Call
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Generates a unique Jitsi Meet call URL for an appointment
 */
export const generateCallLink = (appointmentId: string): string => {
  return `https://meet.jit.si/HealthtechApp-${appointmentId}`;
};

// Console testing helper
if (typeof window !== 'undefined') {
  (window as any).generateCallLink = generateCallLink;
  (window as any).runCallLinkTest = (testId: string = 'APT-9999') => {
    console.log('Running Teleconsultation Call Link Test...');
    const link = generateCallLink(testId);
    console.log(`Generated Call Link for ID "${testId}":`, link);
    return link;
  };
  console.log('videoCall service loaded! Call runCallLinkTest("APT-xxxx") in console to verify.');
}
