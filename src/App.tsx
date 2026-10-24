import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';

import { VideoIntro } from './components/VideoIntro';
import { InvitationContent } from './components/InvitationContent';
import { Admin } from './components/Admin';
import { INVITATION_IMAGE_URLS, preloadImages } from './utils/preloadImages';
import { getInviteeNameFromUrl } from './utils/guest';

const isAdminRoute = () => window.location.pathname.replace(/\/+$/, '') === '/admin';

export default function App() {
  const [showInvitation, setShowInvitation] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const params = new URLSearchParams(window.location.search);
  const eventParam = params.get('event') || 'both';

  const fullInviteeName = isAdminRoute() ? '' : getInviteeNameFromUrl();

  let eventLabel = 'Our Wedding Celebration';

  const weddingDate = new Date('2026-11-05T09:08:00');

  useEffect(() => {
    if (isAdminRoute()) return;

    let cancelled = false;

    preloadImages([...INVITATION_IMAGE_URLS]).then(() => {
      if (!cancelled) setAssetsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio('/bg.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audio.preload = 'auto';

      audio.addEventListener('play', () => setIsMusicPlaying(true));
      audio.addEventListener('pause', () => setIsMusicPlaying(false));
      audio.addEventListener('ended', () => setIsMusicPlaying(false));

      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMusicStart = useCallback(() => {
    const audio = ensureAudio();
    audio.play().catch(console.error);
  }, [ensureAudio]);

  const toggleMusic = useCallback(() => {
    const audio = ensureAudio();
    if (audio.paused) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [ensureAudio]);

  const handleEnvelopeComplete = useCallback(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      setShowInvitation(true);
    });
  }, []);

  if (isAdminRoute()) {
    return (
      <>
        <Toaster position="top-center" />
        <Admin />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <InvitationContent
        active={showInvitation}
        eventParam={eventParam}
        fullInviteeName={fullInviteeName}
        eventLabel={eventLabel}
        weddingDate={weddingDate}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
      />

      <AnimatePresence mode="wait">
        {!showInvitation && (
          <VideoIntro
            key="intro"
            onComplete={handleEnvelopeComplete}
            onMusicStart={handleMusicStart}
            event={eventParam}
            readyToTransition={assetsReady}
          />
        )}
      </AnimatePresence>
    </>
  );
}
