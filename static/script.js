// ============================================================
// NET//LAB — Application Layer Protocol Visualizer
// ============================================================

let currentActivity = "browsing";
let currentSteps = [];
let currentStep = -1;
let timer = null;
let isPaused = false;


// ============================================================
// ACTIVITY SWITCHING
// ============================================================

function selectActivity(activityName) {

    currentActivity = activityName;

    document.querySelectorAll(".activity").forEach(activity => {
        activity.classList.remove("active");
    });

    document.querySelectorAll(".activity-tab").forEach(tab => {
        tab.classList.remove("active");
    });

    const selectedActivity =
        document.getElementById(activityName);

    const selectedTab =
        document.getElementById(activityName + "Tab");

    if (selectedActivity) {
        selectedActivity.classList.add("active");
    }

    if (selectedTab) {
        selectedTab.classList.add("active");
    }

    clearVisualization();
}


// ============================================================
// IDLE NETWORK ANIMATION
// ============================================================

function renderIdleNetwork() {

    const messageArea =
        document.getElementById("messageArea");

    if (!messageArea) {
        return;
    }

    messageArea.innerHTML = `
        <div class="network-idle">

            <div class="idle-header">

                <span>NETWORK MONITOR</span>

                <span class="monitor-status">
                    <i></i>
                    IDLE
                </span>

            </div>


            <div class="idle-network">

                <div class="idle-node">

                    <div class="idle-node-icon">
                        C
                    </div>

                    <span>CLIENT</span>

                </div>


                <div class="idle-link">

                    <span class="idle-packet packet-a"></span>
                    <span class="idle-packet packet-b"></span>

                    <span class="idle-line"></span>

                </div>


                <div class="idle-node">

                    <div class="idle-node-icon dns-node">
                        D
                    </div>

                    <span>DNS</span>

                </div>


                <div class="idle-link">

                    <span class="idle-packet packet-c"></span>
                    <span class="idle-packet packet-d"></span>

                    <span class="idle-line"></span>

                </div>


                <div class="idle-node">

                    <div class="idle-node-icon server-node">
                        S
                    </div>

                    <span>SERVER</span>

                </div>

            </div>


            <div class="idle-information">

                <div class="idle-title">
                    Monitoring network activity
                </div>

                <div class="idle-subtitle">
                    Waiting for an Application Layer exchange
                </div>

                <div class="idle-protocols">

                    <span>DNS</span>
                    <span>HTTP</span>
                    <span>SMTP</span>

                </div>

            </div>

        </div>
    `;
}


// ============================================================
// VISUALIZATION RESET
// ============================================================

function clearVisualization() {

    stopTimer();

    currentSteps = [];
    currentStep = -1;
    isPaused = false;

    const protocol =
        document.getElementById("activeProtocol");

    const counter =
        document.getElementById("stepCounter");

    const timeline =
        document.getElementById("timeline");

    if (protocol) {
        protocol.textContent = "READY";
    }

    if (counter) {
        counter.textContent = "STEP 0 / 0";
    }

    if (timeline) {
        timeline.innerHTML = "";
    }

    // Show the live idle network animation
    renderIdleNetwork();
}


// ============================================================
// LOAD PROTOCOL STEPS
// ============================================================

function loadSteps(steps) {

    stopTimer();

    currentSteps = steps;
    currentStep = -1;
    isPaused = false;

    createTimeline();

    if (currentSteps.length > 0) {
        nextStep();
        startTimer();
    }
}


// ============================================================
// SHOW CURRENT STEP
// ============================================================

function showStep(index) {

    if (!currentSteps.length) {
        return;
    }

    if (index < 0) {
        index = 0;
    }

    if (index >= currentSteps.length) {
        index = currentSteps.length - 1;
    }

    currentStep = index;

    const step =
        currentSteps[currentStep];

    const protocol =
        document.getElementById("activeProtocol");

    const counter =
        document.getElementById("stepCounter");

    const messageArea =
        document.getElementById("messageArea");


    if (protocol) {
        protocol.textContent =
            step.protocol;
    }


    if (counter) {

        counter.textContent =
            `STEP ${currentStep + 1} / ${currentSteps.length}`;

    }


    if (messageArea) {

        messageArea.innerHTML = "";

        const card =
            document.createElement("div");

        card.className =
            "message-inner";


        const top =
            document.createElement("div");

        top.className =
            "message-top";


        const protocolTag =
            document.createElement("span");

        protocolTag.className =
            "message-protocol";

        protocolTag.textContent =
            step.protocol;


        const directionTag =
            document.createElement("span");

        directionTag.className =
            "message-direction";

        directionTag.textContent =
            step.direction;


        top.appendChild(protocolTag);
        top.appendChild(directionTag);


        const title =
            document.createElement("h3");

        title.textContent =
            step.title;


        const description =
            document.createElement("p");

        description.textContent =
            step.description;


        const messageBox =
            document.createElement("pre");

        messageBox.className =
            "protocol-message";

        messageBox.textContent =
            step.message;


        card.appendChild(top);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(messageBox);


        messageArea.appendChild(card);
    }


    updateTimeline();


    // Add event to activity log
    addLog(
        currentActivity,
        `${step.protocol} — ${step.title}`
    );


    updateActivityStatus(step);
}


// ============================================================
// TIMELINE
// ============================================================

function createTimeline() {

    const timeline =
        document.getElementById("timeline");

    if (!timeline) {
        return;
    }

    timeline.innerHTML = "";


    currentSteps.forEach((step, index) => {

        const item =
            document.createElement("div");

        item.className =
            "timeline-item";


        const dot =
            document.createElement("button");

        dot.className =
            "timeline-dot";

        dot.type =
            "button";

        dot.title =
            `Step ${index + 1}: ${step.title}`;


        dot.addEventListener("click", () => {

            stopTimer();

            isPaused = true;

            showStep(index);

        });


        const label =
            document.createElement("span");

        label.className =
            "timeline-label";

        label.textContent =
            `${index + 1}`;


        item.appendChild(dot);
        item.appendChild(label);


        timeline.appendChild(item);

    });
}


function updateTimeline() {

    const items =
        document.querySelectorAll(".timeline-item");


    items.forEach((item, index) => {

        item.classList.remove("active");
        item.classList.remove("completed");


        if (index < currentStep) {
            item.classList.add("completed");
        }


        if (index === currentStep) {
            item.classList.add("active");
        }

    });
}


// ============================================================
// AUTOMATIC PLAYBACK
// ============================================================

function startTimer() {

    stopTimer();

    if (!currentSteps.length) {
        return;
    }


    timer = setInterval(() => {

        if (isPaused) {
            return;
        }


        if (currentStep < currentSteps.length - 1) {

            nextStep();

        } else {

            stopTimer();

            updateActivityStatus({
                protocol: "COMPLETE",
                title: "Trace complete",
                description:
                    "Protocol sequence completed."
            });

        }

    }, 2500);
}


function stopTimer() {

    if (timer !== null) {

        clearInterval(timer);

        timer = null;
    }
}


// ============================================================
// NEXT / PREVIOUS
// ============================================================

function nextStep() {

    if (!currentSteps.length) {
        return;
    }


    if (currentStep < currentSteps.length - 1) {

        showStep(currentStep + 1);

    } else {

        showStep(currentSteps.length - 1);

    }
}


function previousStep() {

    if (!currentSteps.length) {
        return;
    }


    stopTimer();

    isPaused = true;


    if (currentStep > 0) {

        showStep(currentStep - 1);

    } else {

        showStep(0);

    }
}


// ============================================================
// PAUSE / RESUME
// ============================================================

function pauseVisualization() {

    if (!currentSteps.length) {
        return;
    }


    isPaused = !isPaused;


    const statusText =
        isPaused
            ? "Visualization paused."
            : "Visualization running.";


    updateStatusForCurrentActivity(
        statusText
    );


    // Secondary activity button
    document.querySelectorAll(
        ".secondary-button, .secondary-action"
    ).forEach(button => {

        button.innerHTML =
            isPaused
                ? `<span>▶</span> RESUME`
                : `<span>Ⅱ</span> PAUSE`;

    });


    // Visualization control buttons
    document.querySelectorAll(
        ".visual-controls button, .visualization-controls .control-button"
    ).forEach(button => {

        const text =
            button.textContent.trim().toUpperCase();


        if (
            text.includes("PAUSE") ||
            text.includes("RESUME")
        ) {

            button.innerHTML =
                isPaused
                    ? `<span>▶</span> RESUME`
                    : `<span>Ⅱ</span> PAUSE`;

        }

    });
}


// ============================================================
// REPLAY
// ============================================================

function replay() {

    if (!currentSteps.length) {
        return;
    }


    stopTimer();

    currentStep = -1;
    isPaused = false;


    updateTimeline();

    nextStep();

    startTimer();


    updateStatusForCurrentActivity(
        "Replaying protocol sequence..."
    );
}


// ============================================================
// BROWSING
// ============================================================

function startBrowsing() {

    const urlInput =
        document.getElementById("url");


    const url =
        urlInput
            ? urlInput.value.trim()
            : "https://example.com";


    if (!url) {

        setActivityStatus(
            "browsing",
            "Please enter a target URL."
        );

        return;
    }


    const hostname =
        extractHostname(url);


    setActivityStatus(
        "browsing",
        `Resolving ${hostname}...`
    );


    clearLog("browsing");


    const steps = [

        {
            protocol: "DNS",

            direction:
                "CLIENT → DNS",

            title:
                "DNS Query",

            description:
                "The client asks DNS to resolve the hostname into an IP address.",

            message:
                `DNS QUERY
Name: ${hostname}
Type: A
Class: IN`
        },


        {
            protocol: "DNS",

            direction:
                "DNS → CLIENT",

            title:
                "DNS Response",

            description:
                "The DNS server returns an IP address for the requested hostname.",

            message:
                `DNS RESPONSE
Name: ${hostname}
Type: A
Answer: 93.184.216.34
TTL: 3600`
        },


        {
            protocol: "HTTP",

            direction:
                "CLIENT → SERVER",

            title:
                "HTTP GET Request",

            description:
                "The client sends an HTTP GET request for the requested resource.",

            message:
                `GET / HTTP/1.1
Host: ${hostname}
Accept: text/html
Connection: keep-alive`
        },


        {
            protocol: "HTTP",

            direction:
                "SERVER → CLIENT",

            title:
                "HTTP 200 Response",

            description:
                "The web server returns the requested resource successfully.",

            message:
                `HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1256
Connection: keep-alive`
        }

    ];


    loadSteps(steps);
}


// ============================================================
// MAIL / SMTP
// ============================================================

function startMail() {

    const toElement =
        document.getElementById("mailTo");

    const subjectElement =
        document.getElementById("mailSubject");

    const bodyElement =
        document.getElementById("mailBody");


    const to =
        toElement
            ? toElement.value.trim()
            : "";


    const subject =
        subjectElement
            ? subjectElement.value.trim()
            : "";


    const body =
        bodyElement
            ? bodyElement.value.trim()
            : "";


    if (!to) {

        setActivityStatus(
            "mail",
            "Please enter a recipient."
        );

        return;
    }


    const safeSubject =
        subject || "Computer Networks Test";


    const safeBody =
        body || "Hello from NET//LAB.";


    setActivityStatus(
        "mail",
        "Starting SMTP session..."
    );


    clearLog("mail");


    const steps = [

        {
            protocol: "SMTP",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "EHLO",

            description:
                "The SMTP client introduces itself and requests the server capabilities.",

            message:
                `EHLO netlab.local`
        },


        {
            protocol: "SMTP",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "250 OK",

            description:
                "The mail server accepts the EHLO command and reports success.",

            message:
                `250-mail.example.com
250-SIZE 52428800
250-STARTTLS
250 AUTH LOGIN`
        },


        {
            protocol: "SMTP",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "MAIL FROM",

            description:
                "The client specifies the sender of the email message.",

            message:
                `MAIL FROM:<student@netlab.local>`
        },


        {
            protocol: "SMTP",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "250 Sender OK",

            description:
                "The server accepts the sender address.",

            message:
                `250 2.1.0 Sender OK`
        },


        {
            protocol: "SMTP",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "RCPT TO",

            description:
                "The client specifies the recipient address.",

            message:
                `RCPT TO:<${to}>`
        },


        {
            protocol: "SMTP",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "250 Recipient OK",

            description:
                "The server accepts the recipient address.",

            message:
                `250 2.1.5 Recipient OK`
        },


        {
            protocol: "SMTP",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "DATA",

            description:
                "The client tells the SMTP server that the email content follows.",

            message:
                `DATA`
        },


        {
            protocol: "SMTP",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "354 Start Mail Input",

            description:
                "The server is ready to receive the message contents.",

            message:
                `354 End data with <CR><LF>.<CR><LF>`
        },


        {
            protocol: "SMTP",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "Message Data",

            description:
                "The client sends the email headers and message body.",

            message:
                `From: student@netlab.local
To: ${to}
Subject: ${safeSubject}

${safeBody}
.`
        },


        {
            protocol: "SMTP",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "250 Message Accepted",

            description:
                "The SMTP server accepts the email for delivery.",

            message:
                `250 2.0.0 Message accepted for delivery`
        },


        {
            protocol: "SMTP",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "QUIT",

            description:
                "The client requests termination of the SMTP session.",

            message:
                `QUIT`
        },


        {
            protocol: "SMTP",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "221 Service Closing",

            description:
                "The server closes the SMTP connection.",

            message:
                `221 2.0.0 Service closing transmission channel`
        }

    ];


    loadSteps(steps);
}


// ============================================================
// STREAMING
// ============================================================

function startStreaming() {

    const qualityElement =
        document.getElementById("quality");


    const quality =
        qualityElement
            ? qualityElement.value
            : "720p";


    setActivityStatus(
        "streaming",
        `Preparing ${quality} stream...`
    );


    clearLog("streaming");


    const steps = [

        {
            protocol: "DNS",

            direction:
                "CLIENT → DNS",

            title:
                "DNS Query",

            description:
                "The client resolves the streaming server hostname.",

            message:
                `DNS QUERY
Name: video.example.com
Type: A
Class: IN`
        },


        {
            protocol: "DNS",

            direction:
                "DNS → CLIENT",

            title:
                "DNS Response",

            description:
                "DNS returns the streaming server IP address.",

            message:
                `DNS RESPONSE
Name: video.example.com
Answer: 203.0.113.20
TTL: 300`
        },


        {
            protocol: "HTTP",

            direction:
                "CLIENT → SERVER",

            title:
                "Manifest Request",

            description:
                "The client requests the stream manifest or playlist.",

            message:
                `GET /media/${quality}/playlist.m3u8 HTTP/1.1
Host: video.example.com
Accept: application/vnd.apple.mpegurl`
        },


        {
            protocol: "HTTP",

            direction:
                "SERVER → CLIENT",

            title:
                "Manifest Response",

            description:
                "The server returns metadata describing available media segments.",

            message:
                `HTTP/1.1 200 OK
Content-Type: application/vnd.apple.mpegurl

#EXTM3U
#EXT-X-TARGETDURATION:4
segment001.ts
segment002.ts
segment003.ts`
        },


        {
            protocol: "HTTP",

            direction:
                "CLIENT → SERVER",

            title:
                "Segment 1 Request",

            description:
                "The client requests the first media segment.",

            message:
                `GET /media/${quality}/segment001.ts HTTP/1.1
Host: video.example.com`
        },


        {
            protocol: "HTTP",

            direction:
                "SERVER → CLIENT",

            title:
                "Segment 1 Response",

            description:
                "The server sends the first media segment.",

            message:
                `HTTP/1.1 200 OK
Content-Type: video/mp2t
Content-Length: 842144`
        },


        {
            protocol: "HTTP",

            direction:
                "CLIENT → SERVER",

            title:
                "Segment 2 Request",

            description:
                "The client requests the next media segment.",

            message:
                `GET /media/${quality}/segment002.ts HTTP/1.1
Host: video.example.com`
        },


        {
            protocol: "HTTP",

            direction:
                "SERVER → CLIENT",

            title:
                "Segment 2 Response",

            description:
                "The server sends the second media segment.",

            message:
                `HTTP/1.1 200 OK
Content-Type: video/mp2t
Content-Length: 851920`
        },


        {
            protocol: "HTTP",

            direction:
                "CLIENT → SERVER",

            title:
                "Segment 3 Request",

            description:
                "The client requests another media segment to continue playback.",

            message:
                `GET /media/${quality}/segment003.ts HTTP/1.1
Host: video.example.com`
        },


        {
            protocol: "HTTP",

            direction:
                "SERVER → CLIENT",

            title:
                "Segment 3 Response",

            description:
                "The server delivers the third media segment.",

            message:
                `HTTP/1.1 200 OK
Content-Type: video/mp2t
Content-Length: 847516`
        }

    ];


    loadSteps(steps);
}


// ============================================================
// STATUS HANDLING
// ============================================================

function setActivityStatus(activity, message) {

    const statusMap = {

        browsing: "browseStatus",
        mail: "mailStatus",
        streaming: "streamStatus"

    };


    const elementId =
        statusMap[activity];


    if (!elementId) {
        return;
    }


    const element =
        document.getElementById(elementId);


    if (element) {

        element.textContent =
            message;

    }
}


function updateActivityStatus(step) {

    let message =
        `${step.protocol}: ${step.title}`;


    if (
        currentStep ===
        currentSteps.length - 1
    ) {

        message +=
            " — sequence complete.";

    }


    setActivityStatus(
        currentActivity,
        message
    );
}


function updateStatusForCurrentActivity(message) {

    setActivityStatus(
        currentActivity,
        message
    );
}


// ============================================================
// EVENT LOG
// ============================================================

function clearLog(activity) {

    const logMap = {

        browsing: "browseLog",
        mail: "mailLog",
        streaming: "streamLog"

    };


    const log =
        document.getElementById(
            logMap[activity]
        );


    if (!log) {
        return;
    }


    log.innerHTML = "";
}


function addLog(activity, message) {

    const logMap = {

        browsing: "browseLog",
        mail: "mailLog",
        streaming: "streamLog"

    };


    const log =
        document.getElementById(
            logMap[activity]
        );


    if (!log) {
        return;
    }


    const empty =
        log.querySelector(".log-empty");


    if (empty) {
        empty.remove();
    }


    const entry =
        document.createElement("div");

    entry.className =
        "log-entry";


    const time =
        document.createElement("span");

    time.className =
        "log-time";


    time.textContent =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    const text =
        document.createElement("span");

    text.className =
        "log-text";

    text.textContent =
        message;


    entry.appendChild(time);
    entry.appendChild(text);


    log.appendChild(entry);


    // Keep newest event visible
    log.scrollTop =
        log.scrollHeight;
}


// ============================================================
// HELPERS
// ============================================================

function extractHostname(url) {

    try {

        let normalized =
            url;


        if (
            !normalized.startsWith("http://") &&
            !normalized.startsWith("https://")
        ) {

            normalized =
                "https://" + normalized;

        }


        return new URL(normalized).hostname;

    } catch (error) {

        return "example.com";

    }
}


// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        selectActivity("browsing");

    }
);

document.addEventListener("DOMContentLoaded", function () {
  renderIdleNetwork();
});