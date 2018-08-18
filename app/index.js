import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

//questions. Simulate JSON object from API
const questions = {
    "q1": {
        "question": "5 + 7 = ?",
        "options": [
            "10",
            "11",
            "12",
            "13"
        ],
        "answer": "12"
    },
    "q2": {
        "question": "12 - 8 = ?",
        "options": [
            "1",
            "2",
            "3",
            "4"
        ],
        "answer": "4"
    },
    "q3": {
        "question": "12 * 2 = ?",
        "options": [
            "12",
            "24",
            "55",
            "13"
        ],
        "answer": "24"
    },
    "q4": {
        "question": "5 + 8 = ?",
        "options": [
            "10",
            "11",
            "12",
            "13"
        ],
        "answer": "13"
    },
    "q5": {
        "question": "Should someone offer Jordan a job?",
        "options": [
            "Yes",
            "No",
            "12",
            "13"
        ],
        "answer": "Yes"
    }
}

//simulate highscores data
let highScores = [{name: 'Jordan', score: 6}, {name: 'Jerry', score: 2}];

//Main component
class Quiz extends React.Component {
    constructor(props) {
        super(props);

        this.handleStart = this.handleStart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
        this.handleReset = this.handleReset.bind(this);

        this.state = {
            currentPage: 0,
            usersName: '',
            usersScore: 0,
            qOne: false,
            qTwo: false,
            qThree: false,
            qFour: false,
            qFive: false,
            totalSeconds: 180,
            timeLength: 3,
            timeLeft: '3:00',
            lastUpdate: 0,
            isCountdown: false
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.update(), 1000);
        console.log("mounted");
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    //update() runs every 1000ms
    update() {
        //only run timer during questions
        if(!this.state.isCountdown){
            return;
        }

        let newLastUpdate = this.state.lastUpdate + 1000;
        let newSecondsLeft = this.state.totalSeconds;
        let newTimeLeft = this.state.timeLeft;
        let page = this.state.currentPage;

        //ends game if timer runs out
        if (this.state.totalSeconds == 1) {
            document.getElementById("beep").play();
            page = 6;
            this.handleFinish();
        }

        if (this.state.totalSeconds > 0) {
            newSecondsLeft -= 1;
        }

        //display for the timer
        let minutes = Math.floor(newSecondsLeft/60);
        if (minutes < 10) {
            minutes = `0${minutes}`
        }
        let seconds = newSecondsLeft % 60;
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        newTimeLeft = `${minutes}:${seconds}`;
        if(newTimeLeft === '00:00') {
            newTimeLeft = 'Out of time';
        }

        this.setState ({
            totalSeconds: newSecondsLeft,
            timeLeft: newTimeLeft,
            lastUpdate: newLastUpdate,
            currentPage: page
        });
    }

    //Starts timer, sets users name, and gives first question
    handleStart() {
        let name = document.getElementById('name').value;
        if(!name) {
            alert("Please enter your name before starting");
            return;
        }

        let newSecondsLeft = this.state.totalSeconds;
        let newTimeLeft = this.state.timeLeft;


        newSecondsLeft = this.state.timeLength * 60;
        if (this.state.timeLength < 10) {
            newTimeLeft = `0${this.state.timeLength}:00`;
        }else{
            newTimeLeft = `${this.state.timeLength}:00`;
        }

        this.setState({
            usersName: name,
            currentPage: 1,
            totalSeconds: newSecondsLeft,
            timeLeft: newTimeLeft,
            lastUpdate: Date.now(),
            isCountdown: true
        })
    }

    //Back one question
    handlePrev() {
        let page = this.state.currentPage - 1;
        this.setState({
            currentPage: page
        })
    }

    //Next question
    handleNext(question) {
        let page = this.state.currentPage + 1;
        this.setState({
            currentPage: page
        })

    }

    //function sets users answer
    handleChange(ans, questionNum) {
        //checks if users answer is correct
        if(questionNum === 1) {
            ans === questions.q1.answer ? this.setState({qOne: true}) : this.setState({qOne: false});
        }

        if(questionNum === 2) {
            ans === questions.q2.answer ? this.setState({qTwo: true}) : this.setState({qTwo: false});
        }

        if(questionNum === 3) {
            ans === questions.q3.answer ? this.setState({qThree: true}) : this.setState({qThree: false});
        }

        if(questionNum === 4) {
            ans === questions.q4.answer ? this.setState({qFour: true}) : this.setState({qFour: false});
        }

        if(questionNum === 5) {
            ans === questions.q5.answer ? this.setState({qFive: true}) : this.setState({qFive: false});
        }
    }

    //counts the users score, stops countdown
    handleFinish() {
        let name = this.state.usersName;
        let score = 0;
        if(this.state.qOne) {
            score++;
        }
        if(this.state.qTwo) {
            score++;
        }
        if(this.state.qThree) {
            score++;
        }
        if(this.state.qFour) {
            score++;
        }
        if(this.state.qFive) {
            score++;
        }
        this.setState({
            currentPage: 6,
            usersScore: score,
            isCountdown: false
        })

        //add users score to highscores list
        const obj = {name: name, score: score}
        highScores.push(obj);
        //sort highScores list by score
        highScores.sort(function(a,b) {return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0);} );
    }

    //resets state for new game
    handleReset() {
        this.setState({
            currentPage: 0,
            usersName: '',
            usersScore: 0,
            qOne: false,
            qTwo: false,
            qThree: false,
            qFour: false,
            qFive: false,
            totalSeconds: 180,
            timeLength: 3,
            timeLeft: '3:00',
            lastUpdate: 0,
            isCountdown: false
        })
    }

    //render child components
    render() {
        return (
            <div id="quiz-box">
                <div class="header">
                    <h1>QUIZ</h1>
                    <p>{this.state.timeLeft}</p>
                </div>
                <audio id="beep" src="https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-18146/zapsplat_transport_car_horn_single_beep_external_toyota_corolla_003_18247.mp3?_=4"></audio>
                    <StartPage page={this.state.currentPage} start={this.handleStart}/>
                    <QuestionOne page={this.state.currentPage} next={this.handleNext} handleChange={this.handleChange}/>
                    <QuestionTwo page={this.state.currentPage} next={this.handleNext} prev={this.handlePrev} handleChange={this.handleChange}/>
                    <QuestionThree page={this.state.currentPage} next={this.handleNext} prev={this.handlePrev} handleChange={this.handleChange}/>
                    <QuestionFour page={this.state.currentPage} next={this.handleNext} prev={this.handlePrev} handleChange={this.handleChange}/>
                    <QuestionFive page={this.state.currentPage} fin={this.handleFinish} prev={this.handlePrev} handleChange={this.handleChange}/>
                    <ScoreScreen page={this.state.currentPage} name={this.state.usersName} score={this.state.usersScore} reset={this.handleReset}/>
            </div>
        )
    }
}

//first page, rules and user registers name
class StartPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.page !== 0) {
            return null;
        }
        return(
            <div className="questions-anim">
                <p>You have 3 minutes to complete a quiz of 5 questions</p>
                <p>Please enter your name and click 'Start' when you are ready to begin.</p>
                <label>Name: <input type="text" id="name" /></label>
                <div className="buttons"><button onClick={this.props.start}>Start</button></div>
            </div>
        );
    }
}

//first question
class QuestionOne extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.page !== 1) {
            return null;
        }
        console.log("on question: ", this.props.page);

        return(
            <div>
                    <fieldset className="questions-anim">
                        <legend className="question">Question 1: {questions.q1.question}</legend>
                        <div className="answers">
                            {questions.q1.options.map(x => <div key={x}><input className="answer" onChange={()=>this.props.handleChange(x, 1)} type="radio" name="q1" id={x} /> <label for={x}>{x}</label></div>)}
                        </div>
                    </fieldset>
                <div className="buttons"><button onClick={()=>this.props.next(this.props.page)}>Next</button></div>
            </div>
        );
    }
}

class QuestionTwo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.page !== 2) {
            return null;
        }
        console.log("on question: ", this.props.page);
        return(
            <div>
                <fieldset className="questions-anim">
                    <legend className="question">Question 2: {questions.q2.question}</legend>
                    <div className="answers">
                        {questions.q2.options.map(x => <div><input className="answer" onChange={()=>this.props.handleChange(x, 2)} type="radio" name="q2" id={x} /> <label for={x}>{x}</label></div>)}
                    </div>
                </fieldset>
                <div className="buttons">
                    <button onClick={()=>this.props.next(this.props.page)}>Next</button>
                    <button onClick={this.props.prev}>Previous</button>
                </div>
            </div>
        );
    }
}

class QuestionThree extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.page !== 3) {
            return null;
        }
        console.log("on question: ", this.props.page);
        return(
            <div>
                <fieldset className="questions-anim">
                    <legend className="question">Question 3: {questions.q3.question}</legend>
                    <div className="answers">
                        {questions.q3.options.map(x => <div><input className="answer" onChange={()=>this.props.handleChange(x, 3)} type="radio" name="q3" id={x} /> <label for={x}>{x}</label></div>)}
                    </div>
                </fieldset>
                <div className="buttons">
                    <button onClick={()=>this.props.next(this.props.page)}>Next</button>
                    <button onClick={this.props.prev}>Previous</button>
                </div>
            </div>
        );
    }
}

class QuestionFour extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.page !== 4) {
            return null;
        }
        console.log("on question: ", this.props.page);
        return(
            <div>
                <fieldset className="questions-anim">
                    <legend className="question">Question 4: {questions.q4.question}</legend>
                    <div className="answers">
                        {questions.q4.options.map(x => <div><input className="answer" onChange={()=>this.props.handleChange(x, 4)} type="radio" name="q4" id={x} /> <label for={x}>{x}</label></div>)}
                    </div>
                </fieldset>
                <div className="buttons">
                    <button onClick={()=>this.props.next(this.props.page)}>Next</button>
                    <button onClick={this.props.prev}>Previous</button>
                </div>
            </div>
        );
    }
}

class QuestionFive extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.page !== 5) {
            return null;
        }
        console.log("on question: ", this.props.page);
        return(
            <div>
                <fieldset className="questions-anim">
                    <legend className="question">Question 5: {questions.q5.question}</legend>
                    <div className="answers">
                        {questions.q5.options.map(x => <div><input className="answer" onChange={()=>this.props.handleChange(x, 5)} type="radio" name="q5" id={x} /> <label for={x}>{x}</label></div>)}
                    </div>
                </fieldset>
                <div className="buttons">
                    <button onClick={this.props.fin}>Finish</button>
                    <button onClick={this.props.prev}>Previous</button>
                </div>
            </div>
        );
    }
}

class ScoreScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.page !== 6) {
            return null;
        }
        return(
            <div>
                <div id="score-screen" className="questions-anim">
                    <div className="user-score">
                        <p className="title">{this.props.name}</p>
                        <p>You finished with a score of: {this.props.score}</p>
                    </div>
                    <div></div>
                    <div className="highscores">
                        <p className="title">High Scores:</p>
                        {highScores.map(x => <p>{x.name}, {x.score}</p>)}
                    </div>
                </div>
                <div><button onClick={this.props.reset}>Reset</button></div>
            </div>
        );
    }
}

ReactDOM.render(
    <Quiz />,
    document.getElementById('app')
);
