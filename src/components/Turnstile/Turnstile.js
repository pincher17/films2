import { useEffect } from 'react';
import Script from 'next/script';
import { NotFoundWrapper } from '@/app/styles/NotFoundPage.styles';

const Turnstile = ({ onToken }) => {
  useEffect(() => {
    window.onloadTurnstileCallback = function () {
      turnstile.render('#turnstile-container', {
        sitekey: '1x00000000000000000000AA',
        callback: function (token) {
          console.log(`Challenge Success ${token}`);
          onToken(token);
        },
      });
    };
  }, [onToken]);

  return (
    <>
      <NotFoundWrapper id="turnstile-container"></NotFoundWrapper>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
        strategy="afterInteractive"
        defer
      />
    </>
  );
};

export default Turnstile;
