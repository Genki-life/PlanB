import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Mic, 
  Calendar, 
  Sliders, 
  Brain, 
  Compass,
  ArrowUp,
  Check,
  ChevronRight,
  X,
  Play,
  Volume2,
  Clock,
  Sparkles
} from 'lucide-react';

const IP_IMAGE_URL = '/src/assets/images/plan_b_character_bust_1793262803041.jpg';
const KILA_LISTENING_URL = '/src/assets/images/kila_listening_pose_1793266337621.jpg';
const THUMB_IMAGE_URL = '/src/assets/images/mindful_walk_thumb_1793264566501.jpg';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'Today' | 'My Plan' | 'Memory' | 'Discover'>('Today');
  const [inputValue, setInputValue] = useState('');
  
  // Card states: 'suggested' | 'accepted' | 'completed'
  const [planState, setPlanState] = useState<'suggested' | 'accepted' | 'completed'>('suggested');
  
  // Hold-to-complete animation state (0 to 100)
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const holdStartRef = useRef<number>(0);

  // Detail Sheet state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Chat modal overlay state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sheetInput, setSheetInput] = useState('');

  // Push / Care message toggle
  const [showPushMessage, setShowPushMessage] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  const handleToggleNotification = () => {
    setShowPushMessage((prev) => !prev);
    setHasUnreadNotification(false);
  };

  // 1. Initial State Handlers
  const handleSoundsGood = () => {
    setPlanState('accepted');
  };

  const handleInitialPlanB = () => {
    setChatMessages([
      {
        sender: 'user',
        text: "Let's explore a Plan B for today's walk."
      },
      {
        sender: 'ai',
        text: "Of course! What's on your mind? We can shorten it to 5 minutes, move it indoors, or swap to gentle stretching."
      }
    ]);
    setIsChatOpen(true);
  };

  // 2. Accepted State Handlers
  const handleAcceptedPlanB = () => {
    setChatMessages([
      {
        sender: 'user',
        text: "Something came up, let's look at Plan B."
      },
      {
        sender: 'ai',
        text: "Understood! No pressure at all. Would you like to reschedule for tonight, or try an easier low-energy alternative?"
      }
    ]);
    setIsChatOpen(true);
  };

  const handleNotToday = () => {
    setChatMessages([
      {
        sender: 'user',
        text: "Not today."
      },
      {
        sender: 'ai',
        text: "Totally fine! Rest days are just as healthy. Shall we pause physical goals and focus on a relaxing evening?"
      }
    ]);
    setIsChatOpen(true);
  };

  // Hold-to-complete logic (3 seconds = 3000ms)
  const startHold = () => {
    if (planState === 'completed') return;
    setIsHolding(true);
    holdStartRef.current = Date.now();

    const update = () => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setHoldProgress(progress);

      if (progress < 100) {
        holdTimerRef.current = requestAnimationFrame(update);
      } else {
        // Successfully held for 3 seconds
        setPlanState('completed');
        setIsHolding(false);
        setHoldProgress(100);
      }
    };

    holdTimerRef.current = requestAnimationFrame(update);
  };

  const cancelHold = () => {
    if (planState === 'completed') return;
    if (holdTimerRef.current) {
      cancelAnimationFrame(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    const elapsed = Date.now() - holdStartRef.current;
    setIsHolding(false);
    setHoldProgress(0);

    // Click fallback: quick tap (< 300ms) can mark complete as accessible fallback
    if (elapsed > 40 && elapsed < 300) {
      setPlanState('completed');
      setHoldProgress(100);
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) cancelAnimationFrame(holdTimerRef.current);
    };
  }, []);

  // Handle push message action
  const handleTellPlanB = () => {
    setChatMessages([
      {
        sender: 'user',
        text: "About yesterday's walk..."
      },
      {
        sender: 'ai',
        text: "I'm listening! Did you get a chance to step outside, or did life get in the way?"
      }
    ]);
    setIsChatOpen(true);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetInput.trim()) return;
    const text = sheetInput.trim();
    setSheetInput('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text },
      { sender: 'ai', text: "Got it! Take your time, there's always another way that fits your day." }
    ]);
  };

  // SVG circular progress calculation (enlarged by ~1.4x)
  const circleRadius = 34;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#ECEAE3] flex items-center justify-center p-0 sm:py-6 font-sans antialiased select-none text-[#22241F]">
      {/* Mobile Screen Container */}
      <div className="w-full max-w-[412px] h-[100dvh] sm:h-[852px] bg-[#F6F5F0] relative flex flex-col justify-between overflow-hidden sm:rounded-[44px] sm:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12)] sm:border sm:border-[#E0DED4]">
        
        {/* 1. Top Header */}
        <header className="pt-12 sm:pt-7 px-6 flex items-center justify-between shrink-0 z-20">
          <span className="text-2xl font-bold tracking-tight text-[#1E201B]">
            Plan B
          </span>
          <button 
            type="button"
            onClick={handleToggleNotification}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#3D4037] hover:bg-black/5 active:scale-95 transition-all"
            aria-label="Messages"
            title={showPushMessage ? "Switch to daily care" : "View push message"}
          >
            <MessageSquare className="w-5 h-5 stroke-[1.8]" />
            {hasUnreadNotification && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DE775B] ring-2 ring-[#F6F5F0]" />
            )}
          </button>
        </header>

        {/* Main Body Content: Naturally scrollable to prevent any clipping */}
        <div className="flex-1 overflow-y-auto px-6 pt-1 pb-2 flex flex-col justify-between scrollbar-none">
          
          {/* 2. Centered IP Character Bust (Seamlessly blended, zero border) */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[170px] max-h-[225px] shrink-0 relative my-1">
            <div 
              className={`relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center transition-all duration-200 ease-out ${
                isChatOpen 
                  ? 'opacity-0 scale-90' 
                  : 'opacity-100 scale-100'
              }`}
            >
              <img
                src={IP_IMAGE_URL}
                alt="Plan B Companion Kila"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_96%)] mix-blend-multiply opacity-95"
              />
            </div>

            {/* 1. Centered Nickname "Kila" directly below IP */}
            <h2 className="text-[17px] font-semibold text-[#1F211C] tracking-tight text-center mt-1 select-none">
              Kila
            </h2>
          </div>

          {/* 3. Lightweight Speech Area (Placed below Kila's nickname) */}
          <div className="min-h-[42px] flex flex-col items-center justify-center text-center px-4 my-1 transition-all duration-300 shrink-0">
            {!showPushMessage ? (
              <p className="text-[14px] sm:text-[15px] font-normal text-[#5B5E55] leading-relaxed tracking-normal animate-in fade-in duration-300">
                Hope your morning is going a little easier.
              </p>
            ) : (
              <div className="flex flex-col items-center gap-0.5 animate-in fade-in duration-300">
                <p className="text-[14px] sm:text-[15px] font-normal text-[#2A2C26] leading-relaxed">
                  Did you get a chance to take that walk yesterday?
                </p>
                <button
                  type="button"
                  onClick={handleTellPlanB}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#65775E] hover:text-[#4F5E49] active:scale-95 transition-all underline underline-offset-3"
                >
                  <span>Tell Plan B</span>
                  <ChevronRight className="w-3 h-3 stroke-[2.2]" />
                </button>
              </div>
            )}
          </div>

          {/* 4. Plan Card with Smooth Height Transition */}
          <div 
            className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 ease-out mb-2 shrink-0 relative overflow-hidden ${
              planState === 'suggested'
                ? 'bg-white/95 border border-[#E5E2D8] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]'
                : 'bg-[#F2F5EF] border border-[#D5DDCF] shadow-[0_6px_24px_-4px_rgba(80,100,70,0.07)]'
            }`}
          >
            {/* CARD STATE 1: SUGGESTED (Initial) */}
            {planState === 'suggested' && (
              <div className="flex flex-col justify-between gap-3 animate-in fade-in duration-200">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#797E72] block">
                    Today’s suggestion
                  </span>
                  <h2 className="text-[18px] sm:text-[19px] font-semibold tracking-tight text-[#1F211C] mt-1 leading-snug">
                    Take a 15-minute walk
                  </h2>
                  <p className="text-xs text-[#6A6D63] mt-1 leading-normal">
                    After lunch could be a good time, based on your usual routine.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleSoundsGood}
                    className="py-2.5 px-3 rounded-xl bg-[#6B7D64] hover:bg-[#5F7058] active:scale-97 text-white text-xs sm:text-[13px] font-medium shadow-2xs transition-all text-center"
                  >
                    Sounds good
                  </button>
                  <button
                    type="button"
                    onClick={handleInitialPlanB}
                    className="py-2.5 px-3 rounded-xl bg-[#F6F5F0] hover:bg-[#EFECE4] active:scale-97 text-[#43463E] border border-[#DDD9CE] text-xs sm:text-[13px] font-medium transition-all text-center"
                  >
                    Plan B
                  </button>
                </div>
              </div>
            )}

            {/* CARD STATE 2 & 3: ACCEPTED (YOUR PLAN) & COMPLETED - Top-to-Bottom Vertical Stack */}
            {planState !== 'suggested' && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                
                {/* 1. Top Section: Label "YOUR PLAN", Plan Title Left, Thumbnail Right */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E53] block mb-1">
                    YOUR PLAN
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-[18px] sm:text-[19px] font-semibold tracking-tight text-[#1F211C] leading-snug">
                      Take a 15-minute walk
                    </h2>

                    {/* Rich Media Thumbnail */}
                    <button
                      type="button"
                      onClick={() => setIsDetailOpen(true)}
                      className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#CBD5C4] shadow-2xs group active:scale-95 transition-all"
                      title="View plan guide"
                    >
                      <img
                        src={THUMB_IMAGE_URL}
                        alt="Walk preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow-xs">
                          <Play className="w-2.5 h-2.5 fill-[#2C3826] text-[#2C3826] ml-0.5" />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Middle Section: Horizontally Centered Circular Done Button (Enlarged ~1.4x) + "Hold to complete" */}
                <div className="flex flex-col items-center justify-center py-1.5">
                  <div className="relative w-[76px] h-[76px] flex items-center justify-center">
                    {/* SVG Progress Ring */}
                    <svg className="w-[76px] h-[76px] -rotate-90 pointer-events-none" viewBox="0 0 76 76">
                      {/* Background track */}
                      <circle
                        cx="38"
                        cy="38"
                        r={circleRadius}
                        className="stroke-[#DDE4D7]"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      {/* Animated progress stroke - Thickened for clarity */}
                      <circle
                        cx="38"
                        cy="38"
                        r={circleRadius}
                        className="stroke-[#61745A] transition-all duration-75"
                        strokeWidth="4.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={planState === 'completed' ? 0 : strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    {/* Circular Button Core (1.4x size: 60px diameter) */}
                    <button
                      type="button"
                      onMouseDown={startHold}
                      onMouseUp={cancelHold}
                      onMouseLeave={cancelHold}
                      onTouchStart={startHold}
                      onTouchEnd={cancelHold}
                      className={`absolute w-[60px] h-[60px] rounded-full flex items-center justify-center font-medium transition-all duration-200 select-none shadow-sm ${
                        planState === 'completed'
                          ? 'bg-[#61745A] text-white shadow-xs'
                          : isHolding
                          ? 'bg-[#566850] text-white scale-95 shadow-inner'
                          : 'bg-[#6B7D64] hover:bg-[#607259] active:bg-[#566850] text-white'
                      }`}
                      aria-label="Hold to complete"
                    >
                      {planState === 'completed' ? (
                        <Check className="w-6 h-6 stroke-[3]" />
                      ) : (
                        <span className="font-semibold text-[16px] tracking-tight">Done</span>
                      )}
                    </button>
                  </div>

                  {/* Single-line text underneath Done button */}
                  <span className="text-[11px] text-[#71786D] mt-2 whitespace-nowrap text-center font-normal">
                    {planState === 'completed' ? 'Completed' : 'Hold to complete'}
                  </span>
                </div>

                {/* 3. Bottom Section: Side-by-Side "Plan B" and "Not today" */}
                <div className="flex items-center justify-center gap-8 pt-2 border-t border-[#E1E7DC]/70">
                  {planState === 'completed' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPlanState('accepted');
                        setHoldProgress(0);
                      }}
                      className="text-xs text-[#71786D] hover:text-[#1F211C] py-1 px-3 transition-colors whitespace-nowrap underline underline-offset-3"
                    >
                      Undo completion
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleAcceptedPlanB}
                        className="text-xs font-medium text-[#4D5648] hover:text-[#1F211C] py-1 px-3 transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                      >
                        Plan B
                      </button>
                      <button
                        type="button"
                        onClick={handleNotToday}
                        className="text-xs font-medium text-[#737C6E] hover:text-[#1F211C] py-1 px-3 transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                      >
                        Not today
                      </button>
                    </>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

        {/* 5. Bottom Section: Conversational Input & 4 Navigation Tabs (Pinned cleanly) */}
        <div className="px-5 pb-7 sm:pb-6 pt-1 flex flex-col gap-2 shrink-0 z-20 bg-[#F6F5F0]/95 backdrop-blur-xs">
          {/* Conversational Input Entry */}
          <div 
            onClick={() => {
              setChatMessages([
                {
                  sender: 'ai',
                  text: "Hi Sarah! How's your day shaping up? Tell me whatever is on your mind."
                }
              ]);
              setIsChatOpen(true);
            }}
            className="bg-white rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-3 border border-[#E3DFD3] shadow-[0_4px_16px_rgba(0,0,0,0.02)] cursor-pointer"
          >
            <span className="flex-1 text-sm text-[#8F9288] font-normal select-none">
              Talk to Kila…
            </span>
            <div className="text-[#7D8177]">
              <Mic className="w-5 h-5 stroke-[1.8]" />
            </div>
          </div>

          {/* 4 Bottom Navigation Tabs */}
          <nav className="pt-2 px-2 flex items-center justify-between text-xs font-medium">
            {[
              { id: 'Today', icon: Calendar },
              { id: 'My Plan', icon: Sliders },
              { id: 'Memory', icon: Brain },
              { id: 'Discover', icon: Compass },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    isActive
                      ? 'text-[#283323] font-semibold'
                      : 'text-[#8C8F85] hover:text-[#4A4E44]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  <span className="text-[11px] tracking-tight">{tab.id}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 6. Rich Media Plan Detail Sheet (Placeholder for walk guide & audio) */}
        {isDetailOpen && (
          <div className="absolute inset-0 z-40 bg-black/20 backdrop-blur-2xs flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-[#FAF9F5] rounded-t-[32px] border-t border-[#E5E2D8] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] flex flex-col h-[75%] max-h-[600px] animate-in slide-in-from-bottom duration-300">
              
              {/* Sheet Header */}
              <div className="px-5 pt-4 pb-3 border-b border-[#EFECE3] flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#61745A]">
                    Plan Details
                  </span>
                  <h3 className="text-base font-semibold text-[#1F211C]">15-minute Mindful Walk</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#686C62] hover:bg-black/5 active:scale-95 transition-all"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Sheet Content: Media & Action Guide */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {/* Media Hero Banner */}
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-[#DDE3D6] shadow-xs">
                  <img
                    src={THUMB_IMAGE_URL}
                    alt="Walking trail"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-3.5">
                    <div className="flex items-center justify-between w-full text-white">
                      <div>
                        <div className="text-xs font-semibold">Morning Tree Trail Audio</div>
                        <div className="text-[10px] text-white/80">Gentle birdsong & calming rhythm • 15:00</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-8 h-8 rounded-full bg-white text-[#2C3826] flex items-center justify-center shadow-md active:scale-95"
                      >
                        {isPlayingAudio ? (
                          <Volume2 className="w-4 h-4 stroke-[2.2]" />
                        ) : (
                          <Play className="w-4 h-4 fill-[#2C3826] ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clean Practical Tips */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-[#30362C]">Gentle Guidelines</h4>
                  <div className="p-3 rounded-xl bg-white border border-[#E9E6DC] text-xs text-[#535A4D] space-y-2">
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#6B7D64] mt-0.5 shrink-0" />
                      <span>Best window: right after lunch (1:15 PM) to aid light digestion and mental reset.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#6B7D64] mt-0.5 shrink-0" />
                      <span>Zero pace requirement. Walk as slowly as you like—just let your eyes rest from screens.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sheet Footer */}
              <div className="p-4 border-t border-[#EFECE3] bg-[#FAF9F5] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#6B7D64] text-white text-xs font-medium text-center shadow-xs"
                >
                  Back to Today
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 7. AI Conversation Drawer / Sheet with Kila Listening Pose (Conditionally rendered) */}
        {isChatOpen && (
          <div className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-end animate-in fade-in duration-200">
            {/* Dimmed Backdrop */}
            <div 
              onClick={() => setIsChatOpen(false)} 
              className="absolute inset-0 bg-black/25 backdrop-blur-2xs" 
            />

            {/* Drawer Sheet */}
            <div className="relative bg-[#FAF9F5] rounded-t-[36px] border-t border-[#E5E2D8] shadow-[0_-16px_48px_rgba(0,0,0,0.12)] flex flex-col h-[74%] max-h-[580px] z-10 animate-in slide-in-from-bottom duration-300">
              {/* Kila in Listening Pose Peeking Over the Drawer Top Edge */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 flex items-center justify-center pointer-events-none select-none z-30">
                <img
                  src={KILA_LISTENING_URL}
                  alt="Kila listening"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain [mask-image:radial-gradient(ellipse_at_center,black_62%,transparent_96%)] mix-blend-multiply drop-shadow-xs"
                />
              </div>

              {/* Close Button Top-Right (Independent of Kila) */}
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="absolute top-3.5 right-4 z-40 w-8 h-8 rounded-full flex items-center justify-center text-[#686C62] hover:bg-black/5 active:scale-95 transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Header with Centered Nickname "Kila" */}
              <div className="pt-14 pb-2 px-5 border-b border-[#EFECE3]/70 flex items-center justify-center shrink-0">
                <h3 className="text-[15px] font-semibold text-[#1F211C] tracking-tight text-center">
                  Kila
                </h3>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 text-xs leading-relaxed">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-[#6B7D64] text-white rounded-br-xs'
                          : 'bg-white text-[#2B2D27] border border-[#E7E4DC] rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar inside sheet */}
              <form
                onSubmit={handleSendChatMessage}
                className="p-4 border-t border-[#EFECE3] bg-[#FAF9F5] shrink-0"
              >
                <div className="bg-white rounded-full px-4 py-2.5 flex items-center gap-2 border border-[#DFDBD0] shadow-2xs">
                  <input
                    type="text"
                    value={sheetInput}
                    onChange={(e) => setSheetInput(e.target.value)}
                    placeholder="Type your response…"
                    className="flex-1 bg-transparent text-xs text-[#1F211C] placeholder-[#909489] outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!sheetInput.trim()}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      sheetInput.trim()
                        ? 'bg-[#6B7D64] text-white active:scale-95'
                        : 'bg-[#EBE8DF] text-[#A6A99F]'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
