//Imports
import { useState, useRef, useEffect } from 'react';
import './App.css';
import './components/Mobile.css'

//React components
import Infinitives from './components/InfinitivesFr';
import Tenses from './components/Tenses';
import PersonsFr from './components/PersonsFr';
import Modal from './components/ModalFr';
import Tutorial from './components/Tutorial';
import SetSeconds from './components/SetSeconds';
import MobileInfinitives from './components/MobileInfinitivesFr';
import MobileTenses from './components/MobileTenses';
import MobilePersonsFr from './components/MobilePersonsFr';
import Footer from './components/Footer';

//Data file containing all verbs' info
import data from './french-data.json';
import ModalContentFr from './components/ModalContentFr';

//Sound files
import wrongSoundFile from './sound/wrong.mp3';
import correctSoundFile from './sound/correct.mp3';
import ReflexiveModal from './components/ReflexiveModalFr';
import SpecialCharactersFr from './components/SpecialCharactersFr';



function FrenchApp() {

  // We create a ref for the input element (in order to have the input targeted when we click on Play)
  const inputRef = useRef(null);

  //We deconstruct all information needed from the json file
  const { infinitives, tenses, persons } = data;

  let countdown;

  //----STATE------STATE----------STATE--------STATE--------STATE--------STATE-------STATE--------//

  const [jsonData, setJsonData] = useState(data);

  // sets whether the labels and input appear or not
  const [labelsOn, setLabelsOn] = useState(false);
  const [inputOn, setInputOn] = useState(false);

  // Sets teacher mode on or off
  const [teacherMode, setTeacherMode] = useState(false)
  const [secondsByUser, setSecondsByUser] = useState(20); //seconds chosen by the user
  const [countdownInterval, setCoundownInterval] = useState(null) //countdown

  //These are here to store the user answer
  const [input, setInput] = useState('');

  // Having the gameOn mode will avoid unwanted behaviours when clicking on the Play and Check buttons
  const [gameIsOn, setGameIsOn] = useState(false);
  const [gameOver, setGameOver] = useState(true);

  //These are the final infinitive, tense and person that the user needs to guess
  const [infinitiveToAnswer, setInfinitiveToAnswer] = useState('');
  const [tenseToAnswer, setTenseToAnswer] = useState('');
  const [personToAnswer, setPersonToAnswer] = useState();

  //This is the definitive verb that the userNeeds to guess, and its translation
  const [finalWord, setFinalWord] = useState('');
  const [englishFinalWord, setEnglishFinalWord] = useState('');

  //This will become true if the infinitive to guess happens to be a reflexive one
  const [isReflexive, setIsReflexive] = useState(false);

  //This state changes the style of the text when you give the right/wrong answer
  const [rightAnswer, setRightAnswer] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);

  const [userTries, setUserTries] = useState(3);

  // Showing the modal or tutorial
  const [showModal, setShowModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // We store this value to true if the user has switched off all tenses, to avoid bugs
  const [allInfinitivesFalse, setAllInfinitivesFalse] = useState(false);
  const [allIrregularsFalse, setAllIrregularsFalse] = useState(false);
  const [allTensesFalse, setAllTensesFalse] = useState(false);
  const [allPersonsFalse, setAllPersonsFalse] = useState(false);

  // State that controls the mobile version of the info row
  const [showMobileInfinitives, setShowMobileInfinitives] = useState(false);
  const [showMobileTenses, setShowMobileTenses] = useState(false);
  const [showMobilePersons, setShowMobilePersons] = useState(false);

  //Making the counter visible or not
  const [counterVisible, setCounterVisible] = useState(false);

  // Sound-----------Sound---------------Sound----------------Sound---------------Sound--------------Sound---------

  //preload sounds to avoid delay
  const wrongSound = new Audio(wrongSoundFile);
  const correctSound = new Audio(correctSoundFile);

  const playWrongSound = () => {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }
  const playCorrectSound = () => {
    correctSound.currentTime = 0;
    correctSound.play();
  }

  //-------FUNCTIONS----FUNCTIONS-------FUNCTIONS--------FUNCTIONS-------FUNCTIONS-------FUNCTIONS-----FUNCTIONS------

    // This controls the tracker on the footer, making it appear when hovering over it
    useEffect(() => {
      const el = document.querySelector(".user-counter");
      if (el) el.style.opacity = counterVisible ? "1" : "0";
      }, [counterVisible]);

  const resetState = () => {
    setInput("");
    setRightAnswer(false);
    setWrongAnswer(false);
    setUserTries(3);
    setFinalWord("");
    setEnglishFinalWord("");
    setTenseToAnswer("");
    setInfinitiveToAnswer("");
    setPersonToAnswer("");
    setShowModal(false);
    setIsReflexive(false);
  }

  // Enables the functionality to toggle the tenses on or off
  const toggleTense = (index) => {
    const updatedTenses = [...jsonData.tenses];
    updatedTenses[index][6] = !updatedTenses[index][6];
    setJsonData({ ...jsonData, tenses: updatedTenses })

    //We check whether all tenses have been set to false by the user
    const allTFalse = updatedTenses.every(tense => !tense[6]);
    setAllTensesFalse(allTFalse);
    resetState(); // we reset the game
    setLabelsOn(false);
    setInputOn(false);
  }

  const togglePerson = (index) => {
    const updatedPersons = [...jsonData.persons];
    updatedPersons[index][1] = !updatedPersons[index][1];
    setJsonData({ ...jsonData, persons: updatedPersons })

    const allPFalse = updatedPersons.every(person => !person[1]);
    setAllPersonsFalse(allPFalse);
    resetState(); // we reset the game
    setLabelsOn(false);
    setInputOn(false);
  }

  // -------------------------Function to show all verb options on or off---------------------------------*/

  const toggleAllVerbOptions = () => {
    setShowMobileInfinitives(prevValue => !prevValue);
    setShowMobileTenses(prevValue => !prevValue);
    setShowMobilePersons(prevValue => !prevValue);
    resetState(); // we reset the game
    setLabelsOn(false);
    setInputOn(false);
  }

  // ----------------------------Functions to toggle the infinitives on and off------------------------------
  const toggle_er = () => {
    const updatedInfinitives = jsonData.infinitives.map(infinitive => {
      //check if the infinitive is an -ar verb
      if (infinitive[7] === "-er verb") {
        //set the 8th value to its opposite (true or false)
        infinitive[8] = !infinitive[8];
      }
      return infinitive
    })
    // update jsonData with modified values
    setJsonData({ ... jsonData, infinitives: updatedInfinitives})
    //We check whether all infinitives have been set to false by the user
    const allInfFalse = updatedInfinitives.every(infinitive => !infinitive[8]);
    setAllInfinitivesFalse(allInfFalse);
    resetState(); // we reset the game
    setLabelsOn(false);
    setInputOn(false);
  }

  const toggle_ir = () => {
    const updatedInfinitives = jsonData.infinitives.map(infinitive => {
      //check if the infinitive is an -er verb
      if (infinitive[7] === "-ir verb") {
        //set the 8th value to its opposite (true or false)
        infinitive[8] = !infinitive[8];
      }
      return infinitive
    })
    // update jsonData with modified values
    setJsonData({ ... jsonData, infinitives: updatedInfinitives})
    //We check whether all infinitives have been set to false by the user
    const allInfFalse = updatedInfinitives.every(infinitive => !infinitive[8]);
    setAllInfinitivesFalse(allInfFalse);
    resetState(); // we reset the game
    setLabelsOn(false);
    setInputOn(false);
  }

  const toggle_re = () => {
    const updatedInfinitives = jsonData.infinitives.map(infinitive => {
      //check if the infinitive is an -ir verb
      if (infinitive[7] === "-re verb") {
        //set the 8th value to its opposite (true or false)
        infinitive[8] = !infinitive[8];
      }
      return infinitive
    })
    // update jsonData with modified values
    setJsonData({ ... jsonData, infinitives: updatedInfinitives})
    //We check whether all infinitives have been set to false by the user
    const allInfFalse = updatedInfinitives.every(infinitive => !infinitive[8]);
    setAllInfinitivesFalse(allInfFalse);
    resetState(); // we reset the game
    setLabelsOn(false);
    setInputOn(false);
  }

    const toggle_modal = () => {
    const updatedInfinitives = jsonData.infinitives.map(infinitive => {
      if (infinitive[7] === "modal verb") {
        infinitive[8] = !infinitive[8];
      }
      return infinitive
    })
    setJsonData({ ... jsonData, infinitives: updatedInfinitives})
    const allInfFalse = updatedInfinitives.every(infinitive => !infinitive[8]);
    setAllInfinitivesFalse(allInfFalse);
    resetState(); //
    setLabelsOn(false);
    setInputOn(false);
  }

  const toggle_reflexive = () => {
    const updatedInfinitives = jsonData.infinitives.map(infinitive => {
      if (infinitive[7] === "reflexive verb") {
        infinitive[8] = !infinitive[8];
      }
      return infinitive
    })
    setJsonData({ ... jsonData, infinitives: updatedInfinitives})
    const allInfFalse = updatedInfinitives.every(infinitive => !infinitive[8]);
    setAllInfinitivesFalse(allInfFalse);
    resetState(); //
    setLabelsOn(false);
    setInputOn(false);
  }

  const toggle_all_irregulars = () => {
    const updatedInfinitives = jsonData.infinitives.map(infinitive => {
      if (infinitive[7] === "irregular verb"){
        if (infinitives[32][8] === false) {
          infinitive[8] = true;
          setAllIrregularsFalse(true);
        } else if (infinitives[32][8] === true){
          infinitive[8] = false;
          setAllIrregularsFalse(false);
        }  
      }
      return infinitive
    })
    
    setJsonData({ ... jsonData, infinitives: updatedInfinitives})
    const allInfFalse = updatedInfinitives.every(infinitive => !infinitive[8]);
    setAllInfinitivesFalse(allInfFalse);
    resetState();
    setLabelsOn(false);
    setInputOn(false);
  }

  const toggle_individual_irregulars = (index) => {
    const updatedInfinitives = [...jsonData.infinitives];
    updatedInfinitives[index+24][8] = !updatedInfinitives[index+24][8];
    setJsonData({ ... jsonData, infinitives: updatedInfinitives})
    //here we check whether we have set all verbs to false
    const allInfFalse = updatedInfinitives.every(infinitive => !infinitive[8]);
    setAllInfinitivesFalse(allInfFalse);
    //here we check whether we have set all irregulars to false
    const allIrregularsFalse = updatedInfinitives.filter(infinitive => infinitive[7] === "irregular verb").every(infinitive => !infinitive[8])
    setAllIrregularsFalse(!allIrregularsFalse)

    resetState();
    setLabelsOn(false);
    setInputOn(false);
  }



  // Switches the value of showModal true/false
  const handleModal = () => {
    if (gameIsOn && finalWord !== "") {
      setShowModal(prevValue => !prevValue)
    }
  }

    // Switches the value of showTutorial true/false
  const handleTutorial = () => {
      setShowTutorial(prevValue => !prevValue)
  }

  //Function that selects the random verb that the user needs to guess
  const handlePlay = () => {
    setLabelsOn(true); // we make sure the info labels and input bar appear
    setInputOn(true);

    //we clear the interval of the countdown so there are no more than one running at the same time, creating bugs
    clearInterval(countdownInterval); 

    //delete previous user input, delete all previous state values
    resetState();

    //Set Game to mode ON
    setGameIsOn(true);
    setGameOver(false);

    //We make sure all verb options are closed on mobile
    setShowMobileInfinitives(false)
    setShowMobilePersons(false);
    setShowMobileTenses(false);

    //We make sure there is at least one tense and person active
    if (allInfinitivesFalse || allTensesFalse || allPersonsFalse) {
      setInput('Select at least one infinitive, tense and person!');
      setLabelsOn(false);
      return;
    }

    //choose infinitive
    let randomInfinitiveIndex = Math.floor(Math.random() * infinitives.length);
    let varInfinitiveToAnswer = infinitives[randomInfinitiveIndex];
    //keep looping until we get a value that has not been switched off
    while (varInfinitiveToAnswer[8] === false) {
        randomInfinitiveIndex = Math.floor(Math.random() * infinitives.length);
        varInfinitiveToAnswer = infinitives[randomInfinitiveIndex];
    }
    if (varInfinitiveToAnswer[7] === "reflexive verb") {
      setIsReflexive(true);
    }

    //choose tense
    let randomTenseIndex = Math.floor(Math.random() * tenses.length);
    let varTenseToAnswer = tenses[randomTenseIndex];
    //here we add a while loop to make sure we don't return a tense that has been turned off by the user
    while (varTenseToAnswer[6] === false) {
          randomTenseIndex = Math.floor(Math.random() * tenses.length);
          varTenseToAnswer = tenses[randomTenseIndex];
    }

    //choose person
    let randomPersonIndex;
    let varPersonToAnswer;
    do {
      randomPersonIndex = Math.floor(Math.random() * persons.length)
      varPersonToAnswer = persons[randomPersonIndex];
    } while (!varPersonToAnswer[1]); // We keep looping until we get a person that has not been deactivated by the user

    let varFinalWord = varInfinitiveToAnswer[randomTenseIndex + 1][randomPersonIndex][0];
    let varEnglishFinalWord = varInfinitiveToAnswer[randomTenseIndex + 1][randomPersonIndex][1];

    //turn variables into state
    setInfinitiveToAnswer(varInfinitiveToAnswer);
    setTenseToAnswer(varTenseToAnswer);
    setPersonToAnswer(varPersonToAnswer);
    setFinalWord(varFinalWord);
    setEnglishFinalWord(varEnglishFinalWord);
    

    countdown = secondsByUser;
    if (!teacherMode) {
      // Focus the input element after setting the game
      // It was necessary to include this on a setTimeout to make sure it happened immediately after first click
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    } else {
      setInput(secondsByUser);
      setCoundownInterval(
        setInterval(() => {
          countdown--;
          setInput(countdown.toString());
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            setGameIsOn(false);
          }
        }, 1000)
      )
    }
  }

  //Function that checks whether the user was right in his guess
  const handleCheck = () => {
    if (gameIsOn) {
      if (input !== "Select at least one tense and person!") {
        if (userTries > 0) {
          if (input !== "") {
            //tidy user input (set to lower case, delete accents, diacritics, etc)
            let newInput = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            let newFinalWord = finalWord[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            
            if (newInput === newFinalWord) {
              playCorrectSound();
              setRightAnswer(true);
              setInput(finalWord[0]);
              setGameIsOn(false);
              setGameOver(true);
              setWrongAnswer(false);
            } else if (newFinalWord[1] && newInput === newFinalWord[1]) {
              playCorrectSound();
              setRightAnswer(true);
              setInput(finalWord[1]);
              setGameIsOn(false);
              setGameOver(true);
              setWrongAnswer(false);
            } else if(newFinalWord[2] && newInput === newFinalWord[2]) {
              playCorrectSound();
              setRightAnswer(true);
              setInput(finalWord[2]);
              setGameIsOn(false);
              setGameOver(true);
              setWrongAnswer(false);
            } else if(newInput !== newFinalWord && userTries === 1) {
              playWrongSound();
              setUserTries(0)
              setWrongAnswer(true);
              setInput(`The answer was "${finalWord}"`)
              setGameOver(true);
            } else {
              playWrongSound();
              setWrongAnswer(true);
              setInput(input);
              setUserTries(prevTries => prevTries - 1)
            }
          } else { setInput("Type your answer!") }
        }
      }
    }
  }

  // This function appears only on Teacher mode, letting the teacher show the correct answer
  const showAnswer = () => {
    if (finalWord) {
      setRightAnswer(true);
      setInput(finalWord);///
      setGameIsOn(false);
    }
  }

  // useEffect to add event listeners to buttons
  useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === '/') {
          event.preventDefault() //this prevents the character '/' from appearing in the input
          handlePlay();
        } else if (event.key === '.') {
          if (teacherMode) {
            event.preventDefault() //this prevents the character '/' from appearing in the input
            showAnswer();
          }
        } 
      };
        //Add event listeners to the document for keydown events
        document.addEventListener('keydown', handleKeyDown);

        //Cleanup function to remove event listener when component unmounts
        return() => {
          document.removeEventListener('keydown', handleKeyDown)
        };
  }, [handlePlay, showAnswer, teacherMode]);

  // This useEffect is here so that the countdown can be interrupted when clicking on showAnswer
  useEffect(() => {
    if (!gameIsOn) {
      clearInterval(countdownInterval);
    }
  }, [countdownInterval, gameIsOn])

  const toggleTeacherMode = () => {
    setLabelsOn(false);
    setInputOn(false);
    setGameIsOn(false);
    setGameOver(true);
    setTeacherMode(prevValue => !prevValue);
    resetState();
  }

    const shortenPerson = (personToAnswer) => {
      if (personToAnswer[0] === "Je → I"){
        return "Je";
      } else if (personToAnswer[0] === "tu → you"){
        return "tu";
      } else if (personToAnswer[0] === "il → he"){
        return "il";
      } else if (personToAnswer[0] === "elle → she"){
        return "elle";
      } else if (personToAnswer[0] === "on → we"){
        return "on";
      } else if (personToAnswer[0] === "nous → we"){
        return "nous";
      } else if (personToAnswer[0] === "vous → you all"){
        return "vous";
      } else if (personToAnswer[0] === "ils → they"){
        return "ils";
      } else if (personToAnswer[0] === "elles → they"){
        return "elles";
      }else {
        return "";
      }
    }


  return (
    // al final borre el estilo de la clase teacher, tal vez puedas borrarlo de la siguiente linea
    <div className={`App ${teacherMode ? "teacher" : ""}`}>
      <div className="framework">

        <div className='title-row'>
          <button className='top-button tooltip-container' onClick={handleTutorial}>
            <span class="material-symbols-outlined">help</span>
            <span className="tooltip">Instructions</span>
          </button>
          <h1 className="title">French verbs trainer: {teacherMode ? "Teacher Mode" : "Student Mode"}</h1>
          <button 
            className='top-button tooltip-container'
            onClick={toggleTeacherMode}>
            <span class="material-symbols-outlined">person_raised_hand</span>
            <span className="tooltip">Toggle between Student and Teacher modes</span>
          </button>
        </div>
        
        {!teacherMode && <p className='tries'>{`Remaining tries: ${userTries}`}</p>}

        <div className="row1">
          <Tenses 
            tenses={tenses} 
            toggleTense={toggleTense}
            showMobileTenses={showMobileTenses}
            toggleAllVerbOptions={toggleAllVerbOptions}
            tenseToAnswer={tenseToAnswer}
            />
          <Infinitives 
            infinitives={Infinitives} 
            toggle_er={toggle_er} 
            toggle_ir={toggle_ir}
            toggle_re={toggle_re} 
            toggle_modal={toggle_modal}
            toggle_reflexive={toggle_reflexive}
            toggle_all_irregulars={toggle_all_irregulars} 
            toggle_individual_irregulars={toggle_individual_irregulars} 
            allIrregularsFalse={allIrregularsFalse}
            infinitiveToAnswer={infinitiveToAnswer}
            showMobileInfinitives={showMobileInfinitives}
            toggleAllVerbOptions={toggleAllVerbOptions}
            finalWord={finalWord}
            />
          <PersonsFr 
            persons={persons} 
            togglePerson={togglePerson}
            showMobilePersons={showMobilePersons}
            toggleAllVerbOptions={toggleAllVerbOptions}
            personToAnswer={personToAnswer}
            shortenPerson={shortenPerson}
            />
        </div>

        <div className="mobile-row">
          <MobileTenses 
            showMobileTenses={showMobileTenses}
            setShowMobileTenses={setShowMobileTenses}
            setShowMobileInfinitives={setShowMobileInfinitives}
            setShowMobilePersons={setShowMobilePersons}
            tenses={tenses} 
            toggleTense={toggleTense}
            resetState={resetState}
            setLabelsOn={setLabelsOn}
            setInputOn={setInputOn}
            tenseToAnswer={tenseToAnswer}
            />
          <MobileInfinitives 
            showMobileInfinitives={showMobileInfinitives} 
            setShowMobileInfinitives={setShowMobileInfinitives}
            setShowMobileTenses={setShowMobileTenses}
            setShowMobilePersons={setShowMobilePersons}
            infinitives={Infinitives} 
            toggle_er={toggle_er} 
            toggle_ir={toggle_ir}
            toggle_re={toggle_re} 
            toggle_modal={toggle_modal}
            toggle_reflexive={toggle_reflexive}
            toggle_all_irregulars={toggle_all_irregulars} 
            toggle_individual_irregulars={toggle_individual_irregulars} 
            allIrregularsFalse={allIrregularsFalse}
            resetState={resetState}
            setLabelsOn={setLabelsOn}
            setInputOn={setInputOn}
            infinitiveToAnswer={infinitiveToAnswer}
            finalWord={finalWord}
            />
          <MobilePersonsFr 
            showMobilePersons={showMobilePersons}
            setShowMobilePersons={setShowMobilePersons}
            setShowMobileInfinitives={setShowMobileInfinitives}
            setShowMobileTenses={setShowMobileTenses}
            persons={persons} 
            togglePerson={togglePerson}
            resetState={resetState}
            setLabelsOn={setLabelsOn}
            setInputOn={setInputOn}
            personToAnswer={personToAnswer}
            shortenPerson={shortenPerson}
          />
        </div>

        <div className="row2">

          {inputOn && 
            <input
              className="user-text"
              id={(rightAnswer ? "correct-answer" : "") + (wrongAnswer ? "incorrect-answer" : "")}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); //this line avoids the enter button to trigger input form submission
                  handleCheck();
                }
              }}
              disabled={gameOver}
              ref={inputRef}
            />}

        </div>

          {inputOn && finalWord &&
            <div className='translation-label'>{`The meaning is: ${englishFinalWord[0]}`}</div>
          }

      </div>

      <div className='button-group'>
          {!teacherMode && labelsOn && <button className='main-button squiggle' onClick={handleCheck}>Check</button>}
          {teacherMode && labelsOn && <button className='main-button squiggle' onClick={showAnswer}>Show Answer</button>}
          {teacherMode && !labelsOn && <div className='main-button dummy-button squiggle'>Dummy</div>}

          <button className='main-button' onClick={handlePlay}>Play</button>

          {teacherMode && <SetSeconds secondsByUser={secondsByUser} setSecondsByUser={setSecondsByUser}/>}
          {!teacherMode && labelsOn && <button className='main-button squiggle' onClick={handleModal}>Cheatsheet</button>}
        </div>

      {inputOn && !teacherMode &&
        <SpecialCharactersFr setInput={setInput}/>
      }
        
      {showModal &&
        <Modal
          handleModal={handleModal}
          tense={tenseToAnswer}
          isReflexive={isReflexive}
          infinitiveToAnswer={infinitiveToAnswer}
        />}
      {showTutorial &&
        <Tutorial handleTutorial={handleTutorial}/>
      }
      {teacherMode && tenseToAnswer &&
        <div className='modal-2'>
          {isReflexive && <ReflexiveModal />}
          <ModalContentFr
            handleModal={handleModal}
            tense={tenseToAnswer}
            teacherMode={teacherMode}
            infinitiveToAnswer={infinitiveToAnswer}
          />
        </div>}

        <Footer
          onHoverStart={() => setCounterVisible(true)}
          onHoverEnd={() => setCounterVisible(false)}
        />
        
    </div>
  );
}

export default FrenchApp;
