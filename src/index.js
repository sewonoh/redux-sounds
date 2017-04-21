const howlerIntegration = require('./howler_integration');

function soundsMiddleware(soundsData) {
  if ( typeof soundsData !== 'object' )
    throw {
      name: 'missingSoundData',
      message: `
        Please provide an object to soundsMiddleware!
        When initializing, it needs an object holding all desired sound data.
        See https://github.com/joshwcomeau/redux-sounds/#troubleshooting
      `
    };

  // Set up our sounds object, and pre-load all audio files.
  // Our sounds object basically just takes the options provided to the
  // middleware, and constructs a new Howl object for each one with them.
  howlerIntegration.initialize(soundsData);

  return store => next => action => {
    // Ignore actions that haven't specified a sound.
    if ( !action.meta || !action.meta.sound ) {
      return next(action);
    }

    // Sample action:
    // {  "id":2,
    //    "type":"SOUND_ACTION",
    //    "meta": {
    //      "sound":"Navigation_Down",
    //      "volume":0
    //    }
    // }

    let volume = 1.0;
    if (volume != action.meta.volume && action.meta.volume >= 0 && action.meta.volume <= 1.0) {
      volume = action.meta.volume;
    }

    const [ soundName, spriteName ] = action.meta.sound.split('.');

    howlerIntegration.play(soundName, spriteName, volume);

    return next(action);
  };
}

module.exports = soundsMiddleware;
