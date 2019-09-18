/*
Kevin Pham
For use with index.html.  Provides behavior for Karl Thermometer, including
the drawing itself and functionality to the form components.
*/

(function() {
    "use strict";
    
    // Constant for 2*pi, the total measure of radians in a circle
    const CIRCLE_END = 2 * Math.PI;
    
    // Circles to be drawn in thermometer, must have at least one object and
    // each element needs the x, y coordinates of the center and radius r
    const CIRCLES = [
        // Head
        {
            x: 742,
            y: 148,
            r: 59
        },
        // Body
        {
            x: 670,
            y: 180,
            r: 45
        },
        {
            x: 595,
            y: 150,
            r: 50
        },
        {
            x: 515,
            y: 114,
            r: 63
        },
        {
            x: 435,
            y: 125,
            r: 50
        },
        {
            x: 360,
            y: 157,
            r: 43
        },
        {
            x: 304,
            y: 185,
            r: 35
        },
        // Tail
        {
            x: 240,
            y: 185,
            r: 30
        },
        // Back Legs
        {
            x: 262,
            y: 225,
            r: 5
        },
        {
            x: 280,
            y: 235,
            r: 7
        },
        {
            x: 302,
            y: 240,
            r: 7
        },
        {
            x: 325,
            y: 235,
            r: 7
        },
        // Front Legs
        {
            x: 644,
            y: 235,
            r: 7
        },
        {
            x: 667,
            y: 240,
            r: 7
        },
        {
            x: 687,
            y: 235,
            r: 7
        },
        // Antenae
        {
            x: 720,
            y: 50,
            r: 15
        },
        {
            x: 705,
            y: 63,
            r: 5
        },
        {
            x: 703,
            y: 78,
            r: 5
        },
        {
            x: 708,
            y: 93,
            r: 5
        },
        {
            x: 770,
            y: 50,
            r: 15
        },
        {
            x: 755,
            y: 63,
            r: 5
        },
        {
            x: 748,
            y: 75,
            r: 5
        },
        {
            x: 758,
            y: 85,
            r: 5
        }
    ];
    
    // Needs exactly 2 elements that should be strings representing valid colors
    const LOGO_COLORS = ["purple", "gold"];
    
    let min;
    let max;
    let grid = false;
    
    window.addEventListener("load", init);
    
    /**
     * Initializes website, including buttons and preliminary drawings.
     */
    function init() {
        let canvas = qs("canvas");
        let ctx = canvas.getContext("2d");
        
        getMaxAndMin(canvas);
        
        toggleGrid(canvas, ctx);
        toggleGrid(canvas, ctx);
        
        id("submit").addEventListener("click", () => redraw(canvas, ctx));
        id("grid").addEventListener("click", () => toggleGrid(canvas, ctx));
        id("save").addEventListener("click", () => saveAsImage(canvas));
    }
    
    /**
     * Toggles grid lines
     * @param {Object} canvas - DOM for canvas being drawn on
     * @param {Object} ctx - context used to draw on canvas
     */
    function toggleGrid(canvas, ctx) {
        if (grid) {
            milestones(ctx, canvas.height);
            id("grid").innerText = "Remove Grid Lines";
        }else {
            let grd = ctx.createLinearGradient(0, 0, 1000, 0);
            grd.addColorStop(0, id("gradient1").value);
            grd.addColorStop(1, id("gradient2").value);
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, 1000, 300);
            id("grid").innerText = "Add Grid Lines";
        }
        draw(ctx, 0, 1000);
        grid = !grid;
        ctx.font = "20px Righteous";
        ctx.fillStyle = LOGO_COLORS[0];
        ctx.fillText("UW", 25, 22);
        ctx.fillStyle = LOGO_COLORS[1];
        ctx.fillText("CK", 0, 15);
    }
    
    /**
     * Saves whatever is on the given canvas as an image
     * @param {Object} canvas - DOM for canvas being drawn on
     */
    function saveAsImage(canvas) {
        let link = document.getElementById('link');
        link.setAttribute('download', 'KarlThermometer.png');
        link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();
    }
    
    /**
     * Draws grid lines at every tenth of the goal.
     * @param {Object} ctx - context used to draw on canvas
     * @param {Number} height - height of canvas being drawn on
     */
    function milestones(ctx, height) {
        for (let i = 0; i <= 10; i++) {
            let pos = min + Math.round(i / 10 * (max - min));
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, height);
            ctx.stroke();
            
            ctx.font = "20px Righteous";
            ctx.fillStyle = id("fill1").value;
            ctx.fillText(i * 10 + "%", pos + 3, height - 20);
            ctx.fillStyle = "black";
            ctx.fillText(i * 10 + "%", pos, height - 23);
        }
    }
    
    /**
     * Draws the caterpillar based on user input.  Alerts user if input is invalid.
     * This could mean an integer can't be parsed from the input or that the goal
     * is less than the current amount.
     * @param {Object} ctx - context used to draw on canvas
     */
    function redraw(canvas, ctx) {
        toggleGrid(canvas, ctx);
        toggleGrid(canvas, ctx);
        let current = parseInt(qs("input[name='current']").value);
        let goal = parseInt(qs("input[name='goal']").value);
        if (Number.isNaN(current) || Number.isNaN(goal) ||
            current < 0 || goal <= 0 || current > goal) {
            alert("Please put in valid amounts.");
        }else {
            draw(ctx, current, goal);
            showResults(current, goal);
        }
    }
    
    /**
     * Displays result text with a message depending on the amount raised.
     * @param {Number} current - current amount raised
     * @param {Number} goal - goal for fundraiser
     */
    function showResults(current, goal) {
        let percent = Math.round(current / goal * 100);
        let title = qs("#results h2");
        if (percent < 10) {
            title.innerText = "We're just getting started.";
        }else if (percent < 25) {
            title.innerText = "We're at " + percent + "% there.  Keep it up!";
        }else if (percent < 50) {
            title.innerText = "Great job fundraising.  We're at " + percent + "% of our goal!";
        }else if (percent < 75) {
            title.innerText = "We've reached " + percent + "% our goal.  Keep up the great work!";
        }else if (percent < 100) {
            title.innerText = "In the home stretch now.  We are at " + percent + "% of our goal";
        }else {
            title.innerText = "We've reached our goal!";
        }
        id("current-result").innerText = current;
        id("goal-result").innerText = goal;
        id("results").classList.remove("hidden");
    }
    
    /**
     * Creates left and right bounds for thermometer based on circles being drawn.
     * Sets min and max to calculated values.  min/max will be within bounds of canvas.
     * @param {Object} canvas - DOM for canvas being drawn on
     */
    function getMaxAndMin(canvas) {
        let circle = CIRCLES[0];
        min = circle.x - circle.r;
        max = circle.x + circle.r;
        for (let i = 1; i < CIRCLES.length; i++) {
            circle = CIRCLES[i];
            min = Math.min(min, circle.x - circle.r);
            max = Math.max(max, circle.x + circle.r);
        }
        min = Math.max(0, min);
        max = Math.min(max, canvas.width);
    }
    
    /**
     * Draws circles using given information.  Will color orange/white depending on
     * the current amount and end goal.
     * @param {Object} ctx - context used to draw on canvas
     * @param {Number} current - current amount raised
     * @param {Number} goal - goal to be earned
     */
    function draw(ctx, current, goal) {
        let separator = Math.round((max - min) * current / goal) + min;
        for (let i = 0; i < CIRCLES.length; i++) {
            let circle = CIRCLES[i];
            if (circle.x + circle.r <= separator) {
                drawCircle(ctx, circle.x, circle.y, circle.r, id("fill1").value, 0, CIRCLE_END);
            }else if (circle.x - circle.r >= separator) {
                drawCircle(ctx, circle.x, circle.y, circle.r, id("fill2").value, 0, CIRCLE_END);
            }else {
                let angle = Math.acos((separator - circle.x) / circle.r);
                drawCircle(ctx, circle.x, circle.y, circle.r, id("fill1").value, angle, CIRCLE_END - angle);
                drawCircle(ctx, circle.x, circle.y, circle.r, id("fill2").value, CIRCLE_END - angle, angle);
            }
        }
    }
    
    /**
     * Draws circle/arc with given information
     * @param {Object} ctx - context of canvas to draw on
     * @param {Number} x - x coordinate of center
     * @param {Number} y - y coordinate of center
     * @param {Number} r - radius of circle
     * @param {String} fill - fill style for drawing
     * @param {Number} angle - angle to use for start of arc in radians
     * @param {Number} angle - angle to use for end of arc in radians
     */
    function drawCircle(ctx, x, y, r, fill, angleStart, angleEnd) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(x, y, r, angleStart, angleEnd);
        ctx.fill();
    }
    
    /*=====Helper Functions=====*/
    
    const id = (id) => document.getElementById(id);
    const qs = (query) => document.querySelector(query);
    const qsa = (query) => document.querySelectorAll(query);
})();
