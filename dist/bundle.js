(function () {
    'use strict';

    const datas = [
        {
            data: [0.6],
            radius: '45%',
            center: ['50%', '50%'],
            label: {
                fontSize: 10
            },
            outline: {
                borderDistance: 0,
                itemStyle: {
                    borderWidth: 3,
                    // borderColor: '#156ACF',
                    shadowBlur: 20,
                }
            }
        }
    ];

    let width = 300;
    let height = 300;
    let colorList = ['#294D99', '#156ACF', '#1598ED', '#45BDFF'];

    function startWave() {
        let ctx = document.getElementById('canvas').getContext('2d');
        ctx.clearRect(0, 0, width, height);

        datas.forEach(data => {
            data.theta -= 0.1;

            if (data.value < data.mxValue) {
                data.value += 0.01;
            }

            paintBoundary(ctx, data);

            drawWaterLines(ctx, data);
        });

        requestAnimationFrame(startWave);
    }

    function initData() {
        let maxR = Math.min(width, height) * 0.5;
        datas.forEach((data, i) => {
            data.cx = width * parseFloat(data.center[0].split('%')[0]) / 100;
            data.cy = height * parseFloat(data.center[1].split('%')[0]) / 100;
            data.radius = data.radius.split('%')[0] / 100 * maxR;
            data.color = colorList[i % colorList.length];
            data.value = 0;
            data.mxValue = data.data[0];
            data.theta = Math.random();
        });

        console.log(datas, 'datas');
    }


    function drawWaterLines(ctx, item) {
        let offset;
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(item.cx, item.cy, item.radius * 0.95, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        // ctx.arc(item.cx, item.cy, item.radius * 0.85, 0, Math.PI * 2);
        ctx.clip();
        // 水球高度
        offset = item.cy - item.value * item.radius * 2 + item.radius;
        ctx.fillStyle = item.color;
        ctx.beginPath();

        let y;
        let w = 4 / item.radius;
        for (let i = 0; i < 2 * item.radius; i += 0.1) {
            y = 4 * Math.sin(i * w + item.theta) + offset;
            ctx.lineTo(item.cx - item.radius + i, y);
        }

        ctx.lineTo(item.cx + item.radius, item.cy + item.radius);
        ctx.lineTo(item.cx - item.radius, item.cy + item.radius);
        ctx.lineTo(item.cx - item.radius, 4 * Math.sin(item.theta) + offset);

        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = item.color;
        ctx.font = `${item.label.fontSize * 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(item.mxValue * 100 + '%', item.cx, item.cy + item.label.fontSize / 2);
        // ？？？
        ctx.clip();
        ctx.font = `${item.label.fontSize * 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(item.mxValue * 100 + '%', item.cx, item.cy + item.label.fontSize / 2);
        ctx.restore();
    }

    function paintBoundary(ctx, item) {
        ctx.beginPath();
        ctx.fillStyle = item.color;
        ctx.strokeStyle = item.color;
        ctx.arc(item.cx, item.cy, item.radius, 0, 2 * Math.PI);
        ctx.lineWidth = item.outline.itemStyle.borderWidth;
        ctx.stroke();
    }

    window.onload = function() {
        let canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;

        initData();
        startWave();
    };

}());
