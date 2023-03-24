function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
}
function loadClient() {
    gapi.client.setApiKey("AIzaSyD2PF5Xa0DhP9J_L6-ZmcDNKUCq7ha0JVk");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

function generateVideoElem(title, thumbnail, author, videoID) {
    const link = document.createElement("a");
    link.href = `./watch/?v=${videoID}`;
    link.classList.add("result");

    const img = document.createElement("img");
    img.src = thumbnail.url;


    const spanGroup = document.createElement("div");
    spanGroup.classList.add("span-group");

    const titleSpan = document.createElement("span");
    titleSpan.textContent = title

    const authorSpan = document.createElement("span");
    authorSpan.textContent = `By ${author}`;

    spanGroup.append(titleSpan, authorSpan);


    link.append(img, spanGroup);
    document.querySelector(".results").append(link);
}

function generateChannelElem(title, thumbnail, channelID) {
    const link = document.createElement("a");
    link.href = `./channel/#${channelID}`;
    link.classList.add("result");

    const img = document.createElement("img");
    img.src = thumbnail.url;


    const spanGroup = document.createElement("div");
    spanGroup.classList.add("span-group");

    const titleSpan = document.createElement("span");
    titleSpan.textContent = title

    spanGroup.append(titleSpan);


    link.append(img, spanGroup);
    document.querySelector(".results").append(link);
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function search(text) {
    document.querySelector(".results").innerHTML = "";

    return gapi.client.youtube.search.list({
        "q": text,
        "type": [
            "video",
            "channel"
        ],
        "maxResults": 50,
        "relevanceLanguage": "en",
        //"videoEmbeddable": "true"
    }).then(res => {
        [...res.result.items].forEach(IDwrapper => {
            if (IDwrapper.id.kind == "youtube#video") {
                let vID = IDwrapper.id.videoId
                gapi.client.youtube.videos.list({
                    "part": [
                        "snippet"
                    ],
                    "id": [
                        vID
                    ],
                    "maxResults": 1
                }).then(videoWrapper => {
                    let video = videoWrapper.result.items[0].snippet;
                    console.log(video);
                    generateVideoElem(video.title, video.thumbnails.default, video.channelTitle, vID);
                });
            } else if (IDwrapper.id.kind == "youtube#channel") {
                let cID = IDwrapper.id.channelId
                gapi.client.youtube.channels.list({
                    "part": [
                        "snippet"
                    ],
                    "id": [
                        cID
                    ],
                    "maxResults": 1
                }).then(channelWrapper => {
                    let channel = channelWrapper.result.items[0].snippet;
                    console.log(channel);
                    generateChannelElem(channel.title, channel.thumbnails.default, cID);
                });
            }
        });
    }, err => {
        console.error("Execute error", err);
    });
}

document.querySelector(".search-form").addEventListener("submit", async e => {
    e.preventDefault();
    if (gapi.client.youtube == null) {
        await authenticate().then(loadClient);
    }
    search(document.querySelector(".search-in").value);
});

gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "519167129143-bbqhf5tepo1ig6inlm8v6i5af7ruk44f.apps.googleusercontent.com"});
    authenticate().then(loadClient);
});