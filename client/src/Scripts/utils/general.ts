export function createQueryString(json: any) {
    let qs = '?timestamp=' + new Date().getTime();

    for (const key in json) {
        const prop = json[key];

        if (Array.isArray(prop)) {
            for (let j = 0, len = prop.length; j < len; j++) {
                qs += '&' + key + '=' + (prop[j] === null ? '' : encodeURIComponent(prop[j]));
            }
        }
        else {
            qs += '&' + key + '=' + (prop === null ? '' : encodeURIComponent(prop));
        }
    }

    return qs;
};

export function loadScript(src: string, ref: React.RefObject<any> = null) {
    const script = document.createElement('script');

    script.async = false;
    script.src = src;
    script.type = 'text/javascript';

    if (ref) {
        ref.current.appendChild(script);
    }
    else {
        document.querySelector('head').appendChild(script);
    }

    return new Promise((resolve, reject) => {
        script.onload = resolve;
    });
}