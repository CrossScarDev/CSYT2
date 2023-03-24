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
    link.href = `../watch/?v=${videoID}`;
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
function execute() {
    gapi.client.youtube.search.list({
        "channelId": window.location.hash.replace("#", ""),
        "type": [
            "video"
        ],
        "maxResults": 50
    }).then(res => {
        [...res.result.items].forEach(wrapper => {
            let vID = wrapper.id.videoId;
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
                generateVideoElem(video.title, video.thumbnails.default, video.channelTitle, vID);
            })
        });
    });
}

gapi.load("client:auth2", async function() {
    gapi.auth2.init({client_id: "519167129143-bbqhf5tepo1ig6inlm8v6i5af7ruk44f.apps.googleusercontent.com"});
    await authenticate().then(loadClient);
    execute();
});