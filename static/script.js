// ============================================================
// NET//LAB — Application Layer Protocol Visualizer
// ============================================================

let currentActivity = "browsing";
let currentSteps = [];
let currentStep = -1;
let timer = null;
let isPaused = false;
let currentProtocolView = "application";
let transportSteps = [];


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

function loadSteps(steps, transport = []) {

    stopTimer();

    currentSteps = steps;
    transportSteps = transport;

    currentStep = -1;
    isPaused = false;

    createTimeline();

    if (currentSteps.length > 0) {
        nextStep();
        startTimer();
    }
}

    stopTimer();

    currentSteps = steps;
    currentStep = -1;
    isPaused = false;

    createTimeline();

    if (currentSteps.length > 0) {
        nextStep();
        startTimer();
    }



// ============================================================
// SHOW CURRENT STEP
// ============================================================

// ============================================================
// SHOW CURRENT STEP
// ============================================================

function showStep(index) {

    const visibleSteps = getCurrentStepList();

    if (!visibleSteps.length) {
        return;
    }

    if (index < 0) {
        index = 0;
    }

    if (index >= visibleSteps.length) {
        index = visibleSteps.length - 1;
    }

    currentStep = index;

    const step = visibleSteps[currentStep];

    const protocol =
        document.getElementById("activeProtocol");

    const counter =
        document.getElementById("stepCounter");

    const messageArea =
        document.getElementById("messageArea");


    if (protocol) {

        if (currentProtocolView === "transport") {
            protocol.textContent =
                step.transportProtocol || "TCP";
        } else {
            protocol.textContent =
                step.protocol;
        }

    }


    if (counter) {

        counter.textContent =
            `STEP ${currentStep + 1} / ${visibleSteps.length}`;

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
            currentProtocolView === "transport"
                ? (step.transportProtocol || "TCP")
                : step.protocol;


        const directionTag =
            document.createElement("span");

        directionTag.className =
            "message-direction";

        directionTag.textContent =
            step.direction;


        top.appendChild(protocolTag);


        if (step.transport) {

            const transportTag =
                document.createElement("span");

            transportTag.className =
                "message-transport";

            transportTag.textContent =
                step.transport;

            top.appendChild(transportTag);
        }


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


    // Only application-layer steps are written
    // into the existing activity log.
    if (currentProtocolView === "application") {

        addLog(
            currentActivity,
            `${step.protocol} — ${step.title}`
        );

        updateActivityStatus(step);

    }
}

// ============================================================
// TRANSPORT STEP SELECTION
// ============================================================

function getVisibleSteps() {

    if (
        currentProtocolView === "transport" &&
        transportSteps.length > 0
    ) {
        return transportSteps;
    }

    return currentSteps;
}


// ============================================================
// TRANSPORT TIMELINE
// ============================================================

function getCurrentStepList() {

    return getVisibleSteps();
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

    const visibleSteps =
        getCurrentStepList();

    timeline.innerHTML = "";


    visibleSteps.forEach((step, index) => {

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


    updateTimeline();
}


function updateTimeline() {

    const items =
        document.querySelectorAll(".timeline-item");

    const visibleSteps =
        getCurrentStepList();


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


    const counter =
        document.getElementById("stepCounter");


    if (counter && visibleSteps.length) {

        counter.textContent =
            `STEP ${currentStep + 1} / ${visibleSteps.length}`;

    }
}


// ============================================================
// AUTOMATIC PLAYBACK
// ============================================================

function startTimer() {

    stopTimer();

    const visibleSteps =
        getCurrentStepList();

    if (!visibleSteps.length) {
        return;
    }


    timer = setInterval(() => {

        if (isPaused) {
            return;
        }


        const activeSteps =
            getCurrentStepList();


        if (
            currentStep <
            activeSteps.length - 1
        ) {

            nextStep();

        } else {

            stopTimer();


            if (
                currentProtocolView ===
                "application"
            ) {

                updateActivityStatus({
                    protocol: "COMPLETE",
                    title: "Trace complete",
                    description:
                        "Protocol sequence completed."
                });

            }

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

    const visibleSteps =
        getCurrentStepList();

    if (!visibleSteps.length) {
        return;
    }


    if (
        currentStep <
        visibleSteps.length - 1
    ) {

        showStep(currentStep + 1);

    } else {

        showStep(
            visibleSteps.length - 1
        );

    }
}


function previousStep() {

    const visibleSteps =
        getCurrentStepList();

    if (!visibleSteps.length) {
        return;
    }


    stopTimer();

    isPaused = true;


    if (currentStep > 0) {

        showStep(
            currentStep - 1
        );

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


    loadSteps(
        steps,
        createBrowsingTransportSteps()
    );
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


    loadSteps(
        steps,
        createMailTransportSteps()
    );
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


    loadSteps(
        steps,
        createStreamingTransportSteps()
    );
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

// ============================================================
// PROTOCOL VIEW SWITCHING
// ============================================================

// ============================================================
// PROTOCOL VIEW SWITCHING
// ============================================================

function switchProtocolView(view) {

    currentProtocolView = view;


    const applicationTab =
        document.getElementById("applicationViewTab");

    const transportTab =
        document.getElementById("transportViewTab");


    if (applicationTab) {

        applicationTab.classList.toggle(
            "active",
            view === "application"
        );

    }


    if (transportTab) {

        transportTab.classList.toggle(
            "active",
            view === "transport"
        );

    }


    if (
        currentSteps.length > 0 &&
        currentStep >= 0
    ) {

        createTimeline();

        showStep(currentStep);

    }
}
// ============================================================
// TCP — BROWSING
// ============================================================

function createBrowsingTransportSteps() {

    return [

        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "SYN",

            description:
                "The client requests a TCP connection and sends its initial sequence number.",

            message:
                `TCP SEGMENT

Seq: 1000
Ack: 0
Win: 64240
Flags: SYN
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "SYN-ACK",

            description:
                "The server acknowledges the client's SYN and sends its own initial sequence number.",

            message:
                `TCP SEGMENT

Seq: 5000
Ack: 1001
Win: 65535
Flags: SYN, ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "ACK",

            description:
                "The client acknowledges the server's SYN and completes the TCP three-way handshake.",

            message:
                `TCP SEGMENT

Seq: 1001
Ack: 5001
Win: 64240
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "HTTP GET Data",

            description:
                "The HTTP request is carried inside the established TCP byte stream.",

            message:
                `TCP SEGMENT

Seq: 1001
Ack: 5001
Win: 64240
Flags: PSH, ACK
Length: 78`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "ACK — HTTP Request",

            description:
                "The server acknowledges receipt of the HTTP request bytes.",

            message:
                `TCP SEGMENT

Seq: 5001
Ack: 1079
Win: 65535
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "HTTP Response Data",

            description:
                "The server sends the HTTP response through the TCP byte stream.",

            message:
                `TCP SEGMENT

Seq: 5001
Ack: 1079
Win: 65535
Flags: PSH, ACK
Length: 1256`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "ACK — HTTP Response",

            description:
                "The client acknowledges the received response bytes.",

            message:
                `TCP SEGMENT

Seq: 1079
Ack: 6257
Win: 64240
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "FIN",

            description:
                "The client begins TCP connection termination.",

            message:
                `TCP SEGMENT

Seq: 1079
Ack: 6257
Win: 64240
Flags: FIN, ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "ACK — FIN",

            description:
                "The server acknowledges the client's FIN.",

            message:
                `TCP SEGMENT

Seq: 6257
Ack: 1080
Win: 65535
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "FIN",

            description:
                "The server closes its sending side of the TCP connection.",

            message:
                `TCP SEGMENT

Seq: 6257
Ack: 1080
Win: 65535
Flags: FIN, ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "Final ACK",

            description:
                "The client acknowledges the server FIN and completes connection teardown.",

            message:
                `TCP SEGMENT

Seq: 1080
Ack: 6258
Win: 64240
Flags: ACK
Length: 0`
        }

    ];
}


// ============================================================
// TCP — MAIL
// ============================================================

function createMailTransportSteps() {

    return [

        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "SYN",

            description:
                "The SMTP client requests a TCP connection to the mail server.",

            message:
                `TCP SEGMENT

Seq: 2000
Ack: 0
Win: 64240
Flags: SYN
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "SYN-ACK",

            description:
                "The mail server acknowledges the connection request.",

            message:
                `TCP SEGMENT

Seq: 6000
Ack: 2001
Win: 65535
Flags: SYN, ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "ACK",

            description:
                "The client completes the TCP three-way handshake.",

            message:
                `TCP SEGMENT

Seq: 2001
Ack: 6001
Win: 64240
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "SMTP Data",

            description:
                "SMTP commands and message content are carried over the established TCP stream.",

            message:
                `TCP SEGMENT

Seq: 2001
Ack: 6001
Win: 64240
Flags: PSH, ACK
Length: 320`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "SMTP Response",

            description:
                "The server acknowledges the received SMTP data.",

            message:
                `TCP SEGMENT

Seq: 6001
Ack: 2321
Win: 65535
Flags: PSH, ACK
Length: 48`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "ACK",

            description:
                "The client acknowledges the SMTP server response.",

            message:
                `TCP SEGMENT

Seq: 2321
Ack: 6049
Win: 64240
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "FIN",

            description:
                "The SMTP client begins closing the TCP connection.",

            message:
                `TCP SEGMENT

Seq: 2321
Ack: 6049
Win: 64240
Flags: FIN, ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "ACK — FIN",

            description:
                "The mail server acknowledges the client's FIN.",

            message:
                `TCP SEGMENT

Seq: 6049
Ack: 2322
Win: 65535
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "MAIL SERVER → CLIENT",

            title:
                "FIN",

            description:
                "The mail server closes its sending side of the TCP connection.",

            message:
                `TCP SEGMENT

Seq: 6049
Ack: 2322
Win: 65535
Flags: FIN, ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 25",

            direction:
                "CLIENT → MAIL SERVER",

            title:
                "Final ACK",

            description:
                "The client acknowledges the server FIN.",

            message:
                `TCP SEGMENT

Seq: 2322
Ack: 6050
Win: 64240
Flags: ACK
Length: 0`
        }

    ];
}


// ============================================================
// TCP — STREAMING
// ============================================================

function createStreamingTransportSteps() {

    return [

        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "SYN",

            description:
                "The streaming client opens a TCP connection to the media server.",

            message:
                `TCP SEGMENT

Seq: 3000
Ack: 0
Win: 64240
Flags: SYN
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "SYN-ACK",

            description:
                "The media server acknowledges the connection request.",

            message:
                `TCP SEGMENT

Seq: 7000
Ack: 3001
Win: 65535
Flags: SYN, ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "ACK",

            description:
                "The client completes the TCP three-way handshake.",

            message:
                `TCP SEGMENT

Seq: 3001
Ack: 7001
Win: 64240
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "Manifest Request",

            description:
                "The HTTP manifest request is carried inside the TCP stream.",

            message:
                `TCP SEGMENT

Seq: 3001
Ack: 7001
Win: 64240
Flags: PSH, ACK
Length: 92`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "Manifest Response",

            description:
                "The server delivers the stream manifest over TCP.",

            message:
                `TCP SEGMENT

Seq: 7001
Ack: 3093
Win: 65535
Flags: PSH, ACK
Length: 420`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "ACK — Manifest",

            description:
                "The client acknowledges the manifest data.",

            message:
                `TCP SEGMENT

Seq: 3093
Ack: 7421
Win: 64240
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "Segment 1 Request",

            description:
                "The client requests the first media segment.",

            message:
                `TCP SEGMENT

Seq: 3093
Ack: 7421
Win: 64240
Flags: PSH, ACK
Length: 86`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "Segment 1 Data",

            description:
                "The server sends the first media segment through TCP.",

            message:
                `TCP SEGMENT

Seq: 7421
Ack: 3179
Win: 65535
Flags: PSH, ACK
Length: 842144`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "ACK — Segment 1",

            description:
                "The client acknowledges the received media segment.",

            message:
                `TCP SEGMENT

Seq: 3179
Ack: 849565
Win: 64240
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "Segment 2 Request",

            description:
                "The client requests the second media segment.",

            message:
                `TCP SEGMENT

Seq: 3179
Ack: 849565
Win: 64240
Flags: PSH, ACK
Length: 86`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "Segment 2 Data",

            description:
                "The server sends the second media segment.",

            message:
                `TCP SEGMENT

Seq: 849565
Ack: 3265
Win: 65535
Flags: PSH, ACK
Length: 851920`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "ACK — Segment 2",

            description:
                "The client acknowledges the second media segment.",

            message:
                `TCP SEGMENT

Seq: 3265
Ack: 1701485
Win: 64240
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "Segment 3 Request",

            description:
                "The client requests the third media segment.",

            message:
                `TCP SEGMENT

Seq: 3265
Ack: 1701485
Win: 64240
Flags: PSH, ACK
Length: 86`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "Segment 3 Data",

            description:
                "The server sends the third media segment.",

            message:
                `TCP SEGMENT

Seq: 1701485
Ack: 3351
Win: 65535
Flags: PSH, ACK
Length: 847516`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "ACK — Segment 3",

            description:
                "The client acknowledges the third media segment.",

            message:
                `TCP SEGMENT

Seq: 3351
Ack: 2549001
Win: 64240
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "FIN",

            description:
                "The client begins closing the TCP connection.",

            message:
                `TCP SEGMENT

Seq: 3351
Ack: 2549001
Win: 64240
Flags: FIN, ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "ACK — FIN",

            description:
                "The server acknowledges the client's FIN.",

            message:
                `TCP SEGMENT

Seq: 2549001
Ack: 3352
Win: 65535
Flags: ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "SERVER → CLIENT",

            title:
                "FIN",

            description:
                "The server closes its sending side of the TCP connection.",

            message:
                `TCP SEGMENT

Seq: 2549001
Ack: 3352
Win: 65535
Flags: FIN, ACK
Length: 0`
        },


        {
            transportProtocol: "TCP",
            transport: "TCP · Port 80",

            direction:
                "CLIENT → SERVER",

            title:
                "Final ACK",

            description:
                "The client acknowledges the server FIN and completes TCP teardown.",

            message:
                `TCP SEGMENT

Seq: 3352
Ack: 2549002
Win: 64240
Flags: ACK
Length: 0`
        }

    ];
}