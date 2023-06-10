
// Ejercicio sobre GraphQL y localización

// Obtenemos la ubicacion actual del usuario:
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("Coordenadas de ubicación del usuario:");
      console.log("Latitud: " + latitude);
      console.log("Longitud: " + longitude);

      // Aquí puedes utilizar las coordenadas para mostrar la ubicación en un mapa u otras operaciones.
      // Obtener las estaciones más cercanas a la ubicación del usuario
      getClosestStation(latitude, longitude);
    },
    function (error) {
      console.error("Error al obtener la ubicación:", error);
    }
  );
} else {
  console.error("Geolocalización no soportada por el navegador");
}

//Ejercicio sobre async/await APIs y temporización

async function getClosestStation(latitude, longitude) {
  const myquery = `query closestStations {
    closestMetroStation: metroStation(
      findBy: { closest: { latitude: ${latitude}, longitude: ${longitude} } }
    ) {
      ... on MetroStation {
        name
        coordinates {
          longitude
          latitude
        }
        lines
      }
    }
    closestBikeStation: bikeStation(
      findBy: { closest: { latitude: ${latitude}, longitude: ${longitude} } }
    ) {
      ... on BikeStation {
        name
        coordinates {
          longitude
          latitude
        }
        status
      }
    }
    closestBusStation: busStop(
      findBy: { closest: { latitude: ${latitude}, longitude: ${longitude} } }
    ) {
      ... on BusStop {
        name
        location {
          address
          coordinates {
            longitude
            latitude
          }
        }
      }
    }
  }`;
  const url = "https://healthy-fox-82.deno.dev/graphql";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ query: myquery })
  });
  const data = await response.json();
  console.log(data);



  // Display the result of the query
  const closestMetroStation = data.data.closestMetroStation;
  const closestBikeStation = data.data.closestBikeStation;
  const closestBusStation = data.data.closestBusStation;

  const locationUserSection = document.getElementById("userLocation");

  const resultContainer = document.createElement("div");
  resultContainer.className = "col-12 col-lg-4 pt-2 border border-primary rounded bg-light";

  const templateUserLocation = `
    <div class="row">
      <p> <i class="fa-solid fa-train me-2"></i> <strong>Metro</strong>: ${closestMetroStation.name}, ${closestMetroStation.lines[0]} </p>
    </div>
    <div class="row">
      <p> 
        <i class="fa-solid fa-bicycle me-2"></i> 
        <strong>Bike</strong>: ${closestBikeStation.name} 
        <span style="color: ${closestBikeStation.status === "IN_SERVICE" ? "green" : "red"}; font-size: 24px;">
          &#x25cf;
        </span> 
      </p>
    </div>
    <div class="row">
      <p> <i class="fa-solid fa-bus me-2"></i> <strong>Bus</strong>: ${closestBusStation.name} </p>
    </div>
`;

  resultContainer.innerHTML += templateUserLocation;
  locationUserSection.appendChild(resultContainer);
}


document.addEventListener("keydown", function (event) {
  // Obtener el valor de la tecla presionada
  var tecla = event.key;
  var teclasSecciones = {};
  var allSections = document.querySelectorAll("section"); //almacenamos en una variable todos los elementos HTML <section>

  if (allSections.length > 9) {
    console.error("No se pueden asignar más de 9 secciones");
  } else {
    let index = 1;
    for (const section of allSections) {
      const sectionId = section.getAttribute("id");
      teclasSecciones[index] = sectionId;
      index++;
    }
  }

  var primeraVez = false;

  if (!event.target.closest("form")) {
    // Determinar a qué sección se debe desplazar la página
    if (tecla === "h" || tecla === "H" && !primeraVez) {
      showModal();
      primeraVez = true;
    } else if (tecla === "p" || tecla === "P") {
      previousSection();
    } else if (tecla === "n" || tecla === "N") {
      nextSection();
    } else if (tecla === "Escape") {
      closeModal();
      primeraVez = false;
    }
    else {
      var seccion = teclasSecciones[tecla];
      if (seccion) {
        window.location = "#" + seccion;
      } else {
        console.log(tecla);
      }
    }
  }
});


var myModal = new bootstrap.Modal(document.getElementById('myModal'))

let closeModal = function () {
  myModal.hide();
  clearTimeout();
}

let showModal = function () {
  myModal.show();
  setTimeout(() => {closeModal()}, 10000);
}

let nextSection = function () {
  var sections = document.querySelectorAll("section"); // Assuming sections have a common selector

  let currentIndex = 0;
  for (const section of sections) {
    const sectionId = section.getAttribute("id");
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
  
    const windowHeight = window.innerHeight; // Height of the window viewport
    const windowCenter = window.scrollY + (windowHeight / 2); // Vertical center of the window
  
    if (windowCenter >= sectionTop && windowCenter < sectionTop + sectionHeight) {
      if (currentIndex < sections.length - 1) {
        window.location = "#" + sections[currentIndex + 1].getAttribute("id");
      } else {
        window.location = "#" + sections[0].getAttribute("id");
      }
      break;
    }
    currentIndex++;
  }
  
  
}

let previousSection = function () {
  var sections = document.querySelectorAll("section"); // Assuming sections have a common selector

  // Find the current section based on scroll position
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    var sectionId = section.getAttribute("id");
    var sectionTop = section.offsetTop;
    var sectionHeight = section.offsetHeight;

    var windowHeight = window.innerHeight; // Height of the window viewport
    var windowCenter = window.scrollY + (windowHeight / 2); // Vertical center of the window

    if (windowCenter >= sectionTop && windowCenter < sectionTop + sectionHeight) {
      if (i > 0) {
        window.location = "#" + sections[i - 1].getAttribute("id");
      }
      if (i === 0) {
        window.location = "#" + sections[sections.length - 1].getAttribute("id");
      }
      break;
    }
  }
}
