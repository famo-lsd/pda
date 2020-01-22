export function barcodeScan(callback: Function, t: Function) {
    (window as any).cordova.plugins.barcodeScanner.scan(
        result => {
            if (!result.cancelled) {
                callback(result);
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