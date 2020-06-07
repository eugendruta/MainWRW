$(document).ready(function () {
  dialogname = "webrw";
  UTIL.logger(dialogname + ": ready(): Start; startdialog: " + globalconfig.startdialog);

  if (window.WebSocket) {
    UTIL.logger("window.WebSocket: supported");
  } else {
    UTIL.logger("window.WebSocket: nicht supported");
  }

  // Backend: WebRWinMvn:  Glassfish: localhost:8080
  var bckendurl = globalconfig.bckendurl; // "bckendurl": "localhost:8080/WebRWinMvn/",
  UTIL.logger("bckendurl: " + bckendurl);
  var feserver = globalconfig.feserver;

  // localStorage available ??
  if (typeof Storage !== "undefined") {
  } else {
    // Too bad, no localStorage for us
    alert("localStorage nicht verfügbar !!");
  }
  // localStorage.clear()

  // Alle Einträge im Status closed löschen
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    if (value === "closed") {
      localStorage.removeItem(key);
    }
  }

  // Start Navigator im localStorage eintragen
  localStorage.setItem("starttime", Date().toString());
  UTIL.logger(
    dialogname + ": ready(): starttime: " + Date().toString() + " gesetzt"
  );

  // Window close Event
  $(window).on("beforeunload", function (e) {
    e.preventDefault();

    // Startzeit löschen
    localStorage.removeItem("starttime");

    // Noch vorhanden Dialogeinträge  closen
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      if (value === "focus" || value === "folge") {
        localStorage.setItem(key, "closed");
        UTIL.logger(
          dialogname + ":  beforeunload(): key: " + key + "; auf closed gesetzt"
        );
      }
    }

    return "Wollen Sie tatsächlich den Dialog schließen?";
  });

  // Eventlistener: Eintrag in localstorage
  function onStorageEvent(storageEvent) {
		/* StorageEvent {
         key; name of the property set, changed etc.; oldValue; old value of property before change
         newValue; new value of property after change;  url; url of page that made the change
         storageArea; localStorage or sessionStorage,
         }     
         */
    var key = storageEvent.key;
    var newvalue = storageEvent.newValue;
    var oldvalue = storageEvent.oldValue;
    var url = storageEvent.url;
    var eintrag = localStorage.getItem(key);
    UTIL.logger(
      dialogname +
      ": onStorageEvent(): eintrag für key: " +
      key +
      "; oldvalue: " +
      oldvalue +
      "; newvalue: " +
      newvalue +
      "; eintrag: " +
      eintrag
    );

    // eintrag für key: bsueb; oldvalue: *; newvalue: closed; eintrag: closed
    // eintrag für key: bsueb; oldvalue: closed; newvalue: null; eintrag: null
    if (newvalue === "closed") {
      // localStorage Eintrag wurde im Dialog auf closed gesetzt
      localStorage.removeItem(key);
      UTIL.logger(
        dialogname + ": onStorageEvent(): Dialog: " + key + " gelöscht"
      );
    } else if (newvalue === "folge") {
      // Folgedialog starten
      aktdialog = key;
      UTIL.logger(dialogname + ": onStorageEvent(): folgedialog: " + key);
      var left = 100 + Math.floor(Math.random() * 100 + 1) * 5;
      var top = 100 + Math.floor(Math.random() * 100 + 1) * 5;
      // var winProps = 'height=300,width=400,resizable=no,'
      //  + 'status=no,toolbar=no,location=no,menubar=no,' + 'titlebar=no,scrollbars=no,' + 'left=' + left + ',top=' + top
      var _width = localStorage.getItem(aktdialog + ".width");
      _width = _width - _width / 120;
      var _height = localStorage.getItem(aktdialog + ".height");
      _height = _height - _height / 120;
      UTIL.logger(
        dialogname +
        ": onStorageEvent(): aktdialog: " +
        aktdialog +
        ";_width: " +
        _width +
        "; _height: " +
        _height
      );
      if (_width && _height) {
        var winProps =
          "height=" +
          _height +
          ",width=" +
          _width +
          "left=" +
          left +
          ",top=" +
          top;
      } else {
        var winProps = "height=500,width=600,left=" + left + ",top=" + top;
      }

      // var newWin = window.open("../" + aktdialog + "/" + aktdialog + ".html", "_blank")
      // "feserver": "localhost:8090"
      var newWin = window.open(
        "http://" +
        feserver +
        "/webrwinbsuebweb/" +
        aktdialog +
        "/" +
        aktdialog +
        ".html",
        "_blank"
      );

      if (!newWin) {
        alert(
          "Start Dialog" +
          aktdialog +
          " nicht möglich; Bitte POp-Up Blocker deaktivieren."
        );
      } else {
        UTIL.logger(
          dialogname +
          ": onStorageEvent(): dialog: " +
          newWin.name +
          " gestartet"
        );

        localStorage.setItem(aktdialog, "focus");
        UTIL.logger(
          dialogname +
          ": onStorageEvent(): localStorage: aktdialog: " +
          aktdialog +
          " auf focus gesetzt"
        );
      }
    }
  }
  window.addEventListener("storage", onStorageEvent, false);

  // CR in Kennwortfeld: login()
  $("#kennwort").keypress(function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode === 13) {
      UTIL.logger(dialogname + ": kennwort.keypress: keycode: " + keycode);
      login();
    }
  });

  function devicedaten() {
    var ipadresse = localStorage.getItem("ipadresse");
    var pcname = localStorage.getItem("pcname");
    UTIL.logger(
      dialogname +
      ": devicedaten(): ipadresse: " +
      ipadresse +
      "; pcname: " +
      pcname
    );
    if (ipadresse === null) {
      // IP-Adresse und PC-name noch nicht in localstorage eingetragen
      UTIL.showMessage("Bitte IP-Adresse und PC-Name eingeben", "info");
      // Eingabefelder und Button aktivieren
      // Button show; eingabefelder enablen
      $("#ipadresse").prop("disabled", false);
      $("#pcname").prop("disabled", false);
      $("#devspeichernbtn").show();
    } else {
      // Daten vorhanden; anzeigen
      $("#ipadresse").val(ipadresse);
      $("#pcname").val(pcname);
      // Button hide; eingabefelder disable
      $("#ipadresse").prop("disabled", true);
      $("#pcname").prop("disabled", true);
      $("#devspeichernbtn").hide();
    }
  }
  devicedaten();

  // Function: hole Browsertyp (Edge, Chrome, Firefox,   )
  getbrowser = function getBrowser() {
    var _browser = "unbekannt";
    // UTIL.logger(dialogname + ': userAgent + navigator.userAgent)
    if (navigator.userAgent.search("MSIE") >= 0) {
      _browser = "MSIE";
      UTIL.logger(dialogname + ": userAgent: " + _browser);
    } else if (navigator.userAgent.search("Chrome") >= 0) {
      // Enthält auch Edge
      if (navigator.userAgent.search("Edge") >= 0) {
        _browser = "Edge";
        UTIL.logger(dialogname + ": userAgent: " + _browser);
      } else {
        _browser = "Chrome";
        UTIL.logger(dialogname + ": userAgent: " + _browser);
      }
    } else if (navigator.userAgent.search("Firefox") >= 0) {
      _browser = "Firefox";
      UTIL.logger(dialogname + ": userAgent: " + _browser);
    } else if (
      navigator.userAgent.search("Safari") >= 0 &&
      navigator.userAgent.search("Chrome") < 0
    ) {
      _browser = "Safari";
      UTIL.logger(dialogname + ": userAgent: " + _browser);
    } else if (navigator.userAgent.search("Opera") >= 0) {
      _browser = "Opera";
      UTIL.logger(dialogname + ": userAgent: " + _browser);
    } else if (navigator.userAgent.search("NET") >= 0) {
      _browser = "NET";
      UTIL.logger(dialogname + ": userAgent: " + _browser);
    } else if (navigator.userAgent.search("Edge") >= 0) {
      _browser = "Edge";
      UTIL.logger(dialogname + ": userAgent: " + _browser);
    } else {
      _browser = "unbekannt";
      UTIL.logger(dialogname + ": userAgent: " + _browser);
    }

    return _browser;
  };

  browser = getbrowser();
  localStorage.setItem("browser", browser);

  // Menue
  var data = [
    {
      label: "Administration",
      children: [
        { label: "ADUEB: Administration-Übersicht" },
        { label: "AUUEB: Auftragsübersicht" }
      ]
    },
    {
      label: "Stammdaten",
      children: [
        {
          label: "WA 1",
          children: [
            { label: "WAUE1: WA1-Übersicht" },
            { label: "POUEB: Positions-Übersicht" }
          ]
        },
        { label: "WA 2" }
      ]
    },
    {
      label: "Lagerverwaltung",
      children: [
        {
          label: "WA 1",
          children: [
            { label: "WAUE1: WA1-Übersicht" },
            { label: "POUEB: Positions-Übersicht" }
          ]
        },
        { label: "WA 2" }
      ]
    },
    {
      label: "Geräteverwaltung",
      children: [
        {
          label: "WA 1",
          children: [
            { label: "WAUE1: WA1-Übersicht" },
            { label: "POUEB: Positions-Übersicht" }
          ]
        },
        { label: "WA 2" }
      ]
    },
    {
      label: "Bestandsverwaltung",
      children: [
        { label: "BSUEB: Bestands-Übersicht" },
        { label: "AVUEB: Auftragsübersicht" },
        { label: "AVDET: Auftragsdetail" },
        { label: "BPROT: Bestandsprotokoll" }
      ]
    },
    {
      label: "Wareneingang",
      children: [
        {
          label: "WA 1",
          children: [
            { label: "WAUE1: WA1-Übersicht" },
            { label: "POUEB: Positions-Übersicht" }
          ]
        },
        { label: "WA 2" }
      ]
    },
    {
      label: "Auftragsabwicklung",
      children: [
        {
          label: "WA 1",
          children: [
            { label: "WAUE1: WA1-Übersicht" },
            { label: "POUEB: Positions-Übersicht" }
          ]
        },
        { label: "WA 2" }
      ]
    },
    {
      label: "Transportverwaltung",
      children: [
        {
          label: "WA 1",
          children: [
            { label: "WAUE1: WA1-Übersicht" },
            { label: "POUEB: Positions-Übersicht" }
          ]
        },
        { label: "WA 2" }
      ]
    },
    {
      label: "Kommissionierung",
      children: [
        {
          label: "WA 1",
          children: [
            { label: "WAUE1: WA1-Übersicht" },
            { label: "POUEB: Positions-Übersicht" }
          ]
        },
        { label: "WA 2" }
      ]
    },
    {
      label: "Warenausgang",
      children: [
        {
          label: "WA 1",
          children: [
            { label: "WAUE1: WA1-Übersicht" },
            { label: "POUEB: Positions-Übersicht" }
          ]
        },
        { label: "WA 2" }
      ]
    },
    {
      label: "Leitstand",
      children: [
        {
          label: "WA 1",
          children: [
            { label: "WAUE1: WA1-Übersicht" },
            { label: "POUEB: Positions-Übersicht" }
          ]
        },
        { label: "WA 2" }
      ]
    }
  ];

  // Navigator
  navinit();

  // Navigator click event
  $("#navigator").bind("tree.click", function (event) {
    naviclick(event);
  });

  // Start: Navigator und Liste aktiver Dialoge nicht anzeigen
  $("#navigatortbl").hide();

  // Login
  login = function login() {
    var benutzer = $("#benutzer").val();
    var kennwort = $("#kennwort").val();
		/*
            if (UTIL.isEmpty(kennwort)) {
              UTIL.showMessage('Bitte Kennwort eingeben', 'error')
              return
            }     
            */
    var url = bckendurl + "login";
    UTIL.logger(
      dialogname +
      ": login(): benutzer: " +
      benutzer +
      "; kennwort:" +
      kennwort +
      "; url: " +
      url
    );

    // Using the core $.ajax() method
    var _data = { benutzer: benutzer, kennwort: kennwort };
    $.ajax({
      url: url,
      data: _data,
      type: "POST",
      dataType: "json"
    })
      .done(function (json) {
        UTIL.logger(dialogname + ": login(): Ajax Request OK");
        $("<h1>")
          .text(json.title)
          .appendTo("body");
        $('<div class="content">')
          .html(json.html)
          .appendTo("body");

        $("#navigatortbl").show();
        $("#login").hide();

        // Default Startdialog starten
        var defdialog = globalconfig.startdialog;
        if (defdialog !== "") {
          var eingetragen = localStorage.getItem(defdialog);
          UTIL.logger(
            dialogname +
            ": login(): defaultstart: dialog: " +
            defdialog +
            " localStorage eintrag: " +
            eingetragen
          );
          if (!eingetragen) {
            var left = 100 + Math.floor(Math.random() * 100 + 1) * 5;
            var top = 100 + Math.floor(Math.random() * 100 + 1) * 5;
            var _width = localStorage.getItem(defdialog + ".width");
            _width = _width - _width / 120;
            var _height = localStorage.getItem(defdialog + ".height");
            _height = _height - _height / 120;
            UTIL.logger(
              dialogname +
              ": login(): defaultstart: " +
              defdialog +
              ";_width: " +
              _width +
              "; _height: " +
              _height
            );
            if (_width && _height) {
              var winProps =
                "height=" +
                _height +
                ",width=" +
                _width +
                "left=" +
                left +
                ",top=" +
                top;
            } else {
              var winProps =
                "height=500,width=600,left=" + left + ",top=" + top;
            }

            localStorage.setItem(defdialog, "focus");
            UTIL.logger(
              dialogname +
              ": login(): defaultstart:  defdialog: " +
              defdialog +
              " auf focus gesetzt"
            );

            var _firstupper = defdialog.substring(0, 1).toUpperCase();
            // var newWin = window.open("http://" + feserver + "/" + dianame + "/" + aktdialog + "/" + aktdialog + ".html", "_blank")
            var url =
              "http://" +
              feserver +
              "/" +
              _firstupper +
              defdialog.substring(1) +
              "WRW/" +
              defdialog +
              "/" +
              defdialog +
              ".html";
            UTIL.logger("url: " + url);
            var newWin = window.open(url, "_blank");
            UTIL.logger(
              dialogname +
              ": login(): defaultstart: " +
              newWin.name +
              " gestartet"
            );
          }
        }
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
      })
      .always(function (xhr, status) {
        // Request complete
      });
  };

  // Devicedaten speichern
  device = function device() {
    var ipadresse = $("#ipadresse").val();
    var pcname = $("#pcname").val();
    UTIL.logger(
      dialogname + ": device(): ipadresse: " + ipadresse + "; pcname:" + pcname
    );
    localStorage.setItem("ipadresse", ipadresse);
    localStorage.setItem("pcname", pcname);
    // Button hide; eingabefelder disable
    $("#ipadresse").prop("disabled", true);
    $("#pcname").prop("disabled", true);
    $("#devspeichernbtn").hide();
  };
}); // end ready
