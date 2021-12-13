import isOdd from 'is-odd';

export class MyClass {
    constructor(private val: number) {
    }

    get isOdd() {
        return isOdd(this.val);
    }
}