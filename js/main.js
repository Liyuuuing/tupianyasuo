// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');
const compressionControls = document.getElementById('compressionControls');
const previewContainer = document.getElementById('previewContainer');

let originalFile = null;

// 上传区域点击事件
dropZone.addEventListener('click', () => fileInput.click());

// 文件拖拽事件
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#0071e3';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#d2d2d7';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#d2d2d7';
    const files = e.dataTransfer.files;
    if (files.length) {
        handleFile(files[0]);
    }
});

// 文件选择事件
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

// 质量滑块事件
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
    if (originalFile) {
        compressImage(originalFile, e.target.value / 100);
    }
});

// 处理上传的文件
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }

    originalFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        originalSize.textContent = `文件大小：${formatFileSize(file.size)}`;
        compressionControls.style.display = 'block';
        previewContainer.style.display = 'grid';
        compressImage(file, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(file, quality) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                compressedPreview.src = URL.createObjectURL(blob);
                compressedSize.textContent = `文件大小：${formatFileSize(blob.size)}`;
                downloadBtn.style.display = 'block';
                
                // 设置下载事件
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `compressed_${file.name}`;
                    link.click();
                };
            }, file.type, quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 