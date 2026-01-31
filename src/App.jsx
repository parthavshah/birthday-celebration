import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRef, useState, useEffect } from "react";
import "./App.css";
import CelebrationPage from "./components/CelebrationPage";
import Countdown from "./components/Countdown";
import Effects from "./components/Effects";
import Gallery from "./components/Gallery";
import Hearts from "./components/Hearts";
import MessageCard from "./components/MessageCard";
import MusicPlayer from "./components/MusicPlayer";

gsap.registerPlugin(ScrollToPlugin);

function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const [birthdayReached, setBirthdayReached] = useState(() => {
    const saved = localStorage.getItem("birthdayReached");
    return saved === "true";
  });

  const [showEffects, setShowEffects] = useState(false);

  // --- AGE COUNTER LOGIC ---
  const calculateAge = () => {
    const birthDate = new Date("2006-02-01T21:00:00");
    const now = new Date();
    
    let years = now.getFullYear() - birthDate.getFullYear();
    let birthMonth = birthDate.getMonth();
    let nowMonth = now.getMonth();
    
    // Adjust years if birthday hasn't happened yet this year
    if (nowMonth < birthMonth || (nowMonth === birthMonth && now.getDate() < birthDate.getDate())) {
      years--;
    }

    // Get the date of the most recent birthday to calculate remaining time
    const lastBirthday = new Date(birthDate);
    lastBirthday.setFullYear(birthDate.getFullYear() + years);
    
    const diff = now - lastBirthday;

    return {
      years: years,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [age, setAge] = useState(calculateAge());

  useEffect(() => {
    const timer = setInterval(() => {
      setAge(calculateAge());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // -------------------------

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const page4Ref = useRef(null);
  const musicPlayerRef = useRef(null);

  const goToPage = (pageNumber) => {
    const refs = { 1: page1Ref, 2: page2Ref, 3: page3Ref, 4: page4Ref };
    const currentPageRef = refs[currentPage];
    const nextPageRef = refs[pageNumber];
    const isForward = pageNumber > currentPage;

    gsap.to(currentPageRef.current, {
      x: isForward ? "-100%" : "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    gsap.set(nextPageRef.current, {
      x: isForward ? "100%" : "-100%",
      opacity: 0,
      visibility: "visible",
    });

    gsap.to(nextPageRef.current, {
      x: "0%",
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      delay: 0.2,
      onComplete: () => {
        setCurrentPage(pageNumber);
        gsap.set(currentPageRef.current, { x: "0%", visibility: "hidden" });
        gsap.to(window, { duration: 0.3, scrollTo: { y: 0 } });
      },
    });
  };

  const handleBirthdayReached = () => {
    setBirthdayReached(true);
    localStorage.setItem("birthdayReached", "true");
    setShowEffects(true);
    setTimeout(() => setShowEffects(false), 10000);
  };

  return (
    <div className="app">
      <MusicPlayer ref={musicPlayerRef} />
      <Hearts />

      <div
        ref={page1Ref}
        className={`page ${currentPage === 1 ? "active" : ""}`}
        style={{ visibility: currentPage === 1 ? "visible" : "hidden" }}
      >
        <section className="hero">
          <h1 id="heroTitle">
            {birthdayReached ? (
              <>Happy Birthday <span className="highlight">SAAACHI</span> 🎂</>
            ) : (
              <>Counting down to <span className="highlight">Saachi's</span> special day 🎂</>
            )}
          </h1>
          <p>Always smile rasmalai cheeks 💗</p>

          {/* AGE COUNTER UI */}
          <div className="age-counter">
            <p className="age-label">You've been spreading magic for:</p>
            <div className="age-stats">
              <div className="stat-item"><span>{age.years}</span><small>Years</small></div>
              <div className="stat-item"><span>{age.days}</span><small>Days</small></div>
              <div className="stat-item"><span>{age.hours}</span><small>Hrs</small></div>
              <div className="stat-item"><span>{age.minutes}</span><small>Mins</small></div>
              <div className="stat-item"><span>{age.seconds}</span><small>Secs</small></div>
            </div>
          </div>
        </section>

        <Countdown
          onBirthdayReached={handleBirthdayReached}
          birthdayReached={birthdayReached}
        />

        <section className="teaser">
          <h2 id="teaserHeading">
            {birthdayReached
              ? "💖 Ready for your surprise! 💖"
              : "✨ A special celebration awaits you at midnight... ✨"}
          </h2>
          <p className="teaser-hint">Mastii aane wali hai 💫</p>
        </section>

        <button
          id="surpriseBtn"
          className="celebrate-btn"
          disabled={!birthdayReached}
          onClick={() => goToPage(2)}
        >
          Click here budday girl!
        </button>
      </div>

      <div
        ref={page2Ref}
        className={`page ${currentPage === 2 ? "active" : ""}`}
        style={{ visibility: currentPage === 2 ? "visible" : "hidden" }}
      >
        <CelebrationPage onComplete={() => goToPage(3)} musicPlayerRef={musicPlayerRef} />
      </div>

      <div
        ref={page3Ref}
        className={`page ${currentPage === 3 ? "active" : ""}`}
        style={{ visibility: currentPage === 3 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(2)}>← Back</button>
        <MessageCard isActive={currentPage === 3} />
        <button className="page-nav-btn" onClick={() => goToPage(4)}>📸 View Our Memories</button>
      </div>

      <div
        ref={page4Ref}
        className={`page ${currentPage === 4 ? "active" : ""}`}
        style={{ visibility: currentPage === 4 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(3)}>← Back</button>
        <Gallery isActive={currentPage === 4} />
        <section className="final">
          <h2 className="final-message">💖 Forever Yours — Parthav Shah 💖</h2>
          <p className="final-subtitle">Have a great year ahead! ✨</p>
        </section>
      </div>

      {showEffects && <Effects />}
    </div>
  );
}

export default App;