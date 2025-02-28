export const formateUrl = (url: string) => {
    if (url.includes('https://phimimg.com/')) {
        return url;
    }
    return `https://phimimg.com/${url}`;
}