
const $ = require('jquery') ;

function CanvasStart(config) {
  config.canvas.get(0).width = innerWidth;
  config.canvas.get(0).height = innerHeight;

  let weightBefore = 1;
  let isMove = false;
  let current = {} ;
  let position = [];
  let after = [];
  let before = [];

  config.eventsCanvas = {
    mousedown(e, config) {
      $('#back').removeClass('disabled');
      $('#clear').removeClass('disabled');
      $('#forward').addClass('disabled');
      config.ctx.globalCompositeOperation =
        config.tool === 'eraser' ? 'destination-out' : 'source-over';
      current.color = config.color;
      current.weight = config.weight;
      current.tool = config.tool;
      current.lastX = e.clientX;
      current.lastY = e.clientY;
      isMove = true;

      after = [];

      config.ctx.beginPath();
      config.ctx.lineWidth = current.weight;
      config.ctx.strokeStyle = current.color;
      config.ctx.moveTo(e.clientX, e.clientY);
    },
    mousemove(e, config) {
      if (isMove) {
        if (config.tool === 'square') {
          update(before, config);
          config.ctx.strokeStyle = current.color;
          config.ctx.lineWidth = current.weight;
          config.ctx.globalCompositeOperation = 'source-over';
          config.ctx.strokeRect(
            current.lastX,
            current.lastY,
            e.clientX - current.lastX,
            e.clientY - current.lastY
          );
        } else {
          position.push({ x: e.clientX, y: e.clientY });
          config.ctx.lineTo(e.clientX, e.clientY);
          config.ctx.stroke();
        }
      }
    },
    mouseup(e, config) {
      isMove = false;
      position.push({ x: e.clientX, y: e.clientY });
      current.position = position;
      before.push(current);
      current = {} ;
      position = [];
    },
  };

  config.eventsWindow = {
    keypress(e) {
      if (e.ctrlKey)
        switch (e.key.toLowerCase()) {
          case '1':
            return toggleTools('pencil');
          case '2':
            return toggleTools('eraser', 15);
          case '3':
            return toggleTools('square');
          case 'y':
            return forward();
          case 'z':
            return back();
          case 'u':
            return clear();
          case 'i':
            return activeMenu();
        }
    },
  };

  function toggleTools(
    tool,
    weight = -1
  ) {
    $(`#${config.tool}`).removeClass('disabled');
    $(`#${tool}`).addClass('disabled');
    if (weight == -1) {
      config.weight = weightBefore;
    } else {
      weightBefore = config.weight;
      config.weight = weight;
    }
    config.tool = tool;
    $(`#weight`).val(config.weight);
  }

  function back() {
    if (before.length > 0) {
      after.push(before.pop());
      update(before , config);
      $('#forward').removeClass('disabled');
      if (before.length == 0) {
        $('#back').addClass('disabled');
        $('#clear').addClass('disabled');
      }
    } else {
      $('#back').addClass('disabled');
    }
  }

  function forward() {
    if (after.length > 0) {
      before.push(after.pop());
      update(before , config);
      $('#back').removeClass('disabled');
      $('#clear').removeClass('disabled');
      if (after.length == 0) $('#forward').addClass('disabled');
    } else {
      $('#forward').addClass('disabled');
    }
  }

  function clear() {
    config.ctx.clearRect(
      0,
      0,
      config.canvas.get(0).width,
      config.canvas.get(0).height
    );
    after = [];
    before = [];
    $('#forward').addClass('disabled');
    $('#back').addClass('disabled');
    $('#clear').addClass('disabled');
  }

  function activeMenu() {
    $('.menu').toggleClass('open');
  }

  function update(draws, config) {
    config.ctx.clearRect(
      0,
      0,
      config.canvas.get(0).width,
      config.canvas.get(0).height
    );
    draws.forEach((draw) => {
      config.ctx.globalCompositeOperation =
        draw.tool === 'eraser' ? 'destination-out' : 'source-over';
      config.ctx.beginPath();
      config.ctx.lineWidth = draw.weight;
      config.ctx.strokeStyle = draw.color;
      if (draw.tool === 'square') {
        config.ctx.strokeRect(
          draw.lastX,
          draw.lastY,
          draw.position[0].x - draw.lastX,
          draw.position[0].y - draw.lastY
        );
      } else {
        config.ctx.moveTo(draw.lastX, draw.lastY);
        draw.position.forEach(({ x, y }) => {
          config.ctx.lineTo(x, y);
        });
        config.ctx.stroke();
      }
    });
  }

  return {
    clear,
    back,
    forward,
    toggleTools,
  };
}

export default CanvasStart;
