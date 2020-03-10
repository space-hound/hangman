(() => {
    let USER;
    const rndInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    const getRandomWord = () => {
        return __words__[rndInt(0, __words__.length)].toUpperCase();
    }
    const createHiddenWord = word => {
        return word.split("").map(l => {
            if (l !== word[0] && l !== word[word.length - 1]) {
                return "_"
            }
            return l;
        }).join("");
    }
    const getUserData = () => {
        const word = getRandomWord();
        USER = {
            TRIES: 10,
            LETTER_USED: [],
            OG_WORD: word,
            HD_WORD: createHiddenWord(word)
        }
    }
    const printWord = () => {
        document.querySelector("#game .word h1").innerHTML = USER.HD_WORD;
    }
    const printTries = () => {
        document.querySelector("#game .tries h2 span").innerHTML = USER.TRIES;
    }
    const getOccurences = l => {
        return [...USER.OG_WORD].reduce((a, e, i) => {
            if (e === l) {
                return [...a, i];
            }
            return [...a];
        }, [])
    }
    const resolveLetterPicked = l => {
        const occurences = getOccurences(l);
        if (occurences.length) {
            USER.HD_WORD = [...USER.HD_WORD].map((e, i) => {
                if (occurences.includes(i)) {
                    return l;
                }
                return e;
            }).join("");
        } else {
            USER.TRIES--;
        }
        USER.LETTER_USED.push(l);
    }
    const LETTERS = "qwertyuiopasdfghjklzxcvbnm".toUpperCase();
    const letterTemplate = l => {
        return `
            <div class="letter" data-value="${l}">
                <h3>${l}</h3>
            </div> 
        `;
    }
    const insertLetters = () => {
        const letterContainer = document.querySelector("#game .letters");
        letterContainer.innerHTML = "";
        LETTERS.split("").forEach(l => {
            letterContainer.insertAdjacentHTML("beforeend", letterTemplate(l));
        });
    }
    const disableLetter = l => {
        l.classList.add("used");
    }
    const isGameDone = () => {
        return USER.TRIES === 0 || !USER.HD_WORD.includes("_");
    }
    const handleLetterClicked = (l) => {
        resolveLetterPicked(l.dataset["value"]);
        disableLetter(l);
        printTries();
        printWord();

        if (isGameDone()) {
            endGame();
        }
    }
    const attachLettersHandler = () => {
        document.querySelector("#game .letters").addEventListener("click", (e) => {
            const target = e.target.closest(".letter");
            if (target) {
                handleLetterClicked(target);
            }
        });
    }
    const startGame = () => {
        insertLetters();
        getUserData();
        printTries();
        printWord();
        document.querySelector("#menu").classList.remove("pause");
    }
    const endGame = () => {
        document.querySelector("#menu").classList.add("pause");
    }
    const attachMenuHandlers = () => {
        document.querySelector("#menu button").addEventListener("click", startGame);
    }
    const buildGame = () => {
        endGame();
        attachLettersHandler();
        attachMenuHandlers();
    };
    document.addEventListener("DOMContentLoaded", buildGame);
})();