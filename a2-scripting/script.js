var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

btn.addEventListener("click", openModal);
span.addEventListener("click", closeModal);

window.addEventListener("click", function(event) {
  if (event.target == modal) {
    closeModal();
  }
});

async function filteringGallery() {
    return new Promise((resolve) => {
      const filterContainer = document.querySelector(".gallery-filter");
      const galleryItems = document.querySelectorAll(".gallery-item");
  
      filterContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("filter-item")) {
          filterContainer.querySelector(".active").classList.remove("active");
          event.target.classList.add("active");
          const filterValue = event.target.getAttribute("data-filter");
  
          galleryItems.forEach((item) => {
            if (item.classList.contains(filterValue) || filterValue === 'all') {
              item.classList.remove("hide");
              item.classList.add("show");
            } else {
              item.classList.remove("show");
              item.classList.add("hide");
            }
          });
  
          resolve();
        }
      });
    });
  }
  
  (async () => {
    await filteringGallery();
  })();
  
  async function addItemWithAjax(event) {
    event.preventDefault();
  
    const formData = {
      name: document.getElementById("name").value,
      year: document.getElementById("year").value,
      poster: document.getElementById("poster").value,
      genre: document.getElementById("genre").value,
      description: document.getElementById("description").value
    };
  
    const url = 'https://webtech.labs.vu.nl/api24/db694639';
  
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });
  
    if (response.ok) {
      console.log('Item added successfully');
      closeModal();
      window.location.href = gh.html;
      await fetchDataAndPopulateGalleryWithAjax(url);
    } else {
      console.error('Error adding item');
      return Promise.reject('Error adding item');
    }
    filteringGallery();
  } 

window.addEventListener('DOMContentLoaded', (event) => {
    let form = document.querySelector("#mediaForm");
    form.addEventListener("submit", addItemWithAjax);
  });

  async function fetchDataAndPopulateGalleryWithAjax(opUrl) {
    try {
      const response = await fetch(opUrl);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();

      
        if (!document.querySelector('.myrow')) {
            document.querySelector('.myrow') = document.createElement('div');
            document.querySelector('.myrow').className = 'myrow';
        document.querySelector('.container').appendChild(document.querySelector('.myrow'));
        }

        
document.querySelector('.myrow').innerHTML = '';
       
  
      if (data.length > 0) {
        data.forEach((author) => {
          var ct = document.querySelector(".gallery-filter");
  
          let filterItem = document.createElement('span');
          filterItem.className = 'filter-item';
          filterItem.setAttribute('data-filter', `${author.year}`);
          filterItem.innerHTML = `${author.year}`;
  
          ct.appendChild(filterItem);
  
          let galleryItem = document.createElement('div');
          galleryItem.className = `gallery-item ${author.year}`;
  
          let galleryItemInner = document.createElement('div');
          galleryItemInner.className = 'gallery-item-inner';
  
          let poster = document.createElement('img');
          poster.src = `${author.poster}`;
  
          let name = document.createElement('div');
          name.innerHTML = `${author.name}`;
  
          let year = document.createElement('div');
          year.innerHTML = `${author.year}`;
  
          let genre = document.createElement('div');
          genre.innerHTML = `${author.genre}`;

          let description = document.createElement('div');
          description.innerHTML = `${author.description}`;

          let id = document.createElement('div');
          description.innerHTML = 'ID: ' +  `${author.id}`;
  
          galleryItemInner.appendChild(poster);
          galleryItemInner.appendChild(name);
          galleryItemInner.appendChild(year);
          galleryItemInner.appendChild(genre);
          galleryItemInner.appendChild(description);
          galleryItemInner.appendChild(id);
  
          galleryItem.appendChild(galleryItemInner);
          var galleryContainer = document.querySelector(".myrow");
          galleryContainer.appendChild(galleryItem);
        });
      } else {
        console.log('No authors found in the response.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return Promise.reject(error); 
    }
    filteringGallery();
  }
  
function resetDatabase() {
  const resetUrl = 'https://webtech.labs.vu.nl/api24/db694639/reset';

  fetch(resetUrl, {
    method: 'GET',
  })
    .then(response => {
      if (response.ok) {
        console.log('Data reset successfully');

        return fetchDataAndPopulateGallery('https://webtech.labs.vu.nl/api24/db694639');
      } else {
        console.error('Error resetting data:', response.status, response.statusText);
        throw new Error('Error resetting data');
      }
    })
    .then(() => {
        filteringGallery();
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

document.getElementById("resetBtn").addEventListener("click", resetDatabase);

      
document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndPopulateGalleryWithAjax('https://webtech.labs.vu.nl/api24/db694639');
});             


var updateModal = document.getElementById('myupModal');
function openupModal() {
    updateModal.style.display = 'block';
}

function closeupModal() {
    updateModal.style.display = 'none';
}

document.getElementById("myupBtn").addEventListener("click", openupModal);
document.getElementsByClassName("close")[1].addEventListener("click", closeupModal);
window.addEventListener("click", function (event) {
    if (event.target == updateModal) {
        closeupModal();
    }
});


async function updateItemWithAjax(ID) {
    const upurl = `https://webtech.labs.vu.nl/api24/db694639/item/${ID}`;
    const url = 'https://webtech.labs.vu.nl/api24/db694639';
    const upformData = {
      id: document.getElementById("idup").value,  
      name: document.getElementById("upname").value,
      year: document.getElementById("upyear").value,
      poster: document.getElementById("upposter").value,
      genre: document.getElementById("upgenre").value,
      description: document.getElementById("updescription").value
    };
  
    const upresponse = await fetch(upurl, {
      method: 'PUT',
      body: JSON.stringify(upformData),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });
  
    if (upresponse.ok) {
      console.log('Item updated successfully');
      await fetchDataAndPopulateGalleryWithAjax(url);
    } else {
      console.error('Error updating item');
      return Promise.reject('Error updating item');
    }
    filteringGallery();
  } 
  
  window.addEventListener('DOMContentLoaded', () => {
    let form = document.querySelector("#mediaupForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault(); 
      updateItemWithAjax(document.getElementById("idup").value);
    });
  });

  /* resources/taken from: https://www.w3schools.com/howto/howto_css_modals.asp */
