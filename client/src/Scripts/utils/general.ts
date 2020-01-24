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

export function loadScript(src: string, ref: React.RefObject<any>) {
    const script = document.createElement('script');

    script.async = true;
    script.src = src;
    script.type = 'text/javascript';

    ref.current.appendChild(script);
}