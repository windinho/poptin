$(function () {
  var top = 113;
  var count = 1;
  var playground = JSON.parse(localStorage.getItem("playground"));
  if (!playground) {
    localStorage.setItem("playground", JSON.stringify($("#playground").html()));
  }

  var popupBg = localStorage.getItem("popup-bg-color");
  var buttonBg = localStorage.getItem("button-bg-color");
  var buttonColor = localStorage.getItem("button-text-color");

  if (popupBg) $(".popup-bg-color").val(popupBg);
  else localStorage.setItem("popup-bg-color", $(".popup-bg-color").val());

  if (buttonBg) $(".button-bg-color").val(buttonBg);
  else localStorage.setItem("button-bg-color", $(".button-bg-color").val());

  if (buttonColor) $(".button-text-color").val(buttonColor);
  else localStorage.setItem("button-text-color", $(".button-text-color").val());

  if (playground) $("#playground").html(playground);

  popupBg = localStorage.getItem("popup-bg-color");
  buttonBg = localStorage.getItem("button-bg-color");
  buttonColor = localStorage.getItem("button-text-color");

  $("#playground .popup-bg").css("background-color", popupBg);
  $("#playground .btn").css("background-color", buttonBg);
  $("#playground .btn").css("color", buttonColor);

  function addDraggableItem(type) {
    if (top + count * 20 >= 373) count = 1;
    var newItem;
    if (type === "input") {
      newItem = $(
        `<div class="draggable-item text-center" style="top: ${
          top + count * 20
        }px;left: 37px;"><b class="text-white pointer-events-none">Sample text</b></div>`
      );
    } else if (type === "button") {
      newItem = $(
        `<div class="draggable-item" style="top: ${
          top + count * 20
        }px;left: 37px;"><button class="btn pointer-events-none text-white bg-[${buttonBg}]" hover:bg-[none]>Button</button></div>`
      );
    }
    $(".popup-bg").append(newItem);
    makeDraggable(newItem);
    newItem.effect("bounce");
    count++;
  }

  makeDraggable($("main .draggable-item"));

  $("#addTextInput").click(function () {
    addDraggableItem("input");
  });

  $("#addButton").click(function () {
    addDraggableItem("button");
  });

  $("#save").click(function () {
    localStorage.setItem("playground", JSON.stringify($("#playground").html()));
    $(".toast").removeClass("opacity-0").fadeIn(300).delay(1500).fadeOut(300);
  });

  $("#my_modal_7").change(function () {
    if (!$(this).is(":checked")) {
      setTimeout(() => {
        $(".modal-content").removeClass("modal-slide-in");
      }, 500);
    }
  });

  $(".modal-toggle").click(function () {
    var content = JSON.parse(localStorage.getItem("playground"));
    $(".modal-content").html(content).addClass("modal-slide-in");
    $(".modal-content [contenteditable]").attr("contenteditable", "false");
    $(".modal-content .pointer-events-none").removeClass("pointer-events-none");
    $(document).keyup(function (e) {
      if (e.keyCode == 27) {
        $("#my_modal_7").prop("checked", false);
      }
    });
  });

  $(".popup-bg-color").change(function () {
    $("#playground .popup-bg").css("background-color", $(this).val());
    localStorage.setItem("popup-bg-color", $(this).val());
  });

  $(".button-bg-color").change(function () {
    $("#playground .btn").css("background-color", $(this).val());
    localStorage.setItem("button-bg-color", $(this).val());
  });

  $(".button-text-color").change(function () {
    $("#playground .btn").css("color", $(this).val());
    localStorage.setItem("button-text-color", $(this).val());
  });

  $(".popup-bg").click(function (e) {
    if (e.target !== this) {
      return;
    }
    $("main .draggable-item")
      .children()
      .addClass("pointer-events-none")
      .attr("contenteditable", false);
    makeDraggable($("main .draggable-item"));
  });

  $("#uploadButton").on("click", function () {
    $("#fileInput").click();
  });

  $("#fileInput").on("change", function () {
    var file = this.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var item = $(
          `<div class="draggable-item text-center" style="top: ${
            top + count * 20
          }px;left: 20px;"><img class="max-w-32 max-h-32" src="#" alt="Selected Image" /></div>`
        );
        $(item).children().attr("src", e.target.result);
        $(".popup-bg").append(item);
        makeDraggable(item);
      };
      reader.readAsDataURL(file);
    }
  });

  setTimeout(() => {
    $(".loader").remove();
    $("main").removeClass("opacity-0");
  }, 1000);
});

function makeDraggable(that) {
  //   that.addClass("max-sm:m-[-100px]@ max-sm:scale-75");
  that.draggable({
    drag: function (event, ui) {
      $(".lava").removeClass("opacity-0 -z-10");
    },
  });

  $(that).dblclick(function () {
    $(this).draggable("destroy");
    $(this).children().removeClass("pointer-events-none");
    $(this).children().attr("contenteditable", true).focus();
  });

  $(".popup-bg").droppable({
    greedy: true,
    drop: function (event, ui) {
      $(".lava").addClass("opacity-0 -z-10");
    },
  });

  $("main").droppable({
    drop: function (event, ui) {
      $(ui.draggable[0]).toggle("explode").remove();
      setTimeout(() => {
        $(".lava").addClass("opacity-0 -z-10");
      }, 500);
    },
    over: function () {
      $(".lava").addClass("bg-[#b023234d]");
    },
    out: function () {
      $(".lava").removeClass("bg-[#b023234d]");
    },
  });
}
