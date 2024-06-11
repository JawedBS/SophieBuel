const btnAll = document.querySelector(".btnAll")
const btnObject = document.querySelector(".btnObject")
const btnAppartement = document.querySelector(".btnAppartement")
const btnHotel = document.querySelector(".btnHotel")
const imagemodal = document.querySelector(".imagemodal")
const gallery = document.querySelector(".gallery");
const edition = document.getElementById("edition")
const token = localStorage.getItem("token")
const modify = document.getElementById("modify")
const login = document.querySelector(".login")
const logout = document.querySelector(".logout")
const modal = document.getElementById("modal1")
const modalclick = document.querySelector(".modal-click")
const modalexit = document.querySelector(".modal-exit")
const modalexitAll = document.querySelector(".modal-exitAll")
const modalreturn = document.querySelector(".modal-return")
const modalButton = document.querySelector(".modal-button")
const modalButton2 = document.querySelector("#modal2 .modal-button")
const modalSecond = document.getElementById("modal2")
const fileInput = document.getElementById('fileInput');
const reader = new FileReader();
const addPicture = document.querySelector('.add-picture');
const deleteIcone = document.querySelector('.icone-delete')

async function getProjects() {
    return fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then(works => {
            let worksData = works
            return works
        })
}
async function initProjects() {
    const projects = await getProjects();
    console.log(projects)
    genererWorks(projects);
    galleryFilter(projects)
    genererModal(projects)
 }
 initProjects()

 //gestion du filtre

 if (token) {
    btnAll.classList.add("hidden")
    btnObject.classList.add("hidden")
    btnAppartement.classList.add("hidden")
    btnHotel.classList.add("hidden")
}
function galleryFilter(projects) {
    btnAll.addEventListener("click", (event) => {
        event.preventDefault
        gallery.innerHTML= ""
        genererWorks(projects)
    })
    function filterProject(event, categoryId) { 
        event.preventDefault
        gallery.innerHTML= ""
        const project = Array.from(projects);
        const filterProject = project.filter(function (project) {
            return project.categoryId == categoryId;
        })
        for (let i = 0; i < filterProject.length; i++) {
            const workElement = document.createElement("figure");
            const imageElement = document.createElement("img");
            const caption = document.createElement("figcaption");
            imageElement.src = filterProject[i].imageUrl;
            caption.innerText = filterProject[i].title;
            gallery.appendChild(workElement);
            workElement.appendChild(imageElement);
            workElement.appendChild(caption);
        }
        
       }
    btnObject.addEventListener("click", (event) => {filterProject(event, 1)})
    btnAppartement.addEventListener("click", (event) => {filterProject(event, 2)})
    btnHotel.addEventListener("click", (event) => {filterProject(event, 3)})
    
}

 // gestion modal
 
 function genererModal(projects) {
    for (let i = 0; i < projects.length; i++) {
        const workElement = document.createElement("div");
        const imageElement = document.createElement("img");
        const iconeDelete = document.createElement("i");
        imageElement.src = projects[i].imageUrl;
        iconeDelete.setAttribute("id", projects[i].id)
        workElement.appendChild(imageElement);
        workElement.appendChild(iconeDelete);
        imagemodal.appendChild(workElement);
        iconeDelete.addEventListener('click', (event) => {
            event.preventDefault()
            const apiUrl = 'http://localhost:5678/api/works/'
            const fileIdToDelete = event.currentTarget.id

            fetch(`${apiUrl}/${fileIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization' : 'Bearer ' + token,
                },
              })
              .then((response) => {
                if (response.ok) {
                    imagemodal.innerHTML= ""
                    gallery.innerHTML=""
                    initProjects()
                } 
            })
        })
    }
    const divsDansImagemodal = document.getElementsByClassName("imagemodal")[0].getElementsByTagName("div");
    for (let i = 0; i < divsDansImagemodal.length; i++) {
    divsDansImagemodal[i].classList.add("imageGroup");
}
const icones = document.querySelectorAll(".imageGroup > i");
icones.forEach(icone => {
    icone.classList.add("icone-delete", "fa-solid", "fa-trash-can");
    })

}

fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    
    reader.onload = async function(e) {
      const imagePreview = new Image();
      imagePreview.src = e.target.result;
      imagePreview.onload = function() {
        addPicture.innerHTML = '';
        addPicture.appendChild(imagePreview);
      }
    }
    reader.readAsDataURL(file);
  } else {
    addPicture.innerHTML = 'Aucune image sélectionnée';
  }
});

const category = document.getElementById("category")
const title = document.getElementById("title")
modalButton2.addEventListener('click', function (event) {
    event.preventDefault
    //const englobant les 3 valeurs?
    const categoryValue = Number(category.value)
    const titleValue = title.value
    const file = fileInput.files[0];
    const formData = new FormData()
    formData.append('category', categoryValue);
formData.append('title', titleValue);
formData.append('image', file);
    //readastext?
    fetch('http://localhost:5678/api/works', { 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization' : 'Bearer ' + token
        },
        body: formData      
        
    })
    //permet de vérifier la connexion avec le serveur
    .then((response) => {
        if (response.ok) {
            imagemodal.innerHTML= ""
                    gallery.innerHTML=""
                    initProjects()
                    modal.classList.add("hidden")
                    modalSecond.classList.add("hidden")
            return response.json()
        } //else connexion pas passé
    })
    //permet de savoir si tout est valide
    .then((result) => {
        console.log(result)
    } )
    //code pour vérifier la réponse de l'api?
})    


 // gestion galerie

async function genererWorks(projects) {
    for (let i = 0; i < projects.length; i++) {
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const caption = document.createElement("figcaption");
        imageElement.src = projects[i].imageUrl;
        caption.innerText = projects[i].title;
        gallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(caption);
    }
}

if (token) {
    edition.classList.remove("hidden")
    modify.classList.remove("hidden")
    login.classList.add("hidden")
    logout.classList.remove("hidden")
}
logout.addEventListener("click" , () => {
    localStorage.removeItem("token")
})
modalclick.addEventListener("click" , () => {
    modal.classList.remove("hidden")
})
modalButton.addEventListener("click", () => { 
    modalSecond.classList.remove("hidden")
})
modalexit.addEventListener("click" , () => {
    modal.classList.add("hidden")
})
modalexitAll.addEventListener("click" , () => {
    modal.classList.add("hidden")
    modalSecond.classList.add("hidden")
})
modalreturn.addEventListener("click" , () => {
    modalSecond.classList.add("hidden")
})
