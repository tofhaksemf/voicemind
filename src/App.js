import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 당신의 기억력 친구입니다. 화면을 클릭하면 대화를 시작할게요.' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: '', score: 0 });

  const chatEndRef = useRef(null);

  // 1. 음성 출력 함수 (TTS)
  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR'; // 한국어 설정
    utterance.rate = 0.9;     // 약간 천천히 말하기
    
    utterance.onend = () => {
      if (callback) callback(); // 말이 끝나면 다음 동작(음성 인식 등) 실행
    };
    window.speechSynthesis.speak(utterance);
  };

  // 2. 음성 인식 함수 (STT)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다. 크롬 브라우저를 권장합니다.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserResponse(transcript);
    };

    recognition.start();
  };

  // 3. 대화 로직 처리
  const handleUserResponse = (input) => {
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    setTimeout(() => {
      processNextStep(input, newMessages);
    }, 600);
  };

  const processNextStep = (input, currentMessages) => {
    let botReply = '';
    let nextStep = step;

    if (step === 0) {
      setUserInfo(prev => ({ ...prev, name: input }));
      botReply = `${input}님, 반가워요! 오늘은 몇 월인가요? 숫자로 말씀해주세요.`;
      nextStep = 1;
    } else if (step === 1) {
      const currentMonth = new Date().getMonth() + 1;
      if (input.includes(currentMonth.toString())) {
        setUserInfo(prev => ({ ...prev, score: prev.score + 1 }));
        botReply = "정답입니다! 아주 명석하시네요. ";
      } else {
        botReply = "조금 아쉽네요. ";
      }
      botReply += "다음 질문입니다. 사과, 의자, 자동차를 기억해보세요. 다 기억하셨으면 '네'라고 말씀해주세요.";
      nextStep = 2;
    } else if (step === 2) {
      botReply = "방금 말씀드린 세 단어 중 생각나는 것을 하나만 말씀해 보세요.";
      nextStep = 3;
    } else {
      botReply = `${userInfo.name}님, 모든 테스트가 끝났습니다. 정말 고생 많으셨어요!`;
    }

    setMessages([...currentMessages, { sender: 'bot', text: botReply }]);
    setStep(nextStep);
    
    // 봇이 메시지를 출력한 후 다시 말하게 함
    speak(botReply, () => {
      if (nextStep < 4) startListening(); // 마지막 단계가 아니면 다시 듣기 시작
    });
  };

  // 처음 시작할 때 화면 클릭 시 시작하도록 유도
  const startApp = () => {
    if (step === 0 && messages.length === 1) {
      speak(messages[0].text, startListening);
    }
  };

  return (
    <div onClick={startApp} style={styles.container}>
      <header style={styles.header}>기억 친구 (음성 모드)</header>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>
            {msg.text}
          </div>
        ))}
        {isListening && <div style={styles.listening}>🎤 듣고 있어요... 말씀해 주세요</div>}
        <div ref={chatEndRef} />
      </div>
      <div style={styles.footer}>화면을 터치하면 대화가 시작됩니다</div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9', fontFamily: 'sans-serif', cursor: 'pointer' },
  header: { padding: '20px', textAlign: 'center', backgroundColor: '#28a745', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' },
  chatBox: { flex: 1, overflowY: 'auto', padding: '20px' },
  botMsg: { alignSelf: 'flex-start', backgroundColor: 'white', padding: '15px', borderRadius: '15px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', width: 'fit-content' },
  userMsg: { marginLeft: 'auto', backgroundColor: '#e1ffc7', padding: '15px', borderRadius: '15px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', width: 'fit-content' },
  listening: { textAlign: 'center', color: '#dc3545', fontWeight: 'bold', marginTop: '10px', animate: 'pulse 1s infinite' },
  footer: { padding: '15px', textAlign: 'center', color: '#888', fontSize: '0.9rem', borderTop: '1px solid #eee' }
};

export default App;