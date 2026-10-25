/* =====================================================
   HOSTEL MESS PRODUCER-CONSUMER SIMULATOR
   JAVASCRIPT
===================================================== */


/* =====================================================
   1. BUFFER CONFIGURATION
===================================================== */

const BUFFER_SIZE = 5;


/* Shared buffer */

let buffer = [];


/* Token numbers */

let nextToken = 1;


/* Number of students served */

let studentsServed = 0;


/* Total tokens created */

let totalTokensCreated = 0;


/* Auto simulation timer */

let autoSimulation = null;


/* Mutex status */

let mutexLocked = false;


/* =====================================================
   2. GET HTML ELEMENTS
===================================================== */

const bufferElement = document.getElementById("buffer");

const emptyCountElement =
    document.getElementById("emptyCount");

const fullCountElement =
    document.getElementById("fullCount");

const mutexStatusElement =
    document.getElementById("mutexStatus");

const servedCountElement =
    document.getElementById("servedCount");

const generateButton =
    document.getElementById("generateBtn");

const serveButton =
    document.getElementById("serveBtn");

const autoButton =
    document.getElementById("autoBtn");

const resetButton =
    document.getElementById("resetBtn");

const statusMessage =
    document.getElementById("statusMessage");

const logElement =
    document.getElementById("log");


/* =====================================================
   3. DISPLAY BUFFER
===================================================== */

function displayBuffer() {

    /*
        Clear old buffer display
    */

    bufferElement.innerHTML = "";


    /*
        Create 5 buffer slots
    */

    for (let i = 0; i < BUFFER_SIZE; i++) {

        const slot = document.createElement("div");

        slot.classList.add("buffer-slot");


        /*
            If token exists in this position,
            display the token.
        */

        if (i < buffer.length) {

            slot.classList.add("filled");

            slot.textContent =
                "T" + buffer[i];

        }

        else {

            slot.textContent = "Empty";

        }


        bufferElement.appendChild(slot);
    }


    /*
        Update statistics
    */

    emptyCountElement.textContent =
        BUFFER_SIZE - buffer.length;

    fullCountElement.textContent =
        buffer.length;

    servedCountElement.textContent =
        studentsServed;


    /*
        Disable buttons when necessary
    */

    if (buffer.length >= BUFFER_SIZE) {

        generateButton.disabled = true;

    }

    else {

        generateButton.disabled = false;

    }


    if (buffer.length === 0) {

        serveButton.disabled = true;

    }

    else {

        serveButton.disabled = false;

    }
}


/* =====================================================
   4. ACTIVITY LOG
===================================================== */

function addLog(message) {

    const logMessage =
        document.createElement("p");

    logMessage.textContent =
        message;

    logElement.appendChild(logMessage);


    /*
        Automatically scroll to latest message
    */

    logElement.scrollTop =
        logElement.scrollHeight;
}


/* =====================================================
   5. UPDATE STATUS
===================================================== */

function updateStatus(message) {

    statusMessage.textContent =
        message;
}


/* =====================================================
   6. MUTEX LOCK
===================================================== */

function lockMutex() {

    mutexLocked = true;

    mutexStatusElement.textContent =
        "Locked";
}


/* =====================================================
   7. MUTEX UNLOCK
===================================================== */

function unlockMutex() {

    mutexLocked = false;

    mutexStatusElement.textContent =
        "Unlocked";
}


/* =====================================================
   8. PRODUCER
===================================================== */

function produceToken() {


    /*
        Check whether buffer is full
    */

    if (buffer.length >= BUFFER_SIZE) {

        updateStatus(
            "Buffer is FULL. Producer must wait."
        );

        addLog(
            "[Producer] WAIT - Buffer is full."
        );

        return;
    }


    /*
        Producer waits for empty slot
    */

    addLog(
        "[Producer] sem_wait(empty)"
    );


    /*
        Lock shared buffer
    */

    lockMutex();

    addLog(
        "[Producer] Mutex LOCKED"
    );


    /*
        Create new token
    */

    const token =
        nextToken;


    nextToken++;

    totalTokensCreated++;


    /*
        Add token to shared buffer
    */

    buffer.push(token);


    addLog(
        "[Producer] Token T" +
        token +
        " added to buffer."
    );


    /*
        Unlock shared buffer
    */

    unlockMutex();

    addLog(
        "[Producer] Mutex UNLOCKED"
    );


    /*
        Signal full semaphore
    */

    addLog(
        "[Producer] sem_post(full)"
    );


    /*
        Update message
    */

    updateStatus(
        "Token T" +
        token +
        " generated and added to the queue."
    );


    /*
        Refresh display
    */

    displayBuffer();
}


/* =====================================================
   9. CONSUMER
===================================================== */

function consumeToken() {


    /*
        Check whether buffer is empty
    */

    if (buffer.length === 0) {

        updateStatus(
            "Buffer is EMPTY. Consumer must wait."
        );

        addLog(
            "[Consumer] WAIT - Buffer is empty."
        );

        return;
    }


    /*
        Consumer waits for full slot
    */

    addLog(
        "[Consumer] sem_wait(full)"
    );


    /*
        Lock shared buffer
    */

    lockMutex();

    addLog(
        "[Consumer] Mutex LOCKED"
    );


    /*
        Remove first token
        FIFO - First In First Out
    */

    const token =
        buffer.shift();


    /*
        Student is served
    */

    studentsServed++;


    addLog(
        "[Consumer] Token T" +
        token +
        " removed from buffer."
    );


    addLog(
        "[Consumer] Student served using T" +
        token +
        "."
    );


    /*
        Unlock shared buffer
    */

    unlockMutex();

    addLog(
        "[Consumer] Mutex UNLOCKED"
    );


    /*
        Signal empty semaphore
    */

    addLog(
        "[Consumer] sem_post(empty)"
    );


    /*
        Update status
    */

    updateStatus(
        "Token T" +
        token +
        " consumed. Student served."
    );


    /*
        Refresh display
    */

    displayBuffer();
}


/* =====================================================
   10. AUTOMATIC SIMULATION
===================================================== */

function toggleAutoSimulation() {


    /*
        If simulation is already running,
        stop it.
    */

    if (autoSimulation !== null) {

        clearInterval(autoSimulation);

        autoSimulation = null;

        autoButton.textContent =
            "Start Auto Simulation";

        updateStatus(
            "Automatic simulation stopped."
        );

        addLog(
            "[System] Automatic simulation stopped."
        );

        return;
    }


    /*
        Start automatic simulation
    */

    autoButton.textContent =
        "Stop Auto Simulation";


    updateStatus(
        "Automatic simulation is running..."
    );


    addLog(
        "[System] Automatic simulation started."
    );


    autoSimulation =
        setInterval(function () {


            /*
                Randomly choose producer
                or consumer.
            */

            const action =
                Math.random();


            if (action < 0.55) {

                produceToken();

            }

            else {

                consumeToken();

            }


        }, 1200);
}


/* =====================================================
   11. RESET SIMULATION
===================================================== */

function resetSimulation() {


    /*
        Stop automatic simulation
    */

    if (autoSimulation !== null) {

        clearInterval(autoSimulation);

        autoSimulation = null;
    }


    /*
        Reset all values
    */

    buffer = [];

    nextToken = 1;

    studentsServed = 0;

    totalTokensCreated = 0;

    mutexLocked = false;


    /*
        Reset button
    */

    autoButton.textContent =
        "Start Auto Simulation";


    /*
        Reset mutex
    */

    mutexStatusElement.textContent =
        "Unlocked";


    /*
        Clear activity log
    */

    logElement.innerHTML = "";


    addLog(
        "[System] Simulator reset."
    );


    updateStatus(
        "System ready. Generate a token to begin."
    );


    /*
        Refresh display
    */

    displayBuffer();
}


/* =====================================================
   12. BUTTON EVENTS
===================================================== */

generateButton.addEventListener(
    "click",
    produceToken
);


serveButton.addEventListener(
    "click",
    consumeToken
);


autoButton.addEventListener(
    "click",
    toggleAutoSimulation
);


resetButton.addEventListener(
    "click",
    resetSimulation
);


/* =====================================================
   13. INITIALIZE SIMULATOR
===================================================== */

displayBuffer();

addLog(
    "[System] Producer-Consumer simulator initialized."
);

addLog(
    "[System] Buffer capacity = 5."
);

addLog(
    "[System] Waiting for producer..."
);