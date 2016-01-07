// Generated by CoffeeScript 1.10.0
(function() {
  var file, location, refresh, state;

  location = '#canvas';

  file = '';

  state = {
    showChords: true,
    showLyrics: true,
    showRepeats: false,
    showAlts: true,
    showSections: true,
    smartMode: true,
    requestedKey: null
  };

  refresh = function() {
    file = parser.parseString($('#input').val());
    console.log(file);
    draw(location, file, state);
    return $('.alts a').click(function() {
      var id;
      id = $(this).parent().attr('data-id-from');
      return $("span[data-id-to='" + id + "']").html($(this).html());
    });
  };

  $(function() {
    $('#input').val(window.example);
    refresh();
    $('#input').keyup(refresh);
    $('#transposeUp').click(function() {
      state.requestedKey = createNote($('#currentKey').html()).sharp().clean().name;
      return refresh();
    });
    $('#transposeDown').click(function() {
      state.requestedKey = createNote($('#currentKey').html()).flat().clean().name;
      return refresh();
    });
    $('#transposeReset').click(function() {
      state.requestedKey = null;
      $('#transposeModal').modal('hide');
      return refresh();
    });
    $('#transposeToolbar button').click(function() {
      var clickedChord;
      clickedChord = $(this).attr('data-transposeChord');
      state.requestedKey = clickedChord;
      $('#transposeModal').modal('hide');
      return refresh();
    });
    $("[name='toggle-chords']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.showChords = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-lyrics']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.showLyrics = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-muted']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.smartMode = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-section']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.showSections = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-alts']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.showAlts = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-edit']").on('switchChange.bootstrapSwitch', function(event, bool) {
      if (bool) {
        $('#input').parent().show();
      } else {
        $('#input').parent().hide();
      }
      if (bool) {
        $('#output').addClass('col-sm-6');
      } else {
        $('#output').removeClass('col-sm-6');
      }
      return refresh();
    });
    return $("input.bs").bootstrapSwitch();
  });

}).call(this);
