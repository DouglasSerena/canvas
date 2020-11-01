
import CanvasStart from './canvas.js';
const $ = require('jquery') ;

init();
function init() {
  const config = {
    color: '#333333',
    weight: 1,
    tool: 'pencil',
    canvas: $('canvas'),
    ctx: $('canvas')
      .get(0)
      .getContext('2d') ,
    eventsCanvas: {} ,
    eventsWindow: {} ,
  };

  // MENEU
  $('#close').on('click', (e) => {
    $('.menu').removeClass('open');
  });

  // COLOR
  $('#color-input').on('change', (e) => {
    config.color = $('#color-input').val() ;
    $('#color-text').val(config.color);
    $('#color-text').css('color', config.color);
  });

  $('#color-text').on('input', (e) => {
    const value = $('#color-text').val() ;
    if (value.match(/^#[a-fA-f0-9]{6,}/g)) {
      config.color = value;
      $('#color-input').val(config.color);
      $('#color-text').css('color', config.color);
    }
  });

  $('#color-open').on('click', (e) => {
    $('#color-input').click();
  });

  // WEIGHT
  $('#weight').on('input', (e) => {
    const value = Number(($('#weight').val() ).replace(/\D/g, ''));
    config.weight = value;
    return $('#weight').val(value);
  });
  $('#weight-add').on('click', (e) => {
    config.weight++;
    $('#weight').val(config.weight);
  });
  $('#weight-minus').on('click', (e) => {
    config.weight--;
    $('#weight').val(config.weight);
  });

  // Active canvas
  const { back, clear, forward, toggleTools } = CanvasStart(config);

  // tools
  $('#pencil').on('click', () => {
    toggleTools('pencil');
  });
  $('#square').on('click', () => {
    toggleTools('square');
  });
  $('#eraser').on('click', () => {
    toggleTools('eraser', 15);
  });

  // menu

  $('#back').on('click', back);
  $('#clear').on('click', clear);
  $('#forward').on('click', forward);

  Object.keys(config.eventsCanvas).forEach((key) => {
    config.canvas.on(key, (e) => config.eventsCanvas[key](e, config));
  });
  Object.keys(config.eventsWindow).forEach((key) => {
    $(window).on(key, (e) => config.eventsWindow[key](e, config));
  });
}
