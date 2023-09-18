function loadImage() {
    const file = fileDom.files[0]; // 获取文件输入框中选择的文件
    if (!file) { // 如果没有选择文件，返回 null
        return null;
    }
    const objUrl = URL.createObjectURL(file); // 创建文件的 URL 对象
    const img = new Image(); // 创建一个 Image 对象用于加载图片
    return new Promise((resolve, reject) => {
        img.onload = () => { // 当图片加载完成时
            resolve(img); // 返回加载完成的图片对象
        };
        img.onerror = () => {
            resolve(null); // 如果加载过程中发生错误，返回 null
        };
        img.src = objUrl; // 设置图片的源路径为创建的 URL 对象
    });
}


function download(html) {
    var blob = new Blob([html], { type: 'text/html' }); // 创建一个 HTML 文件的 Blob 对象
    var url = window.URL.createObjectURL(blob); // 创建 Blob 对象的 URL
    var a = document.createElement('a'); // 创建一个 <a> 元素用于下载
    a.href = url; // 设置下载链接为 Blob 对象的 URL
    a.style.display = 'none'; // 设置元素不可见
    a.download = 'demo.html'; // 设置下载文件的名称为 'demo.html'
    a.click(); // 触发点击事件进行下载
}

function createHTML(width, height, bmp) {
    const shadowCSSFragments = []; // 用于存储阴影 CSS 片段的数组
    const shadowCSSHover = []; // 用于存储鼠标悬停阴影 CSS 片段的数组

    for (let r = 0; r < height; r++) { // 遍历行
        for (let c = 0; c < width; c++) { // 遍历列
            const i = r * width + c; // 计算当前像素在数据数组中的索引
            const R = bmp[i * 4], // 获取红色通道值
                G = bmp[i * 4 + 1], // 获取绿色通道值
                B = bmp[i * 4 + 2], // 获取蓝色通道值
                A = bmp[i * 4 + 3] / 255; // 获取透明度值（范围从 0 到 1）
            shadowCSSFragments.push(`${c + 1}px ${r}px 
            rgba(${R}, ${G}, ${B}, ${A})`); // 将阴影 CSS 片段添加到数组中
            shadowCSSHover.push(`${c + 1}px ${r}px 
            rgba(${255 - R}, ${255 - G}, ${255 - B}, ${A})`); // 将鼠标悬停阴影 CSS 片段添加到数组中
        }
    }
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <style>
        .shadow-img {
            width: ${width}px;
            height: ${height}px;
        }

        .shadow-img .inner {
            width: 1px;
            height: 1px;
            box-shadow: ${shadowCSSFragments.join(',')};
            transition: 1.5s;
        }

        .shadow-img:hover .inner {
            box-shadow: ${shadowCSSHover.join(',')};
        }
    </style>
</head>

<body>
    <div class="shadow-img">
        <div class="inner"></div>
    </div>
</body>

</html>
    `;
}

async function generate() {
    const img = await loadImage(); // 加载图片
    if (!img) {
        return; // 如果图片加载失败，返回
    }
    const cvs = document.createElement('canvas'); // 创建一个 Canvas 元素
    cvs.width = img.width; // 设置 Canvas 宽度为图片宽度
    cvs.height = img.height; // 设置 Canvas 高度为图片高度
    const ctx = cvs.getContext('2d'); // 获取绘图上下文
    ctx.drawImage(img, 0, 0); // 在 Canvas 上绘制图片

    const bmp = ctx.getImageData(0, 0, img.width, img.height).data// 获取图片的像素数据
    const html = createHTML(img.width, img.height, bmp); // 创建包含阴影效果的 HTML 代码

    download(html); // 下载生成的 HTML 文件
}

