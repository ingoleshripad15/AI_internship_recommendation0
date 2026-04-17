const openMenu = document.getElementById('openMenu');
const sideDrawer = document.getElementById('sideDrawer');
const overlay = document.getElementById('overlay');

// Open the menu when clicking the icon
openMenu.addEventListener('click', () => {
    sideDrawer.classList.add('active');
    overlay.classList.add('active');
});

// Close the menu when clicking the overlay (outside the menu)
overlay.addEventListener('click', () => {
    sideDrawer.classList.remove('active');
    overlay.classList.remove('active');
});


document.getElementById("internshipForm").addEventListener("submit", async function(e){

    e.preventDefault()

    const formData = new FormData(this)

    const data = {
        domain: formData.get("domain"),
        skills: formData.get("skills"),
        education: formData.get("education")
    }

    const response = await fetch("/recommend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const internships = await response.json()

    showResults(internships)

})

function showResults(internships){

    let resultDiv = document.getElementById("results")

    resultDiv.innerHTML = ""

    internships.forEach(i => {

        resultDiv.innerHTML += `
        <div class="card">
            <h3>${i.title}</h3>
            <p><b>Organization:</b> ${i.organization}</p>
            <p><b>Domain:</b> ${i.domain}</p>
            <p><b>Location:</b> ${i.location}</p>
            <p><b>Duration:</b> ${i.duration} weeks</p>
        </div>
        `
    })
    

}