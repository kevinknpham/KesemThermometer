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
    
    let min;
    let max;
    
    window.addEventListener("load", init);
    
    function init() {
        let canvas = qs("canvas");
        let ctx = canvas.getContext("2d");
        
        getMaxAndMin(canvas);
        
        let grd = ctx.createLinearGradient(0, 0, 1000, 0);
        grd.addColorStop(0, "#00c08a");
        grd.addColorStop(1, "#008fbe");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1000, 300);
        
        milestones(ctx, canvas.height);
        draw(ctx, 0, 1000);
        
        id("submit").addEventListener("click", () => redraw(ctx));
    }
    
    function milestones(ctx, height) {
        for (let i = 0; i <= 10; i++) {
            let pos = min + Math.round(i / 10 * (max - min));
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, height);
            ctx.stroke();
            
            ctx.font = "20px Righteous";
            ctx.fillStyle = "orange";
            ctx.fillText(i * 10 + "%", pos + 3, height - 20);
            ctx.fillStyle = "black";
            ctx.fillText(i * 10 + "%", pos, height - 23);
        }
//        ctx.beginPath();
//        ctx.moveTo(max, 0);
//        ctx.lineTo(max, height);
//        ctx.stroke();
    }
    
    function redraw(ctx) {
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
    
    function draw(ctx, current, goal) {
        let separator = Math.round((max - min) * current / goal) + min;
        for (let i = 0; i < CIRCLES.length; i++) {
            let circle = CIRCLES[i];
            if (circle.x + circle.r <= separator) {
                drawCircle(ctx, circle.x, circle.y, circle.r, "orange", 0, CIRCLE_END);
            }else if (circle.x - circle.r >= separator) {
                drawCircle(ctx, circle.x, circle.y, circle.r, "white", 0, CIRCLE_END);
            }else {
                let angle = Math.acos((separator - circle.x) / circle.r);
                drawCircle(ctx, circle.x, circle.y, circle.r, "orange", angle, CIRCLE_END - angle);
                drawCircle(ctx, circle.x, circle.y, circle.r, "white", CIRCLE_END - angle, angle);
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
