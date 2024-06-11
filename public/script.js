document.addEventListener("DOMContentLoaded", function () {
  var audio = document.getElementById("background-music");
  audio.volume = 0.009; // Ajusta el volumen
});

$(document).ready(function () {
  $("form:first").submit(async (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      $(form).addClass("was-validated");
      return;
    }

    let usuario = $("form:first input:first").val();
    let URL = $("form:first input:last").val();
    let descripcion = $("form:first textarea").val();
    const { data } = await axios.post("/post", {
      usuario,
      URL,
      descripcion,
    });
    $("#creado").removeClass("d-none");
    getPosts();

    // Limpiar los campos del formulario
    $("form:first input, form:first textarea").val("");
    $(form).removeClass("was-validated");
  });

  $("textarea.form-control").on("input", function () {
    if ($(this).val().length > 30) {
      $(this).val($(this).val().substr(0, 30));
      alert("Máximo 30 caracteres permitidos");
    }
  });
});

async function getPosts() {
  const { data } = await axios.get("/posts");
  $(".posts").html("");
  $.each(data, (i, u) => {
    $(".posts").append(`
        <div class="card col-lg-3 col-md-4 col-sm-6 d-inline mx-0 px-0" data-id="${
          u.id
        }"> 
          <div class="card-body p-0">
            <img class="card-img-top img-fluid" src="${
              u.url
            }" style="width: 100%; height: 150px; object-fit: cover;"> 
            <div class="p-3">
                <h2 class="card-title">${u.usuario}</h2>
                <hr>
                <p class="card-text">${u.descripcion}</p>
                <svg id="heart-${u.id}" class="heart-icon" style="width: ${
      u.likes ? "70px" : "50px"
    }; height: ${
      u.likes ? "40px" : "50px"
    };" viewBox="0 0 24 24" onclick="like(${u.id})">
                    <path fill="${u.likes ? "red" : "currentColor"}" d="${
      u.likes
        ? "M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
        : "M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z"
    }"/>
                </svg>
                <h5 class="d-inline likes-count"> ${u.likes || 0} </h5>
            </div>
          </div>
        </div>
      `);
  });
}

getPosts();

async function like(id) {
  const { data } = await axios.put(`/post?id=${id}`);
  const postCard = $(`.card[data-id=${id}]`);
  const heartIcon = postCard.find(".heart-icon");
  const likesCount = postCard.find(".likes-count");

  if (data.likes) {
    heartIcon.attr("style", "width:70px; height:40px;");
    heartIcon.find("path").attr("fill", "red");
    heartIcon
      .find("path")
      .attr(
        "d",
        "M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
      );
  } else {
    heartIcon.attr("style", "width:50px; height:50px;");
    heartIcon.find("path").attr("fill", "currentColor");
    heartIcon
      .find("path")
      .attr(
        "d",
        "M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z"
      );
  }

  likesCount.text(` ${data.likes || 0} `);
}
