export default function Footer({ onHoverStart, onHoverEnd }) {
  return (
    <div className="footer-bar">
      {/* LEFT: invisible placeholder to keep center centered */}
      <div className="footer-slot footer-left">
        <div className="counter-placeholder" aria-hidden="true" />
      </div>

      {/* CENTER: your links */}
      <div className="footer-slot footer-center">
        <a
          href="https://www.tes.com/en-ca/member/JaviRodriguez"
          target="_blank"
          rel="noopener noreferrer"
        >
          My teaching resources
        </a>
        <span className="footer-separator"> · </span>
        <a
          href="https://mflvocabtrainer.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Try my new Spanish & French Vocab Trainer
        </a>
      </div>

      {/* RIGHT: hover area that reveals the real counter */}
      <div
        className="footer-slot footer-right"
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <span className="counter-hint"></span>
      </div>
    </div>
  );
}