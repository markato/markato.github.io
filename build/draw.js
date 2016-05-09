var _, byline, determineKey, generateHTML, generateToken, lastDefinedChord, lastInferredChord, printKeysToDOM, s11, title, transpose,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

transpose = require('./transpose');

_ = require('underscore');

s11 = require('sharp11');

module.exports = function(location, song, state) {
  state.originalKey = determineKey(song);
  state.drawKey = state.requestedKey || state.originalKey;
  state.alts = song.alts;
  printKeysToDOM(state);
  $(location).html(generateHTML(song, state));
  return null;
};

printKeysToDOM = function(state) {
  $('#currentKey').html(state.drawKey);
  $('#originalKey').html(state.originalKey);
  $("#transposeToolbar button").removeClass('btn-info');
  $("[data-transposeChord='" + state.drawKey + "']").addClass('btn-info');
  return null;
};

generateHTML = function(song, state) {
  var cstring, i, j, k, len, len1, len2, line, ref, ref1, section, token;
  cstring = '';
  cstring += "<button type='button' class='btn " + (state.isEditing ? 'btn-success' : 'btn-info btn-md') + "' id='edit'> <span class='glyphicon " + (state.isEditing ? 'glyphicon-check' : 'glyphicon-edit') + "' aria-hidden='true'></span> " + (state.isEditing ? 'Save' : 'Edit') + " </button>";
  cstring += "<h2>" + (title(song)) + " <small>in " + state.drawKey + "</small></h2>";
  cstring += "<h4>" + (byline(song)) + "</h4>";
  ref = song.lyrics;
  for (i = 0, len = ref.length; i < len; i++) {
    section = ref[i];
    if (state.showSections) {
      cstring += "<div class='section-header'>" + section.section + "</div>";
      cstring += "<hr/>";
    }
    cstring += "<div class='section'>";
    ref1 = section.lines;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      line = ref1[j];
      for (k = 0, len2 = line.length; k < len2; k++) {
        token = line[k];
        cstring += generateToken(token, state);
      }
      cstring += "<br/>";
    }
    cstring += "</div><br/>";
  }
  return cstring;
};

generateToken = function(token, state) {
  var chord, chord_classes, phrase_classes, result, string;
  token.hasAlts = state.alts[token.chord] != null;
  chord = token.chord;
  if (state.replacements[chord] != null) {
    chord = state.alts[chord][state.replacements[chord]];
  }
  chord = chord.replace(/'/g, '');
  string = token.string.trim();
  phrase_classes = ['phrase'];
  if (token.wordExtension) {
    phrase_classes.push('join');
  }
  chord_classes = ['chord'];
  if (state.smartMode && !token.exception) {
    chord_classes.push('mute');
  }
  if (token.hasAlts && token.exception && state.showAlts) {
    chord_classes.push('alts');
  }
  if (state.drawKey !== state.originalKey && chord) {
    chord = transpose(state.originalKey, state.drawKey, chord);
  }
  chord = chord.replace('#', '&#x266F;').replace('b', '&#x266D;');
  if (!state.showLyrics && !chord) {
    return '';
  }
  if (!string && !state.showChords) {
    return '';
  }
  result = '';
  result += "<p class='" + (phrase_classes.join(' ')) + "'>";
  if (state.showChords) {
    result += "<span class='" + (chord_classes.join(' ')) + "' data-chord='" + (_.escape(token.chord)) + "'>" + (chord || ' ') + "</span><br/>";
  }
  if ((string != null) && state.showLyrics) {
    result += "<span class='string'>" + (string || ' ') + "</span>";
  }
  result += "</p>";
  return result;
};

determineKey = function(song) {
  var possibleKeys, validKeys;
  validKeys = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
  possibleKeys = [song.meta.KEY, s11.note.create(lastInferredChord(song)).clean().name, s11.note.create(lastDefinedChord(song)).clean().name, 'C'];
  return _.find(possibleKeys, function(key) {
    return indexOf.call(validKeys, key) >= 0;
  });
};

lastInferredChord = function(song) {
  return _.last(_.last(_.last(song.lyrics).lines)).chord;
};

lastDefinedChord = function(song) {
  return _.last(_.last(song.chords[_.last(song.sections)]));
};

title = function(song) {
  return song.meta.TITLE || '?';
};

byline = function(song) {
  return (song.meta.ARTIST || "?") + " <i> " + (song.meta.ALBUM || "?") + "</i>";
};
