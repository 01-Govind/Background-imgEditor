document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('image-upload');
    const backgroundUpload = document.getElementById('background-upload');
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
    const downloadBtn = document.getElementById('download-btn');
    const backgroundOptions = document.querySelectorAll('.background-option');

    let uploadedImage = null;
    let uploadedBackground = null;

    imageUpload.addEventListener('change', handleImageUpload);
    backgroundUpload.addEventListener('change', handleBackgroundUpload);
    downloadBtn.addEventListener('click', downloadImage);
    backgroundOptions.forEach(option => option.addEventListener('click', handlePredefinedBackground));

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedImage = new Image();
                uploadedImage.onload = renderCanvas;
                uploadedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function handleBackgroundUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedBackground = new Image();
                uploadedBackground.onload = renderCanvas;
                uploadedBackground.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function handlePredefinedBackground(event) {
        uploadedBackground = new Image();
        uploadedBackground.onload = renderCanvas;
        uploadedBackground.src = event.target.src;
    }

    function renderCanvas() {
        if (uploadedBackground) {
            canvas.width = uploadedBackground.width;
            canvas.height = uploadedBackground.height;
            ctx.drawImage(uploadedBackground, 0, 0, canvas.width, canvas.height);
        }

        if (uploadedImage) {
            const imageAspectRatio = uploadedImage.width / uploadedImage.height;
            const canvasAspectRatio = canvas.width / canvas.height;

            let scaledWidth, scaledHeight;

            if (imageAspectRatio > canvasAspectRatio) {
              
                scaledWidth = canvas.width;
                scaledHeight = scaledWidth / imageAspectRatio;
            } else {
               
                scaledHeight = canvas.height;
                scaledWidth = scaledHeight * imageAspectRatio;
            }

          
            const x = (canvas.width - scaledWidth) / 2;
            const y = (canvas.height - scaledHeight) / 2;

            ctx.drawImage(uploadedImage, x, y, scaledWidth, scaledHeight);
        }
    }

    function downloadImage() {
        if (canvas.toBlob) {
            canvas.toBlob(function (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'edited-image.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }, 'image/png');
        }
    }
});
