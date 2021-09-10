import config from '../config';
import EventEmitter from 'eventemitter3';

const EVENTS = {
  APP_READY: 'app_ready',
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
  constructor() {
    super();

    this.config = config;
    this.data = {
      'count': 0,
      'planets': []
    };

    this.init();
  }

  static get events() {
    return EVENTS;
  }

  /**
   * Initializes the app.
   * Called when the DOM has loaded. You can initiate your custom classes here
   * and manipulate the DOM tree. Task data should be assigned to Application.data.
   * The APP_READY event should be emitted at the end of this method.
   */
  async init() {
    // Initiate classes and wait for async operations here.

    await fetch('https://swapi.boom.dev/api/')
      .then(response => response.json())
      .then(data => {

        fetch(data.planets)
          .then(response => response.json())
          .then(data => {
            this.data.count = data.count

            let next = data.next;
            let numberOfPages = count / 10;

            for (let i = 1; i <= numberOfPages; i++) {
              next = next.substring(0, next.length - 1) + i;

              if (next !== null) {

                fetch(next)
                  .then(response => response.json())
                  .then(data => {

                    data.results.map(i => {
                      this.data.planets.push(i);
                    })
                  });
              }
            }
          });
      });

    this.emit(Application.events.APP_READY);
  }
}

