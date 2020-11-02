// To create this algorithm,
// Refer to this article by Hung Nguyen : https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d

export default function makeResizable(divClass) {
    const resizable = document.querySelector(divClass);
    const resizers = document.querySelectorAll(divClass + ' .resizer');

    const originalResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
    const minimumSize = Math.floor(originalResizableWidth / 5);

    const minMouseX = resizable.getBoundingClientRect().left;
    const maxMouseX = resizable.getBoundingClientRect().right;
    let newResizableWidth;
    let originalResizableLeft;
    let originalMouseX;

    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];

        currentResizer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            newResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
            originalResizableLeft = parseFloat(getComputedStyle(resizable, null).getPropertyValue('left'));
            originalMouseX = e.pageX;
    
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);

            function resize(e) {
                if (currentResizer.classList.contains('left')) {
                    const width = newResizableWidth - (e.pageX - originalMouseX);

                    if (width > minimumSize && e.pageX >= minMouseX) {
                        resizable.style.width = width + 'px';
                        // Evolves the opposite way to width
                        resizable.style.left = originalResizableLeft + (e.pageX - originalMouseX) + 'px';
                    }

                } else if (currentResizer.classList.contains('right')) {
                    const width = newResizableWidth + (e.pageX - originalMouseX);

                    if (width > minimumSize && e.pageX <= maxMouseX) {
                        resizable.style.width = width + 'px';
                    }
                }
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize);
            }
        });
    }
}
