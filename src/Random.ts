export default class Random {
    static int(from: number, to: number) {
        const len = to - from + 1;
        return Math.floor(Math.random() * len) + from;
    }
}