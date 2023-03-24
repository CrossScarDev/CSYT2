//<iframe width="640" height="360" src="https://www.youtube.com/embed/Q8Z6m8wxLpc" title="Universal Lego Sorter - Update 2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("v")

let frame = document.createElement("iframe")
frame.width = 640
frame.height = 360
frame.src = `https://www.youtube.com/embed/${id}`
frame.style.border = "none"
frame.allowFullscreen = true
frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"

document.body.appendChild(frame)

//Back

document.body.append(document.createElement("br"))

let btn = document.createElement("button")
btn.textContent = "Back"
btn.addEventListener("click", () => {
    window.history.back()
})

document.body.append(btn)