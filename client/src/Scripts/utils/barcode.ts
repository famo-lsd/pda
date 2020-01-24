export function barcodeScan(callback: Function, t: Function) {
    function handleBackButton(event: Event) {
        event.preventDefault();
        document.removeEventListener("backbutton", handleBackButton, false);
    }

    document.addEventListener("backbutton", handleBackButton, false);

    (window as any).cordova.plugins.barcodeScanner.scan(
        result => {
            if (!result.cancelled) {
                callback(result);
                document.removeEventListener("backbutton", handleBackButton, false);
            }
        },
        error => {
            alert(t('key_686'));
        },
        {
            preferFrontCamera: false,
            showFlipCameraButton: false,
            showTorchButton: true,
            torchOn: false,
            saveHistory: false,
            prompt: '',
            resultDisplayDuration: 0,
            formats: 'CODE_39,CODE_128',
            orientation: 'unset',
            disableAnimations: true,
            disableSuccessBeep: false,
            continuousMode: false
        }
    );
}