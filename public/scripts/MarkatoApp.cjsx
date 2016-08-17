React = require 'react'
_ = require 'underscore'
S = require 'string'
s11 = require 'sharp11'
transpose = require './transpose'
Switches = require './Switches'
MarkatoOutput = require './MarkatoOutput'
MarkatoInput = require './MarkatoInput'
EditButton = require './EditButton'
DeleteButton = require './DeleteButton'
ChordAltModal = require './ChordAltModal'
TransposeModal = require './TransposeModal'

module.exports = React.createClass
  getInitialState: ->
    isEditing: true
    showChords: true
    showLyrics: true
    showFade: true
    showSections: true
    showAlternates: true
    displayKey: null
    showChordAltModal: false
    showTransposeModal: false
    chordReplacements: {} # Maps chord to index of alternate
    altsModalChord: null
    altsModalAlts: []

  key: ->
    possibleKeys = [
      @extractKey @props.parsedInput.meta.KEY
      @extractKey @lastChord()
      'C'
    ]
    # Return first from possibleKeys where key is not null
    _.find possibleKeys

  extractKey: (str) ->
    try
      s11.note.extract(str).name
    catch err
      null

  displayKey: ->
    @state.displayKey or @key()

  formatChord: (chord) ->
    if chord
      transpose(@key(), @displayKey(), chord).replace(/'/g, '')

  formatChordWithAlts: (chord) ->
    if @props.parsedInput.alts[chord]? and @state.chordReplacements[chord]?
      chord = @props.parsedInput.alts[chord][@state.chordReplacements[chord]]
    @formatChord chord

  lastChord: ->
    try
      chords = _.flatten _.pluck @props.parsedInput.content, 'lines'
      _.last(chords).chord
    catch err
      ''

  resetKey: ->
    @setState displayKey: null

  switchState: ->
    _.pick @state, 'showChords', 'showLyrics', 'showFade', 'showSections', 'showAlternates'

  handleInput: (e) ->
    @props.handleInput e.target.value

  handleEditClick: ->
    @setState isEditing: not @state.isEditing

  toggleState: (key) ->
    => @setState "#{key}": not @state[key]

  switches: ->
    _.map @switchState(), (value, key) =>
      label: S(key).chompLeft('show').s
      key: key
      active: value
      handleClick: @toggleState key

  selectAlt: (index) ->
    =>
      chordReplacements = @state.chordReplacements
      chordReplacements[@state.altsModalChord] = index
      @setState chordReplacements: chordReplacements, showChordAltModal: false

  setDisplayKey: (key) ->
    =>
      @setState displayKey: key, showTransposeModal: false

  showChordAltModal: (chord) ->
    @setState showChordAltModal: true, altsModalChord: chord

  render: ->
    <div className="container">
      <div className="row">
        <div className={if @state.isEditing then "col-md-6" else "col-md-12"}>
          <EditButton isEditing={@state.isEditing} handleClick={@handleEditClick} />
          <DeleteButton handleClick={@props.deleteSong} />
          <Switches switches={@switches()} />
          <MarkatoOutput song={@props.parsedInput}
                         switches={@switchState()}
                         displayKey={@displayKey()}
                         showChordAltModal={@showChordAltModal}
                         chordReplacements={@state.chordReplacements}
                         formatChordWithAlts={@formatChordWithAlts}
                         playback={not @state.isEditing}
                         play={@props.play}
                         showTransposeModal={@toggleState 'showTransposeModal'}
                         setDisplayKey={@setDisplayKey} />
        </div>
        {<div className="col-md-6">
          <MarkatoInput input={@props.input}
                        handleInput={@handleInput} />
        </div> if @state.isEditing}
      </div>
      <ChordAltModal show={@state.showChordAltModal}
                     onHide={@toggleState 'showChordAltModal'}
                     chord={@state.altsModalChord}
                     alts={@props.parsedInput.alts[@state.altsModalChord]}
                     selected={@state.chordReplacements[@state.altsModalChord]}
                     selectAlt={@selectAlt}
                     formatChord={@formatChord} />
      <TransposeModal show={@state.showTransposeModal}
                      onHide={@toggleState 'showTransposeModal'}
                      displayKey={@displayKey()}
                      originalKey={@key()}
                      setDisplayKey={@setDisplayKey}
                      reset={@resetKey} />
    </div>