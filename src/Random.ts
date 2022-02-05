export default class Random {
    /**
     * generate random int [from...to)
     */
    static int(from: number, to: number) {
        const len = to - from;
        return Math.floor(Math.random() * len) + from;
    }

    /**
     * generate two different(if its possible) random int [from...to)
     */
     static intPair(from: number, to: number) {
        let newRandom1 = Random.int(from, to);
        let newRandom2 = Random.int(from, to);

        while (newRandom1 === newRandom2) {
            if (to - from <= 1) break;
            newRandom2 = Random.int(from, to);
        }
        
        return [newRandom1, newRandom2];
    }
}